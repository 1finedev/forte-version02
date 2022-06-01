import React from "react";
import Link from "next/link";

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="navbar-expand-lg fixed top-0 z-50 flex w-full flex-wrap items-center justify-between bg-white px-2 py-3 shadow">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
          <div className="relative flex w-full justify-between uppercase lg:static lg:block lg:w-auto lg:justify-start">
            Forte Bridge Logistics
          </div>
          <div
            className={
              "flex-grow items-center bg-white lg:flex lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex list-none flex-col lg:ml-auto lg:flex-row">
              <li className="flex items-center">{/* <IndexDropdown /> */}</li>
              <li className="flex items-center">
                <a
                  className="flex items-center px-3 py-4 text-xs font-bold uppercase text-gray-700 hover:text-gray-500 lg:py-2"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-react%2F%23%2F"
                  target="_blank"
                >
                  <i className="fab fa-facebook leading-lg text-lg text-gray-400 " />
                  <span className="ml-2 inline-block lg:hidden">Share</span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  className="flex items-center px-3 py-4 text-xs font-bold uppercase text-gray-700 hover:text-gray-500 lg:py-2"
                  href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-react%2F%23%2F&text=Start%20your%20development%20with%20a%20Free%20Tailwind%20CSS%20and%20React%20UI%20Kit%20and%20Admin.%20Let%20Notus%20React%20amaze%20you%20with%20its%20cool%20features%20and%20build%20tools%20and%20get%20your%20project%20to%20a%20whole%20new%20level.%20"
                  target="_blank"
                >
                  <i className="fab fa-twitter leading-lg text-lg text-gray-400 " />
                  <span className="ml-2 inline-block lg:hidden">Tweet</span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  className="flex items-center px-3 py-4 text-xs font-bold uppercase text-gray-700 hover:text-gray-500 lg:py-2"
                  href="https://github.com/creativetimofficial/notus-react?ref=nr-index-navbar"
                  target="_blank"
                >
                  <i className="fab fa-github leading-lg text-lg text-gray-400 " />
                  <span className="ml-2 inline-block lg:hidden">Star</span>
                </a>
              </li>

              <li className="flex items-center">
                <button
                  className="mb-3 ml-3 rounded bg-blue-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600 lg:mr-1 lg:mb-0"
                  type="button"
                >
                  <i className="fas fa-arrow-alt-circle-down"></i> Download
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
