
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

const getDetails = async (req, res, next) => {
  try {
    // console.log(req.params)
    const boardId = req.params.id

    const board = await boardService.getDetails(boardId)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id

    const updateBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) { next(error) }
}
export const boardController = {
  createNew,
  getDetails,
  update
}