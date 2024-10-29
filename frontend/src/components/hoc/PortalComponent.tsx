import React from "react";
import { Container } from "react-bootstrap";

interface Props {
  children: React.ReactNode;
  topHeight: number | undefined;
  bottomHeight: number | undefined;
}

const PortalComponent = ({ children, bottomHeight, topHeight }: Props) => {
  return (
    <Container
      fluid
      className="w-100 p-0"
      style={{
        position: "relative",
        minHeight: `calc(100vh - (${topHeight}px + ${bottomHeight}px))`,
        backgroundColor: "#221d23",
      }}
    >
      {children}
    </Container>
  );
};

export default PortalComponent;
