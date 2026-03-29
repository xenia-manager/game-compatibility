import GameCompatibilityList from "@/components/GameCompatibilityList";

export default function Home() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <p className="text-fluent-neutral text-sm sm:text-base">
          Browse the compatibility status of Xbox 360 games on Xenia Canary
        </p>
      </div>
      <GameCompatibilityList />
    </div>
  );
}
