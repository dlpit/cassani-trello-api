/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

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

export const boardService = {
  createNew
}
