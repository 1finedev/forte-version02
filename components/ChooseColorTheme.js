import { useState } from "react";

const ColorTheme = ({ toggle }) => {
  const [colors, _] = useState([
    { name: "bg-blue-500", value: "#3B82F6" },
    { name: "bg-red-500", value: "#EF4444" },
    { name: "bg-green-500", value: "#51C55E" },
    { name: "bg-black", value: "#000000" },
    { name: "bg-gray-500", value: "#6B7280" },
    { name: "bg-yellow-600", value: "#CA8A04" },
    { name: "bg-orange-600", value: "#EA580B" },
    { name: "bg-purple-500", value: "#A855F7" },
    { name: "bg-pink-500", value: "#F865F7" },
  ]);

  const handleMainColor = (color) => {
    document.documentElement.style.setProperty("--mainColor", color);
    localStorage.setItem("mainColor", color);
  };

  return (
    <div className="relative z-[100000] flex h-screen w-full items-center justify-center">
      <div
        className="absolute w-full h-full bg-black/90"
        onClick={() => toggle()}
      ></div>
      <div className="absolute w-[80vw] rounded-lg bg-white p-[20px] md:w-[50vw]">
        <p className="mb-[30px] text-center text-xl uppercase underline underline-offset-2">
          Choose color theme
        </p>

        <div className="grid grid-cols-3">
          {colors.map((color, index) => {
            return (
              <div
                key={index}
                className="mb-[20px] cursor-pointer justify-self-center"
                onClick={() => {
                  handleMainColor(color.value);
                  toggle();
                }}
              >
                <div
                  className={`h-[50px] w-[50px] rounded-full ${color.name} mb-[20px]`}
                ></div>
                <p className="mt-[-20px] text-center">
                  {color.name.split("-")[1].split("-")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorTheme;
