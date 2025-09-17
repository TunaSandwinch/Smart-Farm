import Card from 'react-bootstrap/Card'

export default function SensorCard({ title, value, unit, subtitle }) {
  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title className="fw-semibold">{title}</Card.Title>
        <Card.Text className="display-6 m-0">
          {value ?? '—'} {value != null && unit ? <small className="text-muted">{unit}</small> : null}
        </Card.Text>
        {subtitle ? <Card.Subtitle className="text-muted mt-1">{subtitle}</Card.Subtitle> : null}
      </Card.Body>
    </Card>
  )
}
