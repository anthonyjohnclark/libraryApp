import IUser from "./IUser";

interface IIdentityContext {
  loggedInUser: IUser | null;
  token: string | null;
  logThemIn: (token: string) => Promise<void>;
  logThemOut: () => void;
  getUser: () => Promise<void>;
  setTokenToBrowser: (token: string) => void;
  setLoggedInUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export default IIdentityContext;
