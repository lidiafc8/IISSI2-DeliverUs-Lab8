// verifica para un id y entidad dados, si existe un registro en la tabla correspondiente en la base de datos que coincida con tal id.
// En caso de que el registro no exista, devuelve el código de estado HTTP 404.
const checkEntityExists = (model, idPathParamName) => async (req, res, next) => {
  try {
    const entity = await model.findByPk(req.params[idPathParamName])
    if (!entity) { return res.status(404).send('Not found') }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}
export { checkEntityExists }
