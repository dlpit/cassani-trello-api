import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const exitingUser = await userModel.findOneByEmail(reqBody.email)
    if (exitingUser) throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')

    // Tạo user mới
    // Lấy tên từ email ví dụ: email là example@gmail.com thì name là example
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      // Tham số thứ 2 là độ phức tạp của password, càng cao băm càng lâu
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // Gọi tới tầng Model để lưu newUser vào database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email xác thực tài khoản

    return pickUser(getNewUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew
}