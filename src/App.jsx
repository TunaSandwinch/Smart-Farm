import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SensorCard from './components/SensorCard.jsx'
import { supabase } from './lib/supabaseClient'
import Header from './components/Header.jsx'

// Keys match the "system_status" table columns we discussed before.
const EMPTY = {
  env_humidity: null,
  env_temperature: null,
  fish_feed_status: null,
  water_temperature: null,
  water_level: null,
  ph_level: null,
  chicken_feed_status: null,
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
      <h1 className="h3 mb-3">Smart Integrated Farming — Live Status</h1>
      <p className="text-muted mb-4">
        {loading ? 'Loading…' : data.updated_at ? `Last update: ${new Date(data.updated_at).toLocaleString()}` : 'No data yet'}
        {error ? ` • Error: ${error}` : ''}
      </p>

      <Row xs={1} md={2} lg={3}>
        <Col><SensorCard title="Environment Humidity" value={data.env_humidity} unit="%" /></Col>
        <Col><SensorCard title="Environment Temperature" value={data.env_temperature} unit="°C" /></Col>
        <Col><SensorCard title="Fish Feeds Status" value={data.fish_feed_status} subtitle="ok / dispensing / empty" /></Col>
        <Col><SensorCard title="Water Temperature" value={data.water_temperature} unit="°C" /></Col>
        <Col><SensorCard title="Water Level" value={data.water_level} unit="cm" /></Col>
        <Col><SensorCard title="pH Level" value={data.ph_level} /></Col>
        <Col><SensorCard title="Chicken Feeds Status" value={data.chicken_feed_status} subtitle="ok / dispensing / empty" /></Col>
        <Col><SensorCard title="Manure Tea Level" value={data.manure_tea_level} unit="cm" /></Col>
      </Row>
    </Container>
    </>

  )
}
