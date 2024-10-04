/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONECT_MONGODB, CLOSE_MONGODB } from '~/config/mongodb'
import { ENV } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  // Fix lỗi Cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  // Enable req.cookies
  app.use(cookieParser())

  // Enable CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  if (ENV.BUILD_MODE === 'production') {
    // Môi trường production
    app.listen(process.env.PORT, () => {
      console.log(`Production ${ENV.AUTHOR} running at Port: ${ process.env.PORT }/`)
    })
  } else {
    // Môi trương development
    app.listen(ENV.LOCAL_DEV_APP_PORT, ENV.LOCAL_DEV_APP_HOST, () => {
      console.log(`Hello ${ENV.AUTHOR} am running at http://${ ENV.LOCAL_DEV_APP_HOST }:${ ENV.LOCAL_DEV_APP_PORT }/`)
    })
  }
  // Clean up before shutdown server
  exitHook(() => {
    console.log('Cleaning up...')
    CLOSE_MONGODB()
    console.log('Closed MongoDB connection!')
  })
}

// Chỉ kết nối tới MongoDB khi đã kết nối thành công thì mới khởi tạo server
// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
(async () => {
  try {
    await CONECT_MONGODB()
    console.log('Connected to MongoDB successfully!')
    START_SERVER()
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
})()

// // Chỉ kết nối tới MongoDB khi đã kết nối thành công thì mới khởi tạo server
// CONECT_MONGODB()
//   .then(() => console.log('Connected to MongoDB successfully!'))
//   .then(() => START_SERVER())
//   .catch(e => {
//     console.error(e)
//     process.exit(0)
//   })