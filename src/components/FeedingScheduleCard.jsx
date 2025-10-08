// src/components/FeedingScheduleCard.jsx
import { FaUtensils } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Container,
  Modal,
} from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";

export default function FeedingScheduleCard({ type }) {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([
    { id: 1, hour: "", minute: "", ampm: "", feed_amount: "" },
    { id: 2, hour: "", minute: "", ampm: "", feed_amount: "" },
    { id: 3, hour: "", minute: "", ampm: "", feed_amount: "" },
  ]);
  const [savingId, setSavingId] = useState(null);
  const [unsettingId, setUnsettingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ action: "", id: null });

  const tableName =
    type === "chicken" ? "chicken_feeding_schedule" : "fish_feeding_schedule";

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const noFrac = timeString.split(".")[0];
    const parts = noFrac.split(":");
    if (parts.length < 2) return "";
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  };

  const to12HourParts = (time24) => {
    if (!time24) return { hour: "", minute: "", ampm: "" };
    const [hhStr, mm] = formatTime(time24).split(":");
    const hh = parseInt(hhStr, 10);
    const ampm = hh >= 12 ? "PM" : "AM";
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    return { hour: String(hour12), minute: mm.padStart(2, "0"), ampm };
  };

  const to24HourString = (hour12, minute, ampm) => {
    if (!hour12 || !minute || !ampm) return null;
    let h = parseInt(hour12, 10);
    if (ampm === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h += 12;
    }
    return `${String(h).padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const fetchSchedules = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select("id, feed_time, feed_amount")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching schedule:", error.message);
      setLoading(false);
      return;
    }

    const byId = {};
    (data || []).forEach((r) => (byId[r.id] = r));

    const rows = [1, 2, 3].map((i) => {
      const r = byId[i];
      const parts = to12HourParts(r ? formatTime(r.feed_time) : "");
      return {
        id: i,
        hour: parts.hour,
        minute: parts.minute,
        ampm: parts.ampm,
        feed_amount: r && r.feed_amount != null ? String(r.feed_amount) : "",
      };
    });

    setSchedules(rows);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line
  }, [type]);

  const handleTimeChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAmountChange = (id, value) => {
    const digits = value.replace(/\D/g, "").slice(0, 3);
    const num =
      digits === "" ? "" : String(Math.min(parseInt(digits, 10), 500));
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, feed_amount: num } : s))
    );
  };

  const hasCompleteTime = (s) => s.hour && s.minute && s.ampm;
  const slotIsSet = (s) => hasCompleteTime(s) && s.feed_amount !== "";
  const slotHasAnyValue = (s) =>
    s.hour || s.minute || s.ampm || s.feed_amount;

  const confirmAction = (action, id) => {
    setModalData({ action, id });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const { action, id } = modalData;
    setShowModal(false);
    if (action === "save") await handleSave(id);
    else if (action === "unset") await handleUnset(id);
  };

  const handleSave = async (id) => {
    const slot = schedules.find((s) => s.id === id);
    if (!slot) return;

    if (!slotIsSet(slot)) {
      alert(`Slot ${id} is incomplete. Please fill time and amount.`);
      return;
    }

    const time24 = to24HourString(slot.hour, slot.minute, slot.ampm);
    const amount = parseInt(slot.feed_amount, 10);
    setSavingId(id);

    const { error } = await supabase
      .from(tableName)
      .update({ feed_time: time24, feed_amount: amount })
      .eq("id", id);

    setSavingId(null);
    if (error) {
      alert(`Error saving slot ${id}: ${error.message}`);
      return;
    }

    await fetchSchedules();
    alert(`Slot ${id} saved successfully!`);
  };

  const handleUnset = async (id) => {
    setUnsettingId(id);
    const { error } = await supabase
      .from(tableName)
      .update({ feed_time: null, feed_amount: null })
      .eq("id", id);

    setUnsettingId(null);
    if (error) {
      alert(`Error unsetting slot ${id}: ${error.message}`);
      return;
    }

    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, hour: "", minute: "", ampm: "", feed_amount: "" }
          : s
      )
    );
    alert(`Slot ${id} cleared.`);
  };

  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <>
      <Card className="shadow-sm mb-4 mx-auto" style={{ maxWidth: "760px" }}>
        <Card.Body>
          <Card.Title className="mb-3 text-capitalize text-center d-flex justify-content-center align-items-center gap-2">
            <FaUtensils size={20} />
            {type} Feeding Schedule
          </Card.Title>

          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          ) : (
            <Container fluid>
              {schedules.map((s) => {
                const canSave = slotIsSet(s);
                const canUnset = slotHasAnyValue(s); // Unset enabled when user sets any field

                return (
                  <Row key={s.id} className="mb-3 align-items-center">
                    <Col xs={12} md={5} className="d-flex gap-2">
                      <Form.Select
                        value={s.hour}
                        onChange={(e) =>
                          handleTimeChange(s.id, "hour", e.target.value)
                        }
                      >
                        <option value="">Hour</option>
                        {hourOptions.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Select
                        value={s.minute}
                        onChange={(e) =>
                          handleTimeChange(s.id, "minute", e.target.value)
                        }
                      >
                        <option value="">Min</option>
                        {minuteOptions.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Select
                        value={s.ampm}
                        onChange={(e) =>
                          handleTimeChange(s.id, "ampm", e.target.value)
                        }
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Form.Select>
                    </Col>

                    <Col xs={12} md={3} className="mt-2 mt-md-0">
                      <Form.Control
                        type="text"
                        placeholder="Amount (g)"
                        value={s.feed_amount}
                        maxLength={3}
                        onChange={(e) =>
                          handleAmountChange(s.id, e.target.value)
                        }
                      />
                    </Col>

                    <Col
                      xs={12}
                      md={4}
                      className="d-flex justify-content-between mt-2 mt-md-0"
                    >
                      <span className="text-muted">Slot {s.id}</span>

                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          disabled={!canSave || savingId === s.id}
                          onClick={() => confirmAction("save", s.id)}
                        >
                          {savingId === s.id ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={!canUnset || unsettingId === s.id}
                          onClick={() => confirmAction("unset", s.id)}
                        >
                          {unsettingId === s.id ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              Clearing...
                            </>
                          ) : (
                            "Unset"
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </Container>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData.action === "save"
            ? `Are you sure you want to save changes for slot ${modalData.id}?`
            : `Are you sure you want to unset slot ${modalData.id}? This will clear its time and amount.`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={modalData.action === "save" ? "success" : "danger"}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
