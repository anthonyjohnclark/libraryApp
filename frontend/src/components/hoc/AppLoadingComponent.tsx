import Container from "react-bootstrap/esm/Container";

export default function AppLoadingComponent() {
  return (
    <Container
      fluid
      className="p-0 d-flex justify-content-center"
      style={{ minHeight: "inherit" }}
    >
      <img
        src={""}
        alt=""
        className="align-self-center"
        style={{ height: "25vh" }}
      />{" "}
    </Container>
  );
}
