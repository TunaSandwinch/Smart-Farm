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
  chickenWaterLevelSubtitle,
} from "../utils/sensorUtils.js";

import {
  TbTemperatureSun,
  TbRulerMeasure2,
  TbPoo,
  TbTemperature,
} from "react-icons/tb";
import { BsSpeedometer2, BsDroplet } from "react-icons/bs";
import { PiBowlFood } from "react-icons/pi";

export default function Dashboard() {
  const { data, loading, error } = useSystemStatus();

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">Real Time Monitoring</h1>

      <Row xs={1} md={2} lg={3}>
        <Col>
          <SensorCard
            title="Environment Humidity"
            value={data.env_humidity}
            unit="%"
            icon={BsDroplet}
            subtitle={envHumiditySubtitle(data.env_humidity)}
            color="text-primary me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="Environment Temperature"
            value={data.env_temperature}
            unit="°C"
            icon={TbTemperatureSun}
            subtitle={envTemperatureSubtitle(data.env_temperature)}
            color="text-warning me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="Water Temperature"
            value={data.water_temperature}
            unit="°C"
            icon={TbTemperature}
            subtitle={waterTemperatureSubtitle(data.water_temperature)}
            color="text-danger me-2"
            
          />
        </Col>
        <Col>
          <SensorCard
            title="Water Level"
            value={data.water_level}
            unit="cm"
            icon={TbRulerMeasure2}
            subtitle={waterLevelSubtitle(data.water_level)}
            color="text-info me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="pH Level"
            value={data.ph_level}
            unit="pH"
            icon={BsSpeedometer2}
            subtitle={phLevelSubtitle(data.ph_level)}
            color="text-primary me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="Manure Tea Level"
            value={data.manure_tea_level}
            unit="cm"
            icon={TbPoo}
            subtitle={teaLevelSubtitle(data.manure_tea_level)}
            color="text-warning me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="Chicken Feed Level"
            value={data.chicken_feed_level}
            unit="cm"
            icon={PiBowlFood}
            subtitle={cFeedSubtitle(data.chicken_feed_level)}
            color="text-warning me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="Chicken Water Level"
            value={data.chicken_water_level}
            unit="cm"
            icon={BsDroplet}
            subtitle={chickenWaterLevelSubtitle(data.chicken_water_level)}
            color="text-info me-2"
          />
        </Col>
        <Col>
          <SensorCard
            title="Fish Feed Level"
            value={data.fish_feed_level}
            unit="cm"
            icon={PiBowlFood}
            subtitle={fFeedSubtitle(data.fish_feed_level)}
            color="text-primary me-2"
          />
        </Col>
      </Row>
    </Container>
  );
}
