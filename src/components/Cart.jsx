import React, { useEffect, useState, useRef } from "react";import axios from "axios";
import cartStore from "../store/cartStore";
import productStore from "../store/productStore";
import categoryStore from "../store/categoryStore";
import { BsFillCartXFill } from "react-icons/bs";
import { GrLinkPrevious } from "react-icons/gr";
import signUpToggle from "../store/signUpToggle";
import profileToggle from "../store/profileToggle";
import loginOffcanvas from "../store/loginOffcanvas";
import cartToggle from "../store/cartToggle";
import userLoginStatus from "../store/userLoginStatus";
import { toast } from 'react-toastify';
import { Carousel, Fancybox } from '@fancyapps/ui/';
import '@fancyapps/ui/dist/carousel/carousel.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@fancyapps/ui/dist/carousel/carousel.thumbs.css';
import { Autoplay } from "@fancyapps/ui/dist/carousel/carousel.autoplay.esm.js";

function Cart() {
  const { signUpStatus,signUpStatusToggle } = signUpToggle();
  const {loginOffcanvasStatus,loginOffcanvasStatusToggle}=loginOffcanvas();
  const { categories, fetchCategories } = categoryStore();
  const { cartStatus, cartStatusToggle } = cartToggle();
  const {profileStatus,toggleProfileStatus}= profileToggle();
  const { products, fetchProducts } = productStore();
  const { cart, removeSingle, addToCart,clearCart } = cartStore();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const carouselRefs = useRef({});
  const [totalPriceDiscount, setTotalPriceDiscount] = useState(0);
  const {loginStatus,loginUserEmail} =userLoginStatus();
const initFancyboxAndCarousel = () => {
    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      idle: false,
      compact: false,
      dragToClose: false,
      animated: false,
      hideClass: false,
      Carousel: { 
        infinite: true,
        Autoplay: { timeout: 5000 },
      },
      Autoplay: {
        timeout: 5000,
      },
      Images: {
        zoom: false,
        Panzoom: { maxScale: 1.5 },
      },
      Toolbar: {
        absolute: true,
        display: { left: [], middle: [], right: ["close"] },
      },
      Thumbs: {
        type: "classic",
        Carousel: {
          Autoplay: { timeout: 5000 },
          axis: "x",
          slidesPerPage: 1,
          Navigation: false,
          center: true,
          fill: true,
          dragFree: true,
        },
      },
    });
  
    // Initialize Carousels
    Object.keys(carouselRefs.current).forEach((id) => {
      if (!carouselRefs.current[id]) return;
      const instance = new Carousel(
        carouselRefs.current[id],
        {
          infinite: true,
          Autoplay: { timeout: 5000 },
          Dots: false,
          Thumbs: {
            type: "classic",
            Carousel: {
              slidesPerPage: 1,
              Navigation: false,
              center: true,
              fill: true,
              dragFree: true,
            },
          },
        },
        { Autoplay } // Register Autoplay Plugin
      );
  
      // Start Autoplay manually if needed
      instance.plugins.Autoplay && instance.plugins.Autoplay.start();
    });
  };
   useEffect(() => {
      initFancyboxAndCarousel();
    }, [cart, products,cartItems]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Merge cart items with product details
    const updatedCart = cart.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      return product ? { ...cartItem, ...product } : null;
    }).filter(Boolean); // Remove null values

    setCartItems(updatedCart);
  }, [cart, products]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc - ((item.price * item.quantity) - (item.quantity * (item.mrp))) , 0);
    setTotalPrice(total);
    setTotalPriceDiscount(totalDiscount);
  }, [cartItems]);

    const checkout =async()=>{
      await axios.post('https://admin.vmpscrackers.com/api/place-order',{cart,email:loginUserEmail})
      .then(response =>{
        console.log(response.data);

        
        // if()
        // clearCart();
      })
      .catch(error=>console.log(error))
    }

  function handlePlaceOrder(){
    // console.log(loginStatus,loginUserEmail);
    
    if(loginStatus){
      // checkout();
      if(profileStatus){
        toggleProfileStatus(false);
      }
      signUpStatusToggle();
      cartStatusToggle();

    }
    else{
      cartStatusToggle();
      loginOffcanvasStatusToggle();
    }
  }
  return (
    <div className="fixed right-0 w-100 h-full bg-yellow-50 z-1 shadow-lg" style={{paddingBottom:"100px",display:cartStatus?"block":"none",boxShadow: "black -5px 5px 45px -15px"}}>

      <div className="flex justify-between py-5 px-5" style={{width:"100%"}}>
        <button className=" cursor-pointer text-black" onClick={()=>{cartStatusToggle()}}><GrLinkPrevious/></button>
        <h1  className="font-bold">Cart</h1>
      </div>
      <div style={{position:"sticky",top:"0px",overflowY:"scroll",height:"80vh",paddingBottom:'50px'}} className="px-2 pt-0">
      {(cartItems.length === 0) && 
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
      
      <BsFillCartXFill className="mb-4" size="70" />
      <p className="text-center"><b>Your Cart is empty</b></p>
      <div className="flex justify-center mt-4">
        <button className="bg-green-500 px-4 py-2 text-black" onClick={()=>cartStatusToggle()}><b>Purchase 🤩</b></button>
      </div>
      </div>
      }
      {categories
        .filter((category) => cartItems.some((product) => product.cat_id === category.id))
        .map((category) => {
          
          const categoryProducts = cartItems.filter((product) => product.cat_id === category.id);
          
          return (
            <div key={category.id} className="mb-5">
              {/* <h2 className="my-5 py-2 ps-5  border-t-1 border-b-1 border-soild border-white bg-sky-900"><b>{category.title}</b></h2> */}
              <h2 className="my-5"></h2>
              {/* <Grid className="list-view" columns={{ initial: "1"}} gap="3"> */}
              <div className="grid grid-cols-1 gap-4 list-view">
                {categoryProducts.map((product) => (
                  
                  <div key={product.id} className="product-card bg-yellow-100 p-0 border-1 border-slate-300" style={{boxShadow: "black 5px 5px 12px -10px" }}>
                 <div ref={(el) => (carouselRefs.current[product.id] = el)} className="f-carousel relative product-slide">
                 {(product.photo?.split(",") || []).map((item, index) => (
                          <div key={index} className="f-carousel__slide" data-fancybox={`gallery-${product.id}`} data-src={`https://admin.vmpscrackers.com/${item}`}>
                            <img src={`https://admin.vmpscrackers.com/${item}`} alt={product.title}
                      style={{ objectFit: "cover", height: "100px", width: "100px" }} />
                          </div>
                        ))}
                      </div>
                   
                    <div className="ms-2">
                      <p className="line-clamp-1" mt="2">
                        {product.title}
                      </p>
                      <div className="flex mt-2">
                        <span className="strike price">
                          MRP ₹{product.mrp}/-
                        </span>
                        <p className="real price font-bold">
                        ₹ {product.price}/-
                        </p>
                        <p className="sub-total text-white ">
                          ₹ {product.quantity * product.price}/-
                        </p>
                      </div>
                      <div className="flex mt-3 control">
                        <button type="button"
                        className="flex justify-center items-center rounded-r-none focus:outline-none text-white bg-red-800 font-medium rounded-sm text-sm px-3.5 focus:shadow-none shadow-none"
                          
                          onClick={() => {toast.warn(`${product.title} is removed from cart`,{position: "bottom-center",
                                                    autoClose: 1000});removeSingle(product.id)}}
                          disabled={product.quantity === 0}
                        >
                          -
                        </button>
                        <input
                         type="text" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-none bg-gray-50 text-xs"
                          value={product.quantity}
                          disabled={true}
                          style={{ width: "2rem", textAlign: "center" }}
                        />
                        <button type="button"
                          className="flex justify-center items-center rounded-l-none focus:outline-none text-white bg-green-800 hover:bg-green-800 font-medium rounded-sm text-sm px-3.5 focus:shadow-none shadow-none"
                          onClick={() => {toast.success(`${product.title} is added in cart`,{position: "bottom-center",
                            autoClose: 1000});addToCart(product.id, product.cat_id)}}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
        <div className="fixed bottom-0 w-100">
              <p className="text-center bg-white text-black py-1">You saved <span className="text-[13px] text-red-700">₹{totalPriceDiscount}/-</span></p>
              <div className="flex justify-between">
              <button className="bg-[#0090ff] text-white-900  font-bold w-50 border-r-2 text-[18px]" onClick={handlePlaceOrder}>Place order</button>
              <p className="bg-green-600 text-white-900 font-bold w-50 text-center" style={{lineHeight:"35px"}}>Total <span>₹{totalPrice}/-</span></p>

          </div>
        </div>
    </div>
  );
}

export default Cart;
