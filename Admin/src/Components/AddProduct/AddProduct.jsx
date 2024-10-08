import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from "../assets/upload_area.svg";
const apiUrl = import.meta.env.VITE_API_URL;

const AddProduct = () => {
   const [image, setImage] = useState(null);
   const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women", // Default category value
        new_price: "",
        old_price: ""
   });

   const imageHandler = (e) => {
        setImage(e.target.files[0]);
   };

   const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
   };

   const Add_Product = async () => {
     console.log(productDetails);
     let formData = new FormData();
     formData.append('product', image);

     try {
        // Upload image first
        const uploadResponse = await fetch(`${apiUrl}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error('Image upload failed');
        }

        const uploadData = await uploadResponse.json();

        if(uploadData.success){
            // Update productDetails with uploaded image URL
            let product = {
                ...productDetails,
                image: uploadData.image_url
            };

            // Add product details to database
            const addProductResponse = await fetch(`${apiUrl}/api/addproduct`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!addProductResponse.ok) {
                throw new Error('Product addition failed');
            }

            const addProductData = await addProductResponse.json();

            if (addProductData.success) {
                alert("Product Added");
                // Clear the form
                setProductDetails({
                    name: "",
                    image: "",
                    category: "women",
                    new_price: "",
                    old_price: ""
                });
                setImage(null);
            } else {
                alert("Failed to add product");
            }
        } else {
            alert("Failed to upload image");
        }
     } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred while adding the product. Please try again.');
     }
   };

  return (
    <div className='addproduct'>
        <div className="addproduct-itemfield">
            <p>Product title</p>
            <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here'/>
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler}  type="text" name="old_price" placeholder='Type here'/>
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here'/>
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name='category' className='addproduct-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='addproduct-thumbnail-img'/>
            </label>
            <input onChange={imageHandler} type='file' name='image' id='file-input' hidden/>
        </div>
        <button onClick={Add_Product} className='addproduct-btn'>
            ADD
        </button>
    </div>
  );
};

export default AddProduct;
