import React, { createContext, useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch all products
    fetch(`${apiUrl}/api/allproducts`)
      .then((response) => response.json())
      .then((data) => {
        console.log("All products fetched:", data);
        setAll_Product(data);
      })
      .catch((error) => console.error("Failed to fetch products:", error));

    // Fetch cart items
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/getcart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("Cart items fetched:", data);
          // Ensure cartItems is always an array
          setCartItems(Array.isArray(data) ? data : []);
        })
        .catch((error) => console.error("Failed to fetch cart items:", error));
    }
  }, []);

  const updateCartItems = (updatedCartItems) => {
    // Ensure updatedCartItems is always an array
    setCartItems(Array.isArray(updatedCartItems) ? updatedCartItems : []);
    console.log("Cart items updated:", updatedCartItems);
  };

  const addToCart = (itemId) => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("Added to cart:", data);
          updateCartItems(data);
        })
        .catch((error) => {
          console.error("Failed to add item to cart:", error);
        });
    }
  };

  const decreaseQuantity = (itemId) => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/decreasequantity`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("Quantity decreased:", data);
          updateCartItems(data);
        })
        .catch((error) => {
          console.error("Failed to decrease item quantity:", error);
        });
    }
  };

  const increaseQuantity = (itemId) => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/increasequantity`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("Quantity increased:", data);
          updateCartItems(data);
        })
        .catch((error) => {
          console.error("Failed to increase item quantity:", error);
        });
    }
  };

  const removeFromCart = (itemId) => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/removefromcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("Removed from cart:", data);
          updateCartItems(data);
        })
        .catch((error) => {
          console.error("Failed to remove item from cart:", error);
        });
    }
  };

  const getTotalCartAmount = () => {
    return Array.isArray(cartItems) ? cartItems.reduce((total, cartItem) => {
      const product = all_product.find((p) => p._id === cartItem.productId);
      if (product) {
        return total + product.new_price * cartItem.quantity;
      }
      return total;
    }, 0) : 0;
  };

  const getTotalCartItems = () => {
    return Array.isArray(cartItems) ? cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0) : 0;
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setCartItems([]); // Reset cart items to an empty array
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    handleLogout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
