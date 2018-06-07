# Commits.to &mdash; a.k.a. [The I-Will System](https://github.com/beeminder/iwill/)

Start with the
[Functional Spec](https://github.com/beeminder/iwill/wiki/)
which also gives the backstory for this project.


## Development Setup

Follow the steps below. Please make a pull request if any of this isn't super straightforward
or you need to do additional steps to get up and running!

#### 1. Set Up The Database

1.1 Install Postgres

For macOS, we recommend `brew install postgresql`.

For Ubuntu you can run `sudo apt install postgresql`.

(If you're not on macOS or Ubuntu, please make a PR with instructions for your OS!)

1.2 Start Postgres  

For macOS, start it with running either `brew services start postgresql`
to have it as a background service that will restart if you reboot or
`pg_ctl -D /usr/local/var/postgres start` to start it just once.

On Ubuntu, start it with the command `sudo service postgresql start`
to have it run as a background service that will restart if you reboot or
`sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main -l logfile start`
which runs the script as the automatically created PostgreSQL user account to
start it just once.

1.3 Run the following to create a user and a database. If prompted for a
password, use the password `iwill`.

On macOS:

```sh
createuser -P iwill
createdb -O iwill commitsto
```

On Ubuntu:

```sh
sudo -u postgres createuser -P iwill
sudo -u postgres createdb -O iwill commitsto
```


1.4 Confirm that `postgresql` is running on `localhost:5432`

If you run `pg_isready` you should see `/tmp:5432 - accepting connections`.

#### 2. Install Dependencies

2.1 [Install Node](https://nodejs.org/en/download/) 8.x LTS with the binary
or installer or by using a [package manager](https://nodejs.org/en/download/package-manager).

2.2 Install Node packages with `npm install`


#### 3. Set Up Hosts File For Subdomains

Add the following line to `/etc/hosts` with whatever subdomains you want to be available:

```sh
127.0.0.1	commits-to.js www.commits-to.js alice.commits-to.js bob.commits-to.js
```

You should also add any subdomain you will to use to create test
commits to the list `USERS` in the file `db/seed.js` , e.g.:

```js
const USERS = [
  /* testing */
  'alice', 'bob', 'carol', 'deb', 'my_new_username',
]
```

Make sure to re-seed the database if you make changes here (See instructions in
step 6).


#### 4. Create Environment File

Create a `.env` file in the root of the project directory with the following contents,
replacing `<yourname>` with your name:

```sh
ENV_NAME=<yourname>-dev
PORT=8080
APP_DOMAIN=commits-to.js:8080
DATABASE_URL=postgres://iwill:iwill@localhost:5432/commitsto

# Optional
MAILGUN_KEY=
MAILGUN_DOMAIN=
MAILGUN_TO=
MAILGUN_FROM=
```


#### 5. Run The Application

Start the development server with `npm run start:dev`


#### 6. Seed The Database

Browse (or send a GET request) to `http://commits-to.js:8080/reset` which drops all tables
and inserts seed data from the `data/` folder

#### 7. Try The App

Just surf to [commits-to.js:8080](http://commits-to.js:8080) and you should be able to do
everything you can do at the production version running at [commits.to](http://commits.to).

## Environments

Merges to the `master` branch will be automatically deployed to our Heroku staging tier at `http://commitsto.review`. Merges to the `production` branch are automatically deployed to `http://commits.to`
