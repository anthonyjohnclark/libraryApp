import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import IAPIResponse from "../../models/HookModels/GlobalHookModels/APIInterfaces/IAPIResponse";

const useAPIRequest = () => {
  const [requestStatus, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [apiError, setError] = useState<string | undefined>("");

  const executeAPIRequest = async <T>(
    asyncFunction: () => Promise<IAPIResponse<T> | void>
  ): Promise<IAPIResponse<T> | undefined> => {
    setStatus("pending");
    setError("");

    const timeout = process.env.NODE_ENV === "development" ? 1000 : 0;

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const response = await asyncFunction();
          if (response) {
            if ("isSuccess" in response && response.isSuccess) {
              setStatus("success");
              resolve(response);
            } else {
              setError(response?.error ?? "Unknown error occurred");
              setStatus("error");
              reject(response?.error ?? "Unknown error occurred");
            }
          }
        } catch (error: AxiosError | any) {
          setStatus("error");
          setError(
            (error.response?.data?.error as string) ?? error.response?.data
          );
          reject(error);
        }
      }, timeout);
    });
  };

  return { executeAPIRequest, requestStatus, apiError };
};

export default useAPIRequest;
