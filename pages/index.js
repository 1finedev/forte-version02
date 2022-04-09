import { useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  //workaround to enable SSR work on pages that use getServerSideProps without causing useLayoutEffect errors
  const canUseDOM = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    // check local storage and decide if theme is set
    const color = localStorage.getItem("mainColor");
    if (color !== null) {
      localStorage.setItem("nProgressColor", color);
    }
    // set back to white on unmount
    return () => {
      localStorage.setItem("nProgressColor", "white");
    };
  }, [router]);

  return (
    <div className=" font-brand">
      <header className="flex justify-between border-b border-mainColor bg-gray-100 px-[50px] py-[20px] font-heading text-lg font-medium">
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
        <div className="hidden w-[30vw] items-center justify-between md:flex">
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
        <div className="items-center hidden space-x-4 md:flex ">
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
        <svg
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 cursor-pointer text-mainColor md:hidden"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </header>
      <div
        data-aos="slide"
        className={`${
          showMenu ? "block" : "hidden"
        } mx-auto flex w-[90vw] flex-col items-center space-y-[10px] rounded-b border border-t-0 border-mainColor bg-gray-100 pb-[20px] shadow-lg shadow-black/50 transition`}
      >
        <div className="group relative mt-[20px] w-full cursor-pointer text-center text-lg">
          <p>Services</p>
          <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[2px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
        </div>
        <div className="relative w-full text-lg text-center cursor-pointer group">
          <p>Tracking</p>
          <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[2px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
        </div>
        <div className="relative w-full text-lg text-center cursor-pointer group">
          <p>Locations</p>
          <span className="m-bottom-1 ease-bloop duration-400 absolute left-0 h-[2px] w-full scale-x-0 transform rounded-sm bg-mainColor transition group-hover:scale-x-100 "></span>
        </div>
        <div className="flex items-center space-x-12 pt-[10px]">
          <p
            className="cursor-pointer rounded-lg bg-mainColor px-[20px] py-[8px] text-white hover:animate-pulse"
            onClick={() => router.push("/login")}
          >
            Login{" "}
          </p>
          <p
            className="cursor-pointer rounded-lg bg-mainColor px-[20px] py-[8px] text-white hover:animate-pulse"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </p>
        </div>
      </div>
      {/* slideshow */}
      <div className=""></div>
    </div>
  );
};

export default Index;
