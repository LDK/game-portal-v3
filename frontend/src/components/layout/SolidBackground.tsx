import { Box } from "@mantine/core";
import type { ColorName } from "../../tailwind-colors";

const SolidBackground = ({ children, color = 'green', colorLevel = 6, height = 'auto', mb = '0', mt = '0', pb = '4', pt = '0' }: { children: React.ReactNode, color?: ColorName, colorLevel?: number, height?: string, mb?: string | number, mt?: string | number, pb?: string | number, pt?: string | number }) => {
  const baseColor = `var(--color-${color}-${colorLevel}00)`;

  return (
    <Box className='overflow-auto p-4' mb={mb} pb={pb} mt={mt} pt={pt}
      style={{
        height: height,
        width: "100%",
        backgroundColor: baseColor,
        backgroundAttachment: "fixed",
        // vv fancy felt-like background vv
      }}
    >
      {children}
    </Box>
  );
}

export default SolidBackground;