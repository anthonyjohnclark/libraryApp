import { useEffect } from "react";
import { Nav, Card, Container, Form } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";

import ILoginRequest from "../../models/HookModels/GlobalHookModels/IdentityInterfaces/ILoginRequest";

import useAPIRequest from "../../hooks/GlobalHooks/useAPIRequest";
import { useIdentity } from "../../hooks/GlobalHooks/useIdentityHook";

import LoginFields from "./LoginFields";

import classes from "./LoginPage.module.css";
import AsyncComponent from "../hoc/AsyncComponent";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const formMethods = useForm();
  const identity = useIdentity();

  const LoginRequest = (data: ILoginRequest) => {
    return identity.logThemIn(data);
  };

  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  const formErrors = formMethods.formState.errors;

  useEffect(() => {
    if (apiError !== null) {
      formMethods.clearErrors();
      switch (apiError) {
        case "Email not found.":
          formMethods.setError("email", {
            type: "emailNotFound",
            message: "Oops! We don't have a user with that email!",
          });
          break;
        case "Invalid password.":
          formMethods.setError("password", {
            type: "apiSignInPassword",
            message: "Looks like you've entered the wrong password, try again!",
          });
          break;
        default:
          return;
      }
    }
  }, [formMethods, apiError, formMethods.setError]);

  const renderForm = () => {
    return (
      <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
        <Container>
          <h1 className={classes.LoginHeading}>Login</h1>
          <Form
            onSubmit={formMethods.handleSubmit(() =>
              executeAPIRequest(() =>
                LoginRequest(formMethods.getValues() as ILoginRequest)
              )
            )}
            encType="multipart/form-data"
            autoComplete="on"
          >
            <LoginFields errors={formErrors} />
          </Form>
        </Container>
      </AsyncComponent>
    );
  };

  return (
    <Container
      fluid
      className="p-0 d-flex justify-content-center flex-column"
      style={{ height: "100vh" }}
    >
      <Card className={classes.LoginPage}>
        <Card.Body style={{ width: "75vw", backgroundColor: "#29335c" }}>
          <FormProvider {...formMethods}>{renderForm()}</FormProvider>
          <div className="text-center mt-3">
            <Nav.Link as={Link} to="/signUp" className={classes.SignUpLink}>
              Want to sign up?
            </Nav.Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
export default LoginPage;
