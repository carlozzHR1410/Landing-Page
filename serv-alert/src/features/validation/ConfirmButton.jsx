import Button from '../../components/Button'

function ConfirmButton({ disabled, onClick }) {
  return (
    <Button variant="secondary" disabled={disabled} onClick={onClick}>
      {disabled ? 'Sin accion disponible' : 'Confirmar'}
    </Button>
  )
}

export default ConfirmButton
