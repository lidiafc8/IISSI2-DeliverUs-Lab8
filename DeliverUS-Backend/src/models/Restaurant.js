import { Model } from 'sequelize'
import moment from 'moment'

const loadModel = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /** ESTO NO ES QUE TENGA QUE HACER NADA, ES ALGO QUE YA VENÍA DESDE EL PRINCIPIO
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define las relaciones entre modelos, por ejemplo, el modelo 'restaurant' está relacionado
      // con restaurantCategory, User, Product y Order. Para definir estas relaciones
      // hay que incluir el método associate.
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'restaurantCategoryId', as: 'restaurantCategory' }) // Un restaurante pertenece a una categoría de restaurante
      Restaurant.belongsTo(models.User, { foreignKey: 'userId', as: 'user' }) // Un restaurante pertenece a un usuario
      Restaurant.hasMany(models.Product, { foreignKey: 'restaurantId', as: 'products' }) // Un restaurante tiene varios productos (asterisco)
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantId', as: 'orders' }) // Un restaurante tiene varios pedidos (asterisco)
    }

    // Podemos definir métodos que realicen cálculos sobre el modelo.
    // Por ejemplo, eeste método calcula y devuelve el tiempo de servicio promedio de un restaurante
    async getAverageServiceTime () {
      try { // en el try tenemos que definir lo que hace el método en sí
        const orders = await this.getOrders() // conseguimos los orders
        const serviceTimes = orders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) { // en el catch tenemos que poner lo que se ejecutaría en caso de que no pueda hacer el try, un error en este caso
        return err
      }
    }
  }
  Restaurant.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: DataTypes.TEXT,
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    postalCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url: DataTypes.STRING,
    shippingCosts: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    averageServiceMinutes: DataTypes.DOUBLE,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    logo: DataTypes.STRING,
    heroImage: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: [
        'online',
        'offline',
        'closed',
        'temporarily closed'
      ]
    },
    restaurantCategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}
export default loadModel
