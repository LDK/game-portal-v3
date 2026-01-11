import { PlayingCard, OhnoFace } from "../../../components/cards";
import type { OhnoGame } from "../types";

const CurrentCard = ({ game }:{ game:OhnoGame }) => (
    <>
    {game.current_card &&
        <PlayingCard>
            <OhnoFace face={game.current_card.face} color={game.current_card.group} />
        </PlayingCard>
    }
    </>
);

export default CurrentCard;