import { getSession } from "next-auth/react";
import { useState } from "react";
import { useAlert } from "react-alert";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Particle = dynamic(() => import("../components/Particle"));
import { Layout } from "../components";

const Login = () => {
  // alert hook
  const alert = useAlert();
  const router = useRouter();

  // animation state
  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  //   submit logic
  const onSubmit = async () => {
    const Joi = (await import("joi")).default;

    //   input validation
    const myCustomJoi = Joi.extend(require("joi-phone-number"));

    const schema = Joi.object({
      mobile: myCustomJoi.string().phoneNumber().required().min(13),
      password: Joi.string().min(6).required(),
    });
    const { error } = await schema.validate({
      mobile: mobile,
      password: password,
    });

    if (error) {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          {error.details[0].message}
        </div>,
        {
          type: "error",
        }
      );
    } else {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        mobile: mobile.replace(/\s/g, "").trim() * 1,
        password: password.trim(),
      });
      setLoading(false);
      if (res.error) {
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            {res.error}
          </div>,
          {
            type: "error",
          }
        );
      } else {
        router.push("/profile");
      }
    }
  };

  return (
    <Layout>
      <div
        className={`relative flex min-h-[100vh] w-full flex-col items-center justify-center font-brand text-black`}
      >
        <div className="relative mt-[-10vh] flex h-[90vh]  w-full flex-col items-center justify-center">
          <div className="absolute rounded-2xl bg-white p-[40px] shadow-2xl xl:px-[55px]">
            <h6 className="mt-[10px] text-center font-brand text-xl  uppercase text-black">
              Welcome Back!
            </h6>

            <form>
              <div className="mt-[20px] flex flex-col ">
                <label htmlFor="mobile">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+905526157375"
                  name="mobile"
                  className="mt-[10px] rounded-lg border p-[8px]"
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="mt-[20px] flex flex-col ">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="mt-[10px] rounded-lg border p-[8px]"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="mt-[30px] flex w-full cursor-pointer justify-center rounded-lg bg-gray-500 p-[10px] text-white">
                  <svg
                    className="h-6 w-6"
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
                  className="mt-[30px] w-full cursor-pointer  rounded-lg bg-mainColor p-[10px] text-center text-white"
                >
                  Login
                </h6>
              )}
            </form>
            <p
              onClick={() => router.push("/forgot-password")}
              className="mt-[8px] cursor-pointer text-right text-red-500 underline "
            >
              Forgot your password?
            </p>
            <p className="mt-[15px]">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="cursor-pointer text-red-500"
              >
                Sign up!
              </span>
            </p>
          </div>
        </div>
        <Particle />
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
    };
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Login;
