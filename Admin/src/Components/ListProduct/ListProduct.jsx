import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    try {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
      });
      await fetchInfo(); // Update the product list after removal
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <div className='listproduct'>
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        {allProducts.map((product) => (
          <div className="listproduct-format-main listproduct-format" key={product.id}>
            <img src={product.image} className="listproduct-product-icon" alt=""/>
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={() => remove_product(product.id)} className='listproduct-remove-icon' src={cross_icon} alt=""/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
