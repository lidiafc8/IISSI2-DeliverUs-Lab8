import passport from 'passport'

// recibe un array de roles y verifica si el usuario que ha iniciado sesión tiene el rol necesario.
const hasRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).send({ error: 'Not logged in' })
  }
  if (!roles.includes(req.user.userType)) {
    return res.status(403).send({ error: 'Not enough privileges' })
  }
  return next()
}

// verifica si el usuario ha iniciado sesión (la solicitud incluye un token de portador válido)
const isLoggedIn = (req, res, next) => {
  passport.authenticate('bearer', { session: false })(req, res, next)
}

export { hasRole, isLoggedIn }
