import React,{useEffect} from "react";
import { Flex, Text } from "@radix-ui/themes";
import { BsCart } from "react-icons/bs";
import cartStore from "../store/cartStore";
import cartToggle from "../store/cartToggle";
import DropDown from "./DropDown";
import { CgMenuGridR } from "react-icons/cg";
import settingOffcanvas from "../store/settingOffcanvas";


import { RiCloseFill } from "react-icons/ri";
import settings from "../store/settings";

function Navbar() {
  const {fetchData,settingData} = settings();
  useEffect(()=>{
    fetchData();

  },[])
  const { settingsOffcanvasStatus, toggleSettingsOffcanvas } = settingOffcanvas();
  const { cartStatus, cartStatusToggle } = cartToggle();
  const { cart } = cartStore();
  return (
    <>

     
      <div className="flex justify-between p-5 sticky top-0 w-full z-1 bg-gradient-to-r from-red-900 to-red-800">
        
        <div className="logo">
          
            <img src={`https://admin.vmpscrackers.com/${settingData.logo}`} alt="" style={{width:"110px",rotate:"19deg"}} className="absolute left-[20px] top-[-10px]"/>
         
        </div>
        <div className="flex relative">
          <div
            className="flex"
            style={{
              fontSize: "20px",
              marginRight: "30px",
              position: "relative",
              cursor: "pointer",
            }}
            data-drawer-target="drawer-example"
            data-drawer-show="drawer-example"
            aria-controls="drawer-example"
            onClick={() => {
              if(!cartStatus){
                cartStatusToggle();
                if(settingsOffcanvasStatus){
                  toggleSettingsOffcanvas();
                }
              }
               
            }}
          >
            <p className="absolute qnt-show">{cart.length}</p>
            <button className="text-white">
              <BsCart />
            </button>
          </div>
          <DropDown />
          <button className="text-white text-[30px]" onClick={()=>{
            if(cartStatus){
              cartStatusToggle();
            }

            toggleSettingsOffcanvas()
            
            
          }}>
            {
              settingsOffcanvasStatus?
              <RiCloseFill />:<CgMenuGridR />
            }
          </button>
      
        </div>
      </div>
      
    </>
  );
}

export default Navbar;
