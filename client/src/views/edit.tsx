import { ErrorMessage, Field, Form, Formik } from 'formik';
import _ from 'lodash';
import { darken } from 'polished';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { blue, darkBlue, white } from 'lib/theme/colors';
import { IPromise } from 'src/components/card/index';
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
    margin: .5rem 0 1.5rem;
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

const PromiseSubmitButton = styled.button`
  color: ${white};
  cursor: pointer;
  background-color: ${blue};
  position: absolute;
  bottom: 0;
  display: block;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 1rem;
  text-align: center;
  transition: all .25s ease-in-out;
  margin: 0;
  outline: 0;
  border: 0;
  border-radius: 0;
  width: 100%;
  left: 0;

  &:hover {
    background-color: ${darken(.2, blue)};
  }
`;

const PromiseDeleteButton = styled.a`
  font-size: 12px;
  margin-left: .5rem; // FIXME

  &:hover {
    color: $red;
  }
`;

// FIXME method on Promise model
const parseId = ({ id = '' }) => {
  const [ , username, ...urtext ] = id.toLowerCase().split('/');
  return { username, urtext: urtext.join('/') };
};

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
    const { pathname } = location;
    const { username, urtext } = parseId({ id: pathname.substring(5) }); // remove /edit

    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext}`)
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
