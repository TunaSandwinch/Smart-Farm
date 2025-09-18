import Card from 'react-bootstrap/Card'

export default function SensorCard({ title, value, unit, icon: Icon}) {
  // Compute subtitle dynamically if function is passed
  const subtitle = getSubtitle ? getSubtitle(value) : null

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          {Icon && <Icon className="me-2 text-success" size={24} />}
          <Card.Title className="fw-semibold m-0">{title}</Card.Title>
        </div>

        <Card.Text className="display-6 m-0">
          {value ?? '—'}{' '}
          {value != null && unit ? (
            <small className="text-muted">{unit}</small>
          ) : null}
        </Card.Text>

        {subtitle ? <Card.Subtitle className="text-muted mt-1">{subtitle}</Card.Subtitle> : null}
      </Card.Body>
    </Card>
  )
}
