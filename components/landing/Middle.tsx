import Image from "next/image";
export default function Section2(){

    return (
      <>
        {" "}
        <div className="w-[92%] max-w-[1200px] flex flex-row min-h-[calc(100vh-80px)]  px-8 gap-1">
          {/* Left Card: How This Site Works */}
          <div className="flex-[1.5] bg-white  rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.03)]  flex flex-col items-center gap-3 border border-gray-50  mt-10 p-1">
            <h2 className="text-[32px] h-25 flex items-center justify-center font-bold text-black mb-5 text-center w-full ">
              How This Site Works?
            </h2>

            {/* Video Placeholder */}
            <div className="w-full max-w-[450px] h-[240px] rounded-[16px] border-[5px] border-black flex items-center justify-center relative overflow-hidden mb-12 shrink-0">
              {/* Image */}
              <Image
                src="/section1-preview.png"
                alt="Demo preview"
                fill
                className="object-cover"
              />

              {/* Fade overlay */}
              <div className="absolute inset-0 bg-white/60"></div>

              {/* Play button */}
              <div className="w-16 h-16 bg-gray-300/90 rounded-full flex items-center justify-center z-10 cursor-pointer shadow-md hover:bg-gray-300 transition-colors border-2 border-white">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <polygon points="6,4 20,12 6,20" fill="black" />
                </svg>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-6 w-[85%] mt-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex gap-6 items-center">
                  <div className="w-[95px] h-[95px] rounded-full border-[2px] border-[#FDE047] flex items-center justify-center text-[22px] font-bold text-black flex-shrink-0 bg-white">
                    {num}
                  </div>
                  <p className="text-[16px] text-gray-600 leading-[1.6] font-medium pt-1">
                    Lorem ipsum dolor sit amet consectetur. Porttitor eu cursus
                    arcu viverra eros at a sed dignissim. Nibh amet at nibh
                    pulvinar accumsan at quisque orci.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: FAQ */}
          <div className="flex-1 bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-10 flex flex-col border border-gray-50 ">
            <h2 className="text-[24px] font-bold text-black mb-6">
              Frequently asked questions:
            </h2>

            <div className="flex flex-col gap-5 px-2">
              {/* Expanded Item */}
              <div className="rounded-[16px] border-[1.5px] border-[#A7F3D0] p-6 flex flex-col gap-4 bg-white shadow-sm mx-2">
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-[18px] font-bold text-black">
                    Why to use this site?
                  </span>

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </div>

                <p className="text-[14px] text-gray-500 leading-[1.7]">
                  Lorem ipsum dolor sit amet consectetur. Sed vitae proin enim
                  amet consequat sit. Lorem convallis imperdiet at quis feugiat
                  est dignissim in mi. A odio purus feugiat volutpat tellus
                  felis amet vulputate urna.
                </p>
              </div>

              {/* Collapsed Items */}
              {[
                ["Will it help me in my", "FFCS"],
                ["Do I need to be a VIT student to use", "this site?"],
                ["Lorem ipsum dolor sit amet", "consectetur."],
              ].map((lines, i) => (
                <div
                  key={i}
                  className="rounded-[16px] border-[1.5px] border-[#A7F3D0] px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <span className="text-[15px] font-semibold text-black leading-tight">
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </span>

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ===== SPACER ===== */}
        <div className="h-[120px]" />
      </>
    );
}