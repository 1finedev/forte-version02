import { Layout } from "../components";
import { useState } from "react";
import { useAlert } from "react-alert";
import { useRouter } from "next/router";
import axios from "axios";

const Signup = () => {
  // alert hook
  const alert = useAlert();
  const router = useRouter();

  // state
  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState();
  const [fullname, setFullname] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [agentId, setagentId] = useState();

  const [loading, setLoading] = useState(false);

  //   submit logic
  const onSubmit = async () => {
    const Joi = (await import("joi")).default;
    //   input validation
    const myCustomJoi = Joi.extend(require("joi-phone-number"));

    const schema = Joi.object({
      fullname: Joi.string().required().min(10).max(28),
      agentId: Joi.string().required().min(2),
      mobile: myCustomJoi.string().phoneNumber().required().min(13),
      password: Joi.string().min(6).required(),
      passwordConfirm: Joi.ref("password"),
    }).with("password", "passwordConfirm");

    const { error, value } = await schema.validate({
      mobile: mobile?.replace(/\s/g, "").trim(),
      password: password.trim(),
      fullname: fullname.trim(),
      agentId: agentId.toLowerCase().replace(/\s/g, "").trim(),
      passwordConfirm: passwordConfirm.trim(),
    });

    if (!agentId.toLowerCase().includes("fb")) {
      alert.show(
        <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
          Agent code invalid!
        </div>,
        {
          type: "error",
        }
      );
    }
    if (error) {
      alert.show(
        <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
          {error.details[0].message}
        </div>,
        {
          type: "error",
        }
      );
    } else {
      setLoading(true);
      try {
        const res = await axios.post("/api/auth/signup", {
          value,
        });

        const { error, status, msg } = res.data;

        if (error) {
          alert.show(
            <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
              {error}
            </div>,
            {
              type: "error",
            }
          );
        }
        if (status === "success") {
          alert.show(
            <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
              {`${msg}! Redirecting...`}
            </div>,
            {
              type: "success",
            }
          );

          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (error) {
        alert.show(
          <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
            {error.message}
          </div>,
          {
            type: "error",
          }
        );
      }
      let error;
      setLoading(false);
      if (error) {
        alert.show(
          <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
            {error}
          </div>,
          {
            type: "error",
          }
        );
      }
    }
  };

  return (
    <Layout>
      <div className="relative flex min-h-[100vh] w-full items-center justify-center bg-mainColor font-brand text-black">
        <div className="relative mt-[-8vh] flex  flex-col items-center justify-center">
          <div className="absolute w-[80vw] rounded-2xl border border-mainColor  bg-white  p-[20px] shadow-2xl md:w-[30vw] ">
            <h6 className="mt-[10px] text-center font-brand text-xl uppercase text-black">
              Become an agent
            </h6>
            <form>
              <div className="mt-[10px] flex flex-col ">
                <label htmlFor="fullname">
                  Fullname<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Surname & firstname"
                  name="fullname"
                  className="mt-[8px] rounded-lg border bg-[#E8F0FE] p-[8px]"
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="mt-[10px] flex flex-col ">
                <label htmlFor="mobile">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="905526157375"
                  name="mobile"
                  className="mt-[8px] rounded-lg border bg-[#E8F0FE] p-[8px]"
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="mt-[10px] flex flex-col ">
                <label htmlFor="agentId">
                  Agent Code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="example - e6855"
                  name="agentId"
                  className="mt-[8px] rounded-lg border bg-[#E8F0FE] p-[8px]"
                  onChange={(e) => setagentId(e.target.value)}
                />
              </div>
              <div className="mt-[10px] flex flex-col ">
                <label htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="mt-[8px] rounded-lg border bg-[#E8F0FE] p-[8px]"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-[10px] flex flex-col ">
                <label htmlFor="passwordConfirm">
                  Password Confirm<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  className="mt-[8px] rounded-lg border bg-[#E8F0FE] p-[8px]"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="mt-[20px] flex w-full justify-center rounded-lg bg-gray-500 p-[10px] text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    ></path>
                  </svg>
                </div>
              ) : (
                <h6
                  onClick={onSubmit}
                  className="mt-[20px] w-full cursor-pointer  rounded-lg bg-mainColor p-[10px] text-center text-white"
                >
                  Signup
                </h6>
              )}
            </form>
            <p className="mt-[15px]">
              Already have an account?{" "}
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Login!
              </span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
