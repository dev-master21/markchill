import { Request, Response } from 'express';
import { PromoService } from '../services/promo.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';

export const getPromoCodes = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.include_inactive === 'true';
  const promoCodes = await PromoService.findAll(includeInactive);
  
  res.json({
    success: true,
    promoCodes
  });
});

export const getPromoCode = asyncHandler(async (req: Request, res: Response) => {
  const promoCode = await PromoService.findById(parseInt(req.params.id));
  
  res.json({
    success: true,
    promoCode
  });
});

export const createPromoCode = asyncHandler(async (req: Request, res: Response) => {
  const promoCode = await PromoService.create(req.body);
  
  res.status(201).json({
    success: true,
    promoCode
  });
});

export const updatePromoCode = asyncHandler(async (req: Request, res: Response) => {
  const promoCode = await PromoService.update(parseInt(req.params.id), req.body);
  
  res.json({
    success: true,
    promoCode
  });
});

export const deletePromoCode = asyncHandler(async (req: Request, res: Response) => {
  await PromoService.delete(parseInt(req.params.id));
  
  res.json({
    success: true,
    message: 'Promo code deactivated successfully'
  });
});

export const validatePromoCode = asyncHandler(async (req: any, res: Response) => {
  const { code, order_amount } = req.body;
  
  const result = await PromoService.validateAndApply(
    code,
    req.user.id,
    order_amount
  );
  
  res.json({
    success: true,
    ...result
  });
});