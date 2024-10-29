import { Navigate, useLocation } from "react-router-dom";
import { useIdentity } from "../../hooks/GlobalHooks/useIdentityHook";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const identity = useIdentity();
  let location = useLocation();

  if (!identity.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
