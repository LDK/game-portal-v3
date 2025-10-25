import FeltSection from "../../components/FeltSection";
import GameView from "./sections/GameView";
import OhnoLeaderboard from "./sections/Leaderboard";

interface OhNoProps {
    gameId?: string;
		section?: string;
};

const OhNo = ({ gameId, section }: OhNoProps) => {
	const IndexPage = () => (
		<FeltSection color="green" colorLevel={7}>
			<div>Oh No! Main Game Index</div>
		</FeltSection>
	);

	let mainContent = <IndexPage />;

	switch (section) {
		case "leaderboard":
			mainContent = <OhnoLeaderboard />;
			break;
		case "game":
			mainContent = <GameView gameId={gameId} />;
			break;
		default:
			break;
	}

  return mainContent;
};

export default OhNo;