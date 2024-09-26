// https://www.npmjs.com/package/jsonwebtoken
import e from 'express'
import JWT from 'jsonwebtoken'

/**
 * Function tạo mới 1 token với 3 tham số:
 * - userInfor: thông tin cần lưu trong token
 * - secretSignature: chuỗi ký tự bí mật
 * - tokenLife: thời gian sống của token
 */
const generateToken = async (userInfor, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfor, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw error }
}

/**
 * Function kiểm tra và giải mã token
 */
const verifyToken = async (token, secretSignature) => {
  try {
    // Dùng hàm verify của thư viện jsonwebtoken để giải mã token
    return JWT.verify(token, secretSignature)
  } catch (error) { throw error }
}
export const JwtProvider = {
  generateToken,
  verifyToken
}