import { ErrorMessage, Field, Form, Formik } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { blue, darkBlue } from 'lib/theme/colors';

import PromiseDeleteButton from 'src/components/button/delete';
import PromiseSubmitButton from 'src/components/button/submit';
import DatePicker from 'src/components/form/picker/date';
import ConfirmModal from 'src/components/modal/confirm';
import withParsedDomain from 'src/containers/with_parsed_domain';

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
  promise: IPledge;
  onSubmit?: (promise: IPledge) => ({});
}

interface IPromiseEditState {
  promise?: IPledge;
}

class PromiseEdit extends React.Component<IPromiseEditProps, IPromiseEditState> {
  public readonly state: Readonly<IPromiseEditState> = {
    promise: this.props.promise,
  };

  public handleDelete = (evt) => {
    evt.preventDefault();

    const { promise: { id = '' } = {} } = this.state;
    ConfirmModal('Delete', 'warning').then((result) => {
      if (result.value) {
        // FIXME abstract these out
        fetch('/api/v1/promise/delete', {
          body: JSON.stringify({ id }),
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
        }).then(({ status }) => {
          if (status === 200) {
            window.location.replace(`//${window.location.host}`);
          }
        });
      }
    });
  }

  public handleSubmit = (values, { setSubmitting }) => {
    // FIXME abstract these out
    fetch('/api/v1/promise/edit', {
      body: JSON.stringify(values),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
    .then((response) => response.json().then(({ promise }) => ({ status: response.status, promise })))
    .then(({ status, promise: updatedPromise }) => {
      if (status === 200) {
        this.setState(({ promise }) => ({ promise: { ...promise, ...updatedPromise } }));
        setSubmitting(false);

        const { onSubmit = () => ({}) } = this.props;
        onSubmit(updatedPromise);
      }
    });
  }

  public validateFields(values) {
    const errors = {};

    // TODO

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
                Save
              </PromiseSubmitButton>
            </Form>
          )}
        </Formik>

        <PromiseDeleteButton href='#' onClick={handleDelete}>
          DELETE
        </PromiseDeleteButton>
      </PromiseForm>
    );
  }
}

export default withParsedDomain(PromiseEdit);
