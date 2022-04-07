import Link from "next/link";
import { Layout } from "../components";
const ErrorPage = () => {
  return (
    <Layout>
      <div className="mt-[-8vh] flex h-screen w-screen items-center justify-center bg-mainColor">
        <div className="rounded-md bg-white py-20 px-[20px] shadow-xl md:px-40 ">
          <div className="flex flex-col items-center">
            <h1 className="mb-[20px] text-5xl font-bold text-brandPurple">
              500
            </h1>
            <h6 className="mb-2 text-center text-2xl font-bold text-gray-800 md:text-3xl">
              <span className="text-red-500">Oops!</span> An error occurred on
              the server!
            </h6>

            <p className="mb-8 text-center text-gray-500 md:text-lg">
              Notify the developer if you see this page!
            </p>

            <p className="cursor-pointer bg-blue-100 px-6 py-2 text-sm font-semibold text-blue-800">
              <Link href="/">Go home</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
