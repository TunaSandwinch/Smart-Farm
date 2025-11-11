// src/pages/SettingsPage.jsx
import { Container } from "react-bootstrap";
import FeedingScheduleCard from "../components/FeedingScheduleCard";
import GrowLightScheduleCard from "../components/GrowlightSchedule";

export default function SettingsPage() {
  return (
    <Container className="my-4">
      {/* Feeding Schedule */}
      <h2 className="mb-3">System Settings</h2>
      <FeedingScheduleCard type="chicken" />
      <FeedingScheduleCard type="fish" />

      {/* Spacer between sections */}
      <div className="my-5"></div>

      {/* Grow Light Schedule */}
      <GrowLightScheduleCard type="duckweed" />
      <GrowLightScheduleCard type="lettuce" />
    </Container>
  );
}
