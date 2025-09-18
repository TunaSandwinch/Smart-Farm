import { Navbar, Container } from 'react-bootstrap'
import { FaPlantWilt } from "react-icons/fa6";

export default function Header() {
  return (
  <Navbar className="mb-4 shadow-sm py-3">
    <Container fluid>
      <Navbar.Brand className="d-flex align-items-center fs-4">
        <FaPlantWilt className="me-2 text-success" size={28} />
        <span className="fw-bold">Smart Farm</span>
      </Navbar.Brand>
    </Container>
  </Navbar>

  )
}
