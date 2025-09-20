// src/pages/Dashboard.jsx
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SensorCard from "../components/SensorCard.jsx";
import { useSystemStatus } from "../context/SystemStatusContext.jsx";

import {
  envHumiditySubtitle,
  envTemperatureSubtitle,
  fFeedSubtitle,
  cFeedSubtitle,
  waterTemperatureSubtitle,
  waterLevelSubtitle,
  phLevelSubtitle,
  teaLevelSubtitle,
} from "../utils/sensorUtils.js";

import {
  TbTemperatureSun,
  TbRulerMeasure2,
  TbPoo,
  TbTemperature,
} from "react-icons/tb";
import { BsSpeedometer2, BsDroplet } from "react-icons/bs";
import { PiBird } from "react-icons/pi";
import { IoFishOutline } from "react-icons/io5";

export default function Dashboard() {
  const { data, loading, error } = useSystemStatus();

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">Real Time Monitoring</h1>
      <p className="text-muted mb-4">
        {loading
          ? "Loading…"
          : data.updated_at
          ? `Last update: ${new Date(data.updated_at).toLocaleString()}`
          : "No data yet"}
        {error ? ` • Error: ${error}` : ""}
      </p>

      <Row xs={1} md={2} lg={3}>
        <Col>
          <SensorCard
            title="Environment Humidity"
            value={data.env_humidity}
            unit="%"
            icon={BsDroplet}
            subtitle={envHumiditySubtitle(data.env_humidity)}
          />
        </Col>
        <Col>
          <SensorCard
            title="Environment Temperature"
            value={data.env_temperature}
            unit="°C"
            icon={TbTemperatureSun}
            subtitle={envTemperatureSubtitle(data.env_temperature)}
          />
        </Col>
        <Col>
          <SensorCard
            title="Water Temperature"
            value={data.water_temperature}
            unit="°C"
            icon={TbTemperature}
            subtitle={waterTemperatureSubtitle(data.water_temperature)}
          />
        </Col>
        <Col>
          <SensorCard
            title="Water Level"
            value={data.water_level}
            unit="cm"
            icon={TbRulerMeasure2}
            subtitle={waterLevelSubtitle(data.water_level)}
          />
        </Col>
        <Col>
          <SensorCard
            title="pH Level"
            value={data.ph_level}
            unit="pH"
            icon={BsSpeedometer2}
            subtitle={phLevelSubtitle(data.ph_level)}
          />
        </Col>
        <Col>
          <SensorCard
            title="Manure Tea Level"
            value={data.manure_tea_level}
            unit="cm"
            icon={TbPoo}
            subtitle={teaLevelSubtitle(data.manure_tea_level)}
          />
        </Col>
        <Col>
          <SensorCard
            title="Chicken Feed Level"
            value={data.chicken_feed_level}
            unit="cm"
            icon={PiBird}
            subtitle={cFeedSubtitle(data.chicken_feed_level)}
          />
        </Col>
        <Col>
          <SensorCard
            title="Fish Feed Level"
            value={data.fish_feed_level}
            unit="cm"
            icon={IoFishOutline}
            subtitle={fFeedSubtitle(data.fish_feed_level)}
          />
        </Col>
      </Row>
    </Container>
  );
}
