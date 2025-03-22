import React, { useEffect, useState } from "react";
import settings from "../store/settings";
import settingOffcanvas from "../store/settingOffcanvas";
import { RiCloseFill } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaWhatsappSquare } from "react-icons/fa";
import { RiYoutubeFill } from "react-icons/ri";
import { FaSquareInstagram } from "react-icons/fa6";


const About = ({settingData}) => {
  const { settingsOffcanvasStatus, toggleSettingsOffcanvas } = settingOffcanvas();
  


  const real=settingData.phone?.split(",") || []

  return (
    <div
      className="about-container fixed top-[74px] right-0 w-100 h-full bg-red-50 z-1 shadow-lg p-4 overflow-y-scroll pb-[100px]"
      style={{ maxWidth: "350px",display:settingsOffcanvasStatus?"block":"none" }}
    >
        <div className="flex justify-start mb-5">
        <button
        className="text-[20px] font-bold"
          onClick={() => {
            toggleSettingsOffcanvas()
          }}
        >
          <RiCloseFill />
        </button>
        
      </div>
      <div className="flex justify-center items-center flex-col">

        <div className="relative mb-[66px]">
            <img src={`https://admin.vmpscrackers.com/${settingData?.photo}`} alt="" style={{width:"100%"}}/>
                <div className="absolute bottom-[-60px] left-[50%] translate-x-[-50%] text-white text-[20px]">
                    <img src={`https://admin.vmpscrackers.com/${settingData?.logo}`} alt="" style={{width:"130px"}} className="rounded-full border-gray-800 shadow-lg bg-red-800 p-3"  />

                </div>
        </div>

      <p className="text-red-800 font-bold">{settingData?.short_des}</p>
      <h2 className="text-[20px] font-bold mb-2 mt-[50px]"> Contact Us</h2>
      <p>{settingData?.address}</p>
      <p className="my-3">
      {real.map((p,index)=>{
          return (<a href={`tel:${p}`} className="font-bold" key={index}>{p} | </a>)
        })}

      </p>
        <p>{settingData?.email}</p>

        <div className="flex justify-content-center items-center mt-5">
            {/* <h3 className="text-[20px] font-bold mb-2 mt-[20px]">Soical media links</h3> */}
            {settingData.fb?
                <a href={settingData.fb} target="_blank" className="text-[30px] text-red-800 mx-1"><FaFacebookSquare /></a>:""
            }
            {settingData.twitter?
                <a href={settingData.twitter} target="_blank" className="text-[30px] text-red-800 mx-1"><FaSquareXTwitter /></a>:""
            }
            {settingData.instagram?
                <a href={settingData} target="_blank" className="text-[30px] text-red-800 mx-1"><FaSquareInstagram /></a>:""
            }
            {settingData.whatsapp?
                <a href={settingData.whatsapp} target="_blank" className="text-[30px] text-red-800 mx-1"><FaWhatsappSquare /></a>:""
            }
            {settingData.youtube?
                <a href={settingData.youtube} target="_blank" className="text-[30px] text-red-800 mx-1"><RiYoutubeFill /></a>:""
            }
        </div>

      </div>
      <h2 className="text-[20px] font-bold mb-2 mt-[10px] text-center">Location</h2>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15738.903508321015!2d77.852723!3d9.5325281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06d33bd93bef3d%3A0x4cf67bd83f365ce5!2sVMPS%20CRACKERS!5e0!3m2!1sen!2sin!4v1742635207176!5m2!1sen!2sin" width="100%" height="250" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
};

export default About;
