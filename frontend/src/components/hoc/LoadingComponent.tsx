import Spinner from "react-bootstrap/esm/Spinner";
import Container from "react-bootstrap/esm/Container";

interface Props {
  content?: string;
}

export default function LoadingComponent({ content }: Props) {
  return (
    <Container
      fluid
      className="p-0 d-flex justify-content-center"
      style={{ minHeight: "inherit" }}
    >
      <Spinner
        animation="border"
        variant="warning"
        className="align-self-center"
      />
      <p style={{ fontWeight: "bold" }}>{content}</p>
    </Container>
  );
}
