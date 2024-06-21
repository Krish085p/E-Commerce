import React from 'react'

const Item = () => {
  return (
    <div className="item">
        <img src={props.img} alt=""/>
        <p>{props.name}</p>
        <div className="item-prices">
            
        </div>
    </div>
  )
}

export default Item