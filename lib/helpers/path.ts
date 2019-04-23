import DomainParser from 'lib/parse/domain';

interface IUserPathArgs {
  username: string;
}

interface IPromisePathArgs {
  urtext: string;
  username: string;
}

export const userPath = ({ username }: IUserPathArgs) => {
  const root = DomainParser.getRoot(window.location.host);

  return `//${username}.${root}`;
};

export const promisePath = ({ username, urtext }: IPromisePathArgs) =>
  `${userPath({ username })}/${urtext}`;

export const editPromisePath = ({ user: { username }, urtext }) =>
  `${promisePath({ username, urtext })}#edit`;

// TODO: only force hard reload when necessary

// const promisePath = function ({ username, id }) {
//   let path = '/'
//   const urtext = id.slice(username.length + 1) // FIXME: when this is transpiled
//   if (hasSubdomain()) {
//     path += urtext
//   } else {
//     path += `/${username}.${window.location.host}/${urtext}`
//   }
//   console.log('promisePath', path)
//   return path
// }

// const apiPath = function ({ action, username }) {
//   const prefix = !hasSubdomain() ? `/_s/${username}` : ''
//   return `${prefix}/promises/${action}`
// }

// const fetchById = ({ action, id, username }) => fetch(
//   apiPath({ action, username }),
  // {
  //   method: 'POST',
  //   headers: {
  //     'content-type': 'application/json',
  //   },
  //   body: JSON.stringify({ id }),
  // }
// )
