import { validationResult } from 'express-validator'

// Es el método de manejo de validación que siempre se ejecutará después del middleware de validacion (validation)
// verifica si alguna regla de validación ha sido violada y devuelve la respuesta apropiada
const handleValidation = async (req, res, next) => {
  const err = validationResult(req) // verifica el resultado de express-validator
  if (err.errors.length > 0) { // si alguna regla de validación ha sido violada el error contendrá algo
    res.status(422).send(err) // devuelve un mensaje de error con código de estado 422 (error de validación) y detiene el procedimiento de validación
  } else {
    next() // si todo es correcto, prosigue con la ejecución
  }
}

export { handleValidation }
