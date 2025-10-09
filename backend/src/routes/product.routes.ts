import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { productValidation, validate } from '../middleware/validation.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/low-stock', authenticate, authorize('admin'), productController.getLowStockProducts);
router.get('/:id', productController.getProduct);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  productValidation.create,
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  productValidation.update,
  validate,
  productController.updateProduct
);

router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

export default router;