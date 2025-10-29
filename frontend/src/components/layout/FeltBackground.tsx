import { Box } from "@mantine/core";
import type { ColorName } from "../../tailwind-colors";

const FeltBackground = ({ children, color = 'green', colorLevel = 6, height = 'auto', mb = '0', mt = '0', pb = '4', pt = '0' }: { children: React.ReactNode, color?: ColorName, colorLevel?: number, height?: string, mb?: string | number, mt?: string | number, pb?: string | number, pt?: string | number }) => {
  const baseColor = `var(--color-${color}-${colorLevel}00)`;
  const fadeColor = 'rgba(12, 20, 7, 0.5)';

  return (
    <Box className='overflow-auto p-4' mb={mb} pb={pb} mt={mt} pt={pt}
      style={{
        height: height,
        width: "100%",
        backgroundColor: baseColor,
        backgroundAttachment: "fixed",
        // vv fancy felt-like background vv
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 2px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 2px
          ),
          linear-gradient(180deg, ${baseColor} calc(100vh - 120px), ${fadeColor})
        `,
      }}
    >
      {children}
    </Box>
  );
}

export default FeltBackground;