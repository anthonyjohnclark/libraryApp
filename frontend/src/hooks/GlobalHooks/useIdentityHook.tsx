import { jwtDecode } from "jwt-decode";
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";
import IIdentityContext from "../../models/HookModels/GlobalHookModels/IdentityInterfaces/IIdentityContext";
import agent from "../../api/agent";
import axios, { InternalAxiosRequestConfig } from "axios";
import IUser from "../../models/HookModels/GlobalHookModels/IdentityInterfaces/IUser";
import { useLocation, useNavigate } from "react-router-dom";

const identityContext = createContext<IIdentityContext>({} as IIdentityContext);

interface Props {
  children: React.ReactNode;
}

export const useIdentity = (): IIdentityContext => {
  return useContext(identityContext);
};

export const ProvideIdentity = ({ children }: Props) => {
  const identity = useProvideIdentity();
  return (
    <identityContext.Provider value={identity}>
      {children}
    </identityContext.Provider>
  );
};

const useProvideIdentity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [loggedInUser, setLoggedInUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem("applicationJWT")
  );

  console.log("LoggedIn User:", loggedInUser);

  // Function to set token and decoded user details from JWT
  const initializeUserFromToken = (jwtToken: string) => {
    const decodedToken: any = jwtDecode(jwtToken);

    console.log(decodedToken);

    const userRole = decodedToken["role"];
    const userId = decodedToken["nameid"];

    const user: IUser = {
      email: decodedToken.email || null,
      displayName: decodedToken.unique_name || null,
      token: jwtToken,
      role: userRole,
      id: userId,
    };
    setLoggedInUser(user);
  };

  const setTokenToBrowser = (jwtToken: string) => {
    if (jwtToken) {
      window.localStorage.setItem("applicationJWT", jwtToken);
      initializeUserFromToken(jwtToken); // Set user from token
    }
  };

  // Function to fetch additional user details from the server if necessary
  const getUser = useCallback(async () => {
    if (!loggedInUser && token) {
      try {
        const response = await agent.User.current();
        setLoggedInUser(response);
      } catch (error) {
        console.error(error);
        logThemOut();
      }
    }
  }, [loggedInUser, token]);

  const refreshToken = async () => {
    try {
      const response = await agent.User.refreshToken();
      const newToken = response.value.token;
      setTokenToBrowser(newToken);
      setToken(newToken);
    } catch (error) {
      console.error(error);
      logThemOut();
    }
  };

  // Initialize user on first load or when token changes
  useEffect(() => {
    if (token) {
      initializeUserFromToken(token); // Decode token immediately
      const loginInterceptor = axios.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          if (token) config.headers!.Authorization = `Bearer ${token}`;
          return config;
        }
      );

      // Set up periodic token refresh
      const refreshTokenInterval = setInterval(() => {
        const decodedToken: any = jwtDecode(token);
        const expires = new Date(decodedToken.exp * 1000);
        if (expires.getTime() - Date.now() < 60000) {
          refreshToken();
        }
      }, 30000);

      return () => {
        clearInterval(refreshTokenInterval);
        axios.interceptors.request.eject(loginInterceptor);
      };
    } else {
      logThemOut();
    }
  }, [token]);

  const logThemIn = async (token: any) => {
    if (token) {
      setTokenToBrowser(token);
      setToken(token);
      navigate(from, { replace: true });
    }
  };

  const logThemOut = async () => {
    setToken(null);
    setLoggedInUser(null);
    window.localStorage.removeItem("applicationJWT");
  };

  return {
    loggedInUser,
    token,
    logThemIn,
    logThemOut,
    getUser,
    setTokenToBrowser,
    setLoggedInUser,
  };
};
