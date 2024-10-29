import { useEffect } from "react";
import { Nav, Card, Container, Form } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";

import ISignUpRequest from "../../models/HookModels/GlobalHookModels/IdentityInterfaces/ISignUpRequest";
import useAPIRequest from "../../hooks/GlobalHooks/useAPIRequest";

import SignInFields from "./SignUpFields";
import classes from "./SignUpPage.module.css";
import agent from "../../api/agent";
import AsyncComponent from "../hoc/AsyncComponent";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const formMethods = useForm();
  const navigate = useNavigate();

  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();
  const formErrors = formMethods.formState.errors;

  useEffect(() => {
    if (apiError !== null) {
      formMethods.clearErrors();

      switch (apiError) {
        case "Email already exists.":
          formMethods.setError("email", {
            type: "emailAlreadyExists",
            message: "This email is already associated with an account.",
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
          <h1 className={classes.SignUpHeading}>Sign Up</h1>
          <Form
            onSubmit={formMethods.handleSubmit(() =>
              executeAPIRequest(() =>
                agent.User.signUp(
                  formMethods.getValues() as ISignUpRequest
                ).then(() => {
                  navigate("/signUpConfirmed");
                })
              )
            )}
            encType="multipart/form-data"
            autoComplete="on"
          >
            <SignInFields errors={formErrors}></SignInFields>
          </Form>
        </Container>
      </AsyncComponent>
    );
  };

  return (
    <Container
      fluid
      className="p-0 d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card
        className={classes.SignUpPage}
        style={{ width: "75vw", backgroundColor: "#29335c" }}
      >
        <Card.Body>
          <FormProvider {...formMethods}>{renderForm()}</FormProvider>
        </Card.Body>
        <div className="text-center mt-3">
          <Nav.Link as={Link} to="/login" className={classes.NavLink}>
            Already have an account? Log in
          </Nav.Link>
        </div>
      </Card>
    </Container>
  );
};

export default SignUpPage;
