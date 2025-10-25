// Import each game component here
import OhNo from "../games/ohno";

interface GamePageProps {
  title: string;
  gameId?: string;
  section?: string;
};

const GamePage = ({ title, gameId, section }: GamePageProps) => {
  let mainContent = <div>Game not found.</div>;
  const gameProps = { gameId, section };

  switch (title) {
    case "ohno":
      mainContent = <OhNo {...gameProps} />;
      break;
    default:
      break;
  }

  return mainContent;
};

export default GamePage;