// src/pages/Logging.jsx
import { useState } from "react";
import { Container, Card, Button, Form, Modal } from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";
import { FaFish, FaSeedling, FaDrumstickBite } from "react-icons/fa";

export default function Logging() {
  const [showModal, setShowModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [values, setValues] = useState({}); // Store inputs per card

  const handleInputChange = (type, input) => {
    // Allow only digits, max 3 characters
    const sanitized = input.replace(/\D/g, "").slice(0, 3);
    setValues((prev) => ({ ...prev, [type]: sanitized }));
  };

  const handleLog = (type) => {
    setCurrentLog(type);
    setShowModal(true);
  };

  const confirmLog = async () => {
    const value = values[currentLog];
    if (!value) return;

    // Map log type to the correct DB column
    const columnMap = {
      "Fish Harvest": "fish_harvest",
      "Chicken Harvest": "chicken_harvest",
      "Lettuce Harvest": "lettuce_harvest",
    };

    const columnName = columnMap[currentLog];

    const { error } = await supabase.from("system_logs").insert([
      {
        [columnName]: parseInt(value, 10), // dynamic column
        timestamp: new Date(),
      },
    ]);

    if (error) {
      alert("Error logging data: " + error.message);
    } else {
      alert(`${currentLog} logged successfully!`);
    }

    // Clear only the logged field
    setValues((prev) => ({ ...prev, [currentLog]: "" }));
    setShowModal(false);
  };


  const logItems = [
    { type: "Fish Harvest", icon: <FaFish size={24} className="me-2 text-primary" /> },
    { type: "Chicken Harvest", icon: <FaDrumstickBite size={24} className="me-2 text-danger" /> },
    { type: "Lettuce Harvest", icon: <FaSeedling size={24} className="me-2 text-success" /> },
  ];

  return (
    <Container className="py-4">
      <h2 className="h3 mb-3">Log Harvest Data</h2>
      {logItems.map((item) => (
        <Card
          key={item.type}
          className="mb-3 shadow-sm text-center"
          style={{ width: "500px", height: "250px", margin: "0 auto" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <Card.Title className="fw-bold d-flex align-items-center mb-3">
              {item.icon} {item.type}
            </Card.Title>
            <Form.Control
              type="text"
              placeholder="Enter quantity"
              value={values[item.type] || ""}
              onChange={(e) => handleInputChange(item.type, e.target.value)}
              style={{ width: "300px", textAlign: "center" }}
              maxLength={3} // Just in case
              inputMode="numeric" // On mobile shows number keypad
            />
            <Button
              className="mt-3"
              style={{ width: "150px" }} // wider button
              variant="primary"
              onClick={() => handleLog(item.type)}
                disabled={!values[item.type] || values[item.type].trim() === ""}
            >
              Log
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log{" "}
          <strong>
            {values[currentLog]} {currentLog}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmLog}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
