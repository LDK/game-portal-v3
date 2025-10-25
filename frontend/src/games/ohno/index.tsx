import OhnoHome from "./sections/Home";
import OhnoGameView from "./sections/GameView";

interface OhNoProps {
    gameId?: string;
	section?: string;
	csrfToken: string;
};

const OhnoLeaderboard = () => {
  return <div>Oh No! Leaderboard Component</div>;
};

const OhNoIndex = ({ gameId, section, csrfToken }: OhNoProps) => {
	let mainContent = <OhNo.Home csrfToken={csrfToken} />;

	switch (section) {
		case "leaderboard":
			mainContent = <OhnoLeaderboard />;
			break;
		case "game":
			mainContent = <OhnoGameView gameId={gameId} />;
			break;
		default:
			break;
	}

  return mainContent;
};

const OhNo = {
	Leaderboard: OhnoLeaderboard,
	Home: OhnoHome,
	GameView: OhnoGameView,
	index: OhNoIndex,
};

export default OhNo;