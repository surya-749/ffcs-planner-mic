import Image from "next/image";
export default function FooterSection() {
  return (
    <div className="w-full flex flex-col relative z-0 mb-[60px]">
      {/* Dark Header */}
      <div className="w-full h-[96px] bg-[#5B5B5B] rounded-t-[28px] relative z-10 shadow-md">
        {/* Bindings */}
        <div className="absolute top-[-25px] left-0 w-full flex justify-around px-8 md:px-20 z-20">
          {[
            "#E9D5FF",
            "#A0C4FF",
            "#CAFFD0",
            "#FDFFB6",
            "#C4B5FD",
            "#CAFFD0",
            "#E9D5FF",
          ].map((c, i) => (
            <div
              key={i}
              className="w-[42px] h-[83px] rounded-[14px] shadow-sm border border-black/5"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="w-full h-[280px] bg-[#F3F4F6] border-x border-b border-gray-200 p-6 rounded-b-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* GRID LAYOUT */}
        <div className="grid grid-cols-3 grid-rows-[1fr_auto] gap-3 h-full">
          {/* FFCS (left column full height) */}
          <div className="row-span-2 bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col justify-center">
            <h3 className="text-[55px] font-black tracking-widest uppercase mb-2">
              FFCS
            </h3>

            <p className="text-[25px] leading-[1.6]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
              turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
              nec fringilla accumsan.
            </p>
          </div>

          {/* BUTTON GRID */}
          <div className="bg-white border border-gray-100 rounded-[20px] p-4 shadow-sm grid grid-cols-2 grid-rows-2 gap-1">
            <button className="bg-[#A0C4FF] rounded-[12px] flex items-center justify-center px-4 py-2 gap-3 hover:opacity-90">
              <div className="w-20 h-20 relative rounded flex items-center justify-center ">
                <Image
                  src="/calendar_icon2.png"
                  alt="calendar"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-[25px] font-bold leading-tight">
                Generate <br /> timetable
              </span>
            </button>
            <button className="bg-[#BFA5EE] rounded-[12px] flex items-center justify-center px-4 py-2 gap-3 hover:opacity-90">
              <div className="w-20 h-20 relative rounded flex items-center justify-center ">
                <Image
                  src="/Clock.png"
                  alt="calendar"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-[22px] font-bold leading-tight">
                View Saved <br /> timetables
              </span>
            </button>
            <button className="bg-[#B8EDC0] rounded-[12px] flex items-center justify-center px-4 py-2 gap-3 hover:opacity-90">
              <div className="w-25 h-10 relative rounded flex items-center justify-center ">
                <Image
                  src="/slot_icon.png"
                  alt="calendar"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-[25px] font-bold leading-tight">
                View Slots
              </span>
            </button>
            <button className="bg-[#F9EEAA] rounded-[12px] flex items-center justify-center px-4 py-2 gap-3 hover:opacity-90">
              <div className="w-10 h-10 relative rounded flex items-center justify-center ">
                <Image
                  src="/team_icon.png"
                  alt="calendar"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-[25px] font-bold leading-tight">
                View Team
              </span>
            </button>
          </div>

          {/* LETTER BOX */}
          <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm relative overflow-hidden">
            <div className="absolute top-6 left-6 bg-[#E9D5FF] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[-12deg] rounded">
              C
            </div>

            <div className="absolute top-[90px] left-[65px] bg-[#FDFFB6] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[8deg] rounded">
              D
            </div>

            <div className="absolute top-6 left-[105px] bg-[#CAFFD0] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[15deg] rounded">
              G
            </div>

            <div className="absolute top-10 right-8 bg-[#A0E8AF] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[25deg] rounded">
              E
            </div>

            <div className="absolute top-6 right-[75px] bg-[#A0C4FF] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[-18deg] rounded">
              B
            </div>

            <div className="absolute top-[85px] right-[25px] bg-[#FDFFB6] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[-6deg] rounded">
              A
            </div>

            <div className="absolute top-[95px] right-[85px] bg-[#CDB4DB] w-[34px] h-[34px] flex items-center justify-center font-bold rotate-[22deg] rounded">
              F
            </div>
          </div>

          {/* BUILT WITH */}
          <div className="h-[72px] bg-white border border-gray-100 rounded-[16px] shadow-sm flex items-center justify-center text-[13px] font-bold">
            Built with <span className="text-red-500 mx-1">❤️</span> by
            Microsoft Innovations Club
          </div>

          {/* GET UPDATES */}
          <div className="h-[72px] bg-white border border-gray-100 rounded-[16px] shadow-sm flex items-center p-1.5 gap-2">
            <input
              type="text"
              placeholder="Get updates"
              className="flex-1 px-3 text-[13px] outline-none bg-transparent"
            />

            <button className="w-[50px] bg-[#A7F3D0] rounded-[10px] h-full flex items-center justify-center hover:opacity-80">
              <Image src="/Vector.png" alt="bell icon" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
