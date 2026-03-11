import React from "react";

export default function MobilePage() {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-white font-sans text-black overflow-hidden items-center justify-between">
            {/* Top Section */}
            <h1 className="text-4xl font-extrabold tracking-tight mt-16 leading-none">
                FFCS
            </h1>

            {/* Middle icon */}
            <div className="flex-1 flex items-center justify-center -mt-8 w-full">
                <div className="w-[100px] h-[200px] border-[3px] border-black rounded-[12px] flex flex-col items-center pt-3 relative">
                    <div className="w-[6px] h-[6px] bg-black rounded-full"></div>
                    <div className="flex-1 flex items-center justify-center pb-4 text-sm font-bold tracking-tight">
                        FFCS
                    </div>
                </div>
            </div>

            {/* Bottom Text Area */}
            <div className="flex flex-col items-center px-8 text-center w-full pb-12">
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-4 text-black">
                    Looks like you are on<br />mobile
                </h2>
                <p className="text-base leading-relaxed text-gray-700 font-medium max-w-[300px]">
                    For the best experience, please use a computer to access this website.
                </p>
            </div>

            {/* Footer Area */}
            <div className="w-full bg-[#FAFAFA] py-4 flex flex-col items-center justify-center text-sm border-t border-gray-100 shadow-[0_-20px_40px_rgba(0,0,0,0.015)]">
                <p className="mb-0 text-gray-600 font-medium">
                    Built with <span className="text-[#FF3B30]">❤️</span> by
                </p>
                <p className="mb-0 text-gray-600 font-medium">Microsoft Innovations Club</p>
            </div>
        </div>
    );
}
