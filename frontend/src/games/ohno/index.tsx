import OhnoHome from "./sections/Home";
import OhnoGameView from "./sections/GameView";
import type { User } from "../../types/user";

interface OhNoProps {
    gameId?: string;
	section?: string;
	csrfToken: string;
	userProfile?: User;
};

const OhnoLeaderboard = () => {
  return <div>Oh No! Leaderboard Component</div>;
};

const OhNoIndex = ({ gameId, section, csrfToken, userProfile }: OhNoProps) => {
	let mainContent = <OhNo.Home {...{ csrfToken, userProfile }} />;

	switch (section) {
		case "leaderboard":
			mainContent = <OhnoLeaderboard />;
			break;
		case "game":
			mainContent = <OhnoGameView {...{ gameId: gameId as string, csrfToken }} />;
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