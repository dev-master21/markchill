import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Package,
  Sparkles,
  Zap,
  Leaf,
  Sun,
  Mountain,
  Cloud,
  Wind,
  Scale,
  Flower2,
  Info,
  X,
  Droplets,
  Brain,
  Palette,
  Beaker,
  ArrowLeft,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { useProductsStore } from '../store/productsStore';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';
import productService from '../services/product.service';
import strainService, { Strain } from '../services/strain.service';
import api from '../services/api';
import AnimatedBackground from '../components/common/AnimatedBackground';
import type { Product } from '../types';

// Strain Icons mapping
const strainIcons: Record<string, React.ReactNode> = {
  'Orange Soda': <Sun className="w-5 h-5" />,
  'Glokies': <Mountain className="w-5 h-5" />,
  'Forbidden Fruit': <Sparkles className="w-5 h-5" />,
  'Apple Yusu': <Leaf className="w-5 h-5" />,
  'Lemon Orange': <Zap className="w-5 h-5" />,
  'LSD': <Brain className="w-5 h-5" />,
  'Orange Gas': <Wind className="w-5 h-5" />,
  'Cherry Bean': <Heart className="w-5 h-5" />,
  'Chocolope Waffles': <Cloud className="w-5 h-5" />,
  'Super Boof': <Mountain className="w-5 h-5" />,
  'Mimosa x Orange Punch': <Sun className="w-5 h-5" />
};

// Strain type colors
const strainTypeColors: Record<string, string> = {
  'Sativa': 'from-yellow-400 to-orange-500',
  'Indica': 'from-purple-400 to-indigo-600',
  'Hybrid': 'from-green-400 to-teal-500'
};

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, getProductBySlug, fetchProducts } = useProductsStore();
  const { addItem } = useCartStore();
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [strainModalOpen, setStrainModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [strainInfo, setStrainInfo] = useState<Strain | null>(null);
  const [allStrains, setAllStrains] = useState<Strain[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      // Ensure products are loaded
      if (products.length === 0) {
        await fetchProducts();
      }

      // Get product from store or API
      let foundProduct = getProductBySlug(slug);
      
      if (!foundProduct) {
        const response = await productService.getProduct(slug);
        foundProduct = response;
      }

      if (foundProduct) {
        setProduct(foundProduct);
        
        // Set default size
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        } else if (foundProduct.size) {
          setSelectedSize(foundProduct.size);
        }

        // Load strains
        await loadStrains(foundProduct);

        // Set current index for navigation
        const index = products.findIndex(p => p.slug === slug);
        setCurrentProductIndex(index >= 0 ? index : 0);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadStrains = async (productData: Product) => {
    try {
      // Загружаем только те сорта, которые привязаны к продукту
      const response = await api.get(`/products/${productData.id}/strains`);
      const productStrains = response.data.strains;
      
      if (productStrains && productStrains.length > 0) {
        setAllStrains(productStrains);
        
        // Если у продукта указан конкретный strain_id, выбираем его
        if (productData.strain_id) {
          const strain = productStrains.find((s: Strain) => s.id === productData.strain_id);
          if (strain) {
            setStrainInfo(strain);
            setSelectedStrain(strain);
          } else {
            // Если основной сорт не найден, выбираем первый
            setSelectedStrain(productStrains[0]);
            setStrainInfo(productStrains[0]);
          }
        } else {
          // Иначе выбираем первый доступный сорт
          setSelectedStrain(productStrains[0]);
          setStrainInfo(productStrains[0]);
        }
      } else {
        // Если сорта не выбраны, очищаем состояние
        setAllStrains([]);
        setSelectedStrain(null);
        setStrainInfo(null);
      }
    } catch (error) {
      console.error('Failed to load product strains:', error);
      // Если ошибка, пробуем загрузить все сорта
      try {
        const allStrainsData = await strainService.getStrains();
        if (allStrainsData.length > 0) {
          setAllStrains(allStrainsData);
          setSelectedStrain(allStrainsData[0]);
          setStrainInfo(allStrainsData[0]);
        }
      } catch (fallbackError) {
        console.error('Failed to load fallback strains:', fallbackError);
        setAllStrains([]);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    
    // Правильный вызов addItem с тремя параметрами
    addItem(product, quantity, selectedStrain?.name);
    
    toast.success(`${product.name} added to cart!`);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const nextImage = () => {
    if (!product) return;
    const images = [product.image, ...(product.gallery || [])];
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!product) return;
    const images = [product.image, ...(product.gallery || [])];
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const navigateToProduct = (direction: 'prev' | 'next') => {
    if (products.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentProductIndex > 0 ? currentProductIndex - 1 : products.length - 1;
    } else {
      newIndex = currentProductIndex < products.length - 1 ? currentProductIndex + 1 : 0;
    }
    
    const newProduct = products[newIndex];
    navigate(`/product/${newProduct.slug}`);
  };

  const handleShare = async () => {
    if (!product) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/catalog')}
            className="text-primary hover:underline"
          >
            Return to catalog
          </button>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.gallery || [])];
  const typeGradients = {
    WHITE: 'from-gray-100 to-white',
    BLACK: 'from-gray-800 to-black',
    CYAN: 'from-cyan-400 to-blue-500'
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Product Navigation */}
      <div className="fixed top-1/2 -translate-y-1/2 left-2 md:left-4 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateToProduct('prev')}
          className="p-2 md:p-3 glass-dark rounded-full hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </div>
      
      <div className="fixed top-1/2 -translate-y-1/2 right-2 md:right-4 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateToProduct('next')}
          className="p-2 md:p-3 glass-dark rounded-full hover:bg-white/10"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-24">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </button>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <button
                onClick={() => navigate('/catalog')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Catalog
              </button>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white font-medium">{product.name}</li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="relative group">
              <div className="relative aspect-square rounded-3xl overflow-hidden glass-dark">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 
                               glass-dark rounded-full flex items-center justify-center 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 
                               glass-dark rounded-full flex items-center justify-center 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-col gap-2 md:gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold 
                              backdrop-blur-md bg-gradient-to-r ${typeGradients[product.type]} 
                              text-black shadow-lg`}
                  >
                    {product.type}
                  </motion.div>
                  {product.discount && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold 
                               backdrop-blur-md bg-gradient-to-r from-red-400 to-pink-500 
                               text-white shadow-lg"
                    >
                      -{product.discount}%
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col gap-2 md:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border 
                              flex items-center justify-center transition-all ${
                      isLiked
                        ? 'bg-red-500/20 border-red-500 text-red-500'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md bg-white/10 
                             border border-white/20 flex items-center justify-center text-white 
                             hover:bg-white/20 transition-all"
                  >
                    <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                </div>

                {/* Image Indicators */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`transition-all ${
                          selectedImage === index
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                        } rounded-full`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl 
                                overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 
                         bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                {product.name}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6"
              >
                <span className="text-gray-400 text-sm md:text-base">{product.category}</span>
                {strainInfo && (
                  <>
                    <span className="text-gray-600">|</span>
                    <div className="flex items-center gap-2">
                      <Flower2 className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium text-sm md:text-base">
                        {strainInfo.name}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 text-base md:text-lg leading-relaxed"
              >
                {product.description}
              </motion.p>
            </div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-2xl p-4 md:p-6"
            >
              <div className="flex items-baseline gap-2 md:gap-4">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl md:text-2xl text-gray-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 md:px-3 md:py-1 bg-red-500/20 text-red-400 
                                   rounded-full text-xs md:text-sm font-semibold">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Strain Info Button - показываем только если есть хотя бы один сорт */}
            {allStrains.length > 0 && selectedStrain && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStrainModalOpen(true)}
                  className="w-full glass-dark rounded-2xl p-4 md:p-6 border border-primary/30 
                           hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 
                                    group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-colors">
                        <Flower2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-base md:text-lg">Strain Information</h3>
                        <p className="text-xs md:text-sm text-gray-400">
                          {selectedStrain.name} • {selectedStrain.type || 'Hybrid'}
                        </p>
                      </div>
                    </div>
                    <Info className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Strain Selection - показываем только если есть больше одного сорта */}
            {allStrains.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 md:space-y-4"
              >
                <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Leaf className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  Select Strain
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {allStrains.map((strain) => (
                    <motion.button
                      key={strain.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedStrain(strain);
                        setStrainInfo(strain);
                      }}
                      className={`relative p-3 md:p-4 rounded-xl border transition-all ${
                        selectedStrain?.id === strain.id 
                          ? 'glass-dark border-primary' 
                          : 'glass-dark border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center justify-center">
                          {strainIcons[strain.name] || <Flower2 className="w-4 h-4 md:w-5 md:h-5" />}
                        </div>
                        <span className="block text-xs md:text-sm font-medium">{strain.name}</span>
                        {strain.type && (
                          <span className="block text-[10px] md:text-xs text-gray-400">{strain.type}</span>
                        )}
                      </div>
                      {selectedStrain?.id === strain.id && (
                        <motion.div
                          layoutId="strainIndicator"
                          className="absolute inset-0 border-2 border-primary rounded-xl"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Если только один сорт, показываем его как информацию */}
            {allStrains.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-dark rounded-2xl p-4 md:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Flower2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Strain</p>
                    <p className="font-semibold">{allStrains[0].name}</p>
                    {allStrains[0].type && (
                      <p className="text-xs text-gray-400">{allStrains[0].type}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 md:space-y-4"
              >
                <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Scale className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all 
                                text-sm md:text-base ${
                        selectedSize === size
                          ? 'bg-primary text-black'
                          : 'glass-dark hover:bg-white/20'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity and Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3 md:space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex items-center glass-dark rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 md:p-4 hover:bg-white/10 transition-colors rounded-l-xl"
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <span className="px-4 md:px-6 font-bold text-base md:text-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 md:p-4 hover:bg-white/10 transition-colors rounded-r-xl"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`flex-1 py-3 md:py-4 rounded-xl font-semibold flex items-center 
                           justify-center gap-2 md:gap-3 transition-all text-sm md:text-base ${
                    product.inStock
                      ? isAddingToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-primary to-cyan-500 hover:shadow-lg hover:shadow-primary/25'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </motion.button>
              </div>
              
              {product.stock > 0 && (
                <p className="text-xs md:text-sm text-gray-400 text-center">
                  {product.stock} items in stock
                </p>
              )}
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-2 md:gap-4"
            >
              {[
                { icon: Truck, label: 'Fast Delivery', desc: '1-3 days' },
                { icon: Shield, label: 'Secure Payment', desc: 'SSL Encrypted' },
                { icon: Package, label: 'Premium Quality', desc: 'Lab Tested' },
                { icon: Sparkles, label: 'Satisfaction', desc: '100% Guarantee' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass-dark rounded-xl p-3 md:p-4"
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary mb-1 md:mb-2" />
                  <h4 className="font-semibold text-xs md:text-sm">{item.label}</h4>
                  <p className="text-[10px] md:text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Product Details */}
        {product.features && product.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 md:mt-16 glass-dark rounded-3xl p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {product.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Strain Modal */}
      <AnimatePresence>
        {strainModalOpen && selectedStrain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setStrainModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-dark rounded-3xl p-6 md:p-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Flower2 className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">{selectedStrain.name}</h2>
                    {selectedStrain.type && (
                      <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full 
                                     text-xs font-medium bg-gradient-to-r ${
                        strainTypeColors[selectedStrain.type] || 'from-gray-500 to-gray-600'
                      } text-white`}>
                        {selectedStrain.type}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setStrainModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* THC/CBD Content */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedStrain.thc_content && (
                  <div className="glass-dark rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-gray-400">THC Content</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedStrain.thc_content}</p>
                  </div>
                )}
                {selectedStrain.cbd_content && (
                  <div className="glass-dark rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-400">CBD Content</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedStrain.cbd_content}</p>
                  </div>
                )}
              </div>

              {/* Terpenes */}
              {selectedStrain.terpenes && (
                <div className="glass-dark rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Beaker className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Terpenes Profile</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base">{selectedStrain.terpenes}</p>
                </div>
              )}

              {/* Aroma & Taste */}
              {selectedStrain.aroma_taste && (
                <div className="glass-dark rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold">Aroma & Taste</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base">{selectedStrain.aroma_taste}</p>
                </div>
              )}

              {/* Effects */}
              {selectedStrain.effects && (
                <div className="glass-dark rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <h3 className="font-semibold">Effects</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base">{selectedStrain.effects}</p>
                </div>
              )}

              {/* Description */}
              {selectedStrain.description && (
                <div className="glass-dark rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold">Description</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {selectedStrain.description}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStrainModalOpen(false)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-primary to-cyan-500 
                         rounded-xl font-semibold"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}