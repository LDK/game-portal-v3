import { Box, Card, Title, List } from "@mantine/core";
import React from "react";
import NoiseField from "./NoiseField";

function distributeValues(n:number, x:number) {
  const step = (2 * n) / (x - 1); // distance between values
  return Array.from({ length: x }, (_, i) => -n + i * step);
}

export const CardHand = ({ fan = false, children }: { fan?: boolean, children: React.ReactNode }) => {
  const cardCount = React.Children.count(children);
  let returnNode: React.ReactNode = children;

  if (fan && cardCount > 1) {
    let maxTilt = 0;
    let maxX = 0;
    const tilts: number[] = [];
    const xLocs: number[] = [];

    maxTilt = Math.min(90, cardCount * 7); // tilt at least 15 degrees (count will be at least 2), at most 90 degrees
    maxX = cardCount * 8;
    tilts.push(...distributeValues(maxTilt, cardCount));
    xLocs.push(...distributeValues(maxX, cardCount));

    returnNode = React.Children.map(children, (child, i) => {
        const tilt = tilts[i];

        return (
          <Box pos="absolute" className={`z-${i}`} style={{ 
            transformStyle: 'preserve-3d', transform: `rotate(${tilt}deg)`, left: `calc(50% + ${xLocs[i]}px)`, top: `${Math.abs(tilt) / 1.5}px` 
            }}
            >
            {child}
          </Box>
        );
      })
  } else {
    const xLocs: number[] = [];
    let maxX = 0;
    returnNode = children;
    maxX = cardCount * 16;
    xLocs.push(...distributeValues(maxX, cardCount));

    returnNode = React.Children.toArray(children).map((child, i) => {
        return (
          <Box className="top-0" 
            pos="absolute" style={{ left: `calc(50% + ${xLocs[i]}px)`, zIndex: i }}>
            {child}
          </Box>
        );
      })
  }

  const height = fan ? `
    h-[var(--fanned-cards-height-xs)] 
    sm:h-[var(--fanned-cards-height-sm)]
    md:h-[var(--fanned-cards-height-md)]
    lg:h-[var(--fanned-cards-height-lg)]
  ` : `
    h-[var(--playing-card-height-xs)] 
    sm:h-[var(--playing-card-height-sm)]
    md:h-[var(--playing-card-height-md)]
    lg:h-[var(--playing-card-height-lg)]
  `;

  return (
    <Box className={`overflow-visible my-4 py-2 px-0 relative ${height}`}>
      {returnNode}
    </Box>
  );
}

interface OhnoFaceProps {
  face: string;
  color?: 'Red' | 'Yellow' | 'Green' | 'Blue' | 'Wild';
};

export function OhnoFace({ face = 'w', color = 'Wild' }: OhnoFaceProps) {

  let titleText = '';
  let colorClass = 'border-black'

  switch (face) {
    case 's':
      titleText = 'SKIP';
      break;
    case 'r':
      titleText = 'REVERSE';
      break;
    case 'd2':
      titleText = 'DRAW TWO';
      break;
    case 'd4':
      titleText = 'DRAW FOUR';
      break;
    case 'w':
      titleText = 'WILD';
      break;
    default:
      titleText = face;
      break;
  }

  switch (color) {
    case 'Red':
      colorClass = 'border-red-500';
      break;
    case 'Yellow':
      colorClass = 'border-yellow-500';
      break;
    case 'Green':
      colorClass = 'border-green-500';
      break;
    case 'Blue':
      colorClass = 'border-cyan-500';
      break;
    default:
      colorClass = 'border-black';
      break;
  }

  const cornerText = face.toUpperCase();

  return (
    <Card bg="transparent" className={`w-full h-full border-16 ${colorClass} rounded-lg shadow-lg transform transition-transform duration-500`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute top-2 left-2 backface-hidden flex flex-col items-center justify-center">
        <Title order={2} className="text-4xl text-sky-600">{cornerText}</Title>
      </div>
      <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center">
        <Title component="h1" fz="h1" fw={700} ff="Raleway" order={3} className="text-4xl text-sky-600">{titleText}</Title>
      </div>
      <div className="absolute bottom-2 right-2 backface-hidden flex flex-col items-center justify-center">
        <Title order={2} className="text-4xl text-sky-600">{cornerText}</Title>
      </div>
      <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <Title order={2} className="text-4xl text-red-500">A</Title>
        <Title order={3} className="text-2xl text-red-500">♥</Title>
      </div>
    </Card>    
  );
};

export function BattleFace() {
  return (
    <Box className="relative overflow-clip w-full h-full border-1 border-yellow-500 rounded-lg shadow-lg transform transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d' }}
      >
      <NoiseField
        width="100%"
        height="100%"
        gradientFrom="rgba(142,142,73,0.8)"
        gradientTo="rgba(219,219,90,0.8)"
        angle={120}
        noiseFill="#000000"
        opacity={0.9}
        baseFreq={0.9}
        className="absolute group inset-0 shadow-[inset_0_0_50px_20px_rgba(225,225,190,0.35)]"
        style={{
          filter: 'contrast(1.2) brightness(.95)',
        }}
      >
        <Box
          id="shimmer"
          className={`
            pointer-events-none absolute inset-0 rounded-lg
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            bg-gradient-to-tr from-yellow-200/20 via-white/40 to-yellow-400/20
          `}
          style={{
            backgroundSize: "200% 200%",
            animation: "shimmer 6s ease-in-out infinite",
            mixBlendMode: "overlay",
          }}
        />

        <Box h="40%" w="90%" mx="auto" mt="12" className="bg-no-repeat bg-cover bg-top border-1 border-black rounded-lg shadow-[0_3px_2px_1px_rgba(2,2,2,0.1)]" style={{ backgroundImage: 'url(/static/img/monster1.jpg)' }}>

        </Box>

        <Title component="h4" fz="sm" className="text-center">Sample Monster</Title>
        
        <Box bg="transparent" ff="Raleway" className="attacks border-0" mt="4" w="90%" mx="auto">
          <List size="sm" className="text-black/90">
            <List.Item><strong>Slam</strong> (10 dmg)</List.Item>
            <List.Item><strong>Bite</strong> (15 dmg)</List.Item>
            <List.Item><strong>Roar</strong> (Stun)</List.Item>
          </List>
        </Box>

      </NoiseField>
    </Box>
  );
};

export function PlayingCard({ inHand, children, clickable = true }: { inHand?: boolean, children?: React.ReactNode, clickable?: boolean }) {
  const hoverClass = !clickable ? 
    `cursor-default` :
    `
      cursor-pointer hover:translate-y-[-2px] active:translate-y-[-1px]
      hover:shadow-[0_6px_4px_2px_rgba(2,2,2,0.15),0_0_5px_4px_rgba(200,200,200,0.1)]
      hover:brightness-110 hover:contrast-130
      active:shadow-[0_7px_4px_1px_rgba(2,2,2,0.15),0_0_3px_2px_rgba(200,200,200,0.075)]
      transition-all duration-150
    `;

	const card = (<Box mx={4} p={0}
    style={{ width: '142px', height: '200px', perspective: '1000px', transformStyle: 'preserve-3d'  }}
    className={`
        relative border-1 border-white inline-block rounded-lg bg-white
        select-none
        ${hoverClass}
        shadow-[0_8px_6px_3px_rgba(2,2,2,0.15)]
        bg-no-repeat bg-center bg-cover
    `}
    >
        {children}
    </Box>);

	if (inHand) {
		return (
			<Box className="relative group" p={0} m={0}>
				<Box p={0} m={0} className="ghost-card opacity-0 z-0 group-hover:opacity-100 group-hover:z-40 absolute top-0 left-0 w-full h-full rounded-lg border-1 border-dashed border-gray-400 pointer-events-none bg-red-900">
					{/* {card} */}
				</Box>
				{card}
			</Box>
		);
	}

	return card;
};

const foilFilters : { [key: string]: string } = {
  'platinum': 'grayscale(.7) brightness(1.15) contrast(1.5)',
  'gold': 'sepia(1) saturate(1) hue-rotate(0) brightness(1.1) contrast(1.2)',
  'silver': 'grayscale(1) brightness(1.4) contrast(1.2)',
  'bronze': 'sepia(1) saturate(3) hue-rotate(-20) brightness(0.9) contrast(1.2)',
  'rainbow': 'hue-rotate(90) saturate(3) brightness(1.2) contrast(1.2) bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400',
};

export function CardPack({ variant = 'common', foil }: { variant?: 'common' | 'prestige' | 'special' | 'deluxe' | 'bobs' , foil?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'rainbow' | 'standard' }) {
  const foilStyle = (foil && foilFilters[foil]) ? { filter: foilFilters[foil] } : {};

  return (
          <Box mx={4} p={0}
            style={{ width: '142px', height: '213px', perspective: '1000px', backgroundImage: `url('/static/img/${variant}-pack.png')`, ...foilStyle }}
            className={`
              group relative inline-block rounded-lg
              bg-no-repeat bg-center bg-cover
              cursor-pointer select-none
              shadow-[0_8px_6px_3px_rgba(2,2,2,0.15)]
              hover:shadow-[0_6px_4px_2px_rgba(2,2,2,0.15),0_0_5px_4px_rgba(200,200,200,0.1)]
              hover:brightness-110 hover:contrast-130
              active:shadow-[0_7px_4px_1px_rgba(2,2,2,0.15),0_0_3px_2px_rgba(200,200,200,0.075)]
              transition-all duration-150
              hover:translate-y-[-2px]
              active:translate-y-[-1px]
            `}
          >
            {/* {children} */}
          </Box>
  );
};

export function ClassicFace({ suit, value }: { suit?: 'hearts' | 'diamonds' | 'clubs' | 'spades', value: string }) {
  let suitSymbol = '';
  let suitColor = '';
  let valueShort = '';

  switch (value) {
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '10':
      valueShort = value;
      break;
    case 'Jack':
      valueShort = 'J';
      break;
    case 'Queen':
      valueShort = 'Q';
      break;
    case 'King':
      valueShort = 'K';
      break;
    case 'Ace':
      valueShort = 'A';
      break;
    case 'Joker':
      valueShort = 'JOKER';
      break;
    default:
      valueShort = '';
      suitSymbol = '';
      suitColor = '';
      break;
  }

  switch (suit) {
    case 'hearts':
      suitSymbol = '♥';
      suitColor = 'text-red-500';
      break;
    case 'diamonds':
      suitSymbol = '♦';
      suitColor = 'text-red-500';
      break;
    case 'clubs':
      suitSymbol = '♣';
      suitColor = 'text-black';
      break;
    case 'spades':
      suitSymbol = '♠';
      suitColor = 'text-black';
      break;
    default:
      suitSymbol = '';
      suitColor = 'text-black';
  }

  return (
    <>
      <div className="absolute backface-hidden flex flex-col items-center justify-center top-0 left-2">
        <Title order={2} size="h3" className={suitColor}>{valueShort}</Title>
        <Title order={3} size="h3" className={suitColor}>{suitSymbol}</Title>
      </div>
      <div className="absolute backface-hidden flex flex-col items-center justify-center bottom-0 right-2 transform-[rotate(180deg)]">
        <Title order={2} size="h3" className={suitColor}>{valueShort}</Title>
        <Title order={3} size="h3" className={suitColor}>{suitSymbol}</Title>
      </div>
      <div className="absolute backface-hidden inset-0 flex flex-col items-center justify-center">
        <Title order={3} size="h1" className="text-red-500 transform-[scale(1.5)]">{suitSymbol}</Title>
      </div>
    </>
  );
}

export function CardBack() {
  return (
    <div className="absolute backface-hidden inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotateY(180deg)', backgroundImage: 'url(/static/img/cardback-purple.png)' }}>
    </div>
  );
};

