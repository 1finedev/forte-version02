import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-gray-200 pt-8 pb-6">
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 bottom-auto -mt-20 h-20 w-full overflow-hidden"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="fill-current text-gray-200"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left">
            <div className="w-full px-4 lg:w-6/12">
              <h4 className="text-3xl font-semibold">Let's keep in touch!</h4>
              <h5 className="mt-0 mb-2 text-lg text-gray-600">
                Find us on any of these platforms, we respond 1-2 business days.
              </h5>
              <div className="mt-6 mb-6 lg:mb-0">
                <button
                  className="align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal text-blue-400 shadow-lg outline-none focus:outline-none"
                  type="button"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button
                  className="align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal text-blue-600 shadow-lg outline-none focus:outline-none"
                  type="button"
                >
                  <i className="fab fa-facebook-square"></i>
                </button>
                <button
                  className="align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal text-pink-400 shadow-lg outline-none focus:outline-none"
                  type="button"
                >
                  <i className="fab fa-dribbble"></i>
                </button>
                <button
                  className="align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal text-gray-800 shadow-lg outline-none focus:outline-none"
                  type="button"
                >
                  <i className="fab fa-github"></i>
                </button>
              </div>
            </div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="items-top mb-6 flex flex-wrap">
                <div className="ml-auto w-full px-4 lg:w-4/12">
                  <span className="mb-2 block text-sm font-semibold uppercase text-gray-500">
                    Useful Links
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://www.creative-tim.com/presentation?ref=nr-footer"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://blog.creative-tim.com?ref=nr-footer"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://www.github.com/creativetimofficial?ref=nr-footer"
                      >
                        Github
                      </a>
                    </li>
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://www.creative-tim.com/bootstrap-themes/free?ref=nr-footer"
                      >
                        Free Products
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-full px-4 lg:w-4/12">
                  <span className="mb-2 block text-sm font-semibold uppercase text-gray-500">
                    Other Resources
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://github.com/creativetimofficial/notus-react/blob/main/LICENSE.md?ref=nr-footer"
                      >
                        MIT License
                      </a>
                    </li>
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://creative-tim.com/terms?ref=nr-footer"
                      >
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://creative-tim.com/privacy?ref=nr-footer"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="block pb-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                        href="https://creative-tim.com/contact-us?ref=nr-footer"
                      >
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-300" />
          <div className="flex flex-wrap items-center justify-center md:justify-between">
            <div className="mx-auto w-full px-4 text-center md:w-4/12">
              <div className="py-1 text-sm font-semibold text-gray-500">
                Copyright © {new Date().getFullYear()} Notus React by{" "}
                <a
                  href="https://www.creative-tim.com?ref=nr-footer"
                  className="text-gray-500 hover:text-gray-800"
                >
                  Creative Tim
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
