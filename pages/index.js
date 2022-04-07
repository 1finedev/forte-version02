import Typewriter from "typewriter-effect";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Index = () => {
  return (
    <>
      <div className="min-h-[100vh] overflow-x-hidden scroll-smooth text-white">
        <div className="relative h-[560px] w-full">
          <div className="flex h-[10vh]  w-full justify-between bg-mainColor py-[30px] px-[100px] font-heading shadow-lg shadow-white/50 ">
            <div className="flex items-center">
              <p className="font-heading text-[20px]">FORTE-BRIDGE LOGISTICS</p>
            </div>
            <div className="flex items-center space-x-[35px]">
              <div className="group relative">
                <p className="cursor-pointer">Tracking</p>
                <span className="m-bottom-1 ease-bloop duration-600 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-white transition group-hover:scale-x-100 "></span>
              </div>
              <div className="group relative">
                <p className="cursor-pointer">Services</p>
                <span className="m-bottom-1 ease-bloop duration-600 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-white transition group-hover:scale-x-100 "></span>
              </div>
              <div className="group relative">
                <p className="cursor-pointer">Company</p>
                <span className="m-bottom-1 ease-bloop duration-600 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-white transition group-hover:scale-x-100 "></span>
              </div>
              <div className="group relative">
                <p className="cursor-pointer">Resources</p>
                <span className="m-bottom-1 ease-bloop duration-600 absolute left-0 h-[3px] w-full scale-x-0 transform rounded-sm bg-white transition group-hover:scale-x-100 "></span>
              </div>
              <p
                onClick={() => signIn()}
                className="cursor-pointer rounded bg-white py-[8px] px-[30px] text-mainColor hover:bg-gray-300 hover:text-mainColor "
              >
                Sign-in
              </p>
            </div>
          </div>
          <div className="absolute top-0 z-[-2]">
            <div className=" relative h-[100vh] w-[100vw] ">
              <Image
                className="h-full w-full transition-all duration-500 ease-in-out "
                layout="fill"
                objectFit="cover"
                src="/images/slide2.jpg"
                priority
                alt="slideshow"
              />
            </div>
          </div>
          <div className="bg-mainColor/30 absolute top-0 z-[-1] min-h-[100vh] w-[100vw]"></div>
        </div>
      </div>
    </>
  );
};

export default Index;

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
  };
}
