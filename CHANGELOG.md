History
---

## 2017-09-11
- Collects promises by capturing GET requests


## 2017-09-12
- Only do so for known usernames


## 2017-09-13
### Added
- "commits.to" as an alternate domain


## 2017-09-23
### Changed
- Don't create duplicate promises when the same link is clicked
### Added
- 'Promise' json response when a promise already exists


## 2017-09-28
### Changed
- Move seed data to folder
- Use ES6 import/export (babel)
### Added
- express-handlebars package


## 2017-09-29
### Changed
- Refactor app into folders
- Switch to SCSS
### Added
- 'Show' view for promises
  - List is linked
- Handlebars templates
### Removed
- Old promise form that was hidden


## 2017-10-01
### Changed
- Refactor routing
### Added
- Page title based on domain
### Removed
- Old promise route


## 2017-10-06
### Changed
- Route all the things!
### Added
- Set up a basic routing flow and link each view/item
- Lots of handlebars templates
- Pseudocode buildAddToCalendarHTML function in parse.js 
### Removed
- Jquery rendering


## 2017-10-09
### Changed
- Refactor styles and views
- Add a `domain` field to the data model
### Added
- Promise confirmation
- Make domain configurable
### Removed
- Automatic promise creation
