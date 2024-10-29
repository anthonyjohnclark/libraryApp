interface IUser {
  email: string | null;
  displayName: string | null;
  token: string;
  role: string;
  id?: string;
}

export default IUser;
