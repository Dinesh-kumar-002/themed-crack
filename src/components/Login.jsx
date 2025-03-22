import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@radix-ui/themes";
import { GiCheckMark } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { GrLinkPrevious } from "react-icons/gr";
import OtpInput from "react-otp-input";
import "./login.css";
import signUpToggle from "../store/signUpToggle";
import loginOffcanvas from "../store/loginOffcanvas";
import cartToggle from "../store/cartToggle";
import Cookies from "universal-cookie";
import userLoginStatus from "../store/userLoginStatus";
import { toast } from "react-toastify";

function Login() {
  const { loginStatus, setLogin, setLoginStatus, refreshLoginStatus } =
    userLoginStatus();
  const { loginOffcanvasStatus, loginOffcanvasStatusToggle } = loginOffcanvas();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyButtonContent, setVerifyButtonContent] = useState("verify");
  const [emailSet, setEmailSet] = useState(false);
  const [otpHide, setOtpHide] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const { signUpStatus, signUpStatusToggle } = signUpToggle();
  const [countDownTime, setCountDownTime] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [isCounting, setIsCounting] = useState(false);

  const otpResponse = async () => {
    await axios
      .post("https://admin.vmpscrackers.com/api/verfiy-otp", {
        email,
        otp,
      })
      .then((otp) => {
        console.log(otp);
        setEmailSet(true);
        setOtpHide(true);

        // console.log("OTP success",otp.data.success);
        if (otp.data.success) {
          setOtpError(otp.data.message);
          setEmailError("");
          setLogin(email);
          const loginCookie = new Cookies(null, { path: "/" });
          const userCookieEmail = email;
          // console.log(userCookieEmail);

          if (!loginCookie.get("userCookieEmail")) {
            loginCookie.set("userCookieEmail", userCookieEmail);
          }
          setLoginStatus();
          setEmail("");
          refreshLoginStatus();
          setVerifyButtonContent(<GiCheckMark />);
          loginOffcanvasStatusToggle();
          toast.success("Login Successfull", {
            position: "bottom-center",
            autoClose: 2500,
          });
        }
        setOtpError(otp.data.message);
      })
      .catch((error) => {
        // console.log("Error verifying OTP:", error);
        setOtpError(error.response.data.message);
      });
  };

  useEffect(() => {
    if (otp.length == 6) {
      setOtpSent(true);
      setOtpError("please wait...");
      otpResponse();
    } else {
      setOtpError("");
      setOtpSent(false);
    }
  }, [otp]);

  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setCountDownTime((prevTime) => {
        if (prevTime.minutes === 0 && prevTime.seconds === 0) {
          clearInterval(interval);
          setIsCounting(false);
          setEmailSet(false);
          setVerifyButtonContent("Verify");
          return { minutes: 0, seconds: 0 };
        }

        const newSeconds = prevTime.seconds === 0 ? 59 : prevTime.seconds - 1;
        const newMinutes =
          prevTime.seconds === 0 ? prevTime.minutes - 1 : prevTime.minutes;

        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCounting]);

  async function sendVerifyCode() {
    setVerifyButtonContent(
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
    setOtp("");
    setOtpSent("");
    try {
      const response = await axios.post(
        "https://admin.vmpscrackers.com/api/login-verify",
        { email }
      );
      const responseData = response.data;

      if (responseData.success) {
        setCountDownTime({ minutes: 0, seconds: 10 });
        setIsCounting(true);
        setEmailSet(true);
        setOtpHide(false);
        setEmailError("");
      } else {
        setEmailSet(false);
        setEmailError(responseData.message);
      }
      // console.log(emailSet);
    } catch (error) {
      // console.log("Error verifying OTP:", error);
      setEmailError(
        error.response?.data?.message || "Something went wrong ,Try again"
      );
      setVerifyButtonContent("verify");
    }
  }

  function handleEntreEvent(event) {
    if (event.key === "Enter") {
      sendVerifyCode();
    }
  }

  return (
    <div>
      <div
        className="p-5 fixed top-18 w-100 right-0 h-[100vh] bg-red-50 z-9 overflow-y-scroll"
        style={{
          display: loginOffcanvasStatus ? "block" : "none",
          boxShadow: "black -5px 5px 45px -15px",
        }}
      >
        <div className="flex justify-between">
          <button
            onClick={loginOffcanvasStatusToggle}
            className="text-[20px] font-bold"
          >
            <GrLinkPrevious />
          </button>
          <h1 className="text-[20px] text-slate-600 font-bold">Login</h1>
        </div>

        <div className="mt-[50px]">
          <div className="flex shadow-sm">
            <input
              type="text"
              placeholder="Enter your mail ID"
              disabled={emailSet}
              className="block w-full !border-e-0 !rounded-tr-none bg-white !rounded-br-none shadow-sm p-3 rounded-l-sm h-[45px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleEntreEvent(e)}
            />
            <button
              type="button"
              disabled={emailSet}
              className={`p-3 bg-green-600 text-white disabled:opacity-50 h-[45px] font-bold rounded-r-sm`}
              onClick={sendVerifyCode}
            >
              {verifyButtonContent}
            </button>
          </div>
        </div>
        <span className="text-start !mb-0 text-red-500 font-bold mt-2 block">
          {emailError}
        </span>
        <p
          className="text-center mb-1 text-green-700 font-bold"
          style={{ display: isCounting ? "block" : "none" }}
        >
          OTP has been sent (Resend OTP in {countDownTime.minutes}:
          {countDownTime.seconds < 10
            ? `0${countDownTime.seconds}`
            : countDownTime.seconds}
          )
        </p>
        {otpHide ? (
          ""
        ) : (
          <div className="my-5">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              containerStyle={{ justifyContent: "center" }}
              renderSeparator={<span className="error">&nbsp;&nbsp;</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: "2.3rem",
                    textAlign: "center",
                    background: "white",
                    border: "1px solid gray",
                    height: "2.3rem",
                  }}
                  type="number"
                  className="rounded-sm"
                />
              )}
            />
            <p className="text-center text-green-700 font-bold my-3 text-[15px]">
              {otpSent ? "" : `Enter OTP (One Time Password)`}
            </p>
          </div>
        )}
        <p className="text-center text-green-700 text-[15px] font-bold">
          {otpError}
        </p>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          {/* <button className="bg-green-600 px-3 py-2 green" style={{borderRadius:"none"}} type="submit">Login</button> */}
        </div>
        {/* <p className="text-center mt-4 text-gray-500" onClick={()=>{signUpStatusToggle();loginOffcanvasStatusToggle()}}>Dont have account? / <span className="text-green-500">Register</span></p> */}
      </div>
    </div>
  );
}

export default Login;
