import type { User } from "../../types/user";

export interface SettingsSectionProps {
    csrfToken: string;
    userProfile: User;
}