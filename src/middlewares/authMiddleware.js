import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { ENV } from '~/config/environment'

const isAuthorzied = async (req, res, next) => {
  // Check for token in cookies first, then in Authorization header
  const clientAccessToken = req.cookies?.accessToken ||
                           (req.headers.authorization?.startsWith('Bearer ') &&
                            req.headers.authorization.split(' ')[1])

  if (!clientAccessToken) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Token not found)'))
  }
  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      ENV.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      return next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
    }

    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Token invalid)'))
  }
}

export const authMiddleware = {
  isAuthorzied
}