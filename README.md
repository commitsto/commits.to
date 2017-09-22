# The I-Will System &mdash; a.k.a. "promises.to"

NOTE: The spec here is evolving. See also the comments in server.js

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
When Alice or Bob click that URL a promise is created in the promises.to app and a calendar
entry is added to Alice's calendar and a datapoint is sent to Beeminder.

## What happens on the first click of a promise URL

1. It should completely ignore whether the user is logged in. If you
go to alice.promises.to/foo/by/xyz then it says "click to confirm that
alice promises to 'foo' by [date-picker]". The datepicker uses the
"/by/xyz" from the URL as the default but if it parsed it wrong you
have a chance to change it.

2. So the promise isn't actually saved until that button is pressed
but the wording on the page encourages the recipient of the promise to
click it. Or the promiser (call her Alice) can do it -- it doesn't
matter who confirms the creation of the promise.

3. All subsequent visits to the URL just say "alice has promised to
'foo' by [date]" and maybe also a nice countdown timer to the deadline
to give a feeling of a ticking clock. Also it should show Alice's
reliability statistics. Maybe it shows Alice's full list of promises.
Same as if you visit alice.promises.to with no path in the URL.

4. And the other cool part: when a deadline passes without being
marked fulfilled then the reliability score decreases in real time
according to the late penalty function. (See "Computing Statistics" below.)

5. So the only difference for the logged in user is the ability to
mark promises fulfilled. (Post-MVP maybe there's a way for the
promisee (ie, person the promise was made to) to be the one to mark it
fulfilled. And for the MVP maybe everything can be wide open -- we're
not going to have any abuse until there are, realistically, thousands
of users or more.)


----

Everything below is in flux

----

> *Nerd note: Creating an object in a database in response to a GET request is
> pretty unkosher. 
> We're going to do it anyway because of how elegently it reduces the friction for the user.
> Otherwise Alice has to type the promise to Bob and then separately use some UI to add the
> promise to the system.*

The Beeminder datapoint gets the specified deadline as the date (even though it's in the future) 
and a zero as the datapoint value.
The comment should include the deadline time of day and when the promise was first created.

> *For later: 
> Bee doesn't like the idea of events getting created on her calendar whenever random URLs
> get surfed to.
> Probably it will be fine and is good enough for the MVP but later we'll consider an 
> enhancement like so:
> Leave the deadline off of the URL and the promise is created but with no calendar entry.
> When the user is logged in, all such promises are shown and the user can explicitly add a
> deadline.
> Since the user created the promise with a highly greppable string in chat or email it's easy
> for them to look up the deadline they mentioned when they created the promise.
> At that point the calendar entry is created but it took the logged in user doing it.
> For sufficient paranoia an account-level setting could allow or disallow deadlines specified
> as part of the URL.
> (Also some initial feedback suggests that URLs like
> `alice.promises.to/do_the_thing/by/8am_tue`  
> may be too intimidating for nontechnical folks but just
> `alice.promises.to/do_the_thing`  
> is ok.)*

After the promise is created, the app redirects to the main `alice.promises.to` page.

## Uniqueness of Promise Names

The identifier for a promise is the name the user typed in the URL, 
the `let_bob_know_re_meeting` part, 
concatenated with the unixtime (in seconds) of the deadline.
The deadline is specified in the URL by something like "10pm_tue"
so if you make another promise of `let_bob_know_re_meeting` 
next week that will be created as a distinct promise and everything will work fine.
Repeat hits on that URL *this* week will resolve to the same promise identifier 
and be idempotent.

## Account Settings

1. Username, used as a subdomain for the URL
2. Timezone (needed to parse the deadlines)

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

The only statistics we'll care about initially are the number of promises Alice has made 
and her reliability percentage.
And pending vs past promises.

Definitions:

* `fill` &mdash; a promise's fulfilled fraction, between 0 to 1, default 0
* `t` &mdash; current unixtime
* `tfin` &mdash; promise's deadline

A promise's fulfilled fraction, `fill`, is 1 if fulfilled on time, or the specified percentage. 
If there's a fulfilled time specified then `fill` = the specified percentage (or 1 if not specified) times `credit(tfin-t)` where the credit function maps a number of seconds to how much credit you get if you're that much late:

    credit(t) = 1    if t<60              # seconds late
    credit(t) = .999 if t<3600            # minutes late
    credit(t) = .99  if t<86400           # hours late
    credit(t) = .9   if t<86400*7         # days late
    credit(t) = .5   if t<86400*365.25/12 # weeks late
    credit(t) = .1   if t<86400*365.25    # months late
    credit(t) = .01  if t<86400*365.25*10 # years late
    credit(t) = 0    otherwise            # more than a decade late

> *Implementation note: Dreev has a version of that function ready that interpolates continuously.
> We'll want that version because it will be super cool to see the reliability percentage tick
> down in real time when one of Alice's deadlines passes.
> I know React makes that kind of thing easy.*

> *An alternative simple late penalty function I've used before in another context is 
> `1-(t/(86400*7))^4` 
> which gives you a couple days of very little penalty and then your credit plummets 
> till you get zero credit for being more than a week late.*

Finally, for the statistics, iterate through the promises, `p`, like so:

    if p is marked "not fulfilled yet" then
      if t<tfin then                # unfulfilled future promises don't
        waiting++                   #  count for or against you.
      else 
        numerator += credit(t-tfin) # optimistically assume you're just
        denominator++               #  about to fulfill the promise.
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


# Credits

Daniel Reeves wrote a blog post about the idea.
Sergii Kalinchuk got the "promises.to" domain.
Marcin Borkowski had the idea for URLs-as-UI for creating promises.
Chris Butler wrote some of the initial code.

<br>
<br>
<br>


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

## For Later: Security and Privacy

Alice's friends can troll her by making up URLs like 
alice.promises.to/kick_a_puppy 
but that's not a huge concern. 
Alice, when logged in, has to approve promises to be public. 
So the prankster will see a page that says Alice promises to kick a puppy 
but no one else will.

In the MVP we can skip the approval UI and worry about abuse like that the first 
time it's a problem, 
which I predict will be after promises.to is a million dollar company.

## Automatically Creating Calendar Entries

It's pretty critical that the promises end up on your calendar.
That could be done semi-manually by creating links like described here: <https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar>  
No Calendar API needed that way -- just construct the link and if the user is 
logged in to Google it will create the calendar entry when the click it.

## GET vs POST

If create-on-GET is just too hideous then the GET on alice.promises.to/foo
could show a page like:

> Did alice just promise to foo?
>
> [big button that says "YES"]

But I think anyone should be able to click yes, no authentication required.

And I really want to try the outrageous create-on-GET version first because I 
think it might be a feature that every yourname.promises.to URL you type gets 
almost automatically logged as a promise.
And I suspect that spiders and such generating URLs you didn't type will be a non-issue.


## More on Duplicates

When you visit alice.promises.to/foo it shows you,
in addition to the current promise that hitting that link created,
all the past promises named foo and when they were due, etc.

Also I think the deadline should default to 5pm the following business day.
Maybe in the initial implementation that's all that's supported.
No parsing the messy "/by/" stuff in the URLs and no UI for changing deadlines.

## More on Beeminder Integration

Mine is just a do-more goal to fulfill like 8 promises per week. 
I create a datapoint for each promise (via IFTTT from Google Calendar) 
when I promise it, and then change the datapoint to a 1 when I fulfill it 
(or something less than 1 if I fulfill it late).

So Beeminder is not enforcing a success rate, just an absolute number of successes.

## Getting something dogfoodable as quickly as possible

1. no parsing deadlines, just always assume 5pm the next business day
2. no UI for anything, the page just lists all promises no matter what
3. do need a way to mark promises complete (tack on a query param to do it?)
4. no privacy or security features, everything is public
5. no calendar API, just construct a link the user can click to create the calendar event

## Other domain name ideas

* dreev.es/will/ (for anyone who has a domain for their own name)
* alice.promises.to/ (sergii grabbed this one)
* alice.commits.to/ (dreev grabbed this one)
* alice.willdefinite.ly/ (kinda awkward)
* alice.willveri.ly/ (too cutesy?)
* alice.willprobab.ly/ (emphasizes the reliability percentage)
* alice.willresolute.ly

# Changelog

* 2017-09-11: Collects promises by capturing GET requests
* 2017-09-12: Only do so for known usernames
* 2017-09-13: Added "commits.to" as an alternate domain

# Next tasks

1. finish the parseProm function based on the new simple parsing rules
2. add all the fields to the database
3. parse incoming promises so all the fields are stored
4. anything not parseable by the simple rules yields an error message that the user sees when clicking on the URL