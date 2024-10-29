import React, { ReactNode } from "react";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

interface IProps {
  requestStatus: "idle" | "pending" | "success" | "error" | "validation";
  apiError: string | undefined;
  formSubmission?: boolean;
  children: ReactNode;
}

const AsyncComponent = ({
  requestStatus,
  apiError,
  children,
  formSubmission,
}: IProps): JSX.Element | null => {
  if (requestStatus === "pending") {
    return <LoadingComponent />;
  } else if (requestStatus === "error" && !formSubmission) {
    return <ErrorComponent error={apiError} />;
  } else {
    return <>{children}</>;
  }
};

export default AsyncComponent;
