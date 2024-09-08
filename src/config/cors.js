import { WHITELIST_DOMAINS } from '~/utils/constants'
import { ENV } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Cấu hình CORS Option
export const corsOptions = {
  origin: function (origin, callback) {
    // Nêu là môi trường dev thì cho phép tất cả các domain
    if (ENV.BUILD_MODE === 'dev') {
      return callback(null, true)
    }
    // Ngươc lại nếu là môi trường production thì còn 1 trường hợp nữa cần xử lý
    // ENV.BUILD_MODE === 'production'

    // Kiểm tra xem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true
}