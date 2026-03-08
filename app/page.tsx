"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Section2 from "@/components/landing/Middle";
import Section1 from "@/components/landing/Hero";

import FooterSection from "@/components/landing/FooterSection";
export default function Home() {
  
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-sans flex flex-col items-center  pb-8 overflow-x-hidden">
      <Section1 />
     <Section2/>
      <FooterSection/>
    </div>
  );
}
