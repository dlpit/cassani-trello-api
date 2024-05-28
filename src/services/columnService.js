import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

    if (getNewColumn) {
      // Xử lý cấu trúc data trả về
      getNewColumn.cards = []

      // Câp nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updateColumn = await columnModel.update(columnId, updatedData)

    return updateColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')

    // Xóa column
    await columnModel.deleteOneById(columnId)
    // Xoá card thuộc column trên
    await cardModel.deleteManyByColumnId(columnId)
    // Xoá columnId trong mảng columnOrderIds của collection boards
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteResult: 'The column has been deleted successfully!' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}
