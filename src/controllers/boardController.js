
/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {

    // console.log('req.body', req.body)
    // console.log(req.query)
    // console.log(req.params)
    // console.log(req.files)
    // console.log(req.cookies)
    // console.log(req.jwtDecoded)

    // Điều hướng dữ liệu sang tầng service
    const createNewBoard = await boardService.createNew(req.body)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createNewBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}