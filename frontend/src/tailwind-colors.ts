// Adapted from https://gist.github.com/hyunbinseo/ae648ffafcdafa1fed9afc28e4368ebe

// Based on Tailwind CSS v3.0.23

// Requires TypeScript 4.1 or later (Template Literal Types)
// Reference https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types

export type ColorName =
  | 'amber'
  | 'blue'
  | 'cyan'
  | 'emerald'
  | 'fuchsia'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'lime'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'rose'
  | 'sky'
  | 'slate'
  | 'stone'
  | 'teal'
  | 'violet'
  | 'yellow'
  | 'zinc';

export type ColorLevel = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type Color =
  | `${ColorName}-${ColorLevel}`
  | 'inherit'
  | 'current'
  | 'transparent'
  | 'black'
  | 'white';

export type BackgroundColor = `bg-${Color}`;

export type TextColor = `text-${Color}`;