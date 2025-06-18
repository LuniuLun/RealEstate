const MESSAGE = {
  common: {
    ERROR_EVENT: 'Chức năng chưa được hỗ trợ',
    UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định',
    NOT_FOUND: 'Không tìm thấy kết quả',
    ERROR_NETWORK: 'Lỗi kết nối mạng',
    REQUIRE_USER: 'Hãy đăng nhập trước khi dùng chắc năng này'
  },
  user: {
    ADD_SUCCESS: 'Thêm người dùng thành công',
    ADD_FAILED: 'Thêm người dùng thất bại',
    DELETE_SUCCESS: 'Xóa người dùng thành công',
    DELETE_FAILED: 'Xóa người dùng thất bại',
    EDIT_SUCCESS: 'Cập nhật người dùng thành công',
    EDIT_FAILED: 'Cập nhật người dùng thất bại',
    GET_SUCCESS: 'Lấy danh sách người dùng thành công',
    GET_FAILED: 'Không thể tải danh sách người dùng',
    FILTER_SUCCESS: 'Lọc người dùng thành công',
    FILTER_FAILED: 'Lọc người dùng thất bại',
    UPGRADE_SUCCESS: 'Nâng cấp người dùng thành công',
    UPGRADE_FAILED: 'Nâng cấp tài khoản thất bại'
  },
  property: {
    ADD_SUCCESS: 'Thêm bất động sản thành công',
    ADD_FAILED: 'Thêm bất động sản thất bại',
    DELETE_SUCCESS: 'Xóa bất động sản thành công',
    DELETE_FAILED: 'Xóa bất động sản thất bại',
    EDIT_SUCCESS: 'Cập nhật bất động sản thành công',
    EDIT_FAILED: 'Cập nhật bất động sản thất bại',
    GET_SUCCESS: 'Lấy danh sách bất động sản thành công',
    GET_FAILED: 'Không thể tải danh sách bất động sản',
    FILTER_SUCCESS: 'Lọc bất động sản thành công',
    FILTER_FAILED: 'Lọc bất động sản thất bại',
    ESTIMATE_FAILED: 'Dự đoán giá thất bại',
    ESTIMATE_SUCCESS: 'Định giá thành công'
  },
  favouriteProperty: {
    EDIT_SUCCESS: 'Cập nhật danh sách yêu thích thành công',
    EDIT_FAILED: 'Cập nhật danh sách yêu thích thất bại'
  },
  auth: {
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGIN_FAILED: 'Đăng nhập thất bại',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    LOGOUT_FAILED: 'Đăng xuất thất bại',
    REGISTER_SUCCESS: 'Đăng ký thành công',
    REGISTER_FAILED: 'Đăng ký thất bại',
    REQUIRE: 'Vui lòng nhập đầy đủ thông tin của bạn',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PHONE: 'Số điện thoại phải có đúng 9 đến 11 chữ số',
    WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt',
    MISMATCH_PASSWORD: 'Mật khẩu không khớp',
    TERMREQUIRED: 'Bạn cần đồng ý với điều khoản dịch vụ'
  },
  coordinates: {
    GET_SUCCESS: 'Lấy toạ độ thành công',
    GET_FAILED: 'Không tồn tại vị trí này'
  },
  payment: {
    GET_SUCCESS: 'Khởi tạo cổng thanh toán thành công',
    GET_FAILED: 'Không thể khởi tạo cổng thanh toán',
    PAY_SUCCESS: 'Thanh toán thành công',
    PAY_FAILED: 'Thanh toán không thành công'
  },
  transaction: {
    ADD_SUCCESS: 'Tạo giao dịch thành công',
    ADD_FAILED: 'Tạo giao dịch thất bại',
    UPDATE_SUCCESS: 'Cập nhật giao dịch thành công',
    UPDATE_FAILED: 'Cập nhật giao dịch thất bại',
    DELETE_SUCCESS: 'Xóa giao dịch thành công',
    DELETE_FAILED: 'Xóa giao dịch thất bại',
    GET_SUCCESS: 'Lấy danh sách giao dịch thành công',
    GET_FAILED: 'Không thể tải danh sách giao dịch'
  },
  forecast: {
    FORECAST_SUCCESS: 'Dự đoán giá thành công',
    FORECAST_FAILED: 'Dự đoán giá thất bại'
  },
  image: {
    VALIDATION_FAILED: 'Kiểm tra ảnh thành công',
    VALIDATION_SUCCESS: 'Kiểm tra ảnh thất bại',
    NSFW_CONTENT_DETECTED: 'Ảnh tải lên có chứa nội dung nhạy cảm'
  }
}

export default MESSAGE
