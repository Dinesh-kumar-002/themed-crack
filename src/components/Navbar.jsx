import React from 'react'
import {Flex, Text } from '@radix-ui/themes'
import { BsCart } from "react-icons/bs";
import cartStore from '../store/cartStore';
import cartToggle from "../store/cartToggle";
import DropDown from './DropDown';

function Navbar() {
  const { cartStatus, cartStatusToggle } = cartToggle();
  const {cart} = cartStore();
  return (
    <>
        <div className="flex justify-between p-5 sticky top-0 w-full z-10 bg-gradient-to-r from-red-900 to-red-800">
            <div className="logo">
                <h2 className='text-white font-bold'>VMPS Crackers</h2>
            </div>
            

            <div className='flex relative'>   
                
              
                <div className='flex' style={{fontSize:"20px",marginRight:"30px",position:'relative',cursor:"pointer"}} data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example" onClick={()=>{(!cartStatus)?cartStatusToggle():null}}>
                    <p className='absolute qnt-show'>{cart.length}</p>
                    <button className='text-white'><BsCart/></button>
                </div>

            <DropDown/>
            </div>

        </div>
        
    </>
  )
}

export default Navbar