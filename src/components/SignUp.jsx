import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Spinner,
} from "@radix-ui/themes";
import { GiCheckMark } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { GrLinkPrevious } from "react-icons/gr";
import OtpInput from "react-otp-input";
import { Tabs } from "radix-ui";
import "./signup.css";
import signUpToggle from "../store/signUpToggle";
import loginOffcanvas from "../store/loginOffcanvas";
import cartToggle from "../store/cartToggle";
import userLoginStatus from "../store/userLoginStatus";
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';


function SignUp() {
  const {loginStatus,setLogin,setLoginStatus,refreshLoginStatus}= userLoginStatus();
  const {signUpStatus, signUpStatusToggle } = signUpToggle();
  const {cartStatus,cartStatusToggle}= cartToggle();
  const {loginOffcanvasStatus,loginOffcanvasStatusToggle}= loginOffcanvas();
  const [otp, setOtp] = useState("");
  const [emailVerified,setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyButtonContent,setVerifyButtonContent]=useState("verify");
  const [emailSet, setEmailSet] = useState(false);
  const [otpHide, setOtpHide] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  




  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();


  
  const onSubmit = async (data) =>{
    // if(emailVerified){
      
      await axios.post("https://admin.vmpscrackers.com/api/place-order",{cart,email:loginUserEmail,data})
      .then(response=>{
       console.log(response);

      // if(response.data.status=="success"){
      //   toast.success("Registered Successfully",{position: "bottom-center",autoClose: 2500});
      //   const loginCookie = new Cookies(null, { path: "/" });
      //     const userCookieEmail = data.email;
          
      //     if (loginCookie.get("userCookieEmail")) {
      //       return;
      //     } else {
      //       loginCookie.set("userCookieEmail", userCookieEmail);
      //     }
      //   setLogin(data.email);
      //   setLoginStatus();
      //   refreshLoginStatus();
      //     reset();
      //     signUpStatusToggle();
      //     cartStatusToggle();
      // }

     })
     .catch(error=>{
       console.error(error);
     })
    // }else{
    //   setEmailError("Please Verify your mail");
    // }
  }


  return (
    <div
      className="p-5 fixed top-16 w-100 right-0 h-full bg-black z-9"
      style={{ display: signUpStatus ? "block" : "none" }}
    >
      <div className="flex justify-between mb-2">
        <button onClick={signUpStatusToggle}>
          <GrLinkPrevious />
        </button>
        <h1 className="text-[20px] mb-5">Shipping Address</h1>
      </div>

      {/* <h1 className="text-[22px] mb-5">Contact Details</h1> */}
<form action="" onSubmit={handleSubmit(onSubmit)}>
        {/* <label htmlFor="name" className="pb-2 block">
        Name
        </label> */}
        <input placeholder="Name" id="name" {...register("name",{ required: true })} />
        {errors.name && <span className="error">Name is manditory</span>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            {/* <label htmlFor="phone1" className="pb-2 block">
              Phone Number
            </label> */}
            <input placeholder="Phone Number *" id="phone1" {...register("phone",{ required: true ,pattern:"/^\d{0,10}$/"})} />
          </div>
          <div>
            {/* <label htmlFor="phone2" className="pb-2 block">
              Alternate No
            </label> */}
            <input placeholder="Alternate Number" id="phone2" {...register("altphone")} />
          </div>
        </div>
        {errors.phone && <span className="error">* Phone Number is manditory</span>}

      <textarea id="address" placeholder="Delivery Address" {...register("address", { required: "Address is Manditory" })}></textarea>
      {errors.address && <span className="error">Address is required</span>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* <label htmlFor="pincode" className="pb-2 block">
            Pincode
          </label> */}
          <input id="pincode" type="number" placeholder="Delivery Pincode" {...register("pincode",{ required: true })} />
          {errors.pincode && <span className="error">Pincode is required</span>}
        </div>
        <div>
          {/* <label htmlFor="country" className="pb-2 block">
            State
          </label> */}
          <input id="State" type="text" placeholder="Delivery State" value="Tamil Nadu" {...register("state",{ required: true })} />
          {errors.State && <span className="error">State is required</span>}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 20,
          justifyContent: "center",
        }}
      >
       
        <button className="bg-green-600 px-3 py-2 green" style={{borderRadius:"none"}} type="submit">Confirm Order</button>
      </div>
      </form>
    </div>
  );
}

export default SignUp;
