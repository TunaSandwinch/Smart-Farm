// src/pages/Logging.jsx
import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";
import { FaFish, FaSeedling, FaDrumstickBite } from "react-icons/fa";

export default function Logging() {
  const [showModal, setShowModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [values, setValues] = useState({});
  const [fishLogs, setFishLogs] = useState([]);
  const [lettuceLogs, setLettuceLogs] = useState([]);
  const [chickenLogs, setChickenLogs] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
    type: null,
  });
  const [editConfirm, setEditConfirm] = useState({
    show: false,
    id: null,
    type: null,
    value: "",
  });

  // Handle Edit button click
  const handleEdit = (log, type) => {
    const value =
      type === "Fish Harvest"
        ? log.fish_harvest
        : type === "Chicken Harvest"
        ? log.chicken_harvest
        : log.lettuce_harvest;

    setEditConfirm({ show: true, id: log.id, type, value });
  };

  // Confirm Edit
  const confirmEdit = async () => {
    const { id, type, value } = editConfirm;

    const columnMap = {
      "Fish Harvest": "fish_harvest",
      "Chicken Harvest": "chicken_harvest",
      "Lettuce Harvest": "lettuce_harvest",
    };

    const columnName = columnMap[type];

    const { error } = await supabase
      .from("system_logs")
      .update({ [columnName]: parseInt(value, 10) })
      .eq("id", id);

    if (error) {
      alert("Error updating log: " + error.message);
    } else {
      alert(`${type} log updated successfully!`);
      fetchLogs(); // refresh
    }

    setEditConfirm({ show: false, id: null, type: null, value: "" });
  };
  // Fetch logs from Supabase
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching logs:", error.message);
      return;
    }

    // Separate logs by type
    setFishLogs(data.filter((d) => d.fish_harvest !== null));
    setLettuceLogs(data.filter((d) => d.lettuce_harvest !== null));
    setChickenLogs(data.filter((d) => d.chicken_harvest !== null));
  };

  const handleInputChange = (type, input) => {
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

    const columnMap = {
      "Fish Harvest": "fish_harvest",
      "Chicken Harvest": "chicken_harvest",
      "Lettuce Harvest": "lettuce_harvest",
    };

    const columnName = columnMap[currentLog];

    const { error } = await supabase.from("system_logs").insert([
      {
        [columnName]: parseInt(value, 10),
        timestamp: new Date(),
      },
    ]);

    if (error) {
      alert("Error logging data: " + error.message);
    } else {
      alert(`${currentLog} logged successfully!`);
      fetchLogs(); // refresh after insert
    }

    setValues((prev) => ({ ...prev, [currentLog]: "" }));
    setShowModal(false);
  };

  const handleDelete = (id, type) => {
    setDeleteConfirm({ show: true, id, type });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteConfirm;

    const { error } = await supabase
      .from("system_logs")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting log: " + error.message);
    } else {
      alert(`${type} log deleted successfully!`);
      fetchLogs(); // refresh after delete
    }

    setDeleteConfirm({ show: false, id: null, type: null });
  };

  const logItems = [
    {
      type: "Fish Harvest",
      icon: <FaFish size={24} className="me-2 text-primary" />,
    },
    {
      type: "Chicken Harvest",
      icon: <FaDrumstickBite size={24} className="me-2 text-danger" />,
    },
    {
      type: "Lettuce Harvest",
      icon: <FaSeedling size={24} className="me-2 text-success" />,
    },
  ];

  return (
    <Container className="py-4">
      <h2 className="h3 mb-3">Log Harvest Data</h2>

      {/* Logging Cards */}
      {logItems.map((item) => (
        <Card
          key={item.type}
          className="mb-3 shadow-sm text-center mx-auto"
          style={{ maxWidth: "500px", height: "250px" }}
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
              className="text-center"
              style={{ maxWidth: "300px" }}
              maxLength={3}
              inputMode="numeric"
            />
            <Button
              className="mt-3 w-100"
              style={{ maxWidth: "200px" }}
              variant="primary"
              onClick={() => handleLog(item.type)}
              disabled={!values[item.type] || values[item.type].trim() === ""}
            >
              Log
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Confirmation Modal for Logging */}
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

      {/* Confirmation Modal for Delete */}
      <Modal
        show={deleteConfirm.show}
        onHide={() => setDeleteConfirm({ show: false, id: null, type: null })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this{" "}
          <strong>{deleteConfirm.type}</strong> log?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null, type: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    
      {/* Confirmation Modal for Edit */}
      <Modal
        show={editConfirm.show}
        onHide={() => setEditConfirm({ show: false, id: null, type: null, value: "" })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit {editConfirm.type} Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editConfirm.value}
            onChange={(e) =>
              setEditConfirm((prev) => ({
                ...prev,
                value: e.target.value.replace(/\D/g, "").slice(0, 3), // digits only
              }))
            }
            maxLength={3}
            inputMode="numeric"
            className="text-center"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setEditConfirm({ show: false, id: null, type: null, value: "" })
            }
          >
            Cancel
          </Button>
          <Button variant="success" onClick={confirmEdit} disabled={!editConfirm.value}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Stacked Tables */}
      <h3 className="mt-5 mb-3">Fish Harvest Logs</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Quantity</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fishLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.fish_harvest}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(log, "Fish Harvest")}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(log.id, "Fish Harvest")}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="mt-5 mb-3">Lettuce Harvest Logs</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Quantity</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lettuceLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.lettuce_harvest}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(log, "Lettuce Harvest")}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(log.id, "Lettuce Harvest")}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="mt-5 mb-3">Chicken Harvest Logs</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Quantity</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chickenLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.chicken_harvest}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(log, "Chicken Harvest")}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(log.id, "Chicken Harvest")}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
