import usePortalDimensions from "../hooks/GlobalHooks/usePortalDimensions";

import Footer from "./Footer/Footer";
import NavBar from "./Navigation/NavBar";
import PortalComponent from "./hoc/PortalComponent";
import { useRef } from "react";
import { Container } from "react-bootstrap";
import RequireAuth from "./hoc/RequireAuth";

const MainApp = ({ children }: { children: JSX.Element | null }) => {
  const navRef = useRef() as any;

  const footerRef = useRef() as any;

  const { topHeight, bottomHeight, getTopSize, getBottomSize } =
    usePortalDimensions(navRef, footerRef);

  return (
    <RequireAuth>
      <Container fluid style={{ width: "100%", padding: "0" }}>
        <NavBar getNavSize={getTopSize} navRef={navRef} />
        <PortalComponent topHeight={topHeight} bottomHeight={bottomHeight}>
          {children}
        </PortalComponent>
        <Footer getFooterSize={getBottomSize} footerRef={footerRef} />
      </Container>
    </RequireAuth>
  );
};

export default MainApp;
