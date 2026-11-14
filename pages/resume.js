import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Resume = () => (
  <>
    <Head>
      <title>Ashley&apos;s Resume</title>
    </Head>
    <main className="h-screen w-screen overflow-hidden">
      <Link href="/">
        <a className="fixed left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/95 px-4 py-2 text-sm font-semibold text-black shadow-md transition-colors hover:bg-white">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to portfolio
        </a>
      </Link>
      <iframe
        className="h-full w-full border-0"
        src="https://drive.google.com/file/d/1URfkaosQyaXDNiGOZRwnYApnb4_4nkpV/view?usp=drive_link"
        title="Ashley&apos;s resume"
        allow="autoplay"
      />
    </main>
  </>
);

export default Resume;
