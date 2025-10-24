import { Box } from "@mantine/core";

const Footer = () => (
  <Box className="z-50 text-center backdrop-blur-xl p-4 fixed w-full bottom-0 left-0 align-items-middle text-sm mt-4 h-[72px] bg-blend-color-burn text-yellow-100/90 bg-green-700/90">
    <p>Made with ❤️ using <a href="https://vite.dev" className="underline">Vite</a>, <a href="https://react.dev" className="underline">React</a>, <a href="https://mantine.dev" className="underline">Mantine</a>, <a href="https://tailwindcss.com" className="underline">TailwindCSS</a>, and <a href="https://www.djangoproject.com" className="underline">Django</a>.</p>
    <p className="hidden sm:block">Source code on <a href="https://github.com/your-repo" className="underline">GitHub</a> (not really lol).</p>
  </Box>
);

export default Footer;