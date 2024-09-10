import { ENV } from '~/config/environment'

// Những domain mà bạn muốn chấp nhận lấy tài nguyên từ server của bạn
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' // Không cần localhost vì ở file config/cors đã luôn chấp nhận môi trường
  // và các domain khác mà bạn muốn chấp nhận
  'env.WEBSITE_DOMAIN_PRODUCTION'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = ENV.BUILD_MODE === 'production'
  ? ENV.WEBSITE_DOMAIN_PRODUCTION
  : ENV.WEBSITE_DOMAIN_DEVELOPMENT