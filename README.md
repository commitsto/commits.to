# Commits.to &mdash; a.k.a. [The I-Will System](https://github.com/beeminder/iwill/)

Start with the
[Functional Spec](https://github.com/beeminder/iwill/wiki/)
which also gives the backstory for this project.


## Development Setup

Follow the steps below. Please make a pull request if any of this isn't super straightforward or you need to do additional steps to get up and running!

#### 1. Set Up The Database

1.1 Install Postgres

For macOS, we recommend
`brew install postgresql`.
(If you're not on macOS, please make a PR with instructions for your OS!)

1.2 Start Postgres  

For macOS, start it running with either
`brew services start postgresql`
to have it as a background service that will restart if you reboot or
`pg_ctl -D /usr/local/var/postgres start`
to start it just once.

1.3 Run the following to create a user and a database:

```sh
createuser -P iwill
createdb -O iwill commitsto
```

1.4 Confirm that `postgresql` is running on `localhost:5432`

If you run
`pg_isready`
you should see
`/tmp:5432 - accepting connections`.

#### 2. Install Dependencies

2.1 Install Node

For macOS, we recommend
`brew install npm`.
(If you're not on macOS, please make a PR with instructions for your OS!)

2.2 Install Node packages with

`npm install`


#### 3. Set Up Hosts File For Subdomains

Add the following line to `/etc/hosts` with whatever subdomains you want to be available:

```sh
127.0.0.1	commits-to.js www.commits-to.js alice.commits-to.js bob.commits-to.js
```


#### 4. Create Environment File

Create a `.env` file in the root of the project directory with the following contents, replacing `<yourname>` with your name:

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

Start the development server with
`npm run start:dev`


#### 6. Seed The Database

Browse (or send a GET request) to
`http://commits-to.js:8080/resetAndDestroyWholeDatabase`
which drops all tables and inserts seed data from the `data/` folder

#### 7. Try The App

Just surf to
[commits-to.js:8080](http://commits-to.js:8080)
and you should be able to do everything you can do at the production version running at
[commits.to](http://commits.to).

## Staging

Pushes to the `develop` branch will be automatically deployed to our Heroku staging tier at
`http://commitsto.review`
