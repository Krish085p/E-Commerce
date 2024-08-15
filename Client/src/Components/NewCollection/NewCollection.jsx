import React, { useEffect, useState } from 'react';
import './NewCollection.css';
import Item from '../Item/Item';
const apiUrl = import.meta.env.VITE_API_URL;

const NewCollection = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/newcollections`)
      .then(response => response.json())
      .then(data => setNewCollection(data))
      .catch(error => console.error('Error fetching new collections:', error));
  }, []);

  const eventHandler = (itemId) => {
    return () => {
      navigate(`/product/${itemId}`); 
    };
  };

  return (
    <div className='newcollection'>
      <h1>NEW COLLECTIONS</h1>
      <hr/>
      <div className="newcollection-items">
        {newCollection.map(item => (
          <Item onClick = {eventHandler(item._id)}
            key={item.id}
            id={item._id}
            name={item.name}
            image={`${apiUrl}/${item.image}`}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
}

export default NewCollection;
