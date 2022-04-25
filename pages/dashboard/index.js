import Shipment from "../../backend/shipmentModel";
import Image from "next/image";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { Layout, ChooseColorTheme } from "./../../components";
import { useRouter } from "next/router";
import axios from "axios";
import { useAlert } from "react-alert";

const AgentProfile = ({ statistics }) => {
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };
  const router = useRouter();
  const alert = useAlert();

  const photoRef = useRef();
  const { data: session, status } = useSession();
  const [photoPreview, setPhotoPreview] = useState(session.user?.photo);
  const [loading, setLoading] = useState(false);
  const [showEarning, setShowEarning] = useState(false);
  const toggleEarning = () => setShowEarning(!showEarning);
  const transformPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const [showColorTheme, setShowColorTheme] = useState(false);
  const toggle = () => setShowColorTheme(!showColorTheme);

  //workaround to enable SSR work on pages that use getServerSideProps without causing useLayoutEffect errors
  const canUseDOM = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    // check local storage and decide if theme is set
    const color = localStorage.getItem("mainColor");
    if (color === null && router && router.pathname === "/dashboard") {
      setShowColorTheme(true);
    } else {
      document.documentElement.style.setProperty("--mainColor", color);
    }
  }, []);

  useEffect(() => {
    if (session.user) {
      setPhotoPreview(session.user.photo);
    }
  }, [session]);

  useEffect(() => {
    reloadSession();
  }, []);

  const uploadImage = async (base64EncodedImage) => {
    if (!base64EncodedImage) return;
    const res = await axios.post(
      "/api/user/upload",
      { fileStr: base64EncodedImage },
      {
        withCredentials: true,
      }
    );

    const { status, user } = res.data;
    if (status === "success") {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Photo upload successfully!
        </div>,
        {
          type: "success",
        }
      );
      reloadSession();
      setPhotoPreview(user?.photo);
      setLoading(false);
    } else {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Photo upload failed!
        </div>,
        {
          type: "error",
        }
      );
      setPhotoPreview(null);
      setLoading(false);
    }
  };
  const handleImage = async (e) => {
    const file = e.target?.files[0];

    if (file.size > 10000000) {
      return alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Error: Photo must be less than 10mb, please try again!!!
        </div>,
        {
          type: "error",
        }
      );
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      uploadImage(reader.result);
    };
  };
  return (
    <Layout>
      <div className="relative flex min-h-[92vh] min-w-full flex-col  bg-gray-900 font-brand ">
        {showColorTheme ? (
          <div className="absolute inset-0 mt-[-8vh]">
            <ChooseColorTheme toggle={toggle} />
          </div>
        ) : null}

        <p className="bg-mainColor/70 p-[8px] text-center text-sm text-white">
          {session.user.fullname.split(" ")[0]} (
          {session.user.agentId.toUpperCase()}) - Welcome to your dashboard!
        </p>

        <div className="mb-[-40px] flex w-full flex-col  items-center justify-between rounded-bl-2xl rounded-br-2xl bg-white  pt-[4vh] pb-[5vh] text-sm text-black">
          <div className="relative flex h-[115px] w-[115px] items-center justify-center rounded-full bg-gray-300 shadow-2xl ring ring-offset-4">
            {photoPreview ? (
              <Image
                src={photoPreview}
                layout="fill"
                objectFit="cover"
                alt="Profile Photo"
                priority={photoPreview || session?.user?.photo ? true : false}
                className="h-[115px] w-[115px] rounded-full"
              />
            ) : (
              <>
                {loading ? (
                  <p className="animate-bounce animate-pulse">Please wait...</p>
                ) : (
                  <>
                    <div
                      onClick={() => photoRef.current.click()}
                      className="cursor-pointer"
                    >
                      <input
                        className="hidden"
                        ref={photoRef}
                        onChange={handleImage}
                        name="photo"
                        type="file"
                        accept="image/*"
                      />
                      <svg
                        className="w-8 h-8 mx-auto text-mainColor"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                      </svg>
                      <p className="mx-auto text-xs">Upload Photo</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <p className="text-bold mt-[15px] text-xl">
            {session.user.fullname} - ({session.user.agentId.toUpperCase()})
          </p>
          <div
            className="cursor-pointer rounded-lg bg-mainColor px-[10px] py-[4px] text-white"
            onClick={() => setShowColorTheme(!showColorTheme)}
          >
            <p>Change colour theme</p>
          </div>
        </div>
        <div className="shadow-mainColor/50 mx-auto mt-[10px] flex  w-[90vw] items-center justify-between  rounded-l-[40px] rounded-r-[40px] bg-mainColor px-[50px] pb-[10px] pt-[8px] text-white shadow-2xl">
          <div className="text-center">
            <p className="font-bold">{statistics[0]?.totalShipments || 0} </p>
            <p className="text-sm text-gray-300">Total Shipments</p>
          </div>
          <div className="h-[30px] w-[2px] bg-white text-transparent">|</div>
          <div className="text-center">
            <p className="font-bold">
              {(Math.round(statistics[0]?.totalKg * 10) / 10).toFixed(1) * 1 ||
                0}
            </p>
            <p className="text-sm text-gray-300">Total Kilograms</p>
          </div>
        </div>
        <div className="mt-[10px] p-[20px] text-white ">
          <p className="text-heading pb-[10px] text-[20px] ">Earnings</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-[5px]">
              <svg
                className="h-[50px] w-[50px] text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p
                  className={`font-bold ${
                    !showEarning && "blur"
                  } transition-all duration-500 ease-in-out`}
                  onClick={toggleEarning}
                >
                  ₦{transformPrice(session.user.wallet) || 0}
                </p>
                <p className="text-xs text-text-white">Wallet Balance</p>
              </div>
            </div>
            {!showEarning ? (
              <svg
                onClick={() => setShowEarning(!showEarning)}
                className="text-text-white mt-[-70px] h-8 w-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                onClick={() => setShowEarning(!showEarning)}
                className="text-text-white mt-[-70px] h-8  w-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
            <div className="flex  items-center space-x-[5px]">
              <svg
                className="h-[50px] w-[50px] text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p
                  className={`font-bold  transition-all duration-500 ease-in-out ${
                    !showEarning && "blur"
                  }`}
                  onClick={toggleEarning}
                >
                  ₦{transformPrice(session.user.balance) || 0}
                </p>
                <p className="text-xs text-text-white">Available Balance</p>
              </div>{" "}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-mainColor">
          <div className="mt-[10px] p-[20px] text-white">
            <p className="text-heading pb-[10px] text-[20px] text-white">
              Quick Links
            </p>
            <div className="grid items-center justify-center grid-cols-2 text-center">
              <p className="m-2 cursor-pointer  rounded-xl border border-mainColor bg-white  p-[10px] text-mainColor">
                <Link href="/shipments">Shipments</Link>
              </p>
              <p className="m-2 cursor-pointer rounded-xl border border-mainColor bg-white  p-[10px] text-mainColor">
                <Link href="/statistics">Statistics</Link>
              </p>
              <p className="m-2 cursor-pointer  rounded-xl border border-mainColor bg-white  p-[10px] text-mainColor">
                Track
              </p>
              <p className="m-2 cursor-pointer  rounded-xl border border-mainColor bg-white  p-[10px] text-mainColor">
                <Link href="/funds">Funds</Link>
              </p>
              <p className="m-2 cursor-pointer  rounded-xl border border-mainColor bg-white  p-[10px] text-mainColor">
                <Link href="/agentProfile">Profile</Link>
              </p>
              <p className="m-2 cursor-pointer  rounded-xl border border-mainColor bg-white  p-[10px] text-mainColor">
                Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  try {
    const mongoose = (await import("mongoose")).default;
    let idToSearch = mongoose.Types.ObjectId(session.user._id);

    const statistics = await Shipment.aggregate([
      {
        $match: { user: idToSearch },
      },
      {
        $group: {
          _id: null,
          totalKg: {
            $sum: "$weight",
          },
          totalShipments: {
            $sum: 1,
          },
        },
      },
    ]);
    return { props: { statistics } };
  } catch (error) {
    console.log(error);
    return { props: { statistics: [] } };
  }
}

export default AgentProfile;
AgentProfile.auth = true;
