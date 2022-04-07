import { useState } from "react";
import { useRouter } from "next/router";
import { PageNav, Layout } from "./../../components";
import axios from "axios";
import { useAlert } from "react-alert";

const ResetPassword = () => {
  const alert = useAlert();
  const router = useRouter();
  const { reset } = router.query;

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();

  const handleChangePassword = async () => {
    if (!password || !passwordConfirm || password !== passwordConfirm) {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Password is not the same as your confirm password
        </div>,
        {
          type: "error",
        }
      );
    }
    setLoading(true);
    const res = await axios.post("/api/user/resetPassword", {
      password,
      passwordConfirm,
      token: reset,
    });
    if (res.data.status === "success") {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          {res.data.message}
        </div>,
        {
          type: "success",
        }
      );
      router.push("/login");
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
  return (
    <div className="w-full h-screen bg-mainColor">
      <Layout>
        <PageNav />
        <p className="mt-[30px] text-center text-white">
          Kindly enter a new password for your account!
        </p>
        <div className="mt-[20px] w-[85vw] p-[15px]">
          <label htmlFor="password" className="text-white">
            New Password
          </label>
          <br />
          <input
            type="password"
            name="password"
            className="mt-[10px] w-full rounded-lg border p-[8px]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="passwordConfirm"
            className="mt-[20px] block text-white"
          >
            Confirm new Password
          </label>
          <br />
          <input
            type="password"
            name="passwordConfirm"
            className=" mt-[-15px] w-full rounded-lg border p-[8px]"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <div className="mx-auto flex w-[150px] justify-center">
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="mt-[30px] w-full cursor-pointer  rounded-lg bg-white p-[10px] text-center text-mainColor disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            Submit
          </button>
        </div>
      </Layout>
    </div>
  );
};

export default ResetPassword;
