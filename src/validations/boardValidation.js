import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(72).trim().strict().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must have at least 3 characters',
      'string.max': 'Title must have at most 72 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().required().min(3).max(255).trim().strict().messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must have at least 3 characters',
      'string.max': 'Description must have at most 255 characters',
      'any.required': 'Description is required'
    }),
  })
  /**
   * Note: Mặc định không cần phải custom message ở BE vì FE sẽ tự validate và custom message cho đẹp
   * BE chỉ cần valide để đảm bảo dữ liệu đầu vào hợp lệ và trả về message của thư viện là được
   * Quan trọng là việc Validate dữ liệu bắt buộc phải có từ 2 phía
   */
  try {
    // Chỉ định abortEarly: fasle để trả về tất cả các lỗi không chỉ lỗi đầu tiên
    await schema.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu thành công thì chuyển sang Controller tiếp theo
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}