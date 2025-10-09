import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Tag, 
  Package,
  TrendingUp,
  Percent,
  Sparkles,
  Truck,
  Check
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import AnimatedBackground from '../components/common/AnimatedBackground';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const deliveryFee = 100;
  const freeDeliveryThreshold = 2500;
  const discount = isPromoApplied ? 0.1 : 0; // 10% discount if promo applied
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate totals
  const subtotal = getTotalPrice();
  const discountAmount = subtotal * discount;
  const totalBeforeDelivery = subtotal - discountAmount;
  const isFreeDelivery = totalBeforeDelivery >= freeDeliveryThreshold;
  const finalDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const total = totalBeforeDelivery + finalDeliveryFee;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const savings = discountAmount + (isFreeDelivery ? deliveryFee : 0);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'chill10') {
      setIsPromoApplied(true);
      toast.success('Promo code applied! 10% off', {
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: '#18181B',
          color: '#fff',
          border: '1px solid rgba(35, 192, 219, 0.3)',
        },
      });
    } else {
      toast.error('Invalid promo code', {
        style: {
          borderRadius: '12px',
          background: '#18181B',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success('Cart cleared', {
      style: {
        borderRadius: '12px',
        background: '#18181B',
        color: '#fff',
        border: '1px solid rgba(35, 192, 219, 0.3)',
      },
    });
  };

  const stats = [
    { label: 'Items', value: itemCount.toString(), icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Subtotal', value: `฿${subtotal.toLocaleString()}`, icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { label: 'Savings', value: `฿${savings.toLocaleString()}`, icon: Percent, color: 'from-yellow-500 to-amber-600' },
    { label: 'Delivery', value: isFreeDelivery ? 'FREE' : `฿${deliveryFee}`, icon: Truck, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative"
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: -20,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Continue Shopping</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text flex items-center gap-3">
                  <ShoppingBag className="w-10 h-10" />
                  Shopping Cart
                </h1>
                <p className="text-gray-400 mt-2">
                  {items.length} {items.length === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
              
              {items.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowClearModal(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cart</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {items.length === 0 ? (
            // Empty Cart State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative"
              >
                <ShoppingBag className="w-16 h-16 text-gray-600" />
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 rounded-full bg-primary/20"
                />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start exploring our premium collection!
              </p>
              
              <Link to="/catalog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 gradient-primary text-white font-semibold rounded-2xl hover:shadow-[0_0_30px_rgba(35,192,219,0.5)] transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Products
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Compact Stats Grid - Like Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="glass-dark rounded-2xl p-4 relative overflow-hidden group cursor-pointer"
                    >
                      {/* Animated gradient background */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                        </div>
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Mobile Clear Cart Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end mb-4 md:hidden"
                  >
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Cart</span>
                    </button>
                  </motion.div>

                  {/* Items with stagger animation */}
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${item.strain}`}
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <CartItem item={item} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Delivery Progress */}
                  {!isFreeDelivery && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-dark p-6 rounded-2xl mt-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-primary" />
                          <span className="font-medium">Free Delivery Progress</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          ฿{(freeDeliveryThreshold - totalBeforeDelivery).toLocaleString()} more
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(totalBeforeDelivery / freeDeliveryThreshold) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="h-full gradient-primary relative"
                        >
                          <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Add ฿{(freeDeliveryThreshold - totalBeforeDelivery).toLocaleString()} more to get free delivery!
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:sticky lg:top-8 h-fit space-y-6"
                >
                  {/* Summary Card */}
                  <div className="glass-dark p-6 rounded-2xl space-y-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl" />
                    
                    <h3 className="text-xl font-bold relative z-10">Order Summary</h3>

                    {/* Promo Code */}
                    <div className="relative z-10">
                      <label className="text-sm text-gray-400 mb-2 block">Promo Code</label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter code"
                            disabled={isPromoApplied}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 transition-colors pr-10 disabled:opacity-50"
                          />
                          {isPromoApplied && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleApplyPromo}
                          disabled={isPromoApplied || !promoCode}
                          className="px-6 py-3 glass-dark rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Tag className="w-5 h-5" />
                        </motion.button>
                      </div>
                      {!isPromoApplied && (
                        <p className="text-xs text-gray-500 mt-1">Try: CHILL10 for 10% off</p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal ({itemCount} items)</span>
                        <span>฿{subtotal.toLocaleString()}</span>
                      </div>
                      
                      {isPromoApplied && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex justify-between text-green-400"
                        >
                          <span>Discount (10%)</span>
                          <span>-฿{discountAmount.toLocaleString()}</span>
                        </motion.div>
                      )}
                      
                      <div className="flex justify-between text-gray-400">
                        <span>Delivery Fee</span>
                        <span className={isFreeDelivery ? 'text-green-400' : ''}>
                          {isFreeDelivery ? 'FREE' : `฿${deliveryFee}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-gray-400">
                        <span>Tax</span>
                        <span>Included</span>
                      </div>
                      
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg">Total</span>
                          <div className="text-right">
                            <p className="text-3xl font-bold gradient-text">
                              ฿{total.toLocaleString()}
                            </p>
                            {savings > 0 && (
                              <p className="text-xs text-green-400 mt-1">
                                You saved ฿{savings.toLocaleString()}!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link to="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 gradient-primary text-white font-semibold rounded-2xl flex items-center justify-center space-x-2 hover:shadow-[0_0_30px_rgba(35,192,219,0.5)] transition-all duration-300 relative overflow-hidden group"
                      >
                        <span className="relative z-10">Proceed to Checkout</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        
                        {/* Button animation */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-200%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark p-8 rounded-3xl max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Clear Cart?</h3>
                <p className="text-gray-400">
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearCart}
                  className="flex-1 py-3 bg-red-500/20 text-red-500 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
                >
                  Clear Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cart;