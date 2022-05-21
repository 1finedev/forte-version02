import { useState, useEffect } from "react";
import { Layout } from "./../components";
import { useSession, getSession } from "next-auth/react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { useAlert } from "react-alert";

const AgentProfile = () => {
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };
  const alert = useAlert();
  const { data: session } = useSession();
  const services = [
    { label: "Female Wears (Adult)", value: "femaleWearsAdult" },
    { label: "Children Wears", value: "childrenWears" },
    { label: "Bags & Shoes", value: "bags&shoes" },
    { label: "Mens Wears (Adult)", value: "maleWearsAdult" },
    { label: "Furniture", value: "furniture" },
    { label: "Not listed", value: "other" },
  ];
  const [selectedServices, setSelectedServices] = useState(
    session?.user?.services || []
  );
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mobileUpdate, setMobileUpdate] = useState(false);
  const [timer, setTimer] = useState({});
  const [otp, setOtp] = useState();

  const updateProfile = async () => {
    setLoading(true);

    const res = await axios.post(`/api/user/updateProfile`, {
      ...userData,
    });

    if (res.data.status === "success" && res.data.mobile) {
      setMobileUpdate(true);
    } else if (res.data.status === "success" && !res.data.mobile) {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Profile updated successfully!
        </div>,
        {
          type: "success",
        }
      );
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
    await getSession();
    reloadSession();
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    const res = await axios.post(`/api/user/verifyMobile`, {
      mobile: userData.mobile,
      otp,
      changeMobile: true,
    });
    if (res.data.status === "success") {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          OTP verified successfully!
        </div>,
        {
          type: "success",
        }
      );
      setMobileUpdate(false);
      session.user = res.data.user;
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
    if (mobileUpdate) {
      let sMin = 5;
      let time = sMin * 60;
      let countdown = setInterval(update, 1000);
      function update() {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        sec = sec < 10 ? "0" + sec : sec;
        setTimer({ min, sec });
        time--;
        min == 0 && sec == 0 ? clearInterval(countdown) : countdown;
      }
    }
    if (loading && mobileUpdate) {
      clearInterval(countdown);
    }
    // return () => {
    //   clearInterval(countdown);
    // };
  }, [mobileUpdate, loading]);

  useEffect(() => {
    setUserData({ ...userData, services: selectedServices });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServices]);

  return (
    <Layout>
      <div className="min-h-screen w-full bg-mainColor pt-[40px]">
        {mobileUpdate ? (
          <div>
            <p className="p-[20px] text-center text-lg text-white">
              Please enter the code sent to your Whatsapp to verify your number
              change
            </p>
            <div className="flex flex-col items-center">
              <input
                className={`mb-2 w-[160px] rounded-lg border bg-gray-700 px-[15px] py-[10px] text-2xl text-white shadow-md  focus:outline-0`}
                type="number"
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
            </div>
            <div className="mt-[20px] flex justify-center">
              <button
                className="disabled:cursor-disabled mt-[20px] mb-[50px] rounded-lg bg-white px-[50px] py-[10px] text-mainColor shadow-md disabled:bg-gray-500"
                type="submit"
                disabled={loading || !otp}
                onClick={verifyOtp}
              >
                {loading ? "Please wait..." : "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-[20px] text-center font-heading text-lg uppercase text-white underline underline-offset-2">
              Profile Information
            </p>
            <div className="p-[20px]">
              <p className="mb-[5px] text-lg text-white">Full Name</p>
              <input
                type="text"
                className="mb-[20px] h-[40px] w-full rounded-lg bg-gray-300 pl-[8px] text-mainColor focus:outline-none"
                defaultValue={session?.user?.fullname}
                onChange={(e) =>
                  setUserData({ ...userData, fullname: e.target.value })
                }
              />
              <p className="mb-[5px] text-lg text-white">Agent Code</p>
              <input
                type="text"
                className="mb-[20px] h-[40px] w-full rounded-lg bg-gray-300 pl-[8px] text-mainColor"
                defaultValue={session?.user?.agentId.toUpperCase()}
                disabled
              />
              <p className="mb-[5px] text-lg text-white">Phone Number</p>
              <input
                type="text"
                className="mb-[20px] h-[40px] w-full rounded-lg bg-gray-300 pl-[8px] text-mainColor focus:outline-none"
                defaultValue={`+${session?.user?.mobile}`}
                onChange={(e) =>
                  setUserData({ ...userData, mobile: e.target.value })
                }
              />
              <p className="mb-[5px] text-lg text-white">Bank Name</p>
              <input
                type="text"
                className="mb-[20px] h-[40px] w-full rounded-lg bg-gray-300 pl-[8px] text-mainColor focus:outline-none"
                defaultValue={`${session?.user?.bankName}`}
                onChange={(e) =>
                  setUserData({ ...userData, bankName: e.target.value })
                }
              />
              <p className="mb-[5px] text-lg text-white">Account number</p>
              <input
                type="text"
                className="mb-[20px] h-[40px] w-full rounded-lg bg-gray-300 pl-[8px] text-mainColor focus:outline-none"
                defaultValue={`${session?.user?.accountNumber}`}
                onChange={(e) =>
                  setUserData({ ...userData, accountNumber: e.target.value })
                }
              />
              <p className="mb-[5px] text-lg text-white">
                Choose services you offer
              </p>
              <div className="">
                <MultiSelect
                  options={services}
                  value={selectedServices}
                  onChange={setSelectedServices}
                  labelledBy="Choose all that apply"
                  shouldToggleOnHover={true}
                  className=" text-mainColor"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="mt-[20px] mb-[50px] rounded-lg bg-white px-[50px] py-[10px] text-mainColor shadow-md"
                type="submit"
                disabled={loading}
                onClick={updateProfile}
              >
                {loading ? "Please wait..." : "Update Profile"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AgentProfile;
AgentProfile.auth = true;
