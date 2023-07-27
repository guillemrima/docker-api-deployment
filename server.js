const express = require('express')
const cors = require('cors')
const fs = require('fs')
const device = require('express-device');
const app = express()
const cookieParser = require('cookie-parser');
const userAgentMiddleware = require('./src/middlewares/user-agent');
const exposeServiceMiddleware = require('./src/middlewares/expose-services');
const apiTrackingMiddleware = require('./src/middlewares/api-tracking.js');

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  )
  next()
})

const corsOptions = {
  origin: [process.env.BASE_URL]
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }))
app.use(cookieParser());

app.use(device.capture());
app.use(userAgentMiddleware);
app.use(...Object.values(exposeServiceMiddleware));
app.use(apiTrackingMiddleware)

const routePath = './src/routes/'

fs.readdirSync(routePath).forEach(function (file) {
  require(routePath + file)(app)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}.`)
})
