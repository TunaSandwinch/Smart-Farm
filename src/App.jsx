import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SensorCard from './components/SensorCard.jsx'
import { supabase } from './lib/supabaseClient'
import Header from './components/Header.jsx'
import { envHumiditySubtitle } from './utils/sensorUtils.js'
import { envTemperatureSubtitle } from './utils/sensorUtils.js'
import { fFeedSubtitle } from './utils/sensorUtils.js'
import { cFeedSubtitle } from './utils/sensorUtils.js'
import { waterTemperatureSubtitle } from './utils/sensorUtils.js'
import { waterLevelSubtitle } from './utils/sensorUtils.js'
import { phLevelSubtitle } from './utils/sensorUtils.js'
import { teaLevelSubtitle } from './utils/sensorUtils.js'
import { TbTemperatureSun, TbRulerMeasure2, TbPoo, TbTemperature } from "react-icons/tb"
import { BsSpeedometer2, BsDroplet } from "react-icons/bs"
import { PiBird } from "react-icons/pi"
import { IoFishOutline } from "react-icons/io5"
import './App.css'
// Keys match the "system_status" table columns we discussed before.
const EMPTY = {
  env_humidity: null,
  env_temperature: null,
  fish_feed_level: null,
  water_temperature: null,
  water_level: null,
  ph_level: null,
  chicken_feed_level: null,
  manure_tea_level: null,
  updated_at: null,
}

export default function App() {
  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch the snapshot (id = 1)
  async function fetchStatus() {
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      setError(error.message)
      return
    }
    setData(data || EMPTY)
    setError(null)
  }

  useEffect(() => {
    let intervalId

    ;(async () => {
      await fetchStatus()
      setLoading(false)
    })()

    // Realtime subscription (needs Realtime enabled for table)
    const channel = supabase
      .channel('system_status_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_status', filter: 'id=eq.1' },
        (payload) => {
          // UPDATE/INSERT payload contains .new row
          if (payload?.new) setData(payload.new)
        }
      )
      .subscribe()

    // Fallback polling every 5s (works even if Realtime is off)
    intervalId = setInterval(fetchStatus, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(intervalId)
    }
  }, [])

  return (
    <>
    <Header></Header>
    <Container className="py-4">
      <h1 className="h3 mb-3">Real Time Monitoring</h1>
      <p className="text-muted mb-4">
        {loading ? 'Loading…' : data.updated_at ? `Last update: ${new Date(data.updated_at).toLocaleString()}` : 'No data yet'}
        {error ? ` • Error: ${error}` : ''}
      </p>

      <Row xs={1} md={2} lg={3}>
        <Col>
          <SensorCard
            title="Environment Humidity"
            value={data.env_humidity}
            unit="°C"
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
    </>

  )
}
