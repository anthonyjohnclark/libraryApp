import { Alert } from "react-bootstrap";
import { Container } from "react-bootstrap";

interface Props {
  error?: string;
}

const ErrorComponent = ({ error }: Props) => {
  const getErrorMessage = () => {
    if (typeof error === "string") {
      return error;
    }
  };
  return (
    <Container
      fluid
      style={{ fontWeight: "bold", minHeight: "inherit" }}
      className="text-center p-0 d-flex justify-content-center"
    >
      <Alert variant="danger" className="align-self-center">
        Oops! Something went wrong!{" "}
        <span style={{ color: "red" }}>{getErrorMessage()}</span>
        <br />
        Refresh the page and try again.
      </Alert>
    </Container>
  );
};

export default ErrorComponent;
