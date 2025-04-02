import { KindOfUpgradePackage, PricingPlan } from '@type/upgradePackage'

export const PRICINGPLANS: PricingPlan[] = [
  {
    id: KindOfUpgradePackage.BASIC,
    title: 'Gói Cơ Bản',
    price: {
      amount: 376000,
      savings: 'Tiết kiệm đến 1.720.000đ / tháng so với đăng tin lẻ',
      description: 'Dành cho môi giới BĐS có giỏ hàng nhỏ'
    },
    period: '20 tin',
    isPopular: true,
    features: {
      summary: '20 tin đăng - hiển thị 15 ngày',
      list: [
        { text: '20 tin đăng - hiển thị 15 ngày', available: true },
        { text: 'Hiển thị tối đa 30 tin đăng', available: true },
        { text: 'Báo cáo hiệu suất tin đăng', available: false },
        { text: 'Thêm kênh liên hệ mới', available: false },
        { text: 'Công cụ quản lý khách hàng tiềm năng', available: false },
        { text: 'Ưu đãi nâng cấp lên Tin nổi bật - nhiều hình ảnh', available: true },
        { text: 'Duyệt tin nhanh dưới 5 phút', available: false }
      ]
    }
  },
  {
    id: KindOfUpgradePackage.PRO,
    title: 'Gói Chuyên Nghiệp',
    price: {
      amount: 630000,
      savings: 'Tiết kiệm đến 4.750.000đ / tháng so với đăng tin lẻ',
      description: 'Dành cho môi giới BĐS chuyên nghiệp có giỏ hàng lớn'
    },
    period: '50 tin',
    isAvailable: false,
    features: {
      summary: '50 tin đăng - hiển thị 15 ngày',
      list: [
        { text: '50 tin đăng - hiển thị 15 ngày', available: true },
        { text: 'Không giới hạn tin đăng', available: true },
        { text: 'Báo cáo hiệu suất tin đăng', available: true },
        { text: 'Thêm kênh liên hệ mới', available: true },
        { text: 'Công cụ quản lý khách hàng tiềm năng', available: true },
        { text: 'Ưu đãi nâng cấp lên Tin nổi bật - nhiều hình ảnh', available: true },
        { text: 'Duyệt tin nhanh dưới 5 phút', available: false }
      ]
    }
  },
  {
    id: KindOfUpgradePackage.VIP,
    title: 'Gói VIP',
    price: {
      amount: 1760000,
      savings: 'Độc quyền duyệt tin nhanh',
      description: 'Giải pháp trọn gói, lợi ích toàn diện cho môi giới BĐS chuyên nghiệp'
    },
    period: '60 tin',
    isPopular: false,
    isAvailable: false,
    features: {
      summary: '60 tin đăng - hiển thị 15 ngày',
      list: [
        { text: '60 tin đăng - hiển thị 15 ngày', available: true },
        { text: 'Không giới hạn tin đăng', available: true },
        { text: 'Báo cáo hiệu suất tin đăng', available: true },
        { text: 'Thêm kênh liên hệ mới', available: true },
        { text: 'Công cụ quản lý khách hàng tiềm năng', available: true },
        { text: 'Ưu đãi nâng cấp lên Tin nổi bật - nhiều hình ảnh', available: true },
        { text: 'Duyệt tin nhanh dưới 5 phút', available: true },
        { text: 'Đặc quyền duyệt tin nhanh', available: true }
      ]
    }
  }
]
