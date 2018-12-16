import * as React from 'react';

import CardHeader from 'src/components/card/header';

const CardDetails = () => (
  <section class="promise">
    <div class="promise-card {{cardClassesFor promise}} {{dueColor (dueStatus promise.tdue)}}">
      <CardHeader />
      <div class="promise-info">
        <div class="promise-details">
          <a href="{{promisePath promise}}">
            <div class="promise-domain">
              {{ promiseDomain promise.domain }}
            </div>
            <div class="promise-text">
              {{ promise.what }}
              <!-- {{#if promise.tdue}} by {{ prettyDate promise.tdue }}{{/if}} -->
            </div>
            {{#if promise.note}}
              <small>
              {{ promise.note }}
            </small>
            {{/if}}
          </a>
        </div>
      </div>

      {{#if promise.tdue}}
        <div class="promise-bar promise-bar--due">
        <div class="promise-bar-date" style="opacity:.75">
          <div class="relative-date">
            {{ relativeDate promise.tdue }}
          </div>
          <div class="momentable" data-date="{{promise.tdue}}">
            <span><noscript>{{ prettyDate promise.tdue }}</noscript></span>
          </div>
        </div>
      </div>
      {{/if}}
    </div>
  </section>
);

export default CardDetails;
