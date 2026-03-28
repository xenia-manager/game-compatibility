export default function BackgroundLayers() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Mica Layer */}
      <div className="absolute inset-0 w-full h-full mica-layer animate-float" />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(102, 126, 234, 0.05) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
