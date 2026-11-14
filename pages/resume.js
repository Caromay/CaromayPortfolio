import Head from "next/head";

const Resume = () => (
  <>
    <Head>
      <title>Ashley&apos;s Resume</title>
    </Head>
    <main className="h-screen w-screen overflow-hidden">
      <iframe
        className="h-full w-full border-0"
        src="https://drive.google.com/file/d/1URfkaosQyaXDNiGOZRwnYApnb4_4nkpV/preview"
        title="Ashley&apos;s resume"
        allow="autoplay"
      />
    </main>
  </>
);

export default Resume;
