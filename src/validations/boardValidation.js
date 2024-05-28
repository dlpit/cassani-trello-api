import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

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
    type: Joi.string().required().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
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

const update = async (req, res, next) => {
  // Không required() trong trường hợp update
  const schema = Joi.object({
    title: Joi.string().min(3).max(72).trim().strict(),
    description: Joi.string().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })
  try {
    // Chỉ định abortEarly: fasle để trả về tất cả các lỗi không chỉ lỗi đầu tiên
    // Đối với trường hợp update, không cần phải validate tất cả các field (allowUnknown: true)
    await schema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardtoDifferentColumn = async (req, res, next) => {
  const schema = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardtoDifferentColumn
}