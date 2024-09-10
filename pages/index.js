import Image from "next/image";
import localFont from "next/font/local";
import GhoSwapDash from '../components/GhoSwapDash';

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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>My Dashboards</h1>
        <GhoSwapDash />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Sez @ TokenLogic
      </footer>
    </div>
  );
}
