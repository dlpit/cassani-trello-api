import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body', req.body)
    // console.log(req.query)
    // console.log(req.params)
    // console.log(req.files)
    // console.log(req.cookies)
    // console.log(req.jwtDecoded)

    // Điều hướng dữ liệu sang tầng service

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json({ message : 'POST from Controller' })
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}