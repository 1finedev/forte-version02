import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();

  const [sideBarOpen, setSideBarOpen] = useState(
    router.pathname === "/dashboard" ? true : false
  );

  return (
    <>
      <Header setSideBarOpen={setSideBarOpen} sideBarOpen={sideBarOpen} />
      <Sidebar setSideBarOpen={setSideBarOpen} sideBarOpen={sideBarOpen} />
      <div className="pt-[8vh] font-brand"> {children}</div>
    </>
  );
};

export default Layout;
