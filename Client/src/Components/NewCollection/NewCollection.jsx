import React, { useEffect, useState } from 'react';
import './NewCollection.css';
import Item from '../Item/Item';

const NewCollection = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
      .then(response => response.json())
      .then(data => setNewCollection(data))
      .catch(error => console.error('Error fetching new collections:', error));
  }, []);

  return (
    <div className='newcollection'>
      <h1>NEW COLLECTIONS</h1>
      <hr/>
      <div className="newcollection-items">
        {newCollection.map(item => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
}

export default NewCollection;
