import OhnoHome from "./sections/Home";
import OhnoGameView from "./sections/GameView";
import type { User } from "../../types/user";

interface OhNoProps {
    gameId?: string;
	section?: string;
	csrfToken: string;
	user?: User;
};

const OhnoLeaderboard = () => {
  return <div>Oh No! Leaderboard Component</div>;
};

const OhNoIndex = ({ gameId, section, csrfToken, user }: OhNoProps) => {
	let mainContent = <OhNo.Home csrfToken={csrfToken} user={user} />;

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