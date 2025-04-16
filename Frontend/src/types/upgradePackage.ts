export enum KindOfUpgradePackage {
  BASIC = 'BASIC',
  PRO = 'PRO',
  VIP = 'VIP'
}

export interface Price {
  description: string
  amount: number
  savings?: string
}

export interface Feature {
  text: string
  available: boolean
}

export interface PricingPlan {
  id: KindOfUpgradePackage
  title: string
  price: Price
  period: string
  features: {
    summary?: string
    list: Feature[]
  }
  isPopular?: boolean
  isAvailable?: boolean
}
