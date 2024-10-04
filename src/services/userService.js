import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { ENV } from '~/config/environment'

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
    const emailVerificationUrl = `${WEBSITE_DOMAIN}/account/verification?token=${getNewUser.verifyToken}&email=${getNewUser.email}`
    const customSubject = 'Account Verification Instructions'
    const customHtmlContext = 'Thank you for registering an account on our website.Finally, To complete the final step for account verification, please click the button below to verify.'
    const nameBtn = 'Verify Account'

    // Gửi emai: Sử dụng Brevo API
    await BrevoProvider.sendEmail(getNewUser.email, getNewUser.displayName, emailVerificationUrl, customSubject, customHtmlContext, nameBtn)

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async (reqBody) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const exitsUser = await userModel.findOneByEmail(reqBody.email)
    if (!exitsUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    // Kiểm tra tài khoản đã được xác thực chưa
    if (exitsUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already verified!')
    }

    // Kiểm tra token có đúng không
    if (reqBody.token !== exitsUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid token!')
    }

    // Cập nhật isActive thành true
    const updateData = { isActive: true, verifyToken: null }
    const updatedUser = await userModel.update(exitsUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const exitsUser = await userModel.findOneByEmail(reqBody.email)
    // Kiểm tra tài khoản
    if (!exitsUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!exitsUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not verified!')

    // Kiểm tra mật khẩu
    if (!bcryptjs.compareSync(reqBody.password, exitsUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect!')
    }

    // Tạo token
    // Tạo thông tin đính kèm trong JWT Token: bao gòm _id và email
    const userInfor = { _id: exitsUser._id, email: exitsUser.email }

    // Tạo 2 token là accessToken và refreshToken
    const accessToken = await JwtProvider.generateToken(
      userInfor,
      ENV.ACCESS_TOKEN_SECRET_SIGNATURE,
      ENV.ACCESS_TOKEN_LIFE
      // 5 // 5 giây
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfor,
      ENV.REFRESH_TOKEN_SECRET_SIGNATURE,
      ENV.REFRESH_TOKEN_LIFE
    )

    return {
      accessToken,
      refreshToken,
      ...pickUser(exitsUser)
    }
  } catch (error) { throw error }
}
export const userService = {
  createNew,
  verifyAccount,
  login
}