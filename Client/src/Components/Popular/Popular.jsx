import React, { useEffect, useState } from 'react'
import './Popular.css'
import data_product from '../Assets/data'
import Item from '../Item/Item'
import Productdisplay from '../Productdisplay/Productdisplay';
import Product from '../../Pages/Product';
import { Navigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const Popular = (props) => {
  
  const [popularProducts,setpopularProducts] = useState([]); 

  useEffect(()=>{
    fetch(`${apiUrl}/api/popular_in_women`)
    .then((resp)=>resp.json())
    .then((data)=>setpopularProducts(data));
  },[])

  const eventHandler = (itemId) => {
    return () => {
      navigate(`/product/${itemId}`); 
    };
  };

  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr/>
        <div className="popular-item">
            {popularProducts.map((item,i)=>(
                 <Item onClick={eventHandler(item._id)} key={i} id={item._id} name={item.name} image={`${apiUrl}/${item.image}`} new_price={item.new_price} old_price={item.old_price}/>
            ))}
        </div>
    </div>
  )
}

export default Popular
