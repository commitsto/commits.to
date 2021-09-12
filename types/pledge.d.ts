interface IPledge {
  id?: string;
  clix?: number;
  credit?: number;
  what?: string;
  note?: string;
  tdue?: Date;
  tfin?: Date;
  username?: string;
  urtext?: string;
  user?: IUser;
}
