import React from 'react'

import Intro from 'src/components/intro'

const SignUp = () => (
  <main>
    <Intro />
    <h2>
      <p>
        Get in touch with us at <a href="mailto:hello@commits.to">hello@commits.to</a> if you want to join our beta!
      </p>
      <p>
        For more help, also consider joining our <a href="http://slack.commits.to"> Slack channel</a> and checking the <a href="https://forum.beeminder.com/c/commitsto">Beeminder forum</a>.
      </p>
    </h2>
    <p>
      Read the <a href="https://github.com/commitsto/commits.to/wiki">the spec</a> or the <a href="https://blog.beeminder.com/will">original blog post</a>.
    </p>
  </main>
)

export default SignUp
