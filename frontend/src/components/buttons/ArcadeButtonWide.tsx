import { Box, Text } from '@mantine/core';
import type { BackgroundColor, TextColor } from '../../tailwind-colors';
import type { ArcadeButtonProps } from './ArcadeButton';

export function ArcadeButtonWide({
  color = 'gray',
  href,
  label,
  hoverLevel = 600,
  size = 'md',
	textSize,
  disabled = false,
  className = '',
  type = 'button',
  callback,
}: ArcadeButtonProps) {
	let buttonSize = 'h-12';
	let buttonBorderSize = '1.5px';
	let buttonDistance = '-8px';
	let buttonHoverDistance = '-7px';
	let pressedDistance = '-3px';
	let fontSize = textSize;

	switch (size) {
		case 'sm':
			buttonSize = 'h-8';
			buttonBorderSize = '1px';
			buttonDistance = '-6px';
			buttonHoverDistance = '-5px';
			pressedDistance = '-2px';

			if (!textSize) { fontSize = 'sm'; }

			break;
		case 'lg':
			buttonSize = 'h-20';
			buttonBorderSize = '2px';
			buttonDistance = '-10px';
			buttonHoverDistance = '-9px';
			pressedDistance = '-3px';

			if (!textSize) { fontSize = 'md'; }

			break;
		case 'md':
		default:
			buttonSize = 'h-12';
			buttonBorderSize = '1.5px';
			break;
	}

  let wellColor: BackgroundColor = `bg-gray-600`;
  let buttonColor: BackgroundColor =  disabled ? `bg-gray-600` : `bg-gray-800`;
  let hoverColor: BackgroundColor = buttonColor;
  let activeColor: BackgroundColor = buttonColor;
  let hoverOpacity: string = '';
	let textOpacity: string = '/80';
	let mixBlend: string = 'mix-blend-color-dodge';
	let textClass: TextColor = 'text-gray-100';
  
  if (!disabled) {
    switch (color) {
      case 'white':
				textClass = 'text-gray-900';
        buttonColor = `bg-white`;
        hoverColor = `bg-gray-200`;
        activeColor = `bg-gray-300`;
				textOpacity = '/75';
				mixBlend = 'mix-blend-darken';
        // Keep the gray well for black and white buttons
        break;
      case 'black':
        wellColor = `bg-black`;
				buttonColor = 'bg-gray-700';
        hoverColor = `bg-gray-800`;
        activeColor = `bg-gray-800`;
        // Keep the gray well for black and white buttons
        break;
      case 'transparent':
				textClass = 'text-gray-900';
        buttonColor = 'bg-transparent';
        wellColor = 'bg-transparent';
        hoverColor = 'bg-white';
        hoverOpacity = '/30';
        activeColor = `bg-gray-100`;
				textOpacity = '';
				mixBlend = 'mix-blend-normal';
        break;
			case 'lime':
			case 'yellow':
			case 'amber':
			case 'orange':
        buttonColor = `bg-${color}-500`;
        wellColor = `bg-${color}-900`;
        hoverColor = `bg-${color}-${hoverLevel}`;
				textClass = 'text-gray-900';
				textOpacity = '/75';
				mixBlend = 'mix-blend-darken';
				break;
			case 'green':
			case 'cyan':
				buttonColor = `bg-${color}-600`;
				wellColor = `bg-${color}-900`;
				hoverColor = `bg-${color}-700`;
				break;
      default:
        buttonColor = `bg-${color}-500`;
        wellColor = `bg-${color}-900`;
        hoverColor = `bg-${color}-${hoverLevel}`;
        break;
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!type || type !== 'submit') {
      e.preventDefault();
    }

    if (disabled) {
      return;
    }

    if (callback) {
      callback();
    }
    
    if (href) {
      window.location.href = href;
    }
  };

  return (    
    <Box className={className} component="button" type={type} role="button" ff="monospace" style={{
			filter: disabled ? 'grayscale(1) brightness(0.75)' : 'contrast(1.25) brightness(.90)'
		}}>
      <a onClick={handleClick} rel="noopener noreferrer" className={`cursor-pointer justify-items-center ${wellColor} !no-underline border-black border-[${buttonBorderSize}] ${textClass} relative top-[2px] ${buttonSize} rounded-[10%] inline-block border-button text-center group disabled:opacity-50 disabled:cursor-not-allowed  group`} target="">
        <Text
          size={fontSize}
          ff="monospace"
          fw={700}
          px={16}
          className={`
            px-2
            font-bold
            relative flex items-center justify-center
            ${buttonSize}
            ${buttonColor} 
            hover:${hoverColor}${hoverOpacity}
            active:${activeColor}${hoverOpacity}
            border-black border-[1.5px]
            rounded-[10%] font-bold
            transition-all duration-100
            translate-y-[${buttonDistance}]
            hover:translate-y-[${buttonHoverDistance}]
            active:translate-y-[${pressedDistance}]
            group-disabled:hover:!translate-y-[-2px]
            select-none
            shadow-[inset_0_4px_6px_rgba(0,0,0,0.25),0_8px_6px_3px_rgba(2,2,2,0.25)]
            hover:shadow-[inset_0_4px_6px_rgba(0,0,0,0.25),0_5px_6px_3px_rgba(2,2,2,0.25),0_0_6px_5px_rgba(200,200,200,0.15)]
            active:shadow-[inset_0_4px_6px_rgba(0,0,0,0.25),0_3px_3px_1px_rgba(2,2,2,0.15),0_0_3px_2px_rgba(200,200,200,0.075)]
            overflow-hidden
          `}
        >
          <span className="absolute inset-0 rounded-[10%] pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  -45deg,
                  rgba(0,0,0,0.175) 0px,
                  rgba(0,0,0,0.15) .75px,
                  transparent 1px,
                  transparent 3px
                )
              `
            }}
          />
          <span className={`${textClass}${textOpacity} ${mixBlend}`}>{label}</span>
        </Text>
      </a>
    </Box>
  );
}
