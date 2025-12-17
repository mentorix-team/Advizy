export function AnimatedGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0F1110]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02)
 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",     // Increased grid size
          backgroundPosition: "0 0",
          animation: "gridMove 10s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes gridMove {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 80px 80px; /* match the new grid size */
          }
        }
      `}</style>
    </div>
  )
}