import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';
const apiUrl = import.meta.env.VITE_API_URL;

const ShopCategory = ({ banner, category }) => {
  const { all_product } = useContext(ShopContext);

  // Filter products by category
  const [filteredProducts, setFilteredProducts] = useState(all_product.filter(item => item.category === category));

  // State for sorting options dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for the selected sorting option
  const [sortOption, setSortOption] = useState('default');

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle sorting
  const handleSort = (option) => {
    let sortedProducts = [...filteredProducts];
    if (option === 'low-to-high') {
      sortedProducts.sort((a, b) => a.new_price - b.new_price);
    } else if (option === 'high-to-low') {
      sortedProducts.sort((a, b) => b.new_price - a.new_price);
    }

    setSortOption(option);
    setFilteredProducts(sortedProducts);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className='shop-category'>
      <img src={banner} alt="Banner" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{filteredProducts.length}</span> out of {all_product.length} Products
        </p>
        <div className="shopcategory-sort">
          Sort by 
          <button onClick={toggleDropdown}>
            <img src={dropdown_icon} alt="Sort Icon" />
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handleSort('low-to-high')}>Price: Low to High</li>
              <li onClick={() => handleSort('high-to-low')}>Price: High to Low</li>
            </ul>
          )}
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item, index) => (
          <Item
            key={index}
            id={item._id}
            name={item.name}
            image={`${apiUrl}/${item.image}`}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;
