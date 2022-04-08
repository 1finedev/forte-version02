import { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const color = localStorage.getItem("mainColor");
    if (color !== null) {
      localStorage.setItem("nProgressColor", color);
    } else {
      localStorage.setItem("nProgressColor", "#3B82F6");
    }
    // clear local storage on component unmount
    return () => {
      localStorage.removeItem("nProgressColor");
    };
  }, []);

  return (
    <div className=" font-brand">
      <header className="flex justify-between bg-gray-100 px-[50px] py-[20px] font-heading text-lg font-medium">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <svg
            className="w-8 h-8 text-mainColor"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>FORTE-BRIDGE</h3>
        </div>
        <div className="flex w-[25vw] items-center justify-between">
          <div className="relative cursor-pointer group">
            <p>Services</p>
            <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
          </div>
          <div className="relative cursor-pointer group">
            <p>Tracking</p>
            <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
          </div>
          <div className="relative cursor-pointer group">
            <p>Locations</p>
            <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className="relative cursor-pointer group"
            onClick={() => router.push("/login")}
          >
            <p>Login</p>
            <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
          </div>
          <p
            className="cursor-pointer rounded-lg bg-mainColor px-[20px] py-[8px] text-white hover:animate-pulse"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </p>
        </div>
      </header>
    </div>
  );
};

export default Index;
