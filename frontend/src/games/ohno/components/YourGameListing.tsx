import { Card, Popover, Grid, Box, Text } from "@mantine/core";
import { Info, Circle } from "feather-icons-react";
import type { Game } from "../../../types/game";
import type { User } from "../../../types/user";

const YourGameListing = ({ game, user }: { game: Game, user: User }) => {
  const isUserTurn = game.turn_player?.user?.id === user.id;
  const lastPlayTime = (game.round > 0) ? "2hrs ago" : null; // Placeholder logic

  return (
    <Card component="a" href={`/ohno/game/${game.id}`} pos="relative" padding="sm" bg="orange.2" shadow="xs" className="mb-2">
      <Grid justify="space-between" align="center">
        <Grid.Col span={3}>
          <Text size="xs" fw={600}>#{game.id}</Text>
        </Grid.Col>
        <Grid.Col span={6} className="text-left">
          <Text size="xs">{game.players.length} players</Text>
          {lastPlayTime && (
            <Text size="xs">Last play: {lastPlayTime}</Text>
          )}
        </Grid.Col>
        <Grid.Col span={3} className="text-right">
          <Box>
            <Popover width={300} position="top" withArrow shadow="md" opened={true}>
              <Popover.Target>
                <Info
                  size={16}
                  className="text-blue-500 ml-auto"
                  fill="white"
                />
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="sm">
                  <strong>Players:</strong> {game.players.map(p => p.name).join(", ")}<br />
                  {game.started_at && (
                    <>
                      <strong>Started:</strong> {new Date(game.started_at).toLocaleDateString()}<br />
                      <strong>Current Turn:</strong> {game.turn_player?.name || "N/A"}<br />
                    </>
                  )}
                </Text>
              </Popover.Dropdown>
            </Popover>
          </Box>

          {isUserTurn && (
            <Box title="It's your turn!" mb={2}>
              <Circle
                size={16}
                className="text-green-500 ml-auto"
                fill="currentColor"
              />
            </Box>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default YourGameListing;