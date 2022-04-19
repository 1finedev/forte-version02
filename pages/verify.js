import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { getSession } from "next-auth/react";

const Verify = () => {
  const alert = useAlert();
  const router = useRouter();
  const [timer, setTimer] = useState({});
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  const verifyOtp = async () => {
    setLoading(true);
    const res = await axios.post(`/api/user/verifyMobile`, {
      verifyAccount: true,
      otp,
    });
    if (res.data.status === "success") {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Account verified successfully! Log in again to continue.
        </div>,
        {
          type: "success",
        }
      );
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } else {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          {res.data.error}
        </div>,
        {
          type: "error",
        }
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    let sMin = 10;
    let time = sMin * 60;
    let countdown = setInterval(update, 1000);
    function update() {
      let min = Math.floor(time / 60);
      let sec = time % 60;
      sec = sec < 10 ? "0" + sec : sec;
      setTimer({ min, sec });
      time--;
      min == 0 && sec == 0
        ? setExpired(true) && clearInterval(countdown)
        : countdown;
    }

    return () => {
      clearInterval(countdown);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-mainColor pt-[80px]">
      <p className="p-[20px] text-center text-lg text-white">
        Please enter the code sent to your Whatsapp to verify your account
      </p>
      <div className="mt-[30px] flex flex-col items-center">
        <input
          className={`mb-2 w-[160px] rounded-lg border bg-gray-700 px-[15px] py-[10px] text-2xl text-white shadow-md  focus:outline-0`}
          type="tel"
          placeholder=""
          pattern="[0-9]*"
          inputMode="numeric"
          onInput={(e) => setOtp(e.target.value)}
        />
        <p className="text-xs text-gray-300">
          Code expires in{" "}
          <span className="text-red-500">
            {timer.min}:{timer.sec}
          </span>
        </p>

        {expired && (
          <p
            onClick={() => router.push("/login")}
            className="mt-[20px] cursor-pointer bg-blue-100 px-6 py-2 text-sm font-semibold text-blue-800"
          >
            Code expired, click here to resend
          </p>
        )}
      </div>
      <div className="mt-[20px] flex justify-center">
        <button
          className="disabled:cursor-disabled mt-[20px] mb-[50px] rounded-lg bg-mainColor px-[50px] py-[10px] text-white shadow-md disabled:bg-gray-500"
          type="submit"
          disabled={loading || !otp}
          onClick={verifyOtp}
        >
          {loading ? "Please wait..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Verify;
Verify.auth = true;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session?.user?.verified === true) {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
