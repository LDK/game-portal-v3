import "vite/modulepreload-polyfill";
import ReactDOM from "react-dom/client";
import { createTheme, MantineProvider } from '@mantine/core';
import type { CSSVariablesResolver } from '@mantine/core';
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './redux/store'

import App from "./App";
import React from "react";

const theme = createTheme({
  fontFamily: 'Arial, sans-serif',
  fontFamilyMonospace: 'Fira Code, monospace',
  headings: { fontFamily: 'Della Respira, serif' },
  colors: { // primary shade of green is rgb(74, 117, 44)
    green: [
      'rgb(237, 246, 236)', // 0
      'rgb(209, 233, 208)', // 1
      'rgb(174, 216, 174)', // 2
      'rgb(140, 199, 140)', // 3
      'rgb(112, 185, 112)', // 4
      'rgb(74, 117, 44)',   // 5 - primary
      'rgb(58, 93, 35)',    // 6
      'rgb(43, 69, 26)',    // 7
      'rgb(27, 44, 16)',    // 8
      'rgb(12, 20, 7)',      // 9
      'rgb(12, 0, 0)',        // 10
    ],
  },
  primaryColor: 'green',
  primaryShade: 5,
  defaultRadius: 'md',
  components: {
    Title: {
      styles: () => ({
        root: {
          letterSpacing: '0.03em',
        },
      }),
    },
  },
  other: {
    playingCardWidthXs: '80px',
    playingCardHeightXs: '112px',
    playingCardWidthSm: '100px',
    playingCardHeightSm: '140px',
    playingCardWidthMd: '142px',
    playingCardHeightMd: '200px',
    playingCardWidthLg: '180px',
    playingCardHeightLg: '260px',

    playingPackWidthSm: '120px',
    playingPackHeightSm: '165px',
    playingPackWidthMd: '160px',
    playingPackHeightMd: '220px',
  },
});

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--playing-card-width-xs': theme.other.playingCardWidthXs,
    '--playing-card-height-xs': theme.other.playingCardHeightXs,
    '--playing-card-width-sm': theme.other.playingCardWidthSm,
    '--playing-card-height-sm': theme.other.playingCardHeightSm,
    '--playing-card-width-md': theme.other.playingCardWidthMd,
    '--playing-card-height-md': theme.other.playingCardHeightMd,
    '--playing-card-width-lg': theme.other.playingCardWidthLg,
    '--playing-card-height-lg': theme.other.playingCardHeightLg,

    '--fanned-cards-height-xs': `calc(var(--playing-card-height-xs) * 1.35)`,
    '--fanned-cards-height-sm': `calc(var(--playing-card-height-sm) * 1.35)`,
    '--fanned-cards-height-md': `calc(var(--playing-card-height-md) * 1.35)`,
    '--fanned-cards-height-lg': `calc(var(--playing-card-height-lg) * 1.35)`,
    
    '--playing-pack-width-sm': theme.other.playingPackWidthSm,
    '--playing-pack-height-sm': theme.other.playingPackHeightSm,
    '--playing-pack-width-md': theme.other.playingPackWidthMd,
    '--playing-pack-height-md': theme.other.playingPackHeightMd,
  },
  light: {},
  dark: {},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light" cssVariablesResolver={resolver} withCssVariables>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </MantineProvider>
  </React.StrictMode>
);
