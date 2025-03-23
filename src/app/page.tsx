import MobileResponsiveMessage from "./components/MobileScreenPage";
import OptionsSelector from "./components/OptionsSelector";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Main content container with padding to avoid navbar overlap */}
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="flex justify-center gap-16 font-[family-name:var(--font-geist-sans)] max-w-full">
          <MobileResponsiveMessage />
          <OptionsSelector />
        </div>
      </main>
    </div>
  );
}