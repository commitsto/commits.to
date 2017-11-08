[test change directly on github for merging into Glitch at 2017-11-07_21:51]
[2nd test change directly on github at 2017-11-07 22:45]

[Changelog](https://glitch.com/edit/#!/iwill?path=CHANGELOG.md:1:0 )

[GitHub Issues](https://github.com/beeminder/iwill/issues )

[test change on Glitch for pushing to GitHub at 2017-11-07 21:52]

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
The system lets Alice mark the promise completed and keeps track of her reliabliity -- the fraction of promises she keeps!

We have both the "promises.to" and "commits.to" domain names and you can use them interchangeably.


## Overview of Functional Spec

The idea is to create a promise by constructing a URL (URL as UI!) and to mark a promise complete by surfing to that URL and submitting an html form.
By counting up how many promises were made and how many were marked completed (and applying a fancy late penalty function, already written and tested) we can show a real-time reliability percentage for each user.

Our goal is to first deploy something that works for ourselves as the simplest possible CRUD app.
No logins, no user accounts, no security, nothing.
Anyone can surf to the URL for any promise and have carte blanche on changing it in any way.
We just store all the promises and show the reliability statistics based on them.

Here's a walk-through of what needs to happen for a generic example of Bob promising to do a thing by noon:

1. Bob surfs to `bob.commits.to/do_a_thing/by/noon` 
(see "[Creation on GET](#creation-on-get)")
2. The system checks if a promise `do_a_thing` exists for `bob` yet 
(see "[Uniqueness of Promise Names](#uniqueness-of-promise-names)")
3. If not, create a promise `do_a_thing` for user `bob` 
(see "[Promise Data Structure](#promise-data-structure)" and 
"[Date Parsing](#date-parsing)")
4. The page served up for `bob.commits.to/do_a_thing/by/noon` shows a form with all the promise fields 
(see "[Marking Promises Fulfilled](#marking-promises-fulfilled)"), 
a big countdown to the deadline, and 
any late penalty if the deadline has passed 
(see "[Late Penalties](#late-penalties)")
5. In the header or corner of the page should be Bob's overall reliability across all his promises 
(see "[Computing Statistics](#computing-statistics)")
6. Also on the page: a link to create a calendar entry
(see "[Calendar Integration](#calendar-integration)")
7. (We're eager to add Beeminder integration
(see "[Beeminder Integration](#beeminder-integration)")
but will wait on that till we have user logins)
8. Nothing else special happens when a promise is marked fulfilled other than the reliability percentage updates, and maybe the color changes
9. If you go to `bob.commits.to` or `bob.promises.to` with no slug then show Bob's overall reliability score and a list of all his promises


## Creation on GET

Creating an object in a database on the server in response to a GET request is pretty unkosher. 
We've decided it's worth it because of how elegantly it reduces the friction for the user.
If/when that's abused we'll revisit it but initially we're making all tradeoffs in favor of lower friction.

Also it's a nice feature how every yourname.promises.to URL you type gets almost automatically logged as a promise.
We'll address spiders and such -- like the Googlebot trying to fetch yourname.promises.to/robots.txt -- as they're a problem.


## Promise Data Structure

The fundamental object in the promises.to app is of course the promise, aka the commitment.
The following are the database fields for the Promises table:

* `urtext`: full [original text](https://www.google.com/search?q=urtext) (URL) the user typed to create the promise
* `user`: who's making the promise, parsed as the subdomain in the urtext
* `slug`: unique identifier for the promise, parsed from the urtext URL
* (`note`: optional additional notes or context for the promise )
* `tini`: unixtime that the promise was made
* `tdue`: unixtime that the promise is due, aka the deadline
* `tfin`: unixtime that the promise was (fractionally) fulfilled (even if 0%)
* `xfin`: fraction fulfilled, default null to indicate still pending
* (`firm`: true when the due date is confirmed and can't be edited again )
* (`void`: true if the promise became unfulfillable or moot )
* (`clix`: number of clicks a promise has gotten )
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


## Marking Promises Fulfilled

This will want lots of UI love later but we'll start with an ugly html form that just throws in all the fields for the promise (see the "[Promise Data Structure](#promise-data-structure)" section).
Again, no logins or restrictions at all.
Anyone hitting a promise's URL can edit anything any time.

Later we might want to say you can't edit fields that would make the urtext be wrong. 
Namely, `user` and `slug`. 
For now, who cares if the subdomain and path in `urtext` don't match `user` and `slug`.
We'll tighten that down as needed.
And, sure, it defeats the point if you can keep changing the deadline but maybe the honor system will work surprisingly well.
In any case we have ideas for later for how to further discourage cheating (see "For Later: Public Changelog" below).

In the meantime, **marking a promise (partially) fulfilled just means editing the `xfin` field and the `tfin` field**.

Another thing for later: 
The `xfin` and `tfin` fields should either both be null -- meaning the promise is still awaiting completion -- or neither be null.
I.e., when a promise is marked (fractionally) fulfilled, it needs a date that that happened.
We want the code that calculates the statistics to be able to assume that.
But that code is written and turns out to be robost to nonsensical settings of `xfin` and `tfin` so let's not trouble the UI with any special enforcement there.
At some point all this laissez faire will cause problems but those are bridges we'll cross when we come to them.

Finally, whenever anything about the promise changes it should be automatically mirrored in Beeminder (see the "[Beeminder Integration](#beeminder-integration)" section).


## Uniqueness of Promise Names

What should happen if alice says 
`alice.commits.to/send_the_report/by/thu` one week and then says 
`alice.commits.to/send_the_report/by/fri` the next week?

Answer: treat them as the same promise.
I.e., key on just `user`+`'/'`+`slug`.

In practice it seems to be easy to make an unlimited number of unique names for promises and if there's a collision it will be perfectly clear to the user why and what to do about it.

One thing to do about it is just let the user manually rename the old promise.
It's up to the user whether they're ok with any links to the old promise pointing at the new promise.

Again, carte blanche to change any of the promise fields.
Straight up CRUD and assume the user knows what they're doing.


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
Namely, what fraction of the promises you logged did you actually fulfill?
And there's a fun twist: if you fulfill a promise late you get partial credit.
That way we can always compute a single metric for your reliability at any moment in time.

The function we're using for late penalties is below.
The idea is to have your reliability decrease strictly monotonically the moment the deadline hits, with sudden drops when you're a minute, an hour, a day, etc, late.
Here's a plot of that function -- technically the fraction of credit remaining as a function of lateness -- first zoomed in to the first 60some seconds, and then zoomed out further and further:

[![Late penalty function](https://cdn.glitch.com/ff974d2d-e212-470e-8587-f065205350d0%2Flate-penalty.png?1507416292319 "Click for bigger version")](https://cdn.glitch.com/ff974d2d-e212-470e-8587-f065205350d0%2Flate-penalty.png)

For example, `credit(0)` is 1 (no penalty) and `credit(3600)` is 0.999 (most of the credit for being just an hour late).

See the "[Computing Statistics](#computing-statistics)" section for how to actually use this in the app or read on for more on why we like this weirdo function.

### Rationale for the Crazy Late Penalty Function

There are a few key constraints on the shape of this function:

1. Strict monotonicity
2. Asymptotically approaches zero
3. Sudden drops at a minute/hour/day/week/month/year late

Being strictly monotone means that you always see your reliability score visibly ticking down second by second whenever you have an overdue promise.

Approaching but never reaching zero just means you'll always get some epsilon of credit for fulfilling a promise no matter how late you are.

The third constraint is for beehavioral-economic reasons.
We don't want you to feel like, once you've missed the deadline, that another 
hour or day or week won't matter. 
So the second-order discontinuities work like this: 
If you miss the nominal deadline your credit drops to 99.999% within seconds. 
The next sudden drop is at the 1-minute mark. 
After that you can still get 99.9% credit if you're less than an hour 
late. 
And if you miss that, you can still get 99% credit if you're less than a 
day late. 
At 24 hours the credit drops again to 90%, etc. 
A minute, an hour, a day, a week, a month, all the way up to the one-year anniversary of the deadline. 
If you hit that then you still get 10% credit. 
After that it drops pretty quickly to 1% and asymptotically approaches 0%, without ever reaching it.


## Beeminder Integration

We'd like this to be part of the MVP but it means having actual user logins and storing a Beeminder access token, so for the very initial MVP we'll leave this out.

The idea is to 
[send a datapoint to Beeminder](http://beeminder.com/api) 
for each promise you make.
A Beeminder datapoint consists of a date, a value, and a comment.
Beeminder plots those cumulatively on a graph for you and lets you hard-commit to a certain rate of progress.

In the case of promises.to the date on the Beeminder datapoint is the promise's deadline, `tdue` (even though it's in the future), and the value is the fulfilled fraction, `xfin` (initially zero).
The comment should just have the promise's urtext since that's a link to all the data about a promise.
Or something like "Auto-added by promises.to at 12:34pm -- " and then the urtext link.
(It's nice to use the timezone the user has set in Beeminder -- available in the User resource in the Beeminder API -- when showing a time of day.)

The Beeminder goal should be a do-more goal to fulfill, say, 8 promises per week.
The way I (dreev) do this currently: 
I create a datapoint for each promise (via IFTTT from Google Calendar) when I promise it, and then change the datapoint to a 1 when I fulfill it (or something less than 1 if I fulfill it late).

So Beeminder is not enforcing a success rate, just an absolute number of successes.

Pro tip: 
Promise a friend some things from your to-do list that you could do any time.
That way you're always ready for an I-will 
[beemergency](https://blog.beeminder.com/glossary/#eep).

The promises.to app's interactions with Beeminder (via Beeminder API calls) are as follows:

1. When a promise is created, create a datapoint
2. When a promise is marked (partially) fulfilled, update the datapoint's value
3. When a promise's due date changes, update the datapoint's date
4. [LATER] When a promise is deleted, delete the datapoint
5. [LATER] When a promise is voided maybe also delete the datapoint in Beeminder
5. [LATER] Create the initial Beeminder goal when a user signs up for promises.to


## Computing Statistics

The only statistics we'll care about initially are the number of promises the user has made and their reliability percentage.
And how many pending vs past promises.

The relevant fields (see the "[Promise Data Structure](#promise-data-structure)" section) are:

* `xfin` &mdash; a promise's fulfilled fraction, between 0 and 1, default 0
* `tfin` &mdash; when the promise was (fractionally) fulfilled
* `tdue` &mdash; promise's deadline

And we'll take `tnow` to be the current unixtime.
See the "[Late Penalties](#late-penalties)" section for how to compute how much credit you get for a promise as a function of how late you fulfill it.

For a specific promise, we prominently display near the slug either

> pending - `x%` late penalty = `y%` max credit

or

> 50% fulfilled on 2017-10-31 at 12:34pm - x% late penalty = y% credit.

The first case with "pending" is when `xfin` and `tfin` are null.
In that case, the 
`x%` is `1-credit(tnow-tdue)` and the 
`y%` is 100% minus that, i.e., `credit(tnow-tdue)`.
(The credit function, which takes the number of seconds late, returns 1 for negative numbers and then decreases monotonically the later you are, i.e., for more and positive number of seconds late.)
And instead of the string "pending" maybe it's a checkbox that when checked gives you the option to specify the fraction completed and when you (fractionally) completed it.

In the second case, where `xfin` and `tfin` are specified, the 
`x%` is `1-credit(tfin-tdue)` and the 
`y%` is `xfin*credit(tfin-tdue)`.

(To be clear, "50% fulfilled on 2017-10-31" isn't meant like a progress meter, though the user could manually treat it that way.
The idea is to treat the promise as being as done as it's going to get on Oct 31 and the credit you're getting is 50% of what you'd normally get.
So you multiply that 50% by whatever the credit function says based on how much after the due date Oct 31 is.)

For the overall reliability score for a user, we assume unfulfilled promises (`xfin` == null) that are still pre-deadline don't count for or against you.
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


## Calendar Integration

This is pretty important and easy so we'll consider this part of even the initial MVP.
Namely, for each promise, create a link as described here --
<https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar>  
-- to add the promise (slug and deadline) to your calendar.
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

## For Later: Color-coding

* Gray: completed promises
* Hot pink or showing flames or something cute: past due promises
* Red: deadline in less than 24 hours
* Orange: deadline in less than 48 hours
* Blue: deadline in less than 72 hours
* Green: deadline in more than 72 hours


## For Later: Public Changelog

I think this is the most elegant and flexible solution to prevent cheating.
You can change anything at any time but you have to publicly justify each change and it's all permanently displayed on the promise's page.

For example:

* 2017-10-31: due date changed from 11/14 to 11/30 with comment "the original promise URL didn't specify a date and defaulted to 2 weeks out but the end of the month is what I had in mind"

Some people will do things like "giving myself an extra day because my cat got sick" which completely defeats the point of the whole system (even for completely unimpeachable excuses it defeats the point, unless you explicitly make the deadline conditional in the first place) but by having to make those justifications publicly you can see when someone is doing that and discount their supposed reliability percentage accordingly.
I mean, people can cheat and game this in a million ways anyway so no restrictions we try to impose will ever really solve this kind of problem.

(An alternative we were hashing out before was allowing you to edit the due date exactly once in case the system initially parsed it wrong or whatever.)


## For Later: Account Settings

1. Username, used as a subdomain for the URL
2. Beeminder access token
3. Timezone (needed to parse the deadlines; but less important since you can change the deadline if it's misparsed)

Even Later:

1. Pronoun (default "they/them/their/theirs")
2. Display name, e.g., "Alice" as opposed to username "alice"


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

For the MVP we definitely just want to use the slugs as given.
At most we can apply a `humanize()` function to them when displaying the promise on the page that could, for example, replace underscores with spaces.
Or try to be smart and turn "do-the-thing" into "do the thing" but also display the slug "do_things_1-3" as "do things 1-3" and not "do things 1 3".
It's a can of worms so for the MVP we should pick something very simple and only do it in the display logic.

## For Later: Calendar as UI

This is totally at odds with the current design but before we had the URLs-as-UI idea we thought you'd create promises by creating calendar entries and use the calendar API to automatically capture those.

There are various ways to do add calendar entries with very low friction already. 
Then that needs to automatically trigger promises.to to capture each calendar entry.
(I'm doing that now with IFTTT to send promises to Beeminder.)

And maybe it's fine for *every* calendar entry to get automatically added. 
Some of them won't be promises but that's fine -- you can just mark them as 
non-promises or delete them and they won't count. 
If they are promises then you need to manually mark them as fulfilled or not. 
Beeminder (plus the embarrassment of having your reliability percentage drop 
when a deadline passes) should suffice to make sure you remember to do that.

Again, this is moot for now while we work on the URL-as-UI version.


## For Later: Security and Privacy

Alice's friends can troll her by making up URLs like 
alice.promises.to/kick_a_puppy 
but that's not a huge concern. 
Alice, when logged in, could have to approve promises to be public.
So the prankster would see a page that says Alice promises to kick a puppy 
but no one else would.

In the MVP we can skip the approval UI and worry about abuse like that the first time it's a problem, which I predict will be after promises.to is a million dollar company.


## For Later: Active vs Inactive Promises

Here's a big can of worms: It might be nice to reuse slugs!
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


## For Posterity: Domain Name Ideas

* dreev.es/will/ (for anyone who has a domain for their own name)
* alice.promises.to/ (sergii grabbed this one)
* alice.commits.to/ (dreev grabbed this one)
* alice.willdefinite.ly/ (kinda awkward)
* alice.willveri.ly/ (too cutesy?)
* alice.willprobab.ly/ (emphasizes the reliability percentage)
* alice.willresolute.ly (maybe it would grow on me?)

Maybe silly idea: we currently have "promises.to" and "commits.to" which are pretty synonomous but if we had other domains, that could maybe affect the reliability score.
Like "promising" is one thing but if it's alice.intends.to (not that we have that domain) then maybe it doesn't fully count against you if you don't actually do it.
Also if we made this work for people's personal domain names, like dreev.es/will, then we could have arbitrary verbs -- dreev.es/might, etc.
So maybe `verb` would make sense as one of the promise data structure fields in the future?
(This is also too half-baked to do anything with.)


## Getting something dogfoodable as quickly as possible

1. Parse incoming promises so all the fields are stored on GET
2. Anything not parseable yields an error that the user sees when clicking on the URL
3. Let you mark a promise fulfilled (or fractionally fulfilled, including 0%)
4. No privacy or security features; everything is public
5. Easy: construct a link the user can click to create the calendar event
6. Realtime reliability score! (Code is done; just needs hooking up)
