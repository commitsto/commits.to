# The I-Will System &mdash; a.k.a. "promises.to"

(NOTE: The spec here is evolving. We're gradually moving things to 
<https://github.com/beeminder/iwill/issues>)

Problem:
Alice casually says to Bob 
"I'll let you know if I can make it to the meeting"
but then forgets to follow through.

Solution:
Any time Alice makes any 
"<a href="http://blog.beeminder.com/will">I will</a>" 
statement like that, she types a URL like so:

`alice.promises.to/let_bob_know_re_meeting/by/tomorrow_5pm`

As in, she literally types that directly to Bob, manually, when she's making the promise to him.
When Alice or Bob click that URL a promise is created in the promises.to app and a calendar entry is added to Alice's calendar and a datapoint is sent to Beeminder.

----

Everything below is in flux

----

## Creation on GET?

Creating an object in a database in response to a GET request is pretty unkosher. 
But it might be worth it because of how elegantly it reduces the friction for the user.

At the very least I think it's important that anyone be able to click yes to create a promise, no authentication needed.
If/when that's abused we'll revisit this but initially we should make all tradeoffs in favor of lower friction.

In fact, I kind of want to try the outrageous create-on-GET version because I think it might be a feature that every yourname.promises.to URL you type gets almost automatically logged as a promise.
And I suspect that spiders and such generating URLs you didn't type will be a non-issue.

## Beeminder integration

The Beeminder datapoint gets the specified deadline as the date (even though it's in the future) and a zero as the datapoint value.
The comment should include the deadline time of day and when the promise was first created.

The Beeminder goal should be a do-more goal to fulfill like 8 promises per week.
The way I (dreev) do this currently: 
I create a datapoint for each promise (via IFTTT from Google Calendar) 
when I promise it, and then change the datapoint to a 1 when I fulfill it 
(or something less than 1 if I fulfill it late).

So Beeminder is not enforcing a success rate, just an absolute number of successes.

## Uniqueness of Promise Names

What should happen if alice says `alice.commits.to/send_the_report/by/thu` one week and then says `alice.commits.to/send_the_report/by/fri` the next week?

I'm thinking we treat those as the same promise -- so we key on just `user`+`/`+`what`.

In practice it seems to be easy to make an unlimited number of unique names for promises and if there's a collision it will be perfectly clear to the user why and what to do about it.
Anything else involves magic that we shouldn't even think about for the MVP.
The first time we're annoyed by a collision in promise names, we'll revisit this question.

## Account Settings

1. Username, used as a subdomain for the URL
2. Timezone (needed to parse the deadlines; but less important since you have the chance to fix the deadline when creating the promise)

Later:

1. Pronoun (default "they/them/their/theirs")
2. Display name, e.g., "Alice" as opposed to username "alice"

## What Non-Logged-In Users See

Minimally "alice.promises.to" should show this:
  
> If you're here then alice must've promised you they'd do something.
> They've made N such promises so far with a success rate of X%!

It could also show her Beeminder graph.

## UI For Marking Promises Fulfilled

If Alice is logged in, the app lists her existing promises and lets her choose one of 
{not fulfilled yet, fulfilled on time, fulfilled partially or late} 
for each of them. 
Each defaults to "not fulfilled yet". 
If fulfilled partially, Alice specifies what percent fulfilled it was and/or when it was fulfilled.

Whenever anything about the promise changes it needs to be automatically mirrored in Beeminder.

We may also need an option to delete promises or mark them as voided.
We're not sure what should happen on Beeminder with a voided promise so we're just not going to
implement promise-voiding until there's demand for such a feature.

## Computing Statistics

The only statistics we'll care about initially are the number of promises Alice has made and her reliability percentage.
And pending vs past promises.

Definitions:

* `fill` &mdash; a promise's fulfilled fraction, between 0 to 1, default 0
* `tnow` &mdash; current unixtime
* `tdue` &mdash; promise's deadline

A promise's fulfilled fraction, `fill`, is 1 if fulfilled on time, or the specified percentage. 
If there's a fulfilled time specified then `fill` = the specified percentage (or 1 if not specified) times `credit(tfin-tnow)` where the credit function maps a number of seconds to how much credit you get if you're that much late (see lib/latepenalty.js).
For example, credit(0) is 1 (no penalty) and credit(3600) is 0.99 (most of the credit for being just an hour late).

We need a continuous late penalty function because it will be super cool to see the reliability percentage tick down in real time when one of Alice's deadlines passes.
(Dreev recommends React for that stuff.)

Finally, for the statistics, iterate through the promises, `p`, like so:

    if p is marked "not fulfilled yet" then
      if tnow<tfin then             # unfulfilled future promises don't
        waiting++                   #  count for or against you.
      else 
        numerator += credit(tnow-tfin) # optimistically assume I'm just
        denominator++                  #  about to fulfill the promise.
      end
    else                            # p is marked fulfilled or partially
      numerator += fill             #  fulfilled, whether or not it's
      denominator++                 #  past the deadline.
    end

That's it! 
Now you can report that the user has made 
{`denominator+waiting`} promises 
(of which {`waiting`} are still in the future) 
and has a reliability of 
{`numerator/denominator*100`}%.

## Automatically Creating Calendar Entries

It's pretty critical that the promises end up on your calendar.
That could be done semi-manually by creating links like described here: <https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar>  
No Calendar API needed that way -- just construct the link and if the user is 
logged in to Google it will create the calendar entry when the click it.


# Credits

Daniel Reeves wrote a blog post about the idea.
Sergii Kalinchuk got the "promises.to" domain.
Marcin Borkowski had the idea for URLs-as-UI for creating promises.
Chris Butler wrote some of the initial code.

<br>
<br>
<br>

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

## Other domain name ideas

* dreev.es/will/ (for anyone who has a domain for their own name)
* alice.promises.to/ (sergii grabbed this one)
* alice.commits.to/ (dreev grabbed this one)
* alice.willdefinite.ly/ (kinda awkward)
* alice.willveri.ly/ (too cutesy?)
* alice.willprobab.ly/ (emphasizes the reliability percentage)
* alice.willresolute.ly (maybe it would grow on me?)

## Getting something dogfoodable as quickly as possible

1. parse incoming promises so all the fields are stored
2. anything not parseable yields an error message that the user sees when clicking on the URL
3. need a way to mark promises complete (tack on a query param to do it?)
4. no privacy or security features; everything is public
5. no calendar API, just construct a link the user can click to create the calendar event
6. realtime reliability score!

# Changelog

View the 
[project history](https://glitch.com/edit/#!/iwill?path=CHANGELOG.md:1:0)
