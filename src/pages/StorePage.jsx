// src/pages/StorePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // Use our smart api
import { AuthContext } from '../App';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import ProductModal from '../components/ProductModal';
import { toast } from 'react-hot-toast';

const StorePage = () => {
  const { setToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- 2. ADD NEW MODAL STATE ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Fetch products (no change)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('products/');
        const formattedProducts = response.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image_url: p.image_url,
          category_name: p.category,
        }));
        setProducts(formattedProducts);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- 3. ADD MODAL HANDLER ---
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  
  // --- Cart Logic (no change) ---
  const handleAddToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...productToAdd, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, change) => {
    setCart((prevCart) => {
      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };
  
  const handleCheckout = async () => {
    // This is where we call your backend's "Order Now" endpoint
    console.log('Placing order:', cart);

    const orderItems = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    // We can use toast.promise to show loading, success, and error!
    // This is much better than a simple success message.
    try {
      // 2. Send the order to your backend
      await toast.promise(
        api.post('orders/', 
          { items: orderItems }
          // The 'api' instance automatically adds the Authorization header
        ),
        {
          loading: 'Placing your order...', // Loading message
          success: 'Order placed successfully!', // Success message
          error: 'Failed to place order. Please try again.', // Error message
        }
      );
      
      // 3. Success! Clear the cart and close the modal
      setCart([]);
      setIsCartOpen(false);

    } catch (err) {
      // The toast.promise handles the error,
      // but we can log it just in case.
      console.error('Checkout failed:', err);
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)} 
        onLogout={handleLogout} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... (Search bar section is the same) ... */}
        <section className="text-center py-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">What are you looking for?</h1>
          <p className="mt-2 text-lg text-gray-600">All your fresh extracts, delivered fast.</p>
          <div className="mt-8 max-w-lg mx-auto px-4">
            <div className="relative flex items-center w-full h-14 rounded-full shadow-lg bg-white border border-gray-200">
              <input className="w-full h-full pl-6 pr-16 rounded-full text-base text-gray-700 outline-none border-none focus:ring-2 focus:ring-green-500" type="text" placeholder="Search for products..."/>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-green-700">
                Search
              </button>
            </div>
          </div>
        </section>


        {/* Products Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Products</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick} // <-- 4. Pass the handler
              />
            ))}
          </div>
        </section>
      </main>

      {/* Cart Modal (no change) */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      
      {/* --- 5. RENDER THE PRODUCT MODAL --- */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default StorePage;