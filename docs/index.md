# The I-Will System: Functional Specification

## Preamble

Can you hear yourself casually saying to a coworker,
"I'll see if I can reproduce that bug"?
Or to a friend,
"I'll let you know if I can make it to the show"
or
"I'll send you the photos"?
And can you see yourself flaking out and failing to follow through on those things?

Here's our solution to that problem!
(We'll assume your name is Alice and your coworker or friend is Bob.)
Any time you make any 
"<a href="http://blog.beeminder.com/will">I will</a>" 
statement, let's say 
"I'll send you my edits tomorrow",
you type a URL like so:

```
alice.promises.to/send_bob_edits/by/tomorrow_5pm
```

As in, you literally type that, on the fly, directly to Bob, manually, when you're making the commitment to him.
When you or Bob click that URL a promise is created in the promises.to app and a calendar entry is added to your calendar and ideally a datapoint is sent to Beeminder.
The system lets you mark the promise completed and keeps track of your reliability -- the fraction of promises you keep! -- and shows it off to anyone who follows an alice.promises.to link.

(We have both the "promises.to" and "commits.to" domain names and you can use them interchangeably.)

My goal with this project is to have a way to say I'll do something in a way that friends and colleagues can have 99.97% faith in.
Which is my actual reliability so far, from having done this manually since the summer of 2017.
I've tracked my promises in
[a spreadsheet](https://docs.google.com/spreadsheets/d/1gvq0KEhj8lT8epIUUT-rx2rPbzbmIRZFP0kLXcvBHDU/edit?usp=sharing)
and
[on Beeminder](https://www.beeminder.com/d/will).
And I've gotten the public accountability aspect by 
[blogging about this](https://blog.beeminder.com/will/ "Beeminder blog post: The “I Will” System").

The system is ridiculously powerful and satisfying.
It's even weirdly relaxing.
When you get a commitment logged and on your calendar you yourself have faith that it will happen so you can put it out of your head in the meantime.
I'm excited for this to be something anyone can use!


<a name="overview"></a>
## Overview

You create a promise by constructing a URL (URL as UI!) and you mark a promise complete by surfing to that URL and checking a box.
By counting up how many promises were made and how many were marked completed (and applying a fancy late penalty function) we show a real-time reliability percentage for each user.

We'll first deploy something that works for ourselves as the simplest possible CRUD app.
No logins, no user accounts, no security, nothing.
Anyone can surf to the URL for any promise and have carte blanche on changing it in any way.
We just store all the promises and show the reliability statistics based on them.

Here's a walk-through of what needs to happen for a generic example of Jo promising to do a thing by noon:

1. Jo surfs to `jo.commits.to/do_a_thing/by/noon` 
(see "[Creation on GET](#creation-on-get)")
2. The system checks if promise `do_a_thing` exists for `jo` yet 
(see "[Parsing Dates and Promise Uniqueness](#parsing-dates-and-promise-uniqueness)")
3. If not, create promise `do_a_thing` for user `jo` 
(see "[Promise Data Structure](#promise-data-structure)")
4. The page served up for `jo.commits.to/do_a_thing/by/noon` shows a form with some of the promise fields 
(see "[Marking Promises Fulfilled](#marking-promises-fulfilled)")
5. It also shows a big countdown to the deadline and any late penalty if the deadline has passed 
(see "[Late Penalties](#late-penalties)")
6. In the header or corner of the page should be Jo's overall reliability across all her promises 
(see "[Computing Statistics](#computing-statistics)")
7. Also on the page: a link to create a calendar entry
(see "[Calendar Integration](#calendar-integration)")
8. (We're eager to add 
[Beeminder Integration](#for-later-beeminder-integration)
but will wait on that till we have user logins)
8. Nothing else special happens when a promise is marked fulfilled other than the reliability percentage updates, and maybe the color changes
9. If you go to `jo.commits.to` or `jo.promises.to` with no slug you see Jo's overall reliability score and a list of all her promises, sorted by due date would be nice


<a name="creation-on-get"></a>
## Creation on GET

Creating an object in a database on the server in response to a GET request is pretty unkosher. 
We've decided it's worth it because of how elegantly it reduces the friction for the user.
If/when that's abused we'll revisit it but initially we're making all tradeoffs in favor of lower friction.

Also it's a nice feature how every yourname.promises.to URL you type gets almost automatically logged as a promise.
We'll address spiders and such -- like the Googlebot trying to fetch yourname.promises.to/robots.txt -- as they're a problem.


<a name="promise-data-structure"></a>
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
* (`bmid`: the id of the Beeminder datapoint for this promise )

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

* [Public changelog](#for-later-public-changelog) 
for justifying things like changes to the due date
* List of all URLs ever used to access this promise
* Whether the promise was created by the actual user (if they were logged in and were the first to click on it) or by another logged-in user or by someone not logged in
* Information about the client (browser, geoIP, etc) that originally created the promise

### Importing Historical Data

I (dreev) have been manually tracking my promises for a few months now and would like to import my data to initialize the database, as soon as we have the MVP functional.
My data now lives in `data/promises.json` in the Glitch app
where I continue to add to it and edit it.
This should also serve as good real-world data to test the implementation.


<a name="marking-promises-fulfilled"></a>
## Marking Promises Fulfilled

There are two ways to do this -- basic and advanced.
For the MVP we'll implement whichever one is easier, or both.
Coder's discretion!

In both cases the underlying fields are the same 
(see "[Promise Data Structure](#promise-data-structure)").
And again, no logins or restrictions at all.
Anyone hitting a promise's URL can edit anything any time.

(Exceptions: The `user` and `slug` fields won't be editable because they form the unique identifier for the promise and we don't want to have to validate uniqueness when submitting the form.
Also it might be bad for `user` and `slug` to not match what's in the urtext.
So also `urtext` won't be editable.
See "[For Later: Changing Slugs and Urtexts](#for-later-changing-slugs-and-urtexts)".)

In both basic and advanced mode the user can edit the `tdue` field to pick any date/time as the deadline.
Initially the due date is determined by parsing the urtext 
(see "[Parsing Dates and Promise Uniqueness](#parsing-dates-and-promise-uniqueness)")
but the user has free rein to change it.
Yes, it defeats the point if you can keep changing the deadline but for the MVP, honor system!
We have ideas for later for how to further discourage cheating 
(see "[For Later: Public Changelog](#for-later-public-changelog)").

### Basic

Besides editing the due date, all the user gets in basic mode is a checkbox to mark the promise complete.
Checking the box sets `tfin` to now and `xfin` to 1.
Unchecking the box sets `tfin` and `xfin` both back to null.

### Advanced

In advanced mode the user can edit all of the following fields:

* `tini` (initially the timestamp of the [first GET request](#creation-on-get))
* `tdue`
* `tfin`
* `xfin`

In this case marking a promise (partially) fulfilled just means editing the `xfin` field and the `tfin` field to be non-null.
Some combinations of `tfin` and `xfin` don't make sense so we'll consider each possibility:

<blockquote>

##### Case 1: `tfin` null, `xfin` null

The promise is unfulfilled.
This is the default state.

##### Case 2: `tfin` specified, `xfin` null

This combination doesn't make sense.
We won't prohibit it but will show this on the page:

> Error: Promise fulfilled at [`tfin`] but needs fraction fulfilled!

We also won't worry about `tfin` possibly being in the future, although that's also weird.

##### Case 3: `tfin` null, `0 <= xfin < 1` 

This is just the user treating `xfin` like a progress bar.
"I haven't marked it done but I'm 75% of the way there!"
If it's before the deadline then the `isPending()` function in
"[Computing Statistics](#computing-statistics)"
will count the promise as pending, meaning it won't count for or against your reliability score.
If it's after the deadline then we optimistically assume you'll complete it in the next instant and show your remaining credit accordingly.
(Again, see "[Computing Statistics](#computing-statistics)".)

##### Case 4: `tfin` null, `xfin` 1

Another combination that doesn't make sense.
If you're 100% done then there must be a date that that happened.
So show this on the page:

> Warning: Promise marked done but needs completion date!

In
"[Computing Statistics](#computing-statistics)"
this is treated optimistically as if the promise will be completed in the next instant.
</blockquote>


<!-- <br>&nbsp;<br> -->

**For later:**
Whenever anything about the promise changes it should be automatically mirrored in Beeminder 
(see "[For Later: Beeminder Integration](#for-later-beeminder-integration)").


<a name="parsing-dates-and-promise-uniqueness"></a>
## Parsing Dates and Promise Uniqueness

First, what should happen if alice says 
`alice.commits.to/send_the_report/by/thu` one week and then says 
`alice.commits.to/send_the_report/by/fri` the next week?

Answer: treat them as the same promise.
I.e., key on just `user`+`'/'`+`slug`.

In practice it seems to be easy to make an unlimited number of unique names for promises and if there is a collision it's perfectly clear to the user why and what to do about it.
Namely, change the slug!
Later we can consider letting the user change the existing slug if they're ok with any links to the old promise pointing at the new one instead.
But for the MVP slugs are just always unique (per user).

So what does the `/by/` part of the URL mean?
Very little!
If the promise is first being created then we run it through a date parser and initialize the due date to whatever it says.
If there's no `/by/...` part or we couldn't parse it as a date/time, `tdue` defaults to a week from now.
And if the promise already exists -- i.e., the user and slug match an existing promise -- then anything in the urtext besides the user and slug is completely ignored.
We just show the page for the existing promise.

(In the future we'll want to not drop any information on the floor so we'll store all the URLs by which a promise was accessed.
In the meantime we can find those in the access logs if we need them.)

In short, the `/by/...` part of the URL is strictly advisory and can be changed by the user any time
(see "[Marking Promises Fulfilled](#marking-promises-fulfilled)").

-----
> *Implementation note: Chris Butler found 
[the Sherlock date parser](http://blog.metamorphium.com/Sherlock/)
which seems excellent.*
-----

<a name="late-penalties"></a>
## Late Penalties

-----
> *Implementation note:
> The implementation of this is 
[written and tested](https://github.com/beeminder/iwill/blob/master/lib/latepenalty.js).*
-----

A big part of promises.to is tracking how reliable you are.
Namely, what fraction of the promises you logged did you actually fulfill?
And there's a fun twist: if you fulfill a promise late you get partial credit.
That way we can always compute a single metric for your reliability at any moment in time.

The function we're using for late penalties is below.
The idea is to have your reliability decrease strictly monotonically the moment the deadline hits, with sudden drops when you're a minute, an hour, a day, etc, late.
Here's a plot of that function -- technically the fraction of credit remaining as a function of lateness -- first zoomed in to the first 60some seconds, and then zoomed out further and further:

<a href="https://cdn.glitch.com/ff974d2d-e212-470e-8587-f065205350d0%2Flate-penalty.png"
   title="Click for bigger version">
<img class="aligncenter"
  width="100%"
  src="https://cdn.glitch.com/ff974d2d-e212-470e-8587-f065205350d0%2Flate-penalty.png"/>
</a>

For example, `credit(0)` is 1 (no penalty) and `credit(3600)` is 0.999 (most of the credit for being just an hour late).

See "[Computing Statistics](#computing-statistics)" 
for how to actually use this in the app or read on for more on why we like this weirdo function.

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


<a name="computing-statistics"></a>
## Computing Statistics

We'll care about the following statistics initially:

1. Each promise's late penalty (0% if not yet late)
2. Each promise's max credit (100% if not yet late)
3. Each user's total number of promises made
4. Each user's total number of promises pending
5. Each user's overall reliability score

### Individual Promises

The relevant fields 
(see "[Promise Data Structure](#promise-data-structure)") 
are:

* `xfin` &mdash; a promise's fulfilled fraction, between 0 and 1, default 0
* `tfin` &mdash; when the promise was (fractionally) fulfilled
* `tdue` &mdash; promise's deadline

And we'll assume we can get the current unixtime in seconds with a `now()` function.
See "[Late Penalties](#late-penalties)" 
where we define the `credit()` function for how much credit you get for a promise as a function of how late you fulfill it.
Here we optimistically assume that any promise you're late on you're going to fulfill in the next instant.

-----
> *Implementation note: In Javascript you get current unixtime in seconds with `Date.now()/1000` (just `Date.now()` returns it in milliseconds).*
-----

For a specific promise, displayed prominently at the promise's URL, we compute the optimistic late penalty (fraction of credit lost so far by being late) and max credit (`xfin` minus the late penalty so far) as follows.
First a handy function to compute the most possible credit (least late penalty) a promise will get, expressed as a fraction in (0,1]:

```javascript
// The most possible credit (least late penalty) a promise p can have
function rosycredit(p) {
  if (p.tdue === null) { return 1 }
  const ot = p.tfin === null ? now() : p.tfin   // optimistic tfin is now
  return credit(ot - p.tdue)
}
```

And then the key numbers to show in the UI:

```javascript
latepen = 1 - rosycredit(p) // show as "#{latepen*100}%" in the UI
maxcred = (xfin === null ? 1 : xfin) * (1 - latepen) // also show as percent
```

The late penalty and max credit will change in real time for a pending promise that's past its deadline, and will update instantly when `xfin` or `tfin` change.

See "[Marking Promises Fulfilled](#marking-promises-fulfilled)" 
for handling the cases that `xfin` is specified but not `tfin` or vice versa, but the above code is robust to that and just always shows the most optimistic numbers.

(To be clear, if, say, `xfin` is 50% and `tfin` is 2017-10-31 that isn't meant like a progress meter -- "promise is 50% complete as of the 31st" -- though the user could manually treat it that way.
The idea is to treat the promise as being as done as it's going to get on Oct 31 and the credit you're getting is 50% of what you'd normally get.
No optimism about an `xfin` of 50%, only an `xfin` that's null.
So you multiply that 50% by whatever the credit function says based on how much after the due date Oct 31 is and that's your max credit.)

### User's Overall Reliability

For the overall reliability score for a user, we assume unfulfilled promises that are still pre-deadline don't count for or against you.
We call those pending promises, where there's still time to get full credit:

```javascript
// A promise p is pending if it's pre-deadline and not marked totally done
function isPending(p) { 
  return (p.tdue === null || now() < p.tdue) && p.xfin !== 1
}
```

And we optimistically assume that any promise you're late on you're going to fulfill in the next instant.
So we iterate through a user's promises like so:

```javascript
let pending = 0
let numerator = 0
let denominator = 0
user.promises.forEach(p => {
  if (isPending(p)) { pending++ } 
  else {
    numerator += (p.xfin === null ? 1 : p.xfin) * rosycredit(p)
    denominator += 1
  }
})
```

That's it! 
Now you can report that the user has made 
{`denominator+pending`} promises 
(of which {`pending`} are still in the future) 
and has a reliability of 
{`denominator === 0 ? 0 : numerator/denominator*100`}%.

The user's overall realtime reliability score should be shown prominently next to the username wherever it appears or huge in the header or something.
It's the most important number in the whole app.
Especially cool is how it will tick down in real time when one of your deadlines passes.
(Dreev recommends React for having numbers like that always updated in real time.)


<a name="calendar-integration"></a>
## Calendar Integration

This is important enough and easy enough to be part of even the initial MVP.
Namely, for each promise, create a link the user can click on to add it to their Google calendar.
Like this:

<a target="_blank" 
href="https://calendar.google.com/calendar/event?action=TEMPLATE&text=do_the_thing&dates=20171130T235959/20171130T235959&ctz=America/Los_Angeles&details=alice.promises.to/do_the_thing/by/end_of_month"><img border="0" src="https://www.google.com/calendar/images/ext/gc_button1_en.gif"></a>

Just view the html for that button here to see how that's constructed.
(Source:
[StackOverflow answer](https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar).)
Make the slug be the event text, the urtext be the event details and the promise's deadline be both the start and end date of the calendar event.
No Calendar API needed that way -- just construct the link and if the user is logged in to Google it will create the calendar entry when they click it and confirm.


<br>

# Credits

Daniel Reeves wrote a 
[blog post](http://blog.beeminder.com/will "Original blog post written 2 weeks after I started using this system manually")
about the idea.
Sergii Kalinchuk got the "promises.to" domain and is running the server that for now just forwards to Glitch.
Marcin Borkowski had the idea for URLs-as-UI for creating promises.
Chris Butler wrote much of the initial code.

<br>
<br>
<br>

<a name="for-later-beeminder-integration"></a>
## For Later: Beeminder Integration

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


<a name="for-later-color-coding"></a>
## For Later: Color-coding

* Gray: completed promises
* Hot pink or showing flames or something cute: past due promises
* Red: deadline in less than 24 hours
* Orange: deadline in less than 48 hours
* Blue: deadline in less than 72 hours
* Green: deadline in more than 72 hours


<a name="for-later-public-changelog"></a>
## For Later: Public Changelog

I think this is the most elegant and flexible solution to prevent cheating.
You can change anything at any time but you have to publicly justify each change and it's all permanently displayed on the promise's page.

For example:

* 2017-10-31: due date changed from 11/14 to 11/30 with comment "the original promise URL didn't specify a date and defaulted to a week out but the end of the month is what I had in mind"

Some people will do things like "giving myself an extra day because my cat got sick" which completely defeats the point of the whole system (even for entirely unimpeachable excuses it defeats the point, unless you explicitly make the deadline conditional in the first place) but by having to make those justifications publicly you can see when someone is doing that and discount their supposed reliability percentage accordingly.
I mean, people can cheat and game this in a million ways anyway so no restrictions we try to impose will ever really solve this kind of problem.

(An alternative we were hashing out before was allowing you to edit the due date exactly once in case the system initially parsed it wrong or whatever.
I think we'll be in a better position to make these kinds of design decisions after seeing more real-world usage. And I'm all for being super opinionated about things like not letting you edit deadlines.)


## For Later: Future Discounting

If you were late in the past but are always on time now, your past sins should fade over time.
In other words, we should apply a discount rate to reliability scores.
This is super straightforward and I (dreev) can add the code to do it when we're ready.
I'm thinking 6% or 36% per year.


## For Later: Account Settings

1. Username, used as a subdomain for the URL
2. Beeminder access token
3. Timezone (needed to parse the deadlines; but less important since you can change the deadline if it's misparsed)

Even Later:

1. Pronoun (default "they/them/their/theirs")
2. Display name, e.g., "Alice" as opposed to username "alice"


## For Later: Humanizing Slugs

I don't actually like these, just brainstorming:

1. **Magic spaces**:
   Whichever non-alphanumeric character is most common in the urtext, that's 
   what's treated as a space
2. **Less magical version**:
   A non-alphanumeric character must follow "alice.promises.to/" and that
   character is taken as the ersatz space. Eg:
   alice.promises.to/_start_her_promises_with_underscores
3. **Zero magic**:
   Never tamper with the slug at all.

For the MVP we definitely just want to use the slugs as given.
At most we can apply a `humanize()` function to them when displaying the promise on the page that could, for example, replace underscores with spaces.
Or try to be smart and turn "do-the-thing" into "do the thing" but also display the slug "do_things_1-3" as "do things 1-3" and not "do things 1 3".
It's a can of worms so for the MVP we should pick something very simple and only do it in the display logic.

## For Later: Calendar as UI

This is totally at odds with the current spec but before we had the URLs-as-UI idea we thought you'd create promises by creating calendar entries and use the calendar API to automatically capture those.

There are various ways to add calendar entries with very low friction already. 
Then that would need to automatically trigger promises.to to capture each calendar entry.
(I'm doing that now with IFTTT to send promises to Beeminder.)

And maybe it'd be fine for *every* calendar entry to get automatically added. 
Some of them wouldn't be promises but that's fine -- you could just mark them as non-promises or delete them and they wouldn't count. 
If they were promises then you'd need to manually mark them as fulfilled or not. 
Beeminder (plus the embarrassment of having your reliability percentage drop 
when a deadline passes) would suffice to make sure you remember to do that.

Again, this is moot for now while we work on the URL-as-UI version.


## For Later: Security and Privacy

Alice's friends can troll her by making up URLs like 
alice.promises.to/kick_a_puppy 
but that's not a huge concern. 
Alice, when logged in, could have to approve promises to be public.
So the prankster would see a page that says Alice promises to kick a puppy 
but no one else would.

In the MVP we can skip the approval UI and worry about abuse like that the first time it's a problem, which I predict will be after promises.to is a million dollar company.


<a name="for-later-active-vs-inactive-promises"></a>
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

Speaking of which, see the next section on changing slugs and urtexts.


<a name="for-later-changing-slugs-and-urtexts"></a>
## For Later: Changing Slugs and Urtexts

I sometimes dash out a promise URL on my phone but later would prefer a better slug.
Maybe I'm sure no one is going to click on the original one (I continue to be surprised how infrequently people click on these URLs, especially once the novelty wears off) and would like to just change it and let the original link break.
You should never just assume your promisee won't click the link but maybe you explicitly gave the new, better one.
Or maybe you only made the promise verbally and logged it directly via the address bar of your browser.

Or maybe alice.commits.to/send_the_report was dispatched and everyone knows it and now you want to promise to send_the_report again.
The most un-can-of-worms-y way to do that is to rename the old promise to alice.commits.to/send_the_report-old or alice.commits.to/archived:send_the_report or something and then just start over with alice.commits.to/send_the_report like usual.

(That could even be an Official Convention so that any promise page for "foo" would look up and display links to any "foo-old1", "foo-old2", etc promises at the bottom with a "looking for one of these previous incarnations of this promise?".
The UI could help too: maybe promises have an archive button which replaces the slug "foo" with "foo-old", or "foo-old2" if there's already a "foo-old", etc.)

But whatever the reason, you sometimes want to change a promise's slug.
We could just let you do that.
Except we shouldn't let the urtext get out of sync with the slug.
I don't know why exactly but it feels too unhygienic, which is to say I think it will cause problems later.
For debugging if nothing else.
Solution: let the user edit the urtext itself and reparse the new slug.
As the user edits the urtext we show in real time what the new slug would be and if it's taken.
If it's not taken (or the urtext edit doesn't alter the slug) then let the user hit submit.

I don't think that's too onerous to implement and will be worth it soon after the MVP.
At least the renaming, if not the whole archiving/reusing convention.

Finally, some pie in the sky for later still:
What if the user could somehow add 301-redirects willy-nilly?
Then you could change URLs without breaking links.


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
