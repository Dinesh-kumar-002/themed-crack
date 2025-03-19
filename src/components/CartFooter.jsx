// import React from 'react'

// import cartStore from '../store/cartStore'
// import cartToggle from '../store/cartToggle';

// function CartFooter() {
//   const { getTotalItems,getTotalPrice } = cartStore();
//   const { cartStatus,cartStatusToggle } = cartToggle();
  
//   return (
//     <>
//       <div className='flex md:hidden fixed bottom-0 z-8 w-full justify-between items-center p-3 w-full bg-gradient-to-r from-red-900 to-red-800'>
//         <button onClick={()=>cartStatusToggle()}> View Cart</button>
//         <p className="real price">you saved ₹200/-</p>
//         <p className="price">₹{getTotalPrice}/-</p>
//       </div>
    
//     </>
//   )
// }

// export default CartFooter;