import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import classes from "../Navigation/NavBar.module.css";

type Props = {
  linkTo: string;
  children: any;
};

const NavigationLink = ({ linkTo, children }: Props) => {
  const location = useLocation();

  let path = location?.pathname.substring(1);

  const linkStyler = () => {
    let styles: string[] = [];

    if (linkTo === "profile") {
      styles.push("text-center align-self-end");
    } else if (path === linkTo) {
      styles = [classes.ActiveLink];
    }
    return styles.join(" ");
  };

  return (
    <Nav.Link
      as={Link}
      to={`/${linkTo}`}
      active={path === linkTo}
      className={linkStyler()}
    >
      {children}
    </Nav.Link>
  );
};

export default NavigationLink;
