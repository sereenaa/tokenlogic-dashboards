import Image from "next/image";
import localFont from "next/font/local";
import GhoSwapDash from '../components/gho/GhoSwapDash';
import AaveDash from "../components/aave/stkbpt/AprDash";
import AaveDash2 from "../components/aave/stkbpt/InvestmentAnalysisDash"; 
import AaveDash3 from "../components/aave/stkbpt/CompositionDash";
import AaveDash4 from "../components/aave/stkbpt/ClaimsDash";
import AaveDash5 from "../components/aave/stkbpt/DailyStakesDash";

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
      <main className="flex flex-col gap-8 items-center sm:items-start flex-grow">
        <p>My Dashboards ~ Sez @ TokenLogic</p>
        {/* <GhoSwapDash /> */}
        <AaveDash />
        <AaveDash2 className="mt-20 mb-10"/>
        <AaveDash3 className="mt-20"/>
        <AaveDash4 className="mt-10"/>
        <AaveDash5 className="mt-10"/>
      </main>
    </div>
  );
}
