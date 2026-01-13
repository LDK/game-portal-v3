// Import each game component here
import { useEffect, useState } from "react";
import OhNo from "../games/ohno";
import type { User } from "../types/user";
import { LoadingOverlay } from "@mantine/core";

interface GamePageProps {
  title: string;
  gameId?: string;
  section?: string;
  csrfToken: string;
  userProfile?: User;
};
  
const GamePage = ({ title, gameId, section, csrfToken, userProfile }: GamePageProps) => {
  let mainContent = <div>Game not found.</div>;
  const gameProps = { gameId, section, csrfToken, userProfile };
  const [loading, setLoading] = useState(true);
  const [, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setLoading(false);

      if (userProfile.profile_image) {
        setImageUrl(userProfile.profile_image);
      }
    }
  }, [userProfile]);

  switch (title) {
    case "ohno":
      mainContent = <OhNo.index {...gameProps} />;
      break;
    default:
      break;
  }

  return loading ? <LoadingOverlay visible={true} /> : mainContent;
};

export default GamePage;