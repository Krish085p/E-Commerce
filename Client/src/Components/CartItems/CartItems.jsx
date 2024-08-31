import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import plus_icon from "../Assets/plus_icon.png";
import minus_icon from "../Assets/minus_icon.png";
const apiUrl = import.meta.env.VITE_API_URL;

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(ShopContext);
  const totalCartAmount = getTotalCartAmount();

  const handleIncrease = (productId) => {
    console.log(`Increasing quantity for product ${productId}`);
    increaseQuantity(productId);
  };

  const handleDecrease = (productId) => {
    console.log(`Decreasing quantity for product ${productId}`);
    decreaseQuantity(productId);
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((product) => {
        const cartItem = cartItems.find(item => item.productId === product._id);
        const quantity = cartItem ? cartItem.quantity : 0;

        if (quantity > 0) {
          return (
            <div className="cartitems-format" key={product._id}>
              <img src={`${apiUrl}/${product.image}`} alt={product.name} className="carticon-product-icon" />
              <p>{product.name}</p>
              <p>${product.new_price.toFixed(2)}</p>
              <div className="cartitems-quantity">
                <button
                  className="cartitems-quantity-btn"
                  onClick={() => handleDecrease(product._id)}
                >
                  <img src={minus_icon} alt="decrease" />
                </button>
                <span>{quantity}</span>
                <button
                  className="cartitems-quantity-btn"
                  onClick={() => handleIncrease(product._id)}
                >
                  <img src={plus_icon} alt="increase" />
                </button>
              </div>
              <p>${(product.new_price * quantity).toFixed(2)}</p>
              <div className="cartitems-cross-image">
                <img
                  src={remove_icon}
                  onClick={() => removeFromCart(product._id)}
                  alt="remove"
                  className="cartitems-remove-icon"
                />
              </div>
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <h1>Cart Totals</h1>
        <div className="cartitems-total">
          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>${totalCartAmount.toFixed(2)}</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <h3>Total</h3>
            <h3>${totalCartAmount.toFixed(2)}</h3>
          </div>
        </div>
        <button className="cartitems-checkout-btn">PROCEED TO CHECKOUT</button>
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
