export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  id?: number;
  name: string;
  slug: string;
  type: 'WHITE' | 'BLACK' | 'CYAN';
  product_category?: 'plastic-bags' | 'boxes' | 'nano-blunts' | 'hash-rosin' | 'big-blunts';
  category_id?: number;
  description?: string;
  price: number;
  size?: string;
  thc?: string;
  cbd?: string;
  image?: string;
  gallery?: string[];
  model_3d?: string;
  features?: string[];
  is_active: boolean;
  stock?: number;
  strains?: Strain[];
  inventory?: Inventory;
}

export interface Strain {
  id?: number;
  name: string;
  description?: string;
  effects?: string[];
  flavors?: string[];
  thc_content?: string;
  cbd_content?: string;
  type?: 'Sativa' | 'Indica' | 'Hybrid';
}

export interface Category {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Order {
  id?: number;
  order_number: string;
  user_id?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
  delivery_method: 'standard' | 'express';
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_name?: string;
  delivery_phone?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_postal_code?: string;
  delivery_country?: string;
  gift_message?: string;
  notes?: string;
  tracking_number?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id?: number;
  strain_id?: number;
  quantity: number;
  price: number;
  total: number;
  product?: Product;
  strain?: Strain;
}

export interface CartItem {
  id?: number;
  user_id?: number;
  product_id: number;
  strain_id?: number;
  quantity: number;
  product?: Product;
  strain?: Strain;
}

export interface Inventory {
  id?: number;
  product_id: number;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  last_restock_date?: Date;
}

export interface PromoCode {
  id?: number;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  usage_limit?: number;
  used_count: number;
  valid_from: Date;
  valid_until?: Date;
  is_active: boolean;
}

// Request interfaces
export interface AuthRequest extends Express.Request {
  user?: User;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}