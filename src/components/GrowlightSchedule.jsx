
// src/components/GrowlightScheduleCard.jsx
import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form, Modal, Spinner, Container } from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";
import { FiSun } from "react-icons/fi";

export default function GrowlightScheduleCard({ type }) {
  const tableName =
    type === "duckweed" ? "duckweed_growlight_schedule" : "lettuce_growlight_schedule";

  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState({ show: false, action: null }); // action: "save" | "unset"
  const [busyId, setBusyId] = useState(null);

  // schedule parts stored separately for easier validation / selects
  const [parts, setParts] = useState({
    from_hour: "",
    from_minute: "",
    from_ampm: "",
    until_hour: "",
    until_minute: "",
    until_ampm: "",
  });

  // helpers: dropdown options
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")); // "01".."12"
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")); // "00".."59"
  const ampm = ["AM", "PM"];

  // parse DB TIME (HH:MM:SS or HH:MM) => parts {hour(12h), minute, ampm}
  const parseTimeToParts = (time24) => {
    if (!time24) return { h: "", m: "", ap: "" };
    // accept formats like "06:30:00" or "06:30"
    const hhmm = time24.split(".")[0].split(":").slice(0, 2);
    let h24 = parseInt(hhmm[0], 10);
    const m = hhmm[1].padStart(2, "0");
    const ap = h24 >= 12 ? "PM" : "AM";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return { h: String(h12).padStart(2, "0"), m, ap };
  };

  // convert 12h parts to 24h string "HH:MM:00"
  const partsTo24Time = (h12, m, ap) => {
    if (!h12 || !m || !ap) return null;
    let h = parseInt(h12, 10);
    if (ap === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h = h + 12;
    }
    return `${String(h).padStart(2, "0")}:${m}:00`;
  };

  // add 1 hour to a given 12h parts and return new 12h parts
  const addOneHour = (h12, m, ap) => {
    if (!h12 || !m || !ap) return { h: "", m: "", ap: "" };
    let h = parseInt(h12, 10);
    let apNext = ap;
    if (h === 12) {
      h = 1;
      apNext = ap === "AM" ? "PM" : "AM";
    } else {
      h = h + 1;
    }
    return { h: String(h).padStart(2, "0"), m, ap: apNext };
  };

  // fetch current schedule from DB (assumes single row id=1)
  const fetchSchedule = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(tableName).select("from_time, until_time").eq("id", 1).maybeSingle();
    if (error) {
      console.error("Error fetching growlight schedule:", error.message);
      // leave defaults
    } else if (data) {
      const from = parseTimeToParts(data.from_time);
      const until = parseTimeToParts(data.until_time);
      setParts({
        from_hour: from.h,
        from_minute: from.m,
        from_ampm: from.ap,
        until_hour: until.h,
        until_minute: until.m,
        until_ampm: until.ap,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // set a specific part and optionally auto-update until = from + 1 hour when from becomes complete
  function setPart(field, value) {
    setParts((prev) => {
      const next = { ...prev, [field]: value };

      // if a from_* field changed and from is now complete, auto set until to +1 hour (only if until is empty or was previously auto-set)
      const fromComplete = next.from_hour && next.from_minute && next.from_ampm;
      if (field.startsWith("from_") && fromComplete) {
        // compute until parts
        const { h, m, ap } = addOneHour(next.from_hour, next.from_minute, next.from_ampm);
        // if until is empty OR user hasn't set until yet, set to auto value.
        // We'll set if until_hour is empty (meaning not manually filled). This prevents overriding user's explicit edits.
        if (!prev.until_hour && !prev.until_minute && !prev.until_ampm) {
          next.until_hour = h;
          next.until_minute = m;
          next.until_ampm = ap;
        }
      }

      return next;
    });
  }

  // validation helpers
  const fromComplete = parts.from_hour && parts.from_minute && parts.from_ampm;
  const untilComplete = parts.until_hour && parts.until_minute && parts.until_ampm;
  const canSave = fromComplete && untilComplete; // Save enabled only when both complete
  const canUnset = fromComplete || untilComplete || parts.from_hour || parts.from_minute || parts.from_ampm || parts.until_hour || parts.until_minute || parts.until_ampm;

  // confirmation modal handlers
  const openConfirm = (action) => setShowConfirm({ show: true, action });
  const closeConfirm = () => setShowConfirm({ show: false, action: null });

  // Save single schedule (writes to id=1)
  const confirmSave = async () => {
    if (!canSave) {
      alert("Please complete both From and Until times before saving.");
      closeConfirm();
      return;
    }
    setBusyId("save");
    const from_time = partsTo24Time(parts.from_hour, parts.from_minute, parts.from_ampm);
    const until_time = partsTo24Time(parts.until_hour, parts.until_minute, parts.until_ampm);

    const { error } = await supabase.from(tableName).update({ from_time, until_time }).eq("id", 1);
    setBusyId(null);
    closeConfirm();
    if (error) {
      alert("Error saving schedule: " + error.message);
      return;
    }
    await fetchSchedule();
    alert("Growlight schedule saved.");
  };

  // Unset schedule (set nulls)
  const confirmUnset = async () => {
    setBusyId("unset");
    const { error } = await supabase.from(tableName).update({ from_time: null, until_time: null }).eq("id", 1);
    setBusyId(null);
    closeConfirm();
    if (error) {
      alert("Error unsetting schedule: " + error.message);
      return;
    }
    // clear local inputs
    setParts({
      from_hour: "",
      from_minute: "",
      from_ampm: "",
      until_hour: "",
      until_minute: "",
      until_ampm: "",
    });
    alert("Growlight schedule cleared.");
  };

  // Render a single time row (From/Until) with responsive layout:
  function TimeRow({ label, prefix }) {
    // prefix: "from" or "until"
    const hour = parts[`${prefix}_hour`];
    const minute = parts[`${prefix}_minute`];
    const ap = parts[`${prefix}_ampm`];

    return (
      <Row className="mb-2 align-items-center">
        <Col xs={12} md={2}>
          <Form.Label className="mb-1">{label}</Form.Label>
        </Col>

        {/* On mobile we want hour and minute next to each other; use d-flex with gap and allow wrapping */}
        <Col xs={12} md={8}>
          <div className="d-flex gap-1 flex-wrap">
            <div style={{ minWidth: 90 }}>
              <Form.Select
                aria-label={`${label} hour`}
                value={hour || ""}
                onChange={(e) => setPart(`${prefix}_hour`, e.target.value)}
              >
                <option value="">Hour</option>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div style={{ minWidth: 90 }}>
              <Form.Select
                aria-label={`${label} minute`}
                value={minute || ""}
                onChange={(e) => setPart(`${prefix}_minute`, e.target.value)}
              >
                <option value="">Min</option>
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div style={{ minWidth: 110 }}>
              <Form.Select
                aria-label={`${label} AM/PM`}
                value={ap || ""}
                onChange={(e) => setPart(`${prefix}_ampm`, e.target.value)}
              >
                <option value="">AM/PM</option>
                {ampm.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Card className="shadow-sm mb-4 mx-auto" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <Card.Title className="mb-3 text-capitalize text-center">
          <FiSun className="me-2 text-warning" size={24} />
          {type} Growlight Schedule
        </Card.Title>
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" />
          </div>
        ) : (
          <Container fluid>
            <TimeRow label="From" prefix="from" />
            <TimeRow label="Until" prefix="until" />

            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="outline-danger"
                onClick={() => openConfirm("unset")}
                disabled={!canUnset || busyId !== null}
              >
                {busyId === "unset" ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                    Clearing...
                  </>
                ) : (
                  "Unset"
                )}
              </Button>

              <Button
                variant="primary"
                onClick={() => openConfirm("save")}
                disabled={!canSave || busyId !== null}
              >
                {busyId === "save" ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Container>
        )}
      </Card.Body>

      <Modal show={showConfirm.show} onHide={closeConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>{showConfirm.action === "save" ? "Confirm Save" : "Confirm Unset"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showConfirm.action === "save"
            ? "Are you sure you want to save this growlight schedule?"
            : "Are you sure you want to unset this growlight schedule? This will clear stored times."}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button
            variant={showConfirm.action === "save" ? "primary" : "danger"}
            onClick={showConfirm.action === "save" ? confirmSave : confirmUnset}
            disabled={busyId !== null}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
