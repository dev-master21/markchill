import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Экспортируем body и другие валидаторы из express-validator
export { body, query, param } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const authValidation = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number')
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

export const productValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('type').isIn(['WHITE', 'BLACK', 'CYAN']).withMessage('Invalid product type'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer')
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('type').optional().isIn(['WHITE', 'BLACK', 'CYAN']).withMessage('Invalid product type'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number')
  ]
};

export const orderValidation = {
  create: [
    body('delivery_method').isIn(['standard', 'express']).withMessage('Invalid delivery method'),
    body('delivery_name').trim().notEmpty().withMessage('Delivery name is required'),
    body('delivery_phone').notEmpty().withMessage('Delivery phone is required'),
    body('delivery_address').trim().notEmpty().withMessage('Delivery address is required'),
    body('delivery_city').trim().notEmpty().withMessage('Delivery city is required'),
    body('delivery_postal_code').trim().notEmpty().withMessage('Postal code is required')
  ]
};

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort').optional().isString().withMessage('Sort must be a string'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be ASC or DESC')
];