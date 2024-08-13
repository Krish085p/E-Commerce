import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import Productdisplay from '../Components/Productdisplay/Productdisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../Components/RelatedProduct/RelatedProduct';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  
  // Adjust to handle string ID if necessary
  const product = all_product.find((e) => e._id === productId);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <>
      <Breadcrum props={product} />
      <Productdisplay product={product} />
      <DescriptionBox />
      <RelatedProduct />    
    </>
  );
}

export default Product;
