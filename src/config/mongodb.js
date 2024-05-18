import { MongoClient, ServerApiVersion } from 'mongodb'
import { ENV } from '~/config/environment'

// Khởi tạo đối tượng MongoClient để kết nối tới server MongoDB
let casaniNoteDBInstance = null

// serverApi có từ phiên bản 5.0.0 trở lên, có thể không cần dùng
// Mục đích là để chỉ định một Stable API version
// https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
const mongoClient = new MongoClient(ENV.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Hàm này để kết nối tới database
export const CONECT_MONGODB = async () => {
  await mongoClient.connect()
  casaniNoteDBInstance = mongoClient.db(ENV.DATABASE_NAME)
}

// Hàm này có nhiệm vụ export ra đối tượng casaniNoteDBInstance đã kết nối (không async)
// sau khi đã kết nối tới mongodb để có thể sử dụng ở nhiều nơi khác nhau
// Phải đảm bảo rằng chỉ gọi GET_DB khi đã kết nối tới mongodb
export const GET_DB = () => {
  if (!casaniNoteDBInstance) throw new Error('Call CONECT_MONGODB first')
  return casaniNoteDBInstance
}

// Hàm này để đóng kết nối tới database
export const CLOSE_MONGODB = async () => {
  await mongoClient.close()
}