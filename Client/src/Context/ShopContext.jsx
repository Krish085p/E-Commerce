import React, { createContext, useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export const ShopContext = createContext();

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 301; index++) { // 301 to include index 300
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // Load cart items from local storage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }

    // Fetch all products
    fetch(`${apiUrl}/api/allproducts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setAll_Product(data))
      .catch((error) => console.error("Failed to fetch products:", error));

    // If user is logged in, update cart items from the server
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          setCartItems(data);
          localStorage.setItem("cartItems", JSON.stringify(data)); // Update local storage
        })
        .catch((error) => console.error("Failed to fetch cart items:", error));
    }
  }, []);

  // Update local storage whenever cart items change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to local storage immediately
      return updatedCart;
    });

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
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
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Failed to add item to cart:", error);
        });
    } else {
      console.warn("No auth-token found in local storage.");
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 0) {
        updatedCart[itemId] -= 1;
        if (updatedCart[itemId] === 0) {
          delete updatedCart[itemId]; // Remove item completely if quantity is zero
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to local storage immediately
      return updatedCart;
    });

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${apiUrl}/api/removefromcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
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
        .then((data) => console.log(data))
        .catch((error) => console.error("Failed to remove item from cart:", error));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = all_product.find((product) => product._id === Number(itemId));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setCartItems(getDefaultCart()); // Reset cart items to default empty cart
    localStorage.removeItem("cartItems"); // Clear cart items from local storage
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    handleLogout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
