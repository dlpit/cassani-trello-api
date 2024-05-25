/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    // Xử lý dữ liệu trước khi lưu vào database
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để lưu newBoard vào database
    const createBoard = await boardModel.createNew(newBoard)

    // Lấy dữ liệu board vừa tạo ra
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)

    // Làm thêm các xử lý khác nếu cần
    // Gửi email thông báo, gửi tin nhắn thông báo, ...nếu cần
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    // Clone board ra một bản sao để tránh ảnh hưởng dữ liệu gốc
    const clonedBoard = cloneDeep(board)
    // Đưa card vào đúng column
    clonedBoard.columns.forEach(column => {
      // column.cards = clonedBoard.cards.filter(card => card.columnId.toString() === column._id.toString())

      // Sử dụng ObjectId.equals() do MongoDB support so sánh ObjectId
      column.cards = clonedBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    // Xóa trường cards ở board gốc
    delete clonedBoard.cards
    return clonedBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails
}
