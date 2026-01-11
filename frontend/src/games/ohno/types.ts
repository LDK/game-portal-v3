import type { Game, GamePlayer, GameCard } from "../../types/game";

export interface OhnoCard extends GameCard {
    face: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 's' | 'r' | 'd2' | 'w' | 'd4';
    group: 'Red' | 'Yellow' | 'Green' | 'Blue' | 'Wild';
};

export interface OhnoGame extends Game {
    current_card?: OhnoCard;
    reverse?: boolean;
    wild?: boolean;
    wild_color?: 'Red' | 'Yellow' | 'Green' | 'Blue' | null;
};

export interface OhnoPlayer extends GamePlayer {
    cards: string[];
    user_profile_id?: number;
}
