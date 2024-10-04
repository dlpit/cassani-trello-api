import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { ENV } from '~/config/environment'

const isAuthorzied = async (req, res, next) => {
  const clientAccessToken = req.cookies.accessToken
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Token not found)'))
  }
  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      ENV.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // console.log('AuthMiddleware -> accessTokenDecoded', accessTokenDecoded)

    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    // console.log('AuthMiddleware -> error', error)

    // Trả về mã lỗi 401 khi accessToken hết hạn
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }

    // Đăng xuất người dùng khi accessToken không hợp lệ
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Token invalid)'))
  }
}

export const authMiddleware = {
  isAuthorzied
}