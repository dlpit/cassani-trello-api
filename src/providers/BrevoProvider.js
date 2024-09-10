// https://github.com/getbrevo/brevo-node
// https://www.npmjs.com/package/@getbrevo/brevo

const brevo = require('@getbrevo/brevo')
import { ENV } from '~/config/environment'

/**
 * Có thể xem thêm phần docs cấu hình theo từng ngôn ngữ khác nhau tùy dự án ở Brevo Doashboard > Account > SMTP & API > API Keys
 * https://brevo.com
 * Với Nodejs thì tốt nhất lên github của Brevo xem hướng dẫn cụ thể
 */
let apiInstance = new brevo.TransactionalEmailsApi()

let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = ENV.BREVO_API_KEY

const sendEmail = async (toEmail, displayName, emailVerificationUrl, customSubject, customHtmlContext, nameBtn) => {
  // Khởi tạo một sendSmtpEmail với những thông tin cần thiết
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoản người gửi mail: địa chỉ email là email đăng ký trên Brevo
  sendSmtpEmail.sender = {
    email: ENV.ADMIN_EMAIL_ADDRESS,
    name: ENV.ADMIN_EMAIL_NAME
  }
  // Những tài khoản nhận mail, to phải là một Array để tùy biến gửi 1 email cho nhiều người
  // sendSmtpEmail.to = [{ email: toEmail }]

  sendSmtpEmail = {
    to: [{
      email: toEmail
    }],
    templateId: 3,
    params: {
      name: displayName,
      url : emailVerificationUrl,
      date: Date().toLocaleString(),
      subject: customSubject,
      context: customHtmlContext,
      nameBtn: nameBtn
    },
    headers: {
      'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
    }
  }

  // // Tiêu đề email:
  // sendSmtpEmail.subject = customSubject

  // // Nội dung email: HTML hoặc text
  // sendSmtpEmail.htmlContent = customHtmlContent

  // Gửi email
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}