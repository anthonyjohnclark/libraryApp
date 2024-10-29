import { ReactNode } from "react";
import { Alert, Form } from "react-bootstrap";
import { FieldErrorsImpl, useFormContext } from "react-hook-form";

import classes from "./LoginPage.module.css";
type Props = {
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
};

const LoginFields = ({ errors }: Props) => {
  const { register } = useFormContext();

  let emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  return (
    <>
      <Form.Group>
        <Form.Label className={classes.FormLabel}>
          Email<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          className={classes.FormInput}
          type="email"
          placeholder="Email"
          {...register("email", {
            required: true,
            maxLength: 200,
            pattern: {
              value: emailRegex,
              message: "Invalid email.",
            },
          })}
        />
        {errors.email?.type === "emailNotFound" ? (
          <Alert variant="danger" className="mt-2">
            {errors.email?.message as ReactNode}
          </Alert>
        ) : errors.email ? (
          <Alert variant="danger" className="mt-2">
            Email is required.
          </Alert>
        ) : (
          ""
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label className={classes.FormLabel}>
          Enter your password:
        </Form.Label>
        <Form.Control
          className={classes.FormInput}
          type="password"
          placeholder="Password"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password?.type === "apiSignInPassword" ? (
          <Alert variant="danger" className="mt-2">
            {errors.password?.message as ReactNode}
          </Alert>
        ) : errors.password ? (
          <Alert variant="danger" className="mt-2">
            Please enter your password.
          </Alert>
        ) : (
          ""
        )}
      </Form.Group>
      <p className="d-flex align-items-center mb-0">
        <Form.Control type="submit" className={classes.Submit} value="Submit" />
      </p>
    </>
  );
};

export default LoginFields;
