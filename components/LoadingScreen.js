import { useLottie } from "lottie-react";
import cargo from "../public/cargo";

// animation
const Animation = () => {
  const options = {
    animationData: cargo,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);

  return View;
};

const LoadingScreen = () => {
  return (
    <div className="justify-content flex h-screen w-screen items-center bg-mainColor">
      <div className="mx-auto w-[40vw]">
        <Animation />
      </div>
    </div>
  );
};

export default LoadingScreen;
