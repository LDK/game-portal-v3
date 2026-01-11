import { Card, Popover, Grid, Box, Text } from "@mantine/core";
import { Info, Circle } from "feather-icons-react";
import type { Game } from "../../../types/game";
import type { User } from "../../../types/user";
import { useMemo, useState } from "react";
import moment from "moment";

const YourGameListing = ({ game, user }: { game: Game, user: User }) => {
  const isUserTurn = game.turn_player?.user?.id === user.id;
  const lastPlayTime = (game.round > 0 && game.last_play) ? moment(game.last_play).fromNow() : null;
  const [showPopover, setShowPopover] = useState(false);

  const bgColor = useMemo(() => {
    if (isUserTurn) {
      return "orange.2";
    } else if (game.started_at) {
      return "green.1";
    } else {
      return "white";
    }
  }, [isUserTurn, game.started_at]);

  return (
    <Card component="a" href={`/ohno/game/${game.id}`} pos="relative" padding="sm" bg={bgColor} shadow="xs" className="mb-2">
      <Grid justify="space-between" align="center">
        <Grid.Col span={3}>
          <Text size="xs" fw={600}>#{game.id}</Text>
        </Grid.Col>
        <Grid.Col span={6} className="text-left">
          <Text size="xs">{game.players.length}{!game.started_at ? `/${game.max_players} players` : ` players - Round ${game.round}`}</Text>
          {lastPlayTime && (
            <Text size="xs">Last play: {lastPlayTime}</Text>
          )}
        </Grid.Col>
        <Grid.Col span={3} className="text-right">
          <Box>
            <Popover width={300} position="top" withArrow shadow="md" opened={showPopover} onClose={() => setShowPopover(false)}>
              <Popover.Target>
                <Info
                  onMouseOver={() => setShowPopover(true)}
                  onMouseLeave={() => setShowPopover(false)}
                  size={16}
                  className="text-blue-500 ml-auto"
                  fill="white"
                />
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="sm">
                  <strong>Players:</strong> {game.players.map(p => p.name).join(", ")}<br />
                  {game.started_at ? 'Started by' : 'Created by'} <strong>{game.starter}</strong><br />
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