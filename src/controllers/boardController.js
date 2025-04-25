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
    const userId = req.jwtDecoded._id

    // Điều hướng dữ liệu sang tầng service
    const createNewBoard = await boardService.createNew(userId, req.body)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createNewBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // console.log(req.params)
    const boardId = req.params.id

    const board = await boardService.getDetails(userId, boardId)

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

const moveCardtoDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardtoDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const toggleStar = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const result = await boardService.toggleStar(boardId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // page và itemsPerPage được truyền vào trong query url từ phía FE nên BE sẽ lấy thông qua req.query
    const { page, itemsPerPage, q } = req.query
    const queryFilters = q

    const results = await boardService.getBoards(userId, page, itemsPerPage, queryFilters)

    res.status(StatusCodes.OK).json(results)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardtoDifferentColumn,
  toggleStar,
  getBoards
}