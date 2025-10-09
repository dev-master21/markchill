import pool from '../config/database';
import { PromoCode } from '../types';
import { AppError } from '../middleware/error.middleware';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class PromoService {
  static async create(promoData: Partial<PromoCode>): Promise<PromoCode> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO promo_codes (
        code, description, discount_type, discount_value, 
        min_order_amount, usage_limit, valid_until, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        promoData.code!.toUpperCase(),
        promoData.description || null,
        promoData.discount_type || 'percentage',
        promoData.discount_value,
        promoData.min_order_amount || 0,
        promoData.usage_limit || null,
        promoData.valid_until || null,
        promoData.is_active !== false
      ]
    );
    
    return this.findById(result.insertId);
  }
  
  static async findById(id: number): Promise<PromoCode> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM promo_codes WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      throw new AppError('Promo code not found', 404);
    }
    
    return rows[0] as PromoCode;
  }
  
  static async findByCode(code: string): Promise<PromoCode | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM promo_codes WHERE code = ? AND is_active = true',
      [code.toUpperCase()]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as PromoCode;
  }
  
  static async validateAndApply(code: string, userId: number, orderAmount: number): Promise<{
    valid: boolean;
    discount: number;
    message?: string;
  }> {
    const promo = await this.findByCode(code);
    
    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }
    
    // Check if expired
    if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
      return { valid: false, discount: 0, message: 'Promo code has expired' };
    }
    
    // Check minimum order amount
    if (orderAmount < promo.min_order_amount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order amount is ฿${promo.min_order_amount}` 
      };
    }
    
    // Check usage limit
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
      return { valid: false, discount: 0, message: 'Promo code usage limit reached' };
    }
    
    // Check if user already used this code
    const [usageRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user_promo_usage WHERE user_id = ? AND promo_code_id = ?',
      [userId, promo.id]
    );
    
    if (usageRows.length > 0) {
      return { valid: false, discount: 0, message: 'You have already used this promo code' };
    }
    
    // Calculate discount
    let discount = 0;
    if (promo.discount_type === 'percentage') {
      discount = orderAmount * (promo.discount_value / 100);
    } else {
      discount = promo.discount_value;
    }
    
    return { valid: true, discount };
  }
  
  static async recordUsage(promoId: number, userId: number): Promise<void> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Record user usage
      await connection.execute(
        'INSERT INTO user_promo_usage (user_id, promo_code_id) VALUES (?, ?)',
        [userId, promoId]
      );
      
      // Update usage count
      await connection.execute(
        'UPDATE promo_codes SET used_count = used_count + 1 WHERE id = ?',
        [promoId]
      );
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async findAll(includeInactive: boolean = false): Promise<PromoCode[]> {
    let query = 'SELECT * FROM promo_codes';
    
    if (!includeInactive) {
      query += ' WHERE is_active = true';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.execute<RowDataPacket[]>(query);
    
    return rows as PromoCode[];
  }
  
  static async update(id: number, promoData: Partial<PromoCode>): Promise<PromoCode> {
    const updates: string[] = [];
    const values: any[] = [];
    
    const allowedFields = [
      'description', 'discount_type', 'discount_value', 
      'min_order_amount', 'usage_limit', 'valid_until', 'is_active'
    ];
    
    for (const [key, value] of Object.entries(promoData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE promo_codes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }
  
  static async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE promo_codes SET is_active = false WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      throw new AppError('Promo code not found', 404);
    }
  }
}