import React from "react";
import profileToggle from "../store/profileToggle.js";
import Myorders from "./Myorders.jsx";
import myorder from "../store/myorder.js";
import Address from "./Address.jsx";
import address from "../store/address.js";


function Profile() {
    const {orderStatus,toggleMyorderStatus}= myorder();
    const {addressStatus,toggleAddressStatus}= address();
    const {profileStatus,toggleProfileStatus}= profileToggle();

    
  return (
      <div
        className="px-5 pt-5 fixed top-15 right-0 h-full w-100 z-9 bg-red-50 overflow-y-scroll pb-[100px]"
        style={{ display: profileStatus ? "block" : "none" }}
      >
              {orderStatus ? <Myorders /> : null}
              {addressStatus ? <Address /> : null}
        
      </div>
  );
}

export default Profile;
