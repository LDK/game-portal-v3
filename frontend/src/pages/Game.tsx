// Import each game component here
import OhNo from "../games/ohno";

interface GamePageProps {
  title: string;
  gameId?: string;
  section?: string;
  csrfToken: string;
};

const GamePage = ({ title, gameId, section, csrfToken }: GamePageProps) => {
  let mainContent = <div>Game not found.</div>;
  const gameProps = { gameId, section, csrfToken };

  switch (title) {
    case "ohno":
      mainContent = <OhNo.index {...gameProps} />;
      break;
    default:
      break;
  }

  return mainContent;
};

export default GamePage;