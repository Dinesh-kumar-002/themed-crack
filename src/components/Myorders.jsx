import React from 'react';
import { GrLinkPrevious } from "react-icons/gr";
import profileToggle from "../store/profileToggle.js";
import myorder from '../store/myorder.js';
function Myorders() {
    const {profileStatus,toggleProfileStatus}= profileToggle();
    const {orderStatus,toggleMyorderStatus}= myorder();
  return (
    <div>
    
      <div className="flex justify-between mb-2">
              <button onClick={() =>{toggleMyorderStatus(false);toggleProfileStatus(false);}}>
                <GrLinkPrevious />
              </button>
    <h1 className="text-[20px] mb-5">My Order</h1>
    </div>
</div>
  )
}

export default Myorders