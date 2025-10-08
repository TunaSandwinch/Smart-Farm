// src/pages/SettingsPage.jsx
import FeedingScheduleCard from "../components/FeedingScheduleCard";
import GrowLightScheduleCard from "../components/GrowlightSchedule";

export default function SettingsPage() {
  return (
    <div>
      {/* Feeding Schedule Cards */}
      <FeedingScheduleCard type="chicken" />
      <FeedingScheduleCard type="fish" />

      {/* Grow Light Schedule Cards */}
      <GrowLightScheduleCard type="duckweed" />
      <GrowLightScheduleCard type="lettuce" />
    </div>
  );
}
