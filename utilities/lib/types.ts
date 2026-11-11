export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: string
  rating: number
  reviewCount?: number
  image: string
  images?: string[]
  colors?: { name: string; value: string }[]
  storage?: string[]
  inStock: boolean
  seller: string
  warranty?: string
  description: string
  specs?: { label: string; value: string }[]
}

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  color: string
  storage: string
  selected: boolean
}

export interface Order {
  id: string
  date: string
  status: "pending" | "processing" | "delivered" | "cancelled"
  total: number
  items: {
    id: number
    name: string
    image: string
    quantity: number
    price: number
  }[]
}

export interface User {
  name: string
  phone: string
  email: string
  avatar?: string
}

export interface Address {
  id: string
  name: string
  phone: string
  city: string
  address: string
  isDefault: boolean
}
