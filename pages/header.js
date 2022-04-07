import Link from "next/link";

const Header = ({ setSideBarOpen, sideBarOpen }) => {
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-white  transition ease transform duration-300`;

  return (
    <div className="fixed z-[100] mt-[-10px] flex h-[8vh]  w-full items-center justify-between border-b bg-mainColor p-[20px] text-white">
      <button
        className="group flex h-12 w-12 flex-col items-center justify-center rounded"
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
      <h5 className="flex-1 text-center font-brand text-xl">
        <Link href="/dashboard">FORTE-BRIDGE LOGISTICS</Link>
      </h5>
    </div>
  );
};

export default Header;
