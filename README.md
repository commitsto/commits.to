[Changelog](https://glitch.com/edit/#!/iwill?path=CHANGELOG.md:1:0 )

[GitHub Issues](https://github.com/beeminder/iwill/issues )


# The I-Will System

Problem:
Alice casually says to Bob 
"I'll let you know if I can make it to the meeting"
or
"I'll see if I can reproduce that bug"
but then forgets to follow through.

Solution:
Any time Alice makes any 
"<a href="http://blog.beeminder.com/will">I will</a>" 
statement like that, she types a URL like so:

```
alice.promises.to/let_bob_know_re_meeting/by/tomorrow_5pm
```

As in, she literally types that, on the fly, directly to Bob, manually, when she's making the promise to him.
When Alice or Bob click that URL a promise is created in the promises.to app and a calendar entry is added to Alice's calendar and a datapoint is sent to Beeminder.

We actually have both the "promises.to" and "commits.to" domain names and you can use them interchangeably.


## Creation on GET

First of all, creating an object in a database on the server in response to a GET request is pretty unkosher. 
We've decided it's worth it because of how elegantly it reduces the friction for the user.
If/when that's abused we'll revisit it but initially we're making all tradeoffs in favor of lower friction.

Also it's a nice feature how every yourname.promises.to URL you type gets almost automatically logged as a promise.
We'll address spiders and such -- like the Googlebot trying to fetch yourname.promises.to/robots.txt -- as they're a problem.


## Promise Data Structure

The fundamental object in the promises.to app is of course the promise, aka the commitment.
The following are the database fields for the Promises table:

* `urtext`: full original text (URL) the user typed to create the promise
* `user`: who's making the promise, parsed as the subdomain in the urtext
* `slug`: unique identifier for the promise, parsed from the urtext URL
* (`note`: optional additional notes or context for the promise)
* `tini`: unixtime that the promise was made
* `tdue`: unixtime that the promise is due
* `tfin`: unixtime that the promise was (fractionally) fulfilled (even if 0%)
* `xfin`: fraction fulfilled, default null to indicate still pending
* (`firm`: true when the due date is confirmed and can't be edited again)
* (`void`: true if the promise became unfulfillable or moot)
* (`clix`: number of clicks a promise has gotten)
* `bmid`: the id of the Beeminder datapoint for this promise

(The ones in the parentheses we can ignore for the MVP, though `note` and `clix` may be easy enough to go ahead and throw in there.)

For example:

* `urtext` = "bob.promises.to/foo_the_bar/by/noon_tomorrow"
* `user` = "bob"
* `slug` = "foo_the_bar"
* `note` = "promised in slack discussion about such-and-such"
* `tini` = [unixtime of first GET request of the promise's URL]
* `tdue` = [what "noon tomorrow" parsed to at time tini]
* `tfin` = [unixtime that the user marked the promise as fulfilled]
* `xfin` = 0.5 [imagine the user decided to deem it half fulfilled]
* `firm` = false
* `void` = false
* `clix` = 0
* `bmid` = 4f9dd9fd86f22478d3000007

Here are some other ideas for fields, that we can worry about as the project evolves:

* Public changelog for justifying things like changes to the due date
* List of all URLs ever used to access this promise
* Whether the promise was created by the actual user (if they were logged in and were the first to click on it) or by another logged-in user or by someone not logged in
* Information about the client (browser, geoIP, etc) that originally created the promise


## UI For Marking Promises Fulfilled

For the MVP we'll make this dirt simple.
No logins or restrictions or anything.
Just an html form with all the promise fields (see the "Promise Data Structure" section) on every promise's page that lets anyone edit anything any time.

We might want to say you can't edit fields that would make the urtext be wrong. 
Namely, `user` and `slug`. 
Or maybe who cares if the subdomain and path in `urtext` don't match `user` and `slug`!
We can default to total laissez faire and tighten things down as needed.
Sure, it defeats the point if you can keep changing the deadline but maybe the honor system will work surprisingly well!
In any case we have ideas for later for how to further discourage cheating.

In the meantime, **marking a promise (partially) fulfilled just means editing the `xfin` field and the `tfin` field**.

*One constraint: The `xfin` and `tfin` fields should either both be null -- meaning the promise is still awaiting completion -- or neither be null.
I.e., when a promise is marked (fractionally) fulfilled, it needs a date that that happened.
We want the code that calculates the statistics to be able to assume that.
That said, the code in the "Computing Statistics" section is pretty robust to that so if it's hard to implement UI-wise, don't worry about it.*

Finally, whenever anything about the promise changes it needs to be automatically mirrored in Beeminder (see the "Beeminder Integration" section).
And voiding a promise is the same as deleting it as far as Beeminder is concerned.
But we can ignore the whole promise voiding part in the MVP.


## Uniqueness of Promise Names

What should happen if alice says 
`alice.commits.to/send_the_report/by/thu` one week and then says 
`alice.commits.to/send_the_report/by/fri` the next week?

Answer: treat them as the same promise.
I.e., key on just `user`+`'/'`+`slug`.

In practice it seems to be easy to make an unlimited number of unique names for promises and if there's a collision it will be perfectly clear to the user why and what to do about it.

One thing to do about it is just let the user manually rename the old promise.
It's up to the user whether they're ok with any links to the old promise pointing at the new promise.


## Date Parsing

Chris Butler found this date parser that seems excellent:
<http://blog.metamorphium.com/Sherlock/>
But let's not blindly trust our parsing of the date from the URL, or even make it important to include a date.

For the MVP we'll run the `/by/...` part of the urtext through the date parser and initialize `tdue` to whatever it says, when creating the promise.
If there's no `/by/...` part or we couldn't parse it as a date/time, default to a week from now.
Then, per the previous sections, the user (or anyone) can change it however they like after the promise is created.

When you hit a URL for a promise that already exists -- i.e., the user and slug match an existing promise -- then we show the page for that promise and completely ignore whatever comes after the slug in the URL.

(In the future we'll want to not drop that new information on the floor but in the meantime we can find it in the access logs if needed.
In the meantime, the `/by/...` part of the URL, and in fact anything after the slug, is strictly advisory.)


## Late Penalties

A big part of promises.to is tracking how reliable you are.
Like what fraction of the promises you logged did you actually fulfill?
If you fulfill a promise late you get partial credit.
That way we can always compute a single metric for your reliability at any moment in time.

The function we're using for late penalties is below.
The idea is to have your reliability decrease strictly monotonically the moment the deadline hits, with sudden drops when you're a minute, an hour, a day, etc, late.
(More on the rationale for that in `lib/latepenalty.js`.)
The following shows the remaining credit as a function of how late you are, first zoomed in to the first 60some seconds, and then zoomed out further and further:

[![Late penalty function](https://cdn.glitch.com/ff974d2d-e212-470e-8587-f065205350d0%2Flate-penalty.png?1507416292319 "Click for bigger version")](https://cdn.glitch.com/ff974d2d-e212-470e-8587-f065205350d0%2Flate-penalty.png)

For example, credit(0) is 1 (no penalty) and credit(3600) is 0.999 (most of the credit for being just an hour late).


## Beeminder Integration

The idea is to 
[send a datapoint to Beeminder](http://beeminder.com/api) 
for each promise you make.
A Beeminder datapoint consists of a date, a value, and a comment.
Beeminder plots those cumulatively on a graph for you and lets you hard-commit to a certain rate of progress.

In the case of promises.to the date on the Beeminder datapoint is the promise's deadline `tdue` (even though it's in the future) and the value is the fulfilled fraction `xfin` (initially zero).
The comment should just have the promise's urtext since that's a link to all the data about a promise.
Or something like "Auto-added by promises.to at 12:34pm -- " and then the urtext link.
(It's nice to use the timezone the user has set in Beeminder -- available in the User resource in the Beeminder API -- when showing a time of day.)

The Beeminder goal should be a do-more goal to fulfill, say, 8 promises per week.
The way I (dreev) do this currently: 
I create a datapoint for each promise (via IFTTT from Google Calendar) when I promise it, and then change the datapoint to a 1 when I fulfill it (or something less than 1 if I fulfill it late).

So Beeminder is not enforcing a success rate, just an absolute number of successes.

Pro tip: 
Promise a friend some things from your to-do list that you could do any time.
That way you're always ready for an I-will beemergency.

The promises.to app's interactions with Beeminder (via Beeminder API calls) are as follows:

1. When a promise is created, create a datapoint
2. When a promise is marked (partially) fulfilled, update the datapoint's value
3. When a promise's due date changes, update the datapoint's date
4. [POST-MVP] When a promise is deleted, delete the datapoint
5. [POST-MVP] Create the initial Beeminder goal when a user signs up for promises.to


## Account Settings

1. Username, used as a subdomain for the URL
2. Beeminder access token
3. Timezone (needed to parse the deadlines; but less important since you can change the deadline if it's misparsed)

Later:

1. Pronoun (default "they/them/their/theirs")
2. Display name, e.g., "Alice" as opposed to username "alice"


## Computing Statistics

The only statistics we'll care about initially are the number of promises the user has made and their reliability percentage.
And how many pending vs past promises.

The relevant fields (see the "Promise Data Structure" section) are:

* `xfin` &mdash; a promise's fulfilled fraction, between 0 and 1, default 0
* `tfin` &mdash; when the promise was (fractionally) fulfilled
* `tdue` &mdash; promise's deadline

And we'll take `tnow` to be the current unixtime.
See the "Late Penalties" section for how to compute how much credit you get for a promise as a function of how late you fulfill it.

For a specific promise, we prominently display near the slug either

> pending - `x%` late penalty = `y%` max credit

or

> 50% fulfilled on 2017-10-31 at 12:34pm - x% late penalty = y% credit.

The first case with "pending" is when `xfin` and `tfin` are null.
In that case, the 
`x%` is `1-credit(tnow-tdue)` and the 
`y%` is 100% minus that, i.e., `credit(tnow-tdue)`.
(The credit function, which takes the number of seconds late, returns 1 for negative numbers and then increases the higher the positive number.)
And instead of the string "pending" maybe it's a checkbox that when checked gives you the option to specify the fraction completed and when you (fractionally) completed it.

In the second case, where `xfin` and `tfin` are specified, the 
`x%` is `1-credit(tfin-tdue)` and the 
`y%` is `xfin*credit(tfin-tdue)`.

For the overall reliability score for a user, we assume unfulfilled promises that are still pre-deadline don't count for or against you.
And we optimistically assume that any promise you're late on you're going to fulfill in the next instant.
So we iterate through a user's promises like so:

```javascript
let pending = 0
let numerator = 0
let denominator = 0
user.promises.forEach(p => {
  if (p.xfin === null && p.tfin === null && tnow < p.tdue) {
    pending++   
  } else {
    const ox = p.xfin === null ? 1    : p.xfin // optimistic xfin is 1
    const ot = p.tfin === null ? tnow : p.tfin // optimistic tfin is now
    numerator += ox * credit(ot - p.tdue)
    denominator += 1
  }
})
```

That's it! 
Now you can report that the user has made 
{`denominator+pending`} promises 
(of which {`pending`} are still in the future) 
and has a reliability of 
{`numerator/denominator*100`}%.


The user's overall realtime reliability score should be shown prominently next to the username wherever it appears or huge in the header or something.
It's the most important number in the whole app.
Especially cool is how it will tick down in real time when one of your deadlines passes.
(Dreev recommends React for having numbers like that always updated in real time.)


## Automatically Creating Calendar Entries

It's pretty critical that the promises end up on your calendar.
That could be done semi-manually by creating links like described here: 
<https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar>  
No Calendar API needed that way -- just construct the link and if the user is logged in to Google it will create the calendar entry when they click it.

<br>

# Credits

Daniel Reeves wrote a blog post about the idea.
Sergii Kalinchuk got the "promises.to" domain.
Marcin Borkowski had the idea for URLs-as-UI for creating promises.
Chris Butler wrote much of the initial code.

<br>
<br>
<br>

## For Later: Public Changelog

I think this is the most elegant and flexible solution to prevent cheating.
You can change anything at any time but you have to publicly justify each change and it's all permanently displayed on the promise's page.

For example:

* 2017-10-31: due date changed from 11/14 to 11/30 with comment "the original promise URL didn't specify a date and defaulted to 2 weeks out but the end of the month is what I had in mind"

Some people will do things like "giving myself an extra day because my cat got sick" which is stupid and defeats the point but by having to make 

(An alternative we were hashing out before was allowing you to edit the due date exactly once in case the system initially parsed it wrong or whatever.)


## For Later: Ideas for parsing (that I mostly dislike)

1. **Magic spaces**:
   Whichever non-alphanumeric character is most common in the urtext, that's 
   what's assumed to be a space and is replaced with spaces before parsing.
2. **Less magical version**:
   A non-alphanumeric character must follow "alice.promises.to/" and that
   character is taken as the ersatz space. Eg:
   alice.promises.to/_start_her_promises_with_underscores
3. **Flexibility on the '/by/' part**:
   Requiring the string '/by/' to appear in the promise URL means no ambiguity
   about where to start parsing the deadline. But the Chrono parsing library 
   actually does great taking the whole string like "foo the bar by noon 
   tomorrow" and figuring out the time. We could also just take the last
   occurrence of "by" and parse everything after it as the deadline.


## For Later: Calendar as UI

Maybe it's not too much friction to just manually add entries to your calendar as the primary interface for adding promises. 
There are various ways to do that with very low friction already. 
But then that needs to automatically trigger promises.to to capture each calendar entry.
(I'm doing that now with IFTTT to send promises to Beeminder.)

And maybe it's fine for *every* calendar entry to get automatically added. 
Some of them won't be promises but that's fine -- you can just mark them as 
non-promises or delete them and they won't count. 
If they are promises then you need to manually mark them as fulfilled or not. 
Beeminder (plus the embarrassment of having your reliability percentage drop 
when a deadline passes) should suffice to make sure you remember to do that.

This is moot for now while we work on the URL-as-UI version.


## For Later: Security and Privacy

Alice's friends can troll her by making up URLs like 
alice.promises.to/kick_a_puppy 
but that's not a huge concern. 
Alice, when logged in, could have to approve promises to be public.
So the prankster would see a page that says Alice promises to kick a puppy 
but no one else would.

In the MVP we can skip the approval UI and worry about abuse like that the first time it's a problem, which I predict will be after promises.to is a million dollar company.


## For Later: Active vs Inactive Promises

It might be nice to reuse slugs!
Like to say bob.commits.to/call_mom/this_week and repeat that later and treat it as a new promise.

Half-baked idea for accomplishing that:

Define a promise to be inactive if its `tfin` and `tdue` dates are both non-null and in the past. 
(So even if a promise is done early it's still active till the due date, and even if it's overdue it's still active till it's done.
Or "done" -- it could be marked 0% fulfilled.)
If a URL is requested with slug foo and there exists a promise with slug foo but it's inactive, then ... 
never mind, I don't think this works!
(But maybe the notion of active vs inactive is useful for how promises are displayed.)

New plan is to just treat user/slug pairs as necessarily unique.
If you want to reuse a slug for a new promise it's up to you to rename (create a new slug for) the old promise first.


## Other domain name ideas

* dreev.es/will/ (for anyone who has a domain for their own name)
* alice.promises.to/ (sergii grabbed this one)
* alice.commits.to/ (dreev grabbed this one)
* alice.willdefinite.ly/ (kinda awkward)
* alice.willveri.ly/ (too cutesy?)
* alice.willprobab.ly/ (emphasizes the reliability percentage)
* alice.willresolute.ly (maybe it would grow on me?)


## Getting something dogfoodable as quickly as possible

1. parse incoming promises so all the fields are stored on GET
2. anything not parseable yields an error that the user sees when clicking on the URL
3. let you mark a promise fulfilled (or fractionally fulfilled, including 0%)
4. no privacy or security features; everything is public
5. no calendar API, just construct a link the user can click to create the calendar event
6. realtime reliability score!

