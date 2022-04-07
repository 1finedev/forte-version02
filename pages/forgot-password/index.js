import { useState } from "react";
import { PageNav, Layout } from "./../../components";
import axios from "axios";
import { useAlert } from "react-alert";

const Index = () => {
  const alert = useAlert();
  const [mobile, setMobile] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    const res = await axios.post("/api/user/forgotPassword", {
      mobile,
    });

    if (res.data.status === "success") {
      setStatus("success");
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

        <div className="mx-auto mt-[30px] w-[85vw]">
          {status === "success" ? (
            <p className="text-center text-white">
              Kindly check your whatsapp chat for a link to reset your account
              password!
            </p>
          ) : (
            <>
              <p className="text-center text-white">
                Kindly enter the phone number associated with your account your
                account to reset your account password
              </p>
              <input
                type="tel"
                placeholder="e.g +905526157375"
                name="mobile"
                className="mt-[15px] ml-[15vw] rounded-lg border p-[8px]"
                onChange={(e) => setMobile(e.target.value)}
              />
              <div className="mx-auto mt-[10px] flex w-[150px] justify-center">
                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="mt-[30px] w-full cursor-pointer  rounded-lg bg-white p-[10px] text-center text-mainColor"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Index;
