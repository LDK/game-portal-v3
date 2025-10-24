import { Box } from "@mantine/core";
import React from "react";

interface NoiseFieldProps {
  width?: number | string;
  height?: number | string;
  gradientFrom?: string;
  gradientTo?: string;
  angle?: number;
  noiseFill?: string;   // hex or rgba for the base fill of the SVG
  opacity?: number;     // opacity of the noise overlay
  className?: string;   // allow tailwind/mantine class passthrough
  style?: React.CSSProperties; // allow style passthrough
	baseFreq?: number;    // baseFrequency of the noise filter
	children?: React.ReactNode;
}

const NoiseField: React.FC<NoiseFieldProps> = ({
  width = "100%",
  height = "100%",
  gradientFrom = "rgba(142,119,113,0.8)",
  gradientTo = "rgba(255,219,183,0.8)",
  angle = 120,
  noiseFill = "#000000",
  opacity = 0.7,
  baseFreq = 0.85,
  className = "",
  style: styles,
	children,
}) => {
  // Inline SVG template with parametric fill + opacity
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <filter id="n" x="0" y="0">
        <feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" stitchTiles="stitch"/>
      </filter>
      <rect width="300" height="300" fill="${noiseFill}"/>
      <rect width="300" height="300" filter="url(#n)" opacity="${opacity}"/>
    </svg>
  `;
  const svgBase64 = btoa(svgString);

  // const style: React.CSSProperties = {...styles,
  //   width,
  //   height,
  //   backgroundRepeat: "no-repeat",
  //   background: `linear-gradient(${angle}deg, ${gradientFrom} 5%, ${gradientTo} 35%), url('data:image/svg+xml;base64,${svgBase64}')`,
  // };

  return (
		<Box style={{ width, height }} pos="relative">
			<Box className={className} style={{
				backgroundRepeat: "no-repeat",
	    	background: `linear-gradient(${angle}deg, ${gradientFrom} 5%, ${gradientTo} 35%), url('data:image/svg+xml;base64,${svgBase64}')`,
				...styles,
				zIndex: 0,
			}}>
			</Box>
			<Box style={{ zIndex: 1 }} pos="absolute" top={0} left={0} w="100%" h="100%">
				{children}
			</Box>
		</Box>
	);
};

export default NoiseField;