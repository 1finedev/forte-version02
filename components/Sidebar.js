import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
  const router = useRouter();
  const [sideBarExpand, setSidebarExpand] = useState(false);
  const [active, setActive] = useState(router.pathname);
  const [sideBarData, setSideBarData] = useState([
    {
      title: "Home",
      icon: (
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
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      destination: "/dashboard",
    },
    {
      title: "Shipments",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path
            fillRule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      destination: "/shipments",
    },
    {
      title: "Statistics",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
      ),
      destination: "/statistics",
    },
    {
      title: "Wallet",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      destination: "/funds",
    },
    {
      title: "Profile",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
      ),
      destination: "/agentProfile",
    },
    {
      title: "Logout",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      destination: "/logout",
    },
  ]);

  useEffect(() => {
    if (active !== "/logout" && router.pathname !== active) {
      router.push(active);
    }
    if (active === "/logout") {
      signOut().then(() => router.push("/"));
    }
  }, [active, router]);

  return (
    <>
      <div className="relative">
        <div
          data-aos="slide-right"
          className="text-brandFaded fixed z-50 flex h-[100vh] flex-col items-center justify-center text-sm transition-all duration-700"
        >
          {sideBarOpen && (
            <div className="border-tl-full relative mt-[10vh] flex h-[60%] flex-col items-center justify-center space-y-[40px] rounded-full border-r-2 bg-white/90 px-[15px] text-mainColor  shadow-2xl shadow-mainColor">
              {sideBarData.map((nav, index) => {
                return (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      setActive(nav.destination);
                    }}
                    key={index}
                  >
                    <p
                      className={
                        active === nav.destination ? "text-mainColor" : ""
                      }
                    >
                      {nav.icon}
                    </p>
                    {active === nav.destination && !sideBarExpand && (
                      <span className="absolute top-[-3px] right-[-15px] h-8 w-[3px] bg-mainColor"></span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {sideBarOpen && (
          <div
            className="absolute z-40 min-h-[100vh] w-full bg-black opacity-40"
            onClick={() => {
              setSideBarOpen(!sideBarOpen);
            }}
          ></div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
