import { Nav } from "react-bootstrap";
import NavigationLink from "../hoc/NavigationLink";

interface Props {
  displayName: string | null | undefined;
}
const NavBarItems = ({ displayName }: Props) => {
  return (
    <>
      <NavigationLink linkTo={"profile"}>Welcome, {displayName}</NavigationLink>
      <Nav
        className="ml-auto text-center w-100 d-flex justify-content-end pr-5"
        style={{ whiteSpace: "nowrap" }}
        variant="tabs"
      >
        <NavigationLink linkTo={"logout"}>{"Logout"}</NavigationLink>
      </Nav>
    </>
  );
};

export default NavBarItems;
