import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { InventoryService } from '../services/inventory.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import path from 'path';
import fs from 'fs';

export const createProduct = asyncHandler(async (req: any, res: Response) => {
  console.log('=== CREATE PRODUCT REQUEST ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  const productData = { ...req.body };
  
  // Преобразуем is_active в boolean/number
  if (typeof productData.is_active === 'string') {
    productData.is_active = productData.is_active === 'true' ? 1 : 0;
  } else if (typeof productData.is_active === 'boolean') {
    productData.is_active = productData.is_active ? 1 : 0;
  }
  
  // Handle image upload
  if (req.files) {
    if (req.files.image && req.files.image[0]) {
      productData.image = `/uploads/products/${req.files.image[0].filename}`;
    }
    
    if (req.files.gallery) {
      productData.gallery = req.files.gallery.map((file: any) => 
        `/uploads/products/${file.filename}`
      );
    }
  }
  
  // Parse JSON fields
  if (typeof productData.features === 'string') {
    try {
      productData.features = JSON.parse(productData.features);
    } catch {
      productData.features = [];
    }
  }
  
  if (typeof productData.strains === 'string') {
    try {
      productData.strains = JSON.parse(productData.strains);
    } catch {
      productData.strains = [];
    }
  }
  
  // Convert stock to number
  if (productData.stock) {
    productData.stock = parseInt(productData.stock);
  }
  
  const product = await ProductService.create(productData);
  
  res.status(201).json({
    success: true,
    product
  });
});

export const updateProduct = asyncHandler(async (req: any, res: Response) => {
  const productId = parseInt(req.params.id);
  const productData = { ...req.body };
  
  console.log('=== UPDATE PRODUCT REQUEST ===');
  console.log('Product ID:', productId);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  // Преобразуем is_active
  if (typeof productData.is_active === 'string') {
    productData.is_active = productData.is_active === 'true' ? 1 : 0;
  } else if (typeof productData.is_active === 'boolean') {
    productData.is_active = productData.is_active ? 1 : 0;
  }
  
  const currentProduct = await ProductService.findById(productId);
  
  // Handle main image upload
  if (req.files && req.files.image && req.files.image[0]) {
    productData.image = `/uploads/products/${req.files.image[0].filename}`;
  }
  
  // Handle gallery - ТОЛЬКО если что-то передано про галерею
  if (productData.removeGallery === 'true') {
    // Явное удаление всей галереи
    productData.gallery = [];
    delete productData.removeGallery;
  } else if (productData.keepExistingGallery || (req.files && req.files.gallery)) {
    // Обновление галереи
    let newGallery = [];
    
    // Парсим существующие изображения которые нужно сохранить
    if (productData.keepExistingGallery) {
      try {
        const keepExisting = JSON.parse(productData.keepExistingGallery);
        if (Array.isArray(keepExisting)) {
          newGallery = keepExisting;
        }
      } catch (e) {
        console.error('Failed to parse keepExistingGallery:', e);
      }
      delete productData.keepExistingGallery;
    }
    
    // Добавляем новые изображения
    if (req.files && req.files.gallery) {
      const newImages = req.files.gallery.map((file: any) => 
        `/uploads/products/${file.filename}`
      );
      newGallery = [...newGallery, ...newImages];
    }
    
    productData.gallery = newGallery;
  }
  // Если ничего не передано про галерею - НЕ ТРОГАЕМ ЕЁ
  // productData.gallery будет undefined и не перезапишет существующую
  
  // Parse JSON fields
  if (typeof productData.features === 'string') {
    try {
      productData.features = JSON.parse(productData.features);
    } catch {
      productData.features = [];
    }
  }
  
  if (typeof productData.strains === 'string') {
    try {
      productData.strains = JSON.parse(productData.strains);
    } catch {
      productData.strains = [];
    }
  }
  
  // Convert stock to number
  if (productData.stock) {
    productData.stock = parseInt(productData.stock);
  }
  
  console.log('Final productData for update:', productData);
  
  const product = await ProductService.update(productId, productData);
  
  res.json({
    success: true,
    product
  });
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    type: req.query.type,
    product_category: req.query.product_category,
    category_id: req.query.category_id,
    is_active: req.query.is_active !== 'false',
    search: req.query.search,
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 20
  };
  
  const products = await ProductService.findAll(filters);
  
  res.json({
    success: true,
    products,
    page: filters.page,
    limit: filters.limit
  });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const product = await ProductService.findById(productId);
  
  res.json({
    success: true,
    product
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  
  const product = await ProductService.findById(productId);
  
  await ProductService.delete(productId);
  
  // Delete images
  if (product.image && product.image.startsWith('/uploads/')) {
    const imagePath = path.join(__dirname, '../../..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  if (product.gallery && Array.isArray(product.gallery)) {
    for (const image of product.gallery) {
      if (image.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '../../..', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
  }
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

export const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await InventoryService.getLowStockProducts();
  
  res.json({
    success: true,
    products
  });
});