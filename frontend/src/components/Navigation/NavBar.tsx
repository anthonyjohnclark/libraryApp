import { RefObject, useEffect } from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useIdentity } from "../../hooks/GlobalHooks/useIdentityHook";

import classes from "./NavBar.module.css";

import NavBarItems from "./NavBarItems";

interface Props {
  navRef: RefObject<HTMLElement>;
  getNavSize: () => any;
}

const NavBar = ({ navRef, getNavSize }: Props) => {
  const identity = useIdentity();

  useEffect(() => {
    getNavSize();
    window.addEventListener("resize", getNavSize());
  }, [navRef, getNavSize]);
  return (
    <>
      <Navbar expand="lg" bg="light" ref={navRef} className={classes.Folder}>
        <Navbar.Brand as={Link} to="/" className="p-0 mr-5">
          <img
            src={"logo"}
            alt=""
            style={{
              height: "2.5em",
              overflow: "hidden",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="m-1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavBarItems displayName={identity.loggedInUser?.displayName} />
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
