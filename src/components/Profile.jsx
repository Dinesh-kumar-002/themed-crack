import React from "react";
import profileToggle from "../store/profileToggle.js";
// import Profiletab from "./Profiletab.jsx";
// import profile from "../store/profile.js";
import Myorders from "./Myorders.jsx";
import myorder from "../store/myorder.js";
import Address from "./Address.jsx";
import address from "../store/address.js";


function Profile() {
    const {orderStatus,toggleMyorderStatus}= myorder();
    // const {profileStatuss,toggleProfile}= profile();
    const {addressStatus,toggleAddressStatus}= address();
    const {profileStatus,toggleProfileStatus}= profileToggle();

    
  return (
    <div>
      <div
        className="p-5 fixed top-16 right-0 h-full w-100 z-9 bg-red-50"
        style={{ display: profileStatus ? "block" : "none" }}
      >
     
              {/* {profileStatuss ? <Profiletab /> : null} */}
              {orderStatus ? <Myorders /> : null}
              {addressStatus ? <Address /> : null}
        
      </div>
      </div>
  );
}

export default Profile;
