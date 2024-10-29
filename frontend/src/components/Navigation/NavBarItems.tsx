import { Nav } from "react-bootstrap";
import NavigationLink from "../hoc/NavigationLink";
import styles from "./NavBarItems.module.css";

interface Props {
  displayName: string | null | undefined;
}

const NavBarItems = ({ displayName }: Props) => {
  return (
    <Nav
      className="w-100 d-flex align-items-center"
      style={{ whiteSpace: "nowrap" }}
      variant="tabs"
    >
      <Nav.Item className="me-auto">
        Welcome, <span className={styles.DisplayNameStyle}>{displayName}</span>
      </Nav.Item>

      <NavigationLink linkTo={"logout"}>Logout</NavigationLink>
    </Nav>
  );
};

export default NavBarItems;
