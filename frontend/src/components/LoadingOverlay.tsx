
// components/GameLoadingOverlay.tsx

import { Box } from "@mantine/core";

type GameLoadingOverlayProps = {
  visible: boolean;
  zIndex?: number;
  message?: string;
  color1?: string;
  color2?: string;
};

const GameLoadingOverlay = ({
  visible,
  zIndex = 10,
  message,
  color1 = "rgba(255,255,255,0.10)",
  color2 = "rgba(255,255,255,0.02)",
}: GameLoadingOverlayProps) => {
  if (!visible) return null;

  let color1Style = color1;
	let color2Style = color2;

	const colorBases = {
		'red': [255, 100, 100],
		'green': [100, 255, 100],
		'blue': [100, 100, 255],
		'yellow': [255, 255, 100],
		'orange': [255, 165, 0],
		'cyan': [0, 255, 255],
		'lime': [150, 255, 100],
		'pink': [255, 100, 200],
		'purple': [200, 100, 255],
		'teal': [0, 150, 150],
		'gray': [200, 200, 200],
		'white': [255, 255, 255],
		'black': [0, 0, 0],
	};

	if (color1 in colorBases) {
		const base = colorBases[color1 as keyof typeof colorBases];
		color1Style = `rgba(${base[0]}, ${base[1]}, ${base[2]}, 0.50)`;
	}

	if (color2 in colorBases) {
		const base = colorBases[color2 as keyof typeof colorBases];
		color2Style = `rgba(${base[0]}, ${base[1]}, ${base[2]}, 0.25)`;
	}
	
  return (
    <Box
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        display: "grid",
        placeItems: "center",
        borderRadius: "inherit",
        overflow: "hidden",
        // subtle darkening so underlying UI is still visible
        background: "rgba(10, 10, 14, 0.55)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Moving diagonal stripes */}
      <Box className="gamey-stripes" />

      {/* Center loader */}
      <Box
        style={{
          position: "relative",
          zIndex: 1,
          padding: "14px 18px",
          borderRadius: 14,
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
				{message && (
					<Box style={{ fontSize: 14, letterSpacing: 0.6, opacity: 0.92 }}>
						{message}
					</Box>
				)}

        <Box className="gamey-dots" aria-label="loading">
          <span />
          <span />
          <span />
        </Box>
      </Box>

      {/* Styles */}
      <style>{`
        .gamey-stripes {
          position: absolute;
          inset: -40%;
          background:
            repeating-linear-gradient(
              135deg,
              ${color1Style} 0px,
              ${color1Style} 10px,
              ${color2Style} 10px,
              ${color2Style} 22px
            );
          transform: rotate(0deg);
          animation: stripes-slide 900ms linear infinite;
          opacity: 0.9;
        }

        @keyframes stripes-slide {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(31px, 31px, 0); }
        }

        .gamey-dots {
          display: inline-flex;
          gap: 6px;
          align-items: flex-end;
        }

        .gamey-dots span {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          display: block;
          animation: dot-bounce 700ms ease-in-out infinite;
        }

        .gamey-dots span:nth-child(2) {
          animation-delay: 120ms;
          opacity: 0.85;
        }

        .gamey-dots span:nth-child(3) {
          animation-delay: 240ms;
          opacity: 0.7;
        }

        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
      `}</style>
    </Box>
  );
};

export default GameLoadingOverlay;