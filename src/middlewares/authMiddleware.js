import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { ENV } from '~/config/environment'

const isAuthorzied = async (req, res, next) => {
  // Check for token in cookies (default method)
  let clientAccessToken = req.cookies?.accessToken
  
  // If not in cookies, check authorization header (for production/deployed environments)
  if (!clientAccessToken && req.headers.authorization) {
    const authHeader = req.headers.authorization
    if (authHeader.startsWith('Bearer ')) {
      clientAccessToken = authHeader.substring(7)
    }
  }
  
  if (!clientAccessToken) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Token not found)'))
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

    // Trả về mã lỗi 401 khi accessToken hết hạnt
    if (error?.message?.includes('jwt expired')) {
      return next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
    }

    // Đăng xuất người dùng khi accessToken không hợp lệ
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Token invalid)'))
  }
}

export const authMiddleware = {
  isAuthorzied
}