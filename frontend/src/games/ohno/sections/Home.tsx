import { Box, Card, Text, Title, Grid, Popover, LoadingOverlay } from "@mantine/core";
import FeltSection from "../../../components/FeltSection"
import { ArcadeButton } from "../../../components/buttons/ArcadeButton";
import { Circle, Info } from "feather-icons-react";
import NewGame from "../components/NewGame";
import { useState } from "react";

interface OhnoHomeProps {
  csrfToken: string;
}

const OhnoHome = ({ csrfToken }: OhnoHomeProps) => {
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <FeltSection color="blue" colorLevel={7}>
      <NewGame {...{ newGameOpen, setNewGameOpen, setLoading, csrfToken }} />

      <LoadingOverlay visible={loading} />

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
            <ArcadeButton color="green" size="lg" label="START GAME" className="mt-12" callback={() => {
              setNewGameOpen(true);
            }} />
          </Box>
        </Card>
      </Box>
      
      <Box pb={12}>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 4 }} className="text-left">
            <Card padding="md" shadow="sm" bg="yellow.2">
              <Title order={3} className="text-red-500 text-center mx-auto">Your Games</Title>
              <Text mt={8} size="sm">Ongoing games where you are a player. Jump back in!</Text>

              <Box h="300px" mt={8} pt={8} className="overflow-y-auto cursor-pointer">
                {/* List user's ongoing games here */}
                <Card pos="relative" padding="sm" bg="orange.2" shadow="xs" className="mb-2">
                  <Grid justify="space-between" align="center">
                    <Grid.Col span={3}>
                      <Text size="xs" fw={600}>#12345</Text>
                    </Grid.Col>
                    <Grid.Col span={6} className="text-left">
                      <Text size="xs">5 players</Text>
                      <Text size="xs">Last play: 2hrs ago</Text>
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
                              <strong>Players:</strong> Alice, Bob, Charlie, You, Eve<br />
                              <strong>Started:</strong> Jan 1, 2024<br />
                              <strong>Current Turn:</strong> Charlie<br />
                            </Text>
                          </Popover.Dropdown>
                        </Popover>
                      </Box>
                      <Box title="It's your turn!" mb={2}>
                        <Circle
                          size={16}
                          className="text-green-500 ml-auto"
                          fill="currentColor"
                        />
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Card>
                <Card pos="relative" padding="sm" bg="orange.2" shadow="xs" className="mb-2">
                  <Grid justify="space-between" align="center">
                    <Grid.Col span={3}>
                      <Text size="xs" fw={600}>#12345</Text>
                    </Grid.Col>
                    <Grid.Col span={6} className="text-left">
                      <Text size="xs">5 players</Text>
                      <Text size="xs">Last play: 2hrs ago</Text>
                    </Grid.Col>
                    <Grid.Col span={3} className="text-right">
                      <Box title="It's your turn!" mb={2}>
                        <Circle
                          size={16}
                          className="text-green-500 ml-auto"
                          fill="currentColor"
                        />
                      </Box>
                      <Box>
                        <Info
                          size={16}
                          className="text-blue-500 ml-auto"
                          fill="white"
                        />
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Card>
                <Card pos="relative" padding="sm" bg="orange.2" shadow="xs" className="mb-2">
                  <Grid justify="space-between" align="center">
                    <Grid.Col span={3}>
                      <Text size="xs" fw={600}>#12345</Text>
                    </Grid.Col>
                    <Grid.Col span={6} className="text-left">
                      <Text size="xs">5 players</Text>
                      <Text size="xs">Last play: 2hrs ago</Text>
                    </Grid.Col>
                    <Grid.Col span={3} className="text-right">
                      <Box title="It's your turn!" mb={2}>
                        <Circle
                          size={16}
                          className="text-green-500 ml-auto"
                          fill="currentColor"
                        />
                      </Box>
                      <Box>
                        <Info
                          size={16}
                          className="text-blue-500 ml-auto"
                          fill="white"
                        />
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Card>
                <Card pos="relative" padding="sm" bg="orange.2" shadow="xs" className="mb-2">
                  <Grid justify="space-between" align="center">
                    <Grid.Col span={3}>
                      <Text size="xs" fw={600}>#12345</Text>
                    </Grid.Col>
                    <Grid.Col span={6} className="text-left">
                      <Text size="xs">5 players</Text>
                      <Text size="xs">Last play: 2hrs ago</Text>
                    </Grid.Col>
                    <Grid.Col span={3} className="text-right">
                      <Box title="It's your turn!" mb={2}>
                        <Circle
                          size={16}
                          className="text-green-500 ml-auto"
                          fill="currentColor"
                        />
                      </Box>
                      <Box>
                        <Info
                          size={16}
                          className="text-blue-500 ml-auto"
                          fill="white"
                        />
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Card>

                <Text size="sm" fw={700} className="text-center font-bolder mt-4 text-blue-600 hover:underline cursor-pointer">
                  Plus 3 more...
                </Text>
              </Box>
            </Card>
          </Grid.Col>

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
    </FeltSection>
  );
};

export default OhnoHome;