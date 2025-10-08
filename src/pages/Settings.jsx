import FeedingScheduleCard from "../components/FeedingScheduleCard";

export default function FeedingPage() {
  return (
    <div>
      <FeedingScheduleCard type="chicken" />
      <FeedingScheduleCard type="fish" />
    </div>
  );
}
