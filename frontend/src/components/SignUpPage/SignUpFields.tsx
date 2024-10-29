import { ReactNode } from "react";
import { Alert, Form } from "react-bootstrap";
import { FieldErrorsImpl, useFormContext } from "react-hook-form";
import classes from "./SignUpPage.module.css";

type Props = {
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
};

const SignUpFields = ({ errors }: Props) => {
  const { register } = useFormContext();

  let emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  return (
    <>
      <Form.Group>
        <Form.Label className={classes.FormLabel}>
          Display Name<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          className={classes.FormInput}
          type="text"
          placeholder="Display Name"
          {...register("displayName", { required: true })}
        />
        {errors.displayName && (
          <Alert variant="danger" className="mt-2">
            Display Name is required.
          </Alert>
        )}
      </Form.Group>

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
        {errors.email?.type === "emailAlreadyExists" ? (
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
          Password<span className="text-danger">*</span>
        </Form.Label>

        <div className={classes.PasswordRequirements}>
          <ul>
            <li>Minimum Length: 8 characters.</li>
            <li>Lowercase Letter: At least one.</li>
            <li>Uppercase Letter: At least one.</li>
            <li>Digit: At least one.</li>
            <li>
              Special Character: At least one from the set @, $, !, %, *, ?, &.
            </li>
          </ul>
        </div>

        <Form.Control
          className={classes.FormInput}
          type="password"
          placeholder="Password"
          {...register("password", {
            required: true,
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "Password must be complex.",
            },
          })}
        />
        {errors.password && (
          <Alert variant="danger" className="mt-2">
            {typeof errors.password?.message === "string"
              ? errors.password?.message
              : "Password is required."}
          </Alert>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label className={classes.FormLabel}>
          Role<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="select"
          className={classes.FormInput}
          {...register("role", { required: true })}
        >
          <option value="">Select Role</option>
          <option value="Librarian">Librarian</option>
          <option value="Customer">Customer</option>
          <option value="Other">Other</option>
        </Form.Control>
        {errors.role && (
          <Alert variant="danger" className="mt-2">
            Role is required.
          </Alert>
        )}
      </Form.Group>

      <p className="d-flex align-items-center mb-0">
        <Form.Control type="submit" className={classes.Submit} value="Submit" />
      </p>
    </>
  );
};

export default SignUpFields;
