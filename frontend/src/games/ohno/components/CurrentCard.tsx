import { PlayingCard, OhnoFace } from "../../../components/cards";
import type { OhnoGame } from "../types";

const CurrentCard = ({ game, wildColor }:{ game:OhnoGame; wildColor?: 'Red' | 'Yellow' | 'Green' | 'Blue' | null }) => {
    const color = game.wild_color ? wildColor : game.current_card?.group;
    console.log('color', color);

    return (
        <>
        {game.current_card &&
            <PlayingCard clickable={false}>
                <OhnoFace face={game.current_card.face} color={color} />
            </PlayingCard>
        }
        </>
    );
}

export default CurrentCard;