import Card from 'react-bootstrap/Card'

export default function SensorCard({ title, value, unit, icon: Icon, subtitle, color }) {
  // Compute subtitle dynamically if function is passed
  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          {Icon && <Icon size={28} className={color} />}
          <Card.Title className="fw-semibold m-0">{title}</Card.Title>
        </div>

        <Card.Text className="display-6 m-0">
          {value ?? '—'}{' '}
          {value != null && unit ? (
            <small className="text-muted">{unit}</small>
          ) : null}
        </Card.Text>
        <Card.Subtitle className="text-muted mt-1">{subtitle}</Card.Subtitle>
      </Card.Body>
    </Card>
  )
}
