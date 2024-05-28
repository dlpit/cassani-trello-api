/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

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

      // Cách khác là convert ObjectId sang string để so sánh
      // column.cards = clonedBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    // Xóa trường cards ở board gốc
    delete clonedBoard.cards
    return clonedBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updateBoard = await boardModel.update(boardId, updatedData)

    return updateBoard
  } catch (error) { throw error }
}


const moveCardtoDifferentColumn = async (reqBody) => {
  try {
    // * B1: Cập nhật mảng cardOrderIds của column nguồn
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    // * B2: Cập nhật mảng cardOrderIds của column đích
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // * B3: Cập nhật lại trường columnId của card
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })
    return { updateResult: 'success' }
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardtoDifferentColumn
}
