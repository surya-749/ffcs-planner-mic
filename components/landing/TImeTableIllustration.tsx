import { useState } from "react";
export default function TimetableIllustration() {
  const [hiddenBox, setHiddenBox] = useState(null);
  const colors = [
    ["#A0C4FF", "#CAFFD0", "#E9D5FF", "#CAFFD0", "#FEF08A"],
    ["#A0C4FF", "#E9D5FF", "#FEF08A", "#E9D5FF", "#A0C4FF"],
    ["#A0C4FF", "#CAFFD0", "#CAFFD0", "#A0C4FF", "#E9D5FF"],
    ["#E9D5FF", "#FEF08A", "#E9D5FF", "#CAFFD0", "#FEF08A"],
  ];

  const bindings = [
    "#E9D5FF",
    "#A0C4FF",
    "#CAFFD0",
    "#FEF08A",
    "#C4B5FD",
    "#CAFFD0",
    "#E9D5FF",
  ];

  return (
    <div className="relative w-[420px] shrink-0 transform scale-[0.95] lg:scale-100 origin-right ">
      {/* Notebook Rings */}
      <div className="absolute -top-4 left-0 w-full flex justify-around px-6 z-10 ">
        {bindings.map((color, i) => (
          <div
            key={i}
            className="w-[20px] h-[40px] rounded-full shadow-md"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Notebook Top */}
      <div className="h-[60px] bg-gradient-to-b from-[#6B6B6B] to-[#505050] rounded-t-[20px] shadow-inner" />

      {/* Notebook Body */}
      <div className="bg-white rounded-b-[20px] border border-gray-200 p-6 shadow-[0px_10px_35px_rgba(0,0,0,0.08)] mx-8">
        <div className="grid grid-cols-5 gap-3">
          {colors.flat().map((color, i) => (
            <div
              key={i}
              onClick={() => setHiddenBox(i)}
              onMouseLeave={() => setHiddenBox(null)}
              className={`h-[42px] rounded-[10px] cursor-pointer transition-all duration-200 ${
                hiddenBox === i ? "opacity-0 scale-75" : "opacity-100"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
