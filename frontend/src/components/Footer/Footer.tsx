import React, { RefObject, useEffect } from "react";
import { Col, Nav, Navbar, Row } from "react-bootstrap";

type Props = {
  footerRef: RefObject<HTMLElement>;
  getFooterSize: () => any;
};

const Footer = ({ getFooterSize, footerRef }: Props) => {
  useEffect(() => {
    getFooterSize();
    window.addEventListener("resize", getFooterSize());
  }, [footerRef, getFooterSize]);

  return (
    <Navbar bg="primary" expand="lg" ref={footerRef}>
      <Nav className="container-fluid">
        <Row className="w-100">
          <Col className="pl-5">
            <Nav.Item className="nav-link" style={{ color: "#dee5e5" }}>
              Library App
            </Nav.Item>
          </Col>
          <Col className="d-flex justify-content-end">
            <Nav.Item className="nav-link" style={{ color: "#dee5e5" }}>
              Created by Anthony John Clark.
            </Nav.Item>
          </Col>
        </Row>
      </Nav>
    </Navbar>
  );
};

export default Footer;
