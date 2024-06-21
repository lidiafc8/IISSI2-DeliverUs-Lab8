import * as RestaurantValidation from '../controllers/validation/RestaurantValidation.js'
import RestaurantController from '../controllers/RestaurantController.js'
import ProductController from '../controllers/ProductController.js'
import OrderController from '../controllers/OrderController.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import { Restaurant } from '../models/models.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants') // la ruta del endpoint. Definimos el endpoint '/restaurants' que responde a las solicitudes usando la función 'index' definida en RestaurantController
    .get( // el verbo HTTP que queremos que esté disponible en la ruta anterior
      RestaurantController.index) // la función que atenderá las solicitudes para ese verbo HTTP y esa ruta definida en RestaurantController
    .post( // podemos encadenar más verbos HTTP para el mismo endpoint
      isLoggedIn, // verificamos que el usuario ha iniciado sesión
      hasRole('owner'), // verificamos que el usuario tiene el rol de propietario (ya que los clientes no pueden crear restaurantes)
      handleFilesUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER), // gestionar la carga del logo del restaurante
      RestaurantValidation.create, // verificar que los datos del restaurante incluyen valores válidos para cada propiedad para ser creados de acuerdo con nuestros requisitos de información
      handleValidation, // gestionar la validación que hemos hecho en la anterior línea
      RestaurantController.create) // llamar al controlador para crear el restaurante una vez comprobado todo.

  app.route('/restaurants/:restaurantId')
    .get(
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantController.show)
    .put(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership, // comprobar que el restaurante pertenece al usuario loggeado
      handleFilesUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER),
      RestaurantValidation.update,
      handleValidation,
      RestaurantController.update)
    .delete(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.restaurantHasNoOrders,
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
      checkEntityExists(Restaurant, 'restaurantId'),
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.analytics)
}
export default loadFileRoutes
