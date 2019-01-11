interface IUserPathArgs {
  username: string;
}

interface IPromisePathArgs {
  urtext: string;
  username: string;
}

export const userPath = ({ username }: IUserPathArgs) => `/${username}`;

export const promisePath = ({ username, urtext }: IPromisePathArgs) =>
  `${userPath({ username })}/${urtext}`;

// FIXME
export const editPromisePath = ({ user: { username }, urtext }) =>
  `${promisePath({ username, urtext })}#edit`;
