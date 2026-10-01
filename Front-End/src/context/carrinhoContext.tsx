import React, { createContext, useState, useContext, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: string | number;
  imageUrl?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: string | number;
  imageUrl?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productToAdd: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('shoppingCart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Erro ao carregar o carrinho do localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productToAdd: Product) => {
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item.id === productToAdd.id);

      if (isItemInCart) {
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });

    alert(`${productToAdd.name} foi adicionado ao carrinho!`);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
}