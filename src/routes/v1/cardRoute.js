import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorzied, cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorzied, cardValidation.update, cardController.update)
export const cardRoute = Router