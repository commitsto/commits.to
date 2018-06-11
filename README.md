Commits.to &mdash; a.k.a. [The I-Will System](https://github.com/beeminder/iwill/)
---
[![CircleCI](https://circleci.com/gh/commitsto/commits.to.svg?style=svg)](https://circleci.com/gh/commitsto/commits.to)
[![codecov](https://codecov.io/gh/commitsto/commits.to/branch/master/graph/badge.svg)](https://codecov.io/gh/commitsto/commits.to)
[![Maintainability](https://api.codeclimate.com/v1/badges/8e0ffae4691a439960df/maintainability)](https://codeclimate.com/github/commitsto/commits.to/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8e0ffae4691a439960df/test_coverage)](https://codeclimate.com/github/commitsto/commits.to/test_coverage)

Start with the
[Functional Spec](https://github.com/beeminder/iwill/wiki/)
which also gives the backstory for this project.


## Development Setup

Follow the steps below. Please make a pull request if any of this isn't super straightforward
or you need to do additional steps to get up and running!

### Set Up The Database

#### Install Postgres

| Environment | Command                       |
| ----------- | ----------------------------- |
| macOS       | `brew install postgresql`     |
| Linux       | `sudo apt install postgresql` |

#### Start Postgres  

##### macOS
Start it with running either `brew services start postgresql`
to have it as a background service that will restart if you reboot or
`pg_ctl -D /usr/local/var/postgres start` to start it just once.

##### Ubuntu
Start it with the command `sudo service postgresql start`
to have it run as a background service that will restart if you reboot or
`sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main -l logfile start`
which runs the script as the automatically created PostgreSQL user account to
start it just once.

Confirm that `postgresql` is running on `localhost:5432`. If you run `pg_isready` you
should see `/tmp:5432 - accepting connections`.

#### Create Database

Run the following to create a user and a database. If prompted for a
password, use the password `iwill`.

##### macOS

```sh
createuser -P iwill
createdb -O iwill commitsto
```

##### Ubuntu

```sh
sudo -u postgres createuser -P iwill
sudo -u postgres createdb -O iwill commitsto
```

### Install Dependencies

2.1 [Install Node](https://nodejs.org/en/download/) 8.x LTS with the binary
or installer or by using a [package manager](https://nodejs.org/en/download/package-manager).



### Set Up Hosts File For Subdomains

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

Make sure to re-[seed the database](#seed-the-database) if you make changes here.


### Create Environment File

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


### Run The Application

- If you are running the app for the first time, or have recently pulled changes, you should run
`npm install`
- Start the development server with `npm run start:dev`


### Try The App

Just navigate to [commits-to.js:8080](http://commits-to.js:8080) (the `ENV_DOMAIN` - must contain the `PORT`)

### Seed The Database

Browse (or send a GET request) to `http://commits-to.js:8080/reset` which drops all tables
and inserts seed data from the `data/` folder

## Testing

Run [Mocha](https://mochajs.org/) tests with `npm test`.

### Writing tests

We're using the [Chai](http://www.chaijs.com/) assertion library and [Sinon](http://sinonjs.org/) for spying/stubbing.
You can run tests in watch mode to get results nearly instantly on save with `npm run test:watch`

### Structuring tests

The structure and naming inside the `test/` folder should mirror the root structure and file names.
Writing code with well-contained classes or functions will be the most straightforward to unit test.

## Deployments

### Automatic Heroku Deployment

| Environment | Branch       | Domain                  |
| ----------- | ------------ | ----------------------- |
| Staging     | `master`     | http://commitsto.review |
| Production  | `production` | http://commits.to       |
