// src/pages/Analytics.jsx
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { FaFish, FaSeedling, FaDrumstickBite } from "react-icons/fa";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const [harvestData, setHarvestData] = useState({ fish: [], chicken: [], lettuce: [] });
  const [feedData, setFeedData] = useState({ fish: [], chicken: [] });
  const [envData, setEnvData] = useState({ temp: [], humidity: [], ph: [], waterTemp: [] });
  const [totals, setTotals] = useState({ fish: 0, chicken: 0, lettuce: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("system_logs")
      .select(
        "timestamp, fish_harvest, chicken_harvest, lettuce_harvest, fish_feed, chicken_feed, env_temperature, env_humidity, ph_level, water_temperature"
      )
      .order("timestamp", { ascending: true });

    if (error) {
      console.error("Error fetching analytics:", error.message);
      setLoading(false);
      return;
    }

    // Group by date
    const grouped = {};
    let fishTotal = 0,
      chickenTotal = 0,
      lettuceTotal = 0;

    data.forEach((row) => {
      const date = new Date(row.timestamp).toLocaleDateString("en-US");
      if (!grouped[date]) {
        grouped[date] = {
          fish: 0,
          chicken: 0,
          lettuce: 0,
          fishFeed: 0,
          chickenFeed: 0,
          temp: 0,
          humidity: 0,
          ph: 0,
          waterTemp: 0,
          count: 0,
        };
      }
      grouped[date].fish += row.fish_harvest || 0;
      grouped[date].chicken += row.chicken_harvest || 0;
      grouped[date].lettuce += row.lettuce_harvest || 0;
      grouped[date].fishFeed += row.fish_feed || 0;
      grouped[date].chickenFeed += row.chicken_feed || 0;
      grouped[date].temp += row.env_temperature || 0;
      grouped[date].humidity += row.env_humidity || 0;
      grouped[date].ph += row.ph_level || 0;
      grouped[date].waterTemp += row.water_temperature || 0;
      grouped[date].count += 1;

      // Update totals
      fishTotal += row.fish_harvest || 0;
      chickenTotal += row.chicken_harvest || 0;
      lettuceTotal += row.lettuce_harvest || 0;
    });

    const dates = Object.keys(grouped);
    setLabels(dates);

    setHarvestData({
      fish: dates.map((d) => grouped[d].fish),
      chicken: dates.map((d) => grouped[d].chicken),
      lettuce: dates.map((d) => grouped[d].lettuce),
    });

    setFeedData({
      fish: dates.map((d) => grouped[d].fishFeed),
      chicken: dates.map((d) => grouped[d].chickenFeed),
    });

    setEnvData({
      temp: dates.map((d) => grouped[d].temp / grouped[d].count),
      humidity: dates.map((d) => grouped[d].humidity / grouped[d].count),
      ph: dates.map((d) => grouped[d].ph / grouped[d].count),
      waterTemp: dates.map((d) => grouped[d].waterTemp / grouped[d].count),
    });

    setTotals({ fish: fishTotal, chicken: chickenTotal, lettuce: lettuceTotal });
    setLoading(false);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Chart configs
  const harvestChart = {
    labels,
    datasets: [
      { label: "Fish Harvest", data: harvestData.fish, backgroundColor: "rgba(54, 162, 235, 0.6)" },
      { label: "Chicken Harvest", data: harvestData.chicken, backgroundColor: "rgba(255, 99, 132, 0.6)" },
      { label: "Lettuce Harvest", data: harvestData.lettuce, backgroundColor: "rgba(75, 192, 192, 0.6)" },
    ],
  };

  const feedChart = {
    labels,
    datasets: [
      { label: "Fish Feed (g)", data: feedData.fish, borderColor: "rgba(54, 162, 235, 1)", backgroundColor: "rgba(54, 162, 235, 0.2)", fill: true },
      { label: "Chicken Feed (g)", data: feedData.chicken, borderColor: "rgba(255, 206, 86, 1)", backgroundColor: "rgba(255, 206, 86, 0.2)", fill: true },
    ],
  };

  const temperatureChart = {
    labels,
    datasets: [
      { label: "Air Temp (°C)", data: envData.temp, borderColor: "rgba(255, 99, 132, 1)", backgroundColor: "rgba(255, 99, 132, 0.2)", fill: true },
      { label: "Water Temp (°C)", data: envData.waterTemp, borderColor: "rgba(54, 162, 235, 1)", backgroundColor: "rgba(54, 162, 235, 0.2)", fill: true },
    ],
  };

  const humidityPhChart = {
    labels,
    datasets: [
      { label: "Humidity (%)", data: envData.humidity, borderColor: "rgba(75, 192, 192, 1)", backgroundColor: "rgba(75, 192, 192, 0.2)", fill: true },
      { label: "pH Level", data: envData.ph, borderColor: "rgba(153, 102, 255, 1)", backgroundColor: "rgba(153, 102, 255, 0.2)", fill: true },
    ],
  };

  return (
    <Container fluid className="py-4">
      <h2 className="h3 mb-4">Data Report</h2>

      {/* Highlight Totals */}
      <Row className="mb-4 text-center">
        <Col md={4} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaFish size={32} className="text-primary me-2" />
                <Card.Title className="mb-0">Total Fish Harvest</Card.Title>
              </div>
              <h3 className="fw-bold text-primary">{totals.fish}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaDrumstickBite size={32} className="text-danger me-2" />
                <Card.Title className="mb-0">Total Chicken Harvest</Card.Title>
              </div>
              <h3 className="fw-bold text-danger">{totals.chicken}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                 <FaSeedling size={32} className="text-success me-2" />
                <Card.Title>Total Lettuce Harvest</Card.Title>
              </div>

              <h3 className="fw-bold text-success">{totals.lettuce}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Harvest & Feed */}
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Harvest Data</Card.Title>
              <Bar data={harvestChart} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Feed Data</Card.Title>
              <Line data={feedChart} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Environment */}
      <Row>
        <Col xs={12} md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Temperature Data</Card.Title>
              <Line data={temperatureChart} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Humidity & pH</Card.Title>
              <Line data={humidityPhChart} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

