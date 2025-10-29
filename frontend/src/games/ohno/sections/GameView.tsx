// Oh No! Game View Component
import { useEffect, useState } from "react";
import SolidSection from "../../../components/layout/SolidSection";
import type { OhnoPlayer, OhnoGame } from "../types";
import type { GameLog } from "../../../types/game";
import { Box, Divider, Grid, List, Text, Title } from "@mantine/core";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import { Users, RefreshCcw, RefreshCw, Monitor } from "feather-icons-react";
import axios from "axios";
import LogBox from "../components/LogBox";

interface GameViewProps {
    gameId: string;
    csrfToken: string;
};

const playerByTurnOrder = (order:number, players:OhnoPlayer[]) => {
  console.log('Looking for player with turn order:', order, players);
  return players.find(player => player.play_order === (order || 1)) as OhnoPlayer;
};

const PlayersDisplay = ({ players, reverse, turnOrder }: { players: OhnoPlayer[]; reverse: boolean; turnOrder: number }) => {
  const numRectangles = players.length;
  const radius = players.length <= 6 ? 80 : 100; // radius of the circle
  const rectWidth = players.length <= 4 ? 100 : 70;
  const nameCutoff = players.length <= 6 ? 10 : 9;
  const rectHeight = 60;
  const angleStep = 360 / numRectangles;

  return (
    <div className="circle-container">
      <div className="circle relative" style={{ width: radius * 2, height: radius * 2 }}>
        { reverse
          ? <RefreshCcw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          : <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        }
        {Array.from({ length: numRectangles }).map((_, index) => {
          const angle = angleStep * index;
          const transform = `
            rotate(${angle}deg) 
            translate(${radius}px) 
            rotate(-${angle}deg)
          `;

          const player = playerByTurnOrder(index + 1, players);

          console.log('Rendering player:', player);

          return (
            <div
              key={index}
              className="rectangle"
              style={{
                width: rectWidth,
                height: rectHeight,
                transform: transform,
                color: 'black',
                textAlign: 'center',
                backgroundColor: player?.play_order === turnOrder ? 'gold' : 'white',
              }}>
                {/* <span className="font-extrabold w-100 block">Christopher…</span> */}
                <span className="font-normal w-100 block">{player.name.length > nameCutoff ? player.name.slice(0, nameCutoff) + '…' : player.name}</span>
                <div className="mx-auto rounded-md w-6 h-8 bg-black inline-block text-black text-xs">
                  OH<br />
                  NO
                </div>
                
                <span>x{player.cards.length}</span>

            </div>
          );
        })}
      </div>
    </div>
  );
};

const PlayersList = ({ players, game, csrfToken }: { players: OhnoPlayer[]; game: OhnoGame; csrfToken: string }) => {
  return (
    <>
      <Title order={3} mb={8} className="text-black text-left text-yellow-500">Players</Title>
      <Box className="w-full h-auto bg-white border-black rounded bg-opacity-50 text-black p-4 min-h-48 overflow-y-auto text-left relative">
        <List spacing="xs" size="sm" style={{ marginBottom: '4rem' }}>
          {players.map((player, index) => (
            <List.Item key={index}>
              <>{index+1}. {player.name}{player.is_human ? '' : <Monitor style={{ display: 'inline', marginLeft: '.25rem' }} width="16px" /> }</>
            </List.Item>
          ))}
        </List>

        {!game.started_at && (
          <Box pos="absolute" bottom={16} w="94%" left="3%" className="text-center">
            <Divider my="sm" />

            <Grid justify="space-between" align="center">
              <Grid.Col span={7} className="text-left">
                <Text size="sm" c="gray.6" className="mt-2 italic">Order will be shuffled when game starts.</Text>
              </Grid.Col>
              <Grid.Col span={2} className="text-center">
                <Text size="sm" c="black" className="mt-2 italic">
                  <Users style={{ margin: 'auto' }} />
                  {players.length}/{game.max_players}
                </Text>
              </Grid.Col>
              <Grid.Col span={3} className="text-right">
                <ArcadeButtonWide color="blue" size="sm" label="+CPU" className="" callback={() => {
                  const formData = new FormData();
                  formData.append('game_id', game.id);
                  axios.post(`add-cpu-player/`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data', 'X-CSRFToken': csrfToken } }
                  ).then(response => {
                    console.log('CPU player added:', response.data);
                  });
                }} />
              </Grid.Col>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};

const GameView = ({ gameId, csrfToken }: GameViewProps) => {
  const [log, setLog] = useState<GameLog[]>([]);
  const [players, setPlayers] = useState<OhnoPlayer[]>([]);
  const [game, setGame] = useState<OhnoGame | null>(null);

  const fetchGameData = async () => {
    // Placeholder for fetching game data logic
    fetch(`info/`).then(response => response.json()).then(data => {
      const { game_log, players, ...gameData } = data;

      if (game_log) {
        setLog(game_log as GameLog[]);
      }
      if (players) {
        setPlayers(players as OhnoPlayer[]);
      }
      setGame(gameData as OhnoGame);
    });
  };


  const handleStartGame = () => {
    axios.post(`start/`, {}, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then((result) => {
      console.log('Game started:', result.data);
      fetchGameData();
    })
    .catch((error) => {
      console.error("There was an error starting the game!", error);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameId) {
        fetchGameData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  useEffect(() => {
    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);

  return (
    <SolidSection color="green" colorLevel={7}>
      <Box h="75vh" w="100%" className="items-top justify-start overflow-hidden relative pt-2">
        <Grid justify="start" align="top">
          <Grid.Col span={{ base: 12, sm: 6 }} className="text-center mb-4">
            {(game && !game.started) && (
              <PlayersList {...{ players, game, csrfToken }} />
            )}
            {game?.started && (
              <PlayersDisplay {...{ players, reverse: game.reverse || false, turnOrder: game.turn_order || 1 } } />
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }} className="text-center mb-4">
            <Title order={3} mb={8} className="text-black text-left text-yellow-500">Game Log</Title>
            <LogBox dataCallback={setLog} {...{ log, gameId, csrfToken }} />
          </Grid.Col>
        </Grid>

        {game?.started && (
          <Box className="absolute bottom-4 w-full right-0 text-right">
              <ArcadeButtonWide color="white" size="sm" label="INVITE PLAYERS" className="mr-4" callback={() => {
                // Start game logic
              }} />
              <ArcadeButtonWide color="blue" size="sm" label="START GAME" className="" callback={handleStartGame} />
          </Box>
        )}
      </Box>
    </SolidSection>
  );
};

export default GameView;