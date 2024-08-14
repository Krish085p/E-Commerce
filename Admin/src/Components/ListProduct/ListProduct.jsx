import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../assets/cross_icon.png';
const apiUrl = import.meta.env.VITE_API_URL;

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/allproducts`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
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
      await fetch(`${apiUrl}/api/removeproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
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
        {allProducts.map((pro) => (
          <div className="listproduct-format-main listproduct-format" key={pro.id}>
            <img src={`${apiUrl}/${pro.image}`} className="listproduct-product-icon" alt={pro.name} />
            <p>{pro.name}</p>
            <p>${pro.old_price}</p>
            <p>${pro.new_price}</p>
            <p>{pro.category}</p>
            <img
              onClick={() => remove_product(pro.id)}
              className='listproduct-remove-icon'
              src={cross_icon}
              alt="Remove"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
