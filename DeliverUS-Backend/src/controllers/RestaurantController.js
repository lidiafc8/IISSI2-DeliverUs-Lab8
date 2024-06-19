import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

// req: objeto de solicitud. Mirar detalles en apuntes word
// res: objeto de respuesta. Mirar detalles en apuntes word
const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] }, // el exclude incluye todos los atributos del modelo excepto el que le pasamos
        include: // aquí ponemos las relaciones que tiene con otros modelos
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']] // definimos el orden en el que queremos que devuelva los resultados, en este caso estarán ordenados por categoría
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        where: { userId: req.user.id },
        include: [{
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }]
      })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body) // Model.build(req.body): construye un objeto de tipo Model con los datos del cuerpo de la solicitud, es decir, de req.body
  newRestaurant.userId = req.user.id // usuario actualmente autenticado
  try { // una vez creado el restaurante, hay que guardarlo en la tabla correspondiente, lo hacemos como una promesa ya que no queremos que el programa se vea interrumpido en ningún caso
    const restaurant = await newRestaurant.save() // Model.save(): guarda el objeto Model en la tabla correspondiente de la base de datos
    res.json(restaurant) // hacemos que nos devuelva el objeto guardado en formato json
  } catch (err) {
    res.status(500).send(err) // si no, lanza un error con código de estado 500 (error general)
  }
}

const show = async function (req, res) { // devuelve los detalles de un restaurante
  // Only returns PUBLIC information of restaurants
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, { // Restaurant.findByPk devuelve los detalles del restaurante con id=restaurantId
      attributes: { exclude: ['userId'] },
      include: [{ // tenemos que incluir las relaciones que tiene con otros modelos
        model: Product, // un restaurante tiene productos
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory, // un restaurante pertenece a una categoría
        as: 'restaurantCategory'
      }],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']] // la información devuelta debe estar ordenada en función de los productos.
    }
    )
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try { // tenemos que poner una cláusula where para especificar qué restaurante en específico queremos actualizar. Le pasamos el id
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } }) // actualizamos el restaurante con los datos del cuerpo de la solicitud. Se reemplazan todos los campos del objeto (Actualizar solo algunos campos sería PATCH). Hace el mismo proceso que create
    const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId) // una vez actualizado, obtenemos el restaurante actualizado
    res.json(updatedRestaurant) // hacemos que nos lo devuelva en formato json
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try { // tenemos que poner una cláusula where para especificar qué restaurante en específico queremos eliminar. Le pasamos el id
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } }) // Eliminamos el restaurante indicado. DEVUELVE EL NÚMERO DE ELEMENTOS ELIMINADOS
    let message = '' // la variable declarada con let solo estará disponible dentro del bloque en el que se define
    if (result === 1) {
      message = 'Sucessfuly deleted restaurant id.' + req.params.restaurantId
    } else {
      message = 'Could not delete restaurant.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const RestaurantController = {
  index,
  indexOwner,
  create,
  show,
  update,
  destroy
}
export default RestaurantController
