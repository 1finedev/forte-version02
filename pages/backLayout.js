import { useState, useLayoutEffect, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChooseColorTheme } from "./../components";
import ScrollToTop from "react-scroll-to-top";

const Layout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-mainColor  transition ease transform duration-300`;
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [showColorTheme, setShowColorTheme] = useState(false);
  const toggle = () => setShowColorTheme(!showColorTheme);

  //workaround to enable SSR work on pages that use getServerSideProps without causing useLayoutEffect errors
  const canUseDOM = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    // check local storage and decide if theme is set
    const color = localStorage.getItem("mainColor");
    if (color === null) {
      setShowColorTheme(true);
    } else {
      document.documentElement.style.setProperty("--mainColor", color);
    }
  }, []);

  const [navLinks, setNavLinks] = useState([
    {
      title: "Dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      destination: "/management-console",
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
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
      ),
      destination: "/shipment-management",
    },
    {
      title: "Agents",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      destination: "/agents",
    },
    {
      title: "Finances",
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
      destination: "/finances",
    },
  ]);
  const [navHover, setNavHover] = useState(
    navLinks.findIndex((items) => items.destination === router.pathname) === -1
      ? 0
      : navLinks.findIndex((items) => items.destination === router.pathname)
  );

  return (
    <>
      <ScrollToTop smooth color="#6f00ff" />
      <div className="relative flex w-full h-screen overflow-x-hidden bg-white font-heading">
        <nav
          className={`${
            sideBarOpen ? "w-[200px]" : "w-[4vw]"
          } fixed h-screen bg-mainColor pl-[5px] text-white transition-all duration-700  ease-in-out`}
        >
          <div
            className="mb-[30px] flex cursor-pointer items-center space-x-[20px] p-[20px]"
            onClick={() => router.push("/")}
          >
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
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {sideBarOpen ? <h4 className="truncate">FORTE-BRIDGE</h4> : null}
          </div>
          {navLinks.map((link, index) => {
            return (
              <div
                // onMouseOver={() => {
                //   setNavHover(index);
                //   router.push(`${link.destination}`);
                // }}
                onClick={() => {
                  setNavHover(index);
                  router.push(`${link.destination}`);
                }}
                key={index}
                className={`relative  mb-[20px] flex cursor-pointer items-center space-x-[20px] p-[20px] transition-all ${
                  navHover === index
                    ? "rounded-tl-[30px] rounded-bl-[30px] bg-white  text-mainColor"
                    : null
                } font-bold`}
              >
                <span className="cursor-pointer">{link.icon}</span>
                <span
                  className={`${
                    navHover === index
                      ? "before:absolute before:right-0  before:top-[-50px] before:h-[50px] before:w-[50px] before:rounded-[50%] before:bg-transparent before:shadow-side after:absolute after:right-0 after:bottom-[-50px] after:h-[50px] after:w-[50px] after:rounded-[50%] after:bg-transparent after:shadow-sideBottom "
                      : null
                  }`}
                >
                  {sideBarOpen ? link.title : null}
                </span>
              </div>
            );
          })}
        </nav>
        <div
          className={`${
            sideBarOpen ? "ml-[200px]" : "ml-[4vw]"
          } w-full transition-all duration-700 ease-in-out`}
        >
          <div className="flex h-[60px] w-full items-center justify-between">
            <button
              className="flex flex-col items-center justify-center w-12 h-12 rounded group"
              onClick={() => {
                setSideBarOpen(!sideBarOpen);
              }}
            >
              <div
                className={`${genericHamburgerLine} ${
                  sideBarOpen
                    ? "translate-y-3 rotate-45 opacity-100 group-hover:opacity-100"
                    : "opacity-100 group-hover:opacity-100"
                }`}
              />
              <div
                className={`${genericHamburgerLine} ${
                  sideBarOpen
                    ? "opacity-0"
                    : "opacity-100 group-hover:opacity-100"
                }`}
              />
              <div
                className={`${genericHamburgerLine} ${
                  sideBarOpen
                    ? "-translate-y-3 -rotate-45 opacity-100 group-hover:opacity-100"
                    : "opacity-100 group-hover:opacity-100"
                }`}
              />
            </button>
            <div className="text-xl font-medium uppercase font-heading text-mainColor">
              <h2>{navLinks[navHover]?.title} Page</h2>
            </div>
            <div className="flex cursor-pointer space-x-[20px] text-black">
              <div
                className="cursor-pointer rounded-lg bg-mainColor px-[10px] py-[4px] text-white"
                onClick={toggle}
              >
                <p>Change colour theme</p>
              </div>
              <div className="flex space-x-[5px] text-brandText">
                <p> Signed In:</p>
                <p className="text-red-500">
                  {session?.user.fullname?.split(" ")?.[0]?.toUpperCase()}
                </p>
              </div>
              <div className="flex hover:text-mainColor hover:underline">
                <h5
                  onClick={async () => {
                    await signOut();
                    router.push("/login");
                  }}
                  className="pr-[5px]"
                >
                  Logout
                </h5>
                <svg
                  className="h-6 w-6 pr-[10px]"
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
              </div>
            </div>
          </div>
          <hr />
          {showColorTheme ? <ChooseColorTheme toggle={toggle} /> : null}
          <main
            className={`absolute top-[60px] px-[10px] text-black ${
              sideBarOpen
                ? "min-w-[calc(100vw-200px)]"
                : "min-w-[calc(100vw-4rem)]"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
export async function getServerSideProps(context) {
  const session = await getSession({ context });

  if (session?.user?.role === "agent") {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
    };
  }
  return {
    props: {},
  };
}
