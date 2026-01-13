import { Box, Card, Text, Title, Grid, LoadingOverlay } from "@mantine/core";
import { ArcadeButton } from "../../../components/buttons/ArcadeButton";
import NewGame from "../components/NewGame";
import { useEffect, useState } from "react";
import SolidSection from "../../../components/layout/SolidSection";
import YourGames from "../components/YourGames";
import type { Game } from "../../../types/game";
import type { User } from "../../../types/user";

interface OhnoHomeProps {
  csrfToken: string;
  userProfile?: User;
}

const OhnoHome = ({ csrfToken, userProfile }: OhnoHomeProps) => {
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [moreGamesCount, setMoreGamesCount] = useState(0);

  const gameListLimit = 5;

  useEffect(() => {
    const fetchUserGames = async () => {
      if (userProfile) {
        setLoading(true);
        try {
          const response = await fetch(`games/me/${gameListLimit}/`);
          const data = await response.json();

          setUserGames(data.games);
          setMoreGamesCount(data.count - gameListLimit);
        } catch (error) {
          console.error("Error fetching user games:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserGames();
  }, [userProfile]);

  return (
    <SolidSection color="blue" colorLevel={7}>
      <NewGame {...{ newGameOpen, setNewGameOpen, setLoading, csrfToken }} />

      <Box py={12}>
        <Grid align="center" gutter="md">
          <Grid.Col span={{ base: 6 }}>
            <Title className="text-yellow-500">Oh No!</Title>
          </Grid.Col>
          <Grid.Col span={{ base: 6 }} className="text-right">
            <a href="leaderboard" className="hover:underline text-white hover:text-yellow-400">
              View Leaderboard
            </a>
          </Grid.Col>
        </Grid>
        <Card mt={12}>
          <Text>
            Welcome to a classic, fast-paced card game where you'll match colors and numbers while
            your opponents try to trip you up with <strong>Skips</strong>, <strong>Reverses</strong>, and&nbsp;
            <strong>Draw Twos</strong>! The objective is to be the first to get rid of all your cards.
          </Text>
          <Text mt={8}>
            On your turn, play a card that matches the color or number of the top card on the discard pile.
            Or, go <strong>Wild</strong> and change the color to your advantage!
            If you can't play, draw a card from the deck. Don't forget to shout <strong>Oh No!</strong> when you're down to
            one card left. (Although nobody can hear you through the internet...)
          </Text>
          <Box className="w-full justify-end text-right">
            <ArcadeButton color="green" size="lg" label={<>NEW<br />GAME</>} className="mt-12" callback={() => {
              setNewGameOpen(true);
            }} />
          </Box>
        </Card>
      </Box>
      
      {(loading) && <LoadingOverlay visible={true} />}
      {!loading && userProfile && (
        <Box pb={12}>
          <Grid gutter="md">
            {userProfile && (
              <Grid.Col span={{ base: 12, sm: 4 }} className="text-left">
                <YourGames {...{ games: userGames, userProfile, moreGamesCount }} />
              </Grid.Col>
            )}

            <Grid.Col span={{ base: 12, sm: 4 }} className="text-center">
              <Card padding="md" shadow="sm">
                <Title order={3} className="text-green-500">Open Games</Title>
                <Text mt={8} size="sm">Games that are open for anyone to hop in. Join the fun!</Text>
                <Text mt={8}>(show up to 5 open games with a link for more if needed)</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }} className="text-center">
              <Card padding="md" shadow="sm">
                <Title order={3} className="text-yellow-500">Easy to Learn</Title>
                <Text mt={8}>Simple rules make it accessible for everyone.</Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Box>
      )}
    </SolidSection>
  );
};

export default OhnoHome;
