import { ENV } from '~/config/environment'

// Những domain mà bạn muốn chấp nhận lấy tài nguyên từ server của bạn
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' // Không cần localhost vì ở file config/cors đã luôn chấp nhận môi trường
  // và các domain khác mà bạn muốn chấp nhận
  // ENV.WEBSITE_DOMAIN_PRODUCTION
  'https://cassani.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = ENV.BUILD_MODE === 'production'
  ? ENV.WEBSITE_DOMAIN_PRODUCTION
  : ENV.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}