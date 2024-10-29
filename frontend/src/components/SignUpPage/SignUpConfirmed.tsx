import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./SignUpConfirmed.module.css";

const SignUpConfirmed = () => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card className={classes.SignUpConfirmed}>
        <Card.Body className="text-center">
          <h2>Thank You for Signing Up!</h2>
          <p>
            Your account has been successfully created. Please log in to
            continue.
          </p>
          <Link to="/login">
            <Button variant="primary">Go to Login Page</Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUpConfirmed;
