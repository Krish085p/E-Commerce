import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
const apiUrl = import.meta.env.VITE_API_URL;

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
  const totalCartAmount = getTotalCartAmount();

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
        const quantity = cartItems[product.id];
        if (quantity > 0) {
          return (
            <div className="cartitems-format" key={product.id}>
              <img src={`${apiUrl}/${product.image}`} alt={product.name} className="carticon-product-icon" />
              <p>{product.name}</p>
              <p>${product.new_price}</p>
              <button className="cartitems-quantity">{quantity}</button>
              <p>${product.new_price * quantity}</p>
              <img
                src={remove_icon}
                onClick={() => removeFromCart(product.id)}
                alt="remove"
                className="cartitems-remove-icon"
              />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <h1>Cart Totals</h1>
        <div className="cartitems-total">
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${totalCartAmount}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${totalCartAmount}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
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
