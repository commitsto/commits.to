import Handlebars from 'handlebars'
import { domain } from '../data/seed.js'

Handlebars.registerHelper('__domain', function() {
  return domain;
});