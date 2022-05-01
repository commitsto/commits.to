FROM cimg/node:16.15-browsers
MAINTAINER commits.to <admin@commits.to>

ENV CIRCLE_ARTIFACTS /tmp/circleci-artifacts
ENV CIRCLE_TEST_REPORTS /tmp/circleci-test-results
ENV PGHOST 127.0.0.1
ENV NODE_ENV test

# Install Code Climate reporter
RUN sudo touch /bin/cc-test-reporter && \
    sudo curl -o /bin/cc-test-reporter -fL https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 && \
    sudo chmod +x /bin/cc-test-reporter
