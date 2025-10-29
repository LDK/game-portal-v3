import type { Game } from "./game";

export interface User {
    id: string;
    email: string;
    display_name: string;
    secret_key: string;
    public_listing: boolean;
    over_18: boolean;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    games?: Game[];
};