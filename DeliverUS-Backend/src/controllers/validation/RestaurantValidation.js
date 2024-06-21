import { check } from 'express-validator'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'
const maxFileSize = 2000000 // around 2Mb

const create = [ // array que comprueba tanto que los datos cumplan con los esquemas de datos definidos en los migrations como otras aplicaciones que nosotros le añadimos
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(), // trim() elimina espacios al principio y al final

  // optional -> La validación para el campo description se aplica solo si el campo está presente en la solicitud.
  // nullable: true -> Si description no está presente o es null, no se generará un error de validación y no se aplicarán las validaciones adicionales definidas para ese campo (en este caso, isString().trim())
  // checkFalsy: true -> permite que el campo sea considerado como opcional incluso si su valor es un valor "falsy" (por ejemplo, "", 0, false, null o undefined). Es decir, si toma algún valor de los anteriores, no se aplicarán las validaciones adicionales definidas para ese campo y no se generará un error de validación
  // si description está presente y tiene un valor diferente de los valores falsy, se aplica la validacion adicional isString() y trim()
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),

  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
  check('userId').not().exists(), // se utiliza para validar que un campo específico, en este caso userId, no exista en la solicitud. Si userId está presente en la solicitud, la validación fallará

  check('heroImage').custom((value, { req }) => { // define una validación personalizada usando una función de callback, la función reciibe el valor del campo y el objeto req de la solicitud
    return checkFileIsImage(req, 'heroImage') // verifica si el archivo subido es una imagen
  }).withMessage('Please upload an image with format (jpeg, png).'), // mensaje de error que se enviará si la validación falla.

  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize) // verifica si el archivo subido no supera un tamaño concreto
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
]
const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
  check('userId').not().exists(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
]

export { create, update }
