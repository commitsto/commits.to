import { ErrorMessage, Field, Form, Formik } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import DomainParser from 'lib/parse/domain';
import { blue, darkBlue } from 'lib/theme/colors';

import PromiseDeleteButton from 'src/components/button/delete';
import PromiseSubmitButton from 'src/components/button/submit';
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

const FormGroup = styled.div`
  margin: .5rem 0 1.5rem;
`;

interface IPromiseEditProps {
  location: { pathname?: string };
}

interface IPromiseEditState {
  promise?: IPledge;
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

  public handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      fetch('/api/v1/promise/edit', {
        body: JSON.stringify(values),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      });
      this.setState(({ promise }) => ({ promise: { ...promise, ...values } }));
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
    // var timeMatch = /^((0?[1-9]|1[012])(:[0-5]\d){0,2}(\s?[AP]M))$|^([01]\d|2[0-3])(:[0-5]\d){0,2}$/i

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
                  <FormGroup>
                    <Field type="text" name="what" />
                    <ErrorMessage name="what" component="div" />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="note">Description</label>
                    <Field component="textarea" name="note" />
                    <ErrorMessage name="note" component="div" />
                  </FormGroup>

                  <FormGroup>
                    <Field label='void' type="checkbox" name="void" />
                    <label htmlFor="void">Voided?</label>
                    <ErrorMessage name="void" component="div" />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor='tini'>Created Date</label>
                    <Field component={DatePicker} name="tini" />
                    <ErrorMessage name="tini" component="div" />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor='tdue'>Due Date</label>
                    <Field component={DatePicker} name="tdue" />
                    <ErrorMessage name="tdue" component="div" />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor='tfin'>Finish Date</label>
                    <Field component={DatePicker} name="tfin" />
                    <ErrorMessage name="tfin" component="div" />
                  </FormGroup>

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
