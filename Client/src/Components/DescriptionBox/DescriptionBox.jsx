import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews</div>
        </div>
        <div className="descriptionbox-description">
            <p>E-commerce, or electronic commerce, refers to the buying and selling of goods and services over the internet. It has revolutionized the way businesses operate and consumers shop, offering unprecedented convenience and accessibility. With e-commerce platforms, customers can browse products, compare prices, read reviews, and make purchases from the comfort of their own homes. This digital marketplace has also enabled businesses to reach a global audience, reducing geographical barriers and opening new markets. Additionally, advancements in technology such as secure payment gateways, mobile commerce, and personalized shopping experiences have further fueled the growth of e-commerce, making it an integral part of the modern economy.</p>
            <p>E-commerce enables buying and selling goods and services online, offering convenience for consumers to shop anywhere and allowing businesses to reach a global market. It has revolutionized traditional shopping with secure payments, mobile accessibility, and personalized experiences, becoming essential in the modern economy.</p>
        </div>
    </div>
  )
}

export default DescriptionBox