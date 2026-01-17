import type { Game, GamePlayer, GameCard } from "../../types/game";

export type OhnoColor = 'Red' | 'Yellow' | 'Green' | 'Blue';
export type OhnoGroup = OhnoColor | 'Wild';

export interface OhnoCard extends GameCard {
    face: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 's' | 'r' | 'd2' | 'w' | 'd4';
    group: OhnoGroup;
};

export interface OhnoGame extends Game {
    current_card?: string;
    reverse?: boolean;
    wild?: boolean;
    wild_color?: OhnoColor;
};

export interface OhnoPlayer extends GamePlayer {
    cards: string[];
    user_profile_id?: number;
    turn_order?: number;
}
