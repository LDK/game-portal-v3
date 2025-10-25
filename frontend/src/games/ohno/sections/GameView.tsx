// Oh No! Game View Component
interface GameViewProps {
    gameId?: string;
};

const GameView = ({ gameId }: GameViewProps) => {
  return <div>Oh No! Game View Component{gameId && ` (Game ID: ${gameId})`}</div>;
};

export default GameView;