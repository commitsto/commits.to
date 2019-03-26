import { ErrorMessage, Field, Form, Formik } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import DomainParser from 'lib/parse/domain';
import { blue, darkBlue } from 'lib/theme/colors';

import PromiseDeleteButton from 'src/components/button/delete';
import PromiseSubmitButton from 'src/components/button/submit';
import { IPromise } from 'src/components/card/index';
import DatePicker from 'src/components/form/picker/date';
import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';

const PromiseForm = styled.div`
  border: 1px solid ${blue};
  margin: 2rem .5rem;
  position: relative;
  padding: 2rem 2rem 7rem;

  /* TODO: splt these into separate styled components? */
  input, textarea {
    background: none;
    border: 1px dotted ${darkBlue};
    box-sizing: border-box;
    color: ${blue};
    display: block;
    font-size: 1.5rem;
    padding: .5em;
    /* margin: .5rem 0 1.5rem; */
    width: 100%;

    &[type=checkbox] {
      display: inline-block;
      margin-right: .5rem;
      width: auto;
    }

    &[disabled][type=text] {
      border: 1px solid $dark-gray;
    }
  }

  textarea {
    font-size: 1rem;
  }

  label {
    color: ${blue};
  }
`;

interface IPromiseEditProps {
  location: { pathname?: string };
}

interface IPromiseEditState {
  promise?: IPromise;
}

class PromiseEdit extends React.Component<IPromiseEditProps, IPromiseEditState> {
  public readonly state: Readonly<IPromiseEditState> = {
    promise: {},
  };

  public componentDidMount() {
    const { location = {} } = this.props;
    const { pathname: urtext } = location;
    const username = DomainParser.getUsername(window.location.hostname);

    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext.substr(6).toLowerCase()}`)
      .then((response) => {
        response.json()
          .then(({ promise = {} }) => {
            this.setState({ promise });
          });
      });
  }

  public handleDelete(evt) {
    evt.preventDefault();

    alert('delete'); // TODO
  }

  public handleSubmit(values, { setSubmitting }) {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2)); // TODO
      setSubmitting(false);
    }, 400);
  }

  public validateFields(values) {
    const errors = {};

    // if (!values.email) {
    //   errors.email = 'Required';
    // } else if (
    //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    // ) {
    //   errors.email = 'Invalid email address';
    // }

    // console.log('validate', values, errors);

    return errors;
  }

  public render() {
    const { handleDelete, handleSubmit, validateFields } = this;
    const { promise: { user = {}, ...promise } = {} } = this.state;

    return (
      <div>
        <LoadableContainer isLoaded={!_.isEmpty(promise)}>
          <PromiseCard withHeader key={promise.id} promise={promise} user={user} />

          <PromiseForm>
            <Formik
              initialValues={promise}
              onSubmit={handleSubmit}
              validate={validateFields}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field type="text" name="what" />
                  <ErrorMessage name="what" component="div" />

                  <Field component="textarea" name="note" />
                  <ErrorMessage name="note" component="div" />

                  <div>
                    <Field label='void' type="checkbox" name="void" />
                    <label htmlFor="void">Voided?</label>
                    <ErrorMessage name="void" component="div" />
                  </div>

                  <div>
                    <label htmlFor='tini'>Created Date</label>
                    <Field component={DatePicker} name="tini" />
                    <ErrorMessage name="tini" component="div" />
                  </div>

                  {/* <div>
                    <label htmlFor='tdue'>Due Date</label>
                    <Field component={TimePicker} name="tdue" />
                    <ErrorMessage name="tdue" component="div" />
                  </div>

                  <div>
                    <label htmlFor='tfin'>Finish Date</label>
                    <Field component={TimePicker} name="tfin" />
                    <ErrorMessage name="tfin" component="div" />
                  </div> */}

                  <PromiseSubmitButton type="submit" disabled={isSubmitting}>
                    Submit
                  </PromiseSubmitButton>
                </Form>
              )}
            </Formik>
          </PromiseForm>

          <PromiseDeleteButton href='#' onClick={handleDelete}>
            DELETE
          </PromiseDeleteButton>
        </LoadableContainer>
      </div>
    );
  }
}

export default withRouter(PromiseEdit);
