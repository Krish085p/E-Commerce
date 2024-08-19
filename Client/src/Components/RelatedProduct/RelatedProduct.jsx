import React, { useEffect, useState } from 'react';
import './RelatedProduct.css';
import Item from '../Item/Item';
const apiUrl = import.meta.env.VITE_API_URL;

const RelatedProduct = ({ category, proId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/relatedProduct?par=${category}&proId=${proId}`);
        const data = await response.json();
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [category, proId]);

  return (
    <div className='relatedproduct'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproduct-item">
        {relatedProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={`${apiUrl}/${item.image}`}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
