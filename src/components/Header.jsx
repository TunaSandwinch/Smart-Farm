import { Navbar, Container } from 'react-bootstrap'
import { FaLeaf } from 'react-icons/fa'  // Leaf icon from react-icons

export default function Header() {
  return (
  <Navbar bg="light" className="mb-4 shadow-sm py-3">
    <Container fluid>
      <Navbar.Brand className="d-flex align-items-center fs-4">
        <FaLeaf className="me-2 text-success" size={28} />
        <span className="fw-bold">Smart Farm</span>
      </Navbar.Brand>
    </Container>
  </Navbar>

  )
}
