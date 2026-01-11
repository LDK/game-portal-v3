import type { GameLog } from "../../../types/game";
import { Box, Button, Text, TextInput } from "@mantine/core";
import axios from "axios";
import { Send } from "feather-icons-react";
import { useEffect, useRef } from "react";

interface LogBoxProps {
		gameId: string;
		log: GameLog[];
		csrfToken: string;
		dataCallback: (data: GameLog[]) => void;
}

const LogBox = ({ gameId, log, csrfToken, dataCallback }: LogBoxProps) => {
  const gameLogEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (gameLogEndRef.current) {
      gameLogEndRef.current.scrollIntoView();
    }
  }, [log]);

  const LogEntry = ({ entry }: { entry: GameLog }) => {
    let entryText = <>{entry.player}: {entry.action}</>;
    const nameText = <span className={`font-bold${entry.cpu_name ? ' cpu-name' : ''}`}>{entry.player || entry.cpu_name}</span>;
    const entryTs =  new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let textColor = 'black';

    if (entry.specifics && (entry.specifics.color || entry.specifics.card?.group)) {
      textColor = (entry.specifics.color || entry.specifics.card!.group).toLowerCase();
      switch (textColor) {
        case 'wild':
          textColor = 'white';
          break;
        case 'blue':
          textColor = 'blue.5';
          break;
        default:
          break;
      }
    }

    let cardName = <></>;

    if (entry.specifics && entry.specifics.card) {
      cardName = <Text component="span" c={textColor} className="font-bold bg-black">{entry.specifics.card.name}</Text>;
    }

    console.log(textColor, entry.specifics);

    switch (entry.action) {
      case 'draw':
        entryText = <Text>{nameText} drew a card.</Text>;
        break;
      case 'draw-two':
        entryText = <Text>{nameText} drew two cards!</Text>;
        break;
      case 'draw-four':
        entryText = <Text>{nameText} drew four cards!</Text>;
        break;
      case 'join':
        entryText = <Text>{nameText} joined the game.</Text>;
        break;
      case 'play':
        entryText = <Text>{nameText} played a&nbsp;{cardName}.</Text>;
        break;
      case 'skip':
        entryText = <Text>{nameText} was skipped!</Text>;
        break;
      case 'reverse':
        entryText = <Text>Order was reversed!</Text>;
        break;
      case 'wild':
        entryText = <Text>Waiting for {nameText} to choose a color...</Text>;
        break;
      case 'new_game':
        entryText = <Text>{nameText} created a new game.</Text>;
        break;
      case 'add_cpu_player':
        entryText = <Text>{nameText} joined the game.</Text>;
        break;
      case 'game_started':
        entryText = <Text>{nameText} started the game!</Text>;
        break;
      case 'to':
        entryText = <Text display="flex">{nameText}&nbsp;turned over a&nbsp;{cardName}.</Text>;
        break;
      case 'chat':
        entryText = <Text>{nameText}: {entry.specifics?.message}</Text>;
        break;
      case 'deal_cards':
        entryText = <Text>{nameText} dealt the cards.</Text>;
        break;
      case 'color':
        entryText = <Text>{nameText} changed the color to <Text component="span" c={textColor} className="font-bold bg-black">{entry.specifics?.color}</Text>.</Text>;
        break;
    }
    return (
      <Box className="mb-2 sm:flex items-top text-left">
        <p className="text-gray-600 w-[62px] text-xs mr-1 sm:mr-2 no-wrap md:mr-3">{entryTs}</p>
        <Box className="flex">{entryText}</Box>
      </Box>
    );
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('chatInput') as HTMLInputElement;
    const message = input.value.trim();
    if (message) {
      // Send chat message to server (placeholder logic)
      console.log('Sending chat message:', message);
      input.value = '';

			const formData = new FormData();
			formData.append('message', message);
			// formData.append('csrfmiddlewaretoken', csrfToken || '');

			axios.post(`/game/${gameId}/chat/`, formData, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      })
			.then(response => {
				dataCallback(response.data);
      })
      .catch(error => {
        console.error('Error sending chat message:', error);
      });
    }
  };
  return (
    <Box className="w-full bg-white rounded bg-opacity-50 text-black p-4 min-h-64 overflow-y-auto relative">
			<Box className="w-full bg-white rounded bg-opacity-50 text-black p-0 max-h-48 overflow-y-auto relative">
        {log.map((entry, index) => (
          <LogEntry key={index} entry={entry} />
        ))}
        <div ref={gameLogEndRef} />
      </Box>

      <form onSubmit={handleChatSubmit}>
        <Box className="border-solid border-black border-1 rounded relative">
          <Button pos="absolute" color="white" className="hover:bg-white bottom-0 right-0 cursor-pointer z-22" type="submit"><Send color="black" width="16px" /></Button>
          <TextInput placeholder="Type a message..." className="pr-12 border-0 border-none" style={{ border: 'none' }} size="sm" name="chatInput" />
        </Box>
      </form>
    </Box>
  );
};

export default LogBox;