import Link from "next/link";
import { useRouter } from "next/router";

const Header = ({ setSideBarOpen, sideBarOpen }) => {
  const router = useRouter();

  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-white  transition ease transform duration-300`;

  return (
    <div className="fixed z-[100] flex h-[8vh] w-full  items-center justify-between border-b bg-mainColor p-[20px] text-white">
      <button
        className="flex flex-col items-center justify-center w-12 h-12 rounded group"
        disabled={router.pathname === "/login" || router.pathname === "/signup"}
        onClick={() => {
          setSideBarOpen(!sideBarOpen);
        }}
      >
        <div
          className={`${genericHamburgerLine} ${
            sideBarOpen
              ? "translate-y-3 rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            sideBarOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            sideBarOpen
              ? "-translate-y-3 -rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        />
      </button>
      <h5 className="flex-1 text-xl text-center font-brand">
        <Link href="/">FORTE-BRIDGE LOGISTICS</Link>
      </h5>
    </div>
  );
};

export default Header;
