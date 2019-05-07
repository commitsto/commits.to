Commits.to &mdash; a.k.a. [The I-Will System](https://github.com/commitsto/commits.to/)
---
[![CircleCI](https://circleci.com/gh/commitsto/commits.to.svg?style=svg)](https://circleci.com/gh/commitsto/commits.to)
[![codecov](https://codecov.io/gh/commitsto/commits.to/branch/master/graph/badge.svg)](https://codecov.io/gh/commitsto/commits.to)
[![Maintainability](https://api.codeclimate.com/v1/badges/8e0ffae4691a439960df/maintainability)](https://codeclimate.com/github/commitsto/commits.to/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8e0ffae4691a439960df/test_coverage)](https://codeclimate.com/github/commitsto/commits.to/test_coverage)

Start with the
[Functional Spec](https://github.com/commitsto/commits.to/wiki/)
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

### Create Environment File

Create a `.env` file in the root of the project directory with the following contents,
replacing `<yourname>` with your name:

```sh
APP_PORT=5000

DATABASE_URL=postgres://iwill:iwill@localhost:5432/commitsto
```

### Run The Application

If you are running the app for the first time, or have recently pulled changes, you should run
`npm install`

#### Start each process in a separate terminal pane
- Build server in watch mode: `npm run dev:build:server`
- Build client in watch mode: `npm run dev:build:client`
- Start server: `npm run dev:server`


### Try The App

Just navigate to [localhost:5000/](http://localhost:5000/)

### Troubleshooting

If you have problems connecting to the application via your browser, check that you have
made the necessary changes to the `/etc/hosts` file for the subdomain you are using.  
You may also need to flush the DNS cache to ensure those changes are recognized.  

##### Ubuntu

On Ubuntu, you can use the [name service cache daemon (nscd)](https://www.systutorials.com/docs/linux/man/8-nscd/) to flush the DNS cache.

```sh
sudo apt-get install nscd
sudo service nscd restart
```
##### Mac

On MacOS, the command to flush the DNS cache will depend on your exact OS level. See [How To Clear Your DNS Cache](https://documentation.cpanel.net/display/CKB/How+To+Clear+Your+DNS+Cache) for detailed
recommendations by OS version.
## Testing

Run [Mocha](https://mochajs.org/) tests with `npm test`.

### Writing tests

We're using the [Chai](https://www.chaijs.com/) assertion library and [Sinon](https://sinonjs.org/) for spying/stubbing.
You can run tests in watch mode to get results nearly instantly on save with `npm run test:watch`

### Structuring tests

The structure and naming inside the `test/` folder should mirror the root structure and file names.
Writing code with well-contained classes or functions will be the most straightforward to unit test.

## Deployments

### Automatic Heroku Deployment

| Environment | Branch       | Domain                  |
| ----------- | ------------ | ----------------------- |
| Staging     | `master`     | http://commitstew.com   |
| Production  | `production` | http://commits.to       |

## Issue Tracking

Issue tracking labels follow the [Beeminder Label Ontology](https://blog.beeminder.com/buglabels/). The following abbreviations, acronyms, and amusing shorthands are employed in service of bug zapping and feature enhancing:

### Open Labels

| Label       | Meaning                                                                         |
| ----------- | ------------                                                                    |
| BUG         | Opposite of feature                                                             |
| RFE         | Request For Enhancement, aka feature request                                    |
| UVI         | User-Visible Improvement                                                        |
| STY         | Style/polish/CSS, or think of it as in pigsty or an eyesore                     |
| MEN         | Mendoza = need to resolve before accepting more beta users                      |
| PEA         | Easy-peasy                                                                      |
| SKY         | Pie in the sky (would be awesome but not necessarily worth the effort)          |
| ABC         | Non-technical, like prose or webcopy tweaks                                     |
| ADO         | Consensus needed on what to Actually Do (or "much ado about ∅"), AKA question |

### Closed Issues

| Label       | Meaning                                                                       |
| ----------- | ------------                                                                  |
| aok         | Feature, by design                                                            |
| cnr         | Could not reproduce                                                           |
| dup         | Duplicate                                                                     |
| nix         | Won't fix or invalid                                                          |
| zap         | fixed                                                                         |
| zzz         | postponed                                                                     |
