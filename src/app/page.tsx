import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[60px_1fr_50px] min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"  // Add your logo image later
            alt="Inkognito logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-semibold">Inkognito</span>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-2xl font-semibold max-w-md p-4">
            The Inkognito website is coming soon!
          </h1>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="flex gap-6 items-center justify-center">
        <a
          className="hover:underline hover:underline-offset-4"
          href="/privacy"
        >
          Privacy
        </a>
        <a
          className="hover:underline hover:underline-offset-4"
          href="/terms"
        >
          Terms
        </a>
        <a
          className="hover:underline hover:underline-offset-4"
          href="/support"
        >
          Support
        </a>
      </footer>
    </div>
  );
}
