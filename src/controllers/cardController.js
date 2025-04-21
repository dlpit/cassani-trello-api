
/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    const createNewCard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createNewCard)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const updateData = await cardService.update(cardId, req.body)

    res.status(StatusCodes.OK).json(updateData)
  } catch (error) { next(error) }
}
export const cardController = {
  createNew,
  update
}