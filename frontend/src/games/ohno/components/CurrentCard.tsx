import { PlayingCard, OhnoFace } from "../../../components/cards";
import type { OhnoGame, OhnoGroup } from "../types";

const CurrentCard = ({ game, wildColor }:{ game:OhnoGame; wildColor?: 'Red' | 'Yellow' | 'Green' | 'Blue' | undefined }) => {
    const cardId = game.current_card;

    if (!cardId) return <></>;

    const face = cardId[1];
    const group = cardId[0];

    let color:OhnoGroup = wildColor || 'Wild';

    if (!color) {
        switch (group) {
            case 'r':
                color = 'Red';
                break;
            case 'y':
                color = 'Yellow';
                break;
            case 'g':
                color = 'Green';
                break;
            case 'b':
                color = 'Blue';
                break;
            case 'w':
                color = 'Wild';
                break;
        }
    }

    if (!color) return <></>;

    return (
        <>
        {game.current_card &&
            <PlayingCard clickable={false}>
                <OhnoFace face={face} color={color} />
            </PlayingCard>
        }
        </>
    );
}

export default CurrentCard;