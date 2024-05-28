import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

Router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValidation.update, columnController.update) // Update board
  .delete(columnValidation.deleteItem, columnController.deleteItem) // Delete board

export const columnRoute = Router