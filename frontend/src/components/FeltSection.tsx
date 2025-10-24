import { Box } from "@mantine/core";
import FeltBackground from "./FeltBackground";
import type { ColorName } from "../tailwind-colors";

const FeltSection = ({ children, color = 'green', colorLevel = 6 }: { children: React.ReactNode, color?: ColorName, colorLevel?: number }) => {
  return (
    <Box bg="transparent" component="section" className="p-0 my-4 border-yellow-500 rounded-xl border-1 overflow-clip">
      <FeltBackground colorLevel={colorLevel} color={color}>
        {children}
      </FeltBackground>
    </Box>
  );
}

export default FeltSection;