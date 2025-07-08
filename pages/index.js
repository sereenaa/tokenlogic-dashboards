import React, { useEffect, useState } from 'react';
import Image from "next/image";
import localFont from "next/font/local";
import TailwindSidebar from '../components/Sidebar';

import GhoSwapDash from '../components/gho/GhoSwapDash';
import AaveDash from "../components/aave/stkbpt/AprDash";
import AaveDash7 from "../components/aave/stkbpt/BalancerPoolTvlAprDash";
import AaveDash2 from "../components/aave/stkbpt/InvestmentAnalysisDash"; 
import AaveDash3 from "../components/aave/stkbpt/CompositionDash";
import AaveDash4 from "../components/aave/stkbpt/ClaimsDash";
import AaveDash5 from "../components/aave/stkbpt/DailyStakesDash";
import AaveDash6 from "../components/aave/stkbpt/BalancerPoolDash";
import KelpApiFrontend from '../components/kelp/ApiFrontend';
import DefiProtocolUnlocksDash from '../components/defi/DefiProtocolUnlocksDash';
import TokenUnlockScheduleDash from '../components/morpho/TokenUnlockScheduleDash';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen`}
    >
      <TailwindSidebar activeSection={activeSection} />
      <main className="flex-1 flex flex-col gap-8 items-center sm:items-start p-4 sm:p-8 w-full">
        {/* <GhoSwapDash />
        <AaveDash />
        <AaveDash2 className="mt-20 mb-10"/>
        <AaveDash3 className="mt-20"/>
        <AaveDash4 className="mt-10"/>
        <AaveDash5 className="mt-10"/>
        <AaveDash6 className="mt-10"/>
        <section id="AaveDash" className="w-full">
          <AaveDash />
        </section>
        <section id="AaveDash7" className="w-full">
          <AaveDash7 />
        </section>
        <section id="AaveDash2" className="w-full">
          <AaveDash2 className="mt-2 mb-10"/>
        </section>
        <section id="AaveDash3" className="w-full">
          <AaveDash3 className="mt-10"/>
        </section>
        <section id="AaveDash4" className="w-full">
          <AaveDash4 className="mt-10"/>
        </section>
        <section id="AaveDash5" className="w-full">
          <AaveDash5 className="mt-10"/>
        </section>
        <section id="AaveDash6" className="w-full">
          <AaveDash6 className="mt-10"/>
        </section>
        <section id="KelpApiFrontend" className="w-full">
          <KelpApiFrontend />
        </section> */}
        <section id="DefiProtocolUnlocks" className="w-full">
          <DefiProtocolUnlocksDash />
        </section>
        <section id="MorphoTokenUnlocks" className="w-full">
          <TokenUnlockScheduleDash />
        </section>
      </main>
    </div>
  );
}