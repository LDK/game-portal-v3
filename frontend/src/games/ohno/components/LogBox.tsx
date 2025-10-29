import type { GameLog } from "../../../types/game";
import { Box, Button, Text, TextInput } from "@mantine/core";
import axios from "axios";
import { Monitor, Send } from "feather-icons-react";

interface LogBoxProps {
		gameId: string;
		log: GameLog[];
		csrfToken: string;
		dataCallback: (data: GameLog[]) => void;
}

const LogBox = ({ gameId, log, csrfToken, dataCallback }: LogBoxProps) => {
  const LogEntry = ({ entry }: { entry: GameLog }) => {
    let entryText = <>{entry.player}: {entry.action}</>;
    const nameText = <span className="font-bold">{entry.player || entry.cpu_name}&nbsp;</span>;
    const entryTs =  new Date(entry.timestamp).toLocaleTimeString();

    let cardName = <></>;

    if (entry.specifics && entry.specifics.card) {
      cardName = <Text c={entry.specifics.card.group} className="font-bold">{entry.specifics.card.name}</Text>;
    }

    switch (entry.action) {
      case 'draw':
        entryText = <>{nameText} drew a card.</>;
        break;
      case 'join':
        entryText = <>{nameText} joined the game.</>;
        break;
      case 'play':
        entryText = <>{nameText} played a card.</>;
        break;
      case 'skip':
        entryText = <>{nameText} was skipped!</>;
        break;
      case 'reverse':
        entryText = <>{nameText} reversed the order!</>;
        break;
      case 'wild':
        entryText = <>{nameText} played a Wild card!</>;
        break;
      case 'new_game':
        entryText = <>{nameText} created a new game.</>;
        break;
      case 'add_cpu_player':
        entryText = <>{nameText}<Monitor width="16px" style={{ marginRight: '.25rem' }} /> joined the game.</>;
        break;
      case 'game_started':
        entryText = <>{nameText} started the game!</>;
        break;
      case 'to':
        entryText = <>{nameText} turned over a&nbsp;{cardName}.</>;
        break;
      case 'chat':
        entryText = <>{nameText}: {entry.specifics?.message}</>;
        break;
    }
    return (
      <Box className="mb-2 flex items-center">
        <span className="text-gray-600 text-xs mr-3">{entryTs}</span>
        {entryText}
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
			<Box className="w-full bg-white rounded bg-opacity-50 text-black p-4 max-h-48 overflow-y-auto relative">
        {log.map((entry, index) => (
          <LogEntry key={index} entry={entry} />
        ))}
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