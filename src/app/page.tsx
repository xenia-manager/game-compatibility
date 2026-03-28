import GameCompatibilityList from "@/components/GameCompatibilityList";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <p className="text-fluent-neutral">
          Browse the compatibility status of Xbox 360 games on Xenia Canary
        </p>
      </div>
      <GameCompatibilityList />
    </div>
  );
}
