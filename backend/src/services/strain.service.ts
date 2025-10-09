import pool from '../config/database';
import { Strain } from '../types';
import { AppError } from '../middleware/error.middleware';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class StrainService {
  static async create(strainData: Partial<Strain>): Promise<Strain> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO strains (name, description, effects, flavors, thc_content, cbd_content, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        strainData.name,
        strainData.description || null,
        JSON.stringify(strainData.effects || []),
        JSON.stringify(strainData.flavors || []),
        strainData.thc_content || null,
        strainData.cbd_content || null,
        strainData.type || null
      ]
    );
    
    return this.findById(result.insertId);
  }
  
  static async findAll(): Promise<Strain[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM strains ORDER BY name ASC'
    );
    
    return rows.map(row => ({
      ...row,
      effects: JSON.parse(row.effects || '[]'),
      flavors: JSON.parse(row.flavors || '[]')
    })) as Strain[];
  }
  
  static async findById(id: number): Promise<Strain> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM strains WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      throw new AppError('Strain not found', 404);
    }
    
    const strain = rows[0];
    return {
      ...strain,
      effects: JSON.parse(strain.effects || '[]'),
      flavors: JSON.parse(strain.flavors || '[]')
    } as Strain;
  }
  
  static async update(id: number, strainData: Partial<Strain>): Promise<Strain> {
    const updates: string[] = [];
    const values: any[] = [];
    
    const fields = ['name', 'description', 'thc_content', 'cbd_content', 'type'];
    
    for (const field of fields) {
      if (strainData[field as keyof Strain] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(strainData[field as keyof Strain]);
      }
    }
    
    if (strainData.effects) {
      updates.push('effects = ?');
      values.push(JSON.stringify(strainData.effects));
    }
    
    if (strainData.flavors) {
      updates.push('flavors = ?');
      values.push(JSON.stringify(strainData.flavors));
    }
    
    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE strains SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }
  
  static async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM strains WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      throw new AppError('Strain not found', 404);
    }
  }
}