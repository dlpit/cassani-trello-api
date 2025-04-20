import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { ENV } from '~/config/environment'

/**
* Tài liệu tham khảo
* https://cloudinary.com/documentation/node_integration#setting_configuration_parameters_globally
* https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
*/

// Bước cấu hình cloudinary, sử dụng v2 - version 2
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET
})

// Khởi tạo một cái function để thực hiện upload file lên cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Bước 1: Tạo một cái luồng stream upload
    const stream = cloudinaryV2.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }
    )

    // Bước 2: Thực hiện upload cái luồng trên lên cloudinary bằng thư viện streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloudinaryProvider = { streamUpload }