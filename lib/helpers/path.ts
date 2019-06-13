import DomainParser from 'lib/parse/domain';

interface IUserPathArgs {
  host?: string;
  username: string;
}

interface IPromisePathArgs {
  host?: string;
  urtext: string;
  username: string;
}

export const userPath = ({ host, username }: IUserPathArgs) =>
  `//${username}.${DomainParser.getRoot(host)}`;

export const promisePath = ({ host, username, urtext }: IPromisePathArgs) =>
  `${userPath({ host, username })}/${urtext}`;

export const editPromisePath = ({ user: { username }, urtext }) =>
  `${promisePath({ username, urtext })}#edit`;
