import ILoginRequest from "./ILoginRequest";
import IUser from "./IUser";

interface IIdentityContext {
  loggedInUser: IUser | null;
  token: string | null;
  logThemIn: (creds: ILoginRequest) => Promise<void>;
  logThemOut: () => void;
  getUser: () => Promise<void>;
  setTokenToBrowser: (token: string) => void;
  setLoggedInUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export default IIdentityContext;
