/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONECT_MONGODB, CLOSE_MONGODB } from '~/config/mongodb'
import { ENV } from '~/config/environment'

const START_SERVER = () => {
  const app = express()

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(ENV.APP_PORT, ENV.APP_HOST, () => {
    console.log(`Hello ${ENV.AUTHOR} am running at http://${ ENV.APP_HOST }:${ ENV.APP_PORT }/`)
  })

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