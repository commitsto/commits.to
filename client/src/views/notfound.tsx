import * as React from 'react';

const NotFound = ({ message }) => (
  <main>
    <h1>
      404 Not Found
    </h1>
    <h3>
      Were you trying to create a commitment?
    </h3>
    { message && (
      <p style={{ color: 'red' }}>
        <strong>
          Error:&nbsp;
          </strong>
        { message }
      </p>
    ) }
    <p>
      Right now the preferred format is like
        <pre>alice.commits.to/do_the_thing</pre>
    </p>
    <p>
      Please avoid any other special characters right now.
      Things are a bit in flux with the URL format!
      And there are a couple special characters that will cause things to break horribly.
    </p>
  </main>
);

export default NotFound;
