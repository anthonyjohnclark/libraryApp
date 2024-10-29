import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../api/agent";
import useAPIRequest from "../../hooks/GlobalHooks/useAPIRequest";
import { useIdentity } from "../../hooks/GlobalHooks/useIdentityHook";
import AsyncComponent from "../hoc/AsyncComponent";

const LogoutPage = () => {
  const navigate = useNavigate();
  const identity = useIdentity();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await executeAPIRequest(() => agent.User.logout());
      } finally {
        // Clear the user session and redirect regardless of request outcome
        identity.logThemOut();
        navigate("/login");
      }
    };

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <>
      <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
        {""}
      </AsyncComponent>
    </>
  );
};

export default LogoutPage;
