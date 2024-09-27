import Image from "next/image";
import localFont from "next/font/local";
import GhoSwapDash from '../components/GhoSwapDash';
import AaveDash from "../components/AaveStkbptAprDash";
import AaveDash2 from "../components/AaveStkbptInvestmentAnalysisDash"; 
import AaveDash3 from "../components/AaveStkbptCompositionDash";

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
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-grow">
        <h1>My Dashboards</h1>
        {/* <GhoSwapDash /> */}
        <AaveDash />
        <AaveDash2 className="mt-10 mb-10"/>
        <AaveDash3 className="mt-20"/>
        <p className="text-sm italic">Sez @ Tokenlogic</p>
      </main>
    </div>
  );
}
