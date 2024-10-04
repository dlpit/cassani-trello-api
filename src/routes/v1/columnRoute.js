import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorzied, columnValidation.createNew, columnController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorzied, columnValidation.update, columnController.update) // Update board
  .delete(authMiddleware.isAuthorzied, columnValidation.deleteItem, columnController.deleteItem) // Delete board

export const columnRoute = Router