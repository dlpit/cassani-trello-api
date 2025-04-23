import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/board')
  .post(
    authMiddleware.isAuthorzied,
    invitationValidation.createNewBoardInvitation,
    invitationController.createNewBoardInvitation
  )

// Get danh sách lời mời - invitations by User
Router.route('/')
  .get(authMiddleware.isAuthorzied, invitationController.getInvitations)

// Cập nhật một bản ghi Board Invitation
Router.route('/board/:invitationId')
  .put(authMiddleware.isAuthorzied, invitationController.updateBoardInvitation)

export const invitationRoute = Router