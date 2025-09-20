import { Navbar, Container, Nav } from "react-bootstrap";
import { FaPlantWilt } from "react-icons/fa6";
import { NavLink } from "react-router-dom"; // use NavLink instead of Link

export default function Header() {
  return (
    <Navbar expand="lg" className="mb-4 shadow-sm py-3">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center fs-4 text-black">
          <FaPlantWilt className="me-2 text-success" size={28} />
          <span className="fw-bold">Smart Farm</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/analytics">
              Analytics
            </Nav.Link>
            <Nav.Link as={NavLink} to="/logs">
              Logging
            </Nav.Link>
            <Nav.Link as={NavLink} to="/settings">
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
