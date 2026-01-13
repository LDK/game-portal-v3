// Oh No! Game View Component
import { Fragment, useEffect, useMemo, useState } from "react";
import SolidSection from "../../../components/layout/SolidSection";
import type { OhnoPlayer, OhnoGame } from "../types";
import type { GameLog } from "../../../types/game";
import { Box, Divider, Grid, List, Modal, Text, Title } from "@mantine/core";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import { Users, Monitor } from "feather-icons-react";
import axios from "axios";
import LogBox from "../components/LogBox";
import CurrentCard from "../components/CurrentCard";
import { CardHand, PlayingCard, OhnoFace } from "../../../components/cards";

interface GameViewProps {
    gameId: string;
    csrfToken: string;
};

const PlayersDisplay = ({ players, reverse, turnOrder }: { players: OhnoPlayer[]; reverse: boolean; turnOrder: number }) => {
  return (
    <>
      <Title order={3} mb={8} className={`text-black text-left text-yellow-500 ${reverse ? 'bg-red-500' : ''}`}>Players</Title>
      <Box className="w-full h-auto bg-white border-black rounded bg-opacity-50 text-black p-4 min-h-48 overflow-y-auto text-left relative">
        <List spacing="xs" size="sm" style={{ marginBottom: '4rem' }}>
          {players.map((player, index) => (
            <List.Item py={2} px={4} my={0} key={index} bg={ (player.play_order === turnOrder) ? 'orange' : 'transparent' } className={ (player.play_order === turnOrder) ? 'text-white font-bold' : '' }>
              <>{index+1}. {player.name}{player.is_human ? '' : <Monitor style={{ display: 'inline', marginLeft: '.25rem' }} width="16px" /> }</>
            </List.Item>
          ))}
        </List>
      </Box>
    </>
  );
};

const PlayersList = ({ players, game, csrfToken, dataCallback }: { players: OhnoPlayer[]; game: OhnoGame; csrfToken: string; dataCallback: (data: GameLog[]) => void }) => {
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
                    if (response.data) {
                      dataCallback(response.data as GameLog[]);
                    }
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

const WildModal = ({ player, hand, csrfToken, opened }: { player: OhnoPlayer; hand?: string[]; csrfToken: string; opened?: boolean }) => {
  if (!player || !hand?.filter) return null;

  const colorCount = {
    'Red': hand.filter(card => card.startsWith('r')).length,
    'Blue': hand.filter(card => card.startsWith('b')).length,
    'Green': hand.filter(card => card.startsWith('g')).length,
    'Yellow': hand.filter(card => card.startsWith('y')).length,
  };

  const handlePickColor = (color: string) => {
    // Implement color pick logic here, e.g., send to server
    axios.post(`wild/`, {
      player_id: player.id,
      color: color,
    }, {
      headers: {
        'X-CSRFToken': csrfToken, // Add CSRF token if needed
      },
    })
    .then((/*result*/) => {
      // Close modal or update state as needed
    })
    .catch((error) => {
      console.error("There was an error picking the color!", error);
    });
  };

  return (
    <Modal
      size="lg"
      opened={opened || false}
      onClose={() => {}}
      title="Choose a color"
    >
      <Grid justify="center" align="center" gutter="sm" pt={8}>
        {['Red', 'Yellow', 'Green', 'Blue'].map((color) => {
          let boxColor = '';
          switch (color) {
            case 'Red':
              boxColor = 'red';
              break;
            case 'Yellow':
              boxColor = 'yellow';
              break;
            case 'Green':
              boxColor = 'green';
              break;
            case 'Blue':
              boxColor = 'cyan';
              break;
          }

          return (
            <Grid.Col span={6} key={color} className="text-center">
              <Box className={`w-full h-24 bg-${boxColor}-500 rounded flex items-center justify-center cursor-pointer hover:scale-105 transform transition`} onClick={() => handlePickColor(color)}>
                {color} ({colorCount[color as keyof typeof colorCount]} cards)
              </Box>
            </Grid.Col>
          );
        })}
      </Grid>
    </Modal>
  );
};

const GameView = ({ gameId, csrfToken }: GameViewProps) => {
  const [log, setLog] = useState<GameLog[]>([]);
  const [players, setPlayers] = useState<OhnoPlayer[]>([]);
  const [userPlayerId, setUserPlayerId] = useState<string | undefined>('');
  const [game, setGame] = useState<OhnoGame | null>(null);
  const [activeHandIndex, setActiveHandIndex] = useState<number>(-1);
  // const [turnOrder, setTurnOrder] = useState<number>(1);

  // User's cards
  const [hand, setHand] = useState<string[]>([]);

  const playableCards = useMemo<string[]>(() => {
    if (!game || !hand) return [];
    // Logic to determine playable cards based on game.current_card

      let playable = hand.filter(cardId => {
      const cardFace = cardId[1];
      const cardColor = cardId.startsWith('r') ? 'Red' : cardId.startsWith('b') ? 'Blue' : cardId.startsWith('g') ? 'Green' : cardId.startsWith('y') ? 'Yellow' : 'Wild';
      const currentFace = game.current_card ? game.current_card[1] : null;
      const currentColor = game.current_card ? (game.current_card.startsWith('r') ? 'Red' : game.current_card.startsWith('b') ? 'Blue' : game.current_card.startsWith('g') ? 'Green' : game.current_card.startsWith('y') ? 'Yellow' : 'Wild') : null;

      if (game.wild_color) {
        return cardColor === game.wild_color || cardId === 'w';
      }

      if (!game.current_card) return false;

      return cardColor === currentColor || cardFace === currentFace || cardId === 'w';
    });

    if (!playable.length) {
      playable = hand.filter(cardId => cardId === 'wd');
    }

    return playable;
  }, [game, hand]);

  const userPlayer = useMemo(() => {
    return players.find(p => p.id === userPlayerId);
  }, [players, userPlayerId]);

  useEffect(() => {
    if (userPlayer && userPlayer.cards) {
      setHand(userPlayer.cards);
    }
  }, [userPlayer]);

  const handleStartGame = () => {
    axios.post(`start/`, {}, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then((result) => {
      if (result.data.game) {
        setGame(result.data.game as OhnoGame);
      }
      if (result.data.log) {
        setLog(result.data.log as GameLog[]);
      }
    })
    .catch((error) => {
      console.error("There was an error starting the game!", error);
    });
  };

  const handlePlayCard = (cardId: string) => {
    axios.post(`play/`, {
      card_id: cardId,
    }, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then((result) => {
      if (result.data.game) {
        setGame(result.data.game as OhnoGame);
      }
      if (result.data.log) {
        setLog(result.data.log as GameLog[]);
      }
    })
    .catch((error) => {
      console.error("There was an error playing the card!", error);
    });
  };

  useEffect(() => {
    const fetchGameData = async () => {
      // Placeholder for fetching game data logic
      fetch(`info/`).then(response => response.json()).then(data => {
        const { game_log, players, ...gameData } = data;

        if (gameData.user_player_id) {
          setUserPlayerId(gameData.user_player_id);
        }

        if (game_log) {
          const data_latest_ts = game_log.length > 0 ? game_log[game_log.length - 1].timestamp : null;
          const latest_log_ts = log.length > 0 ? log[log.length - 1].timestamp : null;

          // Only update log if there's new data
          if ((data_latest_ts && latest_log_ts && data_latest_ts > latest_log_ts) || !latest_log_ts) {
            setLog(game_log as GameLog[]);
          }
        } else {
          setLog(game_log as GameLog[]);
        }

        if (players) {
          setPlayers(players as OhnoPlayer[]);
        }
        setGame(gameData as OhnoGame);
      });
    };

    if (gameId) {
      fetchGameData();
    }
    // const interval = setInterval(() => {
    //   if (gameId) {
    //     fetchGameData();
    //   }
    // }, 5000);
    // return () => clearInterval(interval);
  }, [gameId, log]);

  return (
    <Fragment>
      {userPlayer && <WildModal player={userPlayer} hand={hand} csrfToken={csrfToken} opened={game?.wild} />}
      <Text c="yellow" component="a" href="/ohno/" className="text-white hover:underline hover:text-yellow-400">
        &laquo; Back to Oh No! Home
      </Text>
      <SolidSection color="green" colorLevel={7}>
        <Box h="75vh" w="100%" className="items-top justify-start overflow-hidden relative pt-2">
          <Grid justify="start" align="top">
            <Grid.Col span={{ base: 12, sm: 6 }} className="text-center mb-4">
              {(game && !game.started_at) && (
                <PlayersList {...{ players, game, csrfToken, dataCallback: setLog }} />
              )}
              {(game && game.started_at) && (
                <>
                  <CurrentCard game={game} wildColor={game?.wild_color} />

                  <Box pos="relative" w="100%" className="my-4">
                    <div className="absolute z-1 w-full">
                      <CardHand fan={false}>
                        {hand.sort((a,b) => {
                          return ((playableCards.includes(a) ? 1 : 0) - (playableCards.includes(b) ? 1 : 0)); 
                        }).map((cardId, index) => (
                          <PlayingCard onClick={() => handlePlayCard(cardId)} disabled={!playableCards.includes(cardId)} key={index} clickable={true} activeHandIndex={activeHandIndex} setActiveHandIndex={setActiveHandIndex} handIndex={index}>
                            <OhnoFace face={cardId[1]} color={cardId.startsWith('r') ? 'Red' : cardId.startsWith('b') ? 'Blue' : cardId.startsWith('g') ? 'Green' : cardId.startsWith('y') ? 'Yellow' : 'Wild'} />
                          </PlayingCard>
                        ))}
                      </CardHand>
                    </div>
                    <div className="absolute z-2 w-full pointer-events-none">
                      <CardHand fan={false}>
                        {hand.map((cardId, index) => (
                          <PlayingCard key={index} clickable={false} ghost={true} handIndex={index} activeHandIndex={activeHandIndex}>
                            <OhnoFace face={cardId[1]} ghost={true} color={cardId.startsWith('r') ? 'Red' : cardId.startsWith('b') ? 'Blue' : cardId.startsWith('g') ? 'Green' : cardId.startsWith('y') ? 'Yellow' : 'Wild'} />
                          </PlayingCard>
                        ))}
                      </CardHand>
                    </div>
                  </Box>
                </>
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }} className="text-center mb-4">
              <Title order={3} mb={8} className="text-black text-left text-yellow-500">Game Log</Title>
              <LogBox dataCallback={setLog} {...{ log, gameId, csrfToken }} />
              {game?.started_at && (
                <PlayersDisplay {...{ players, reverse: game.reverse || false, turnOrder: game.turn_order || 1 } } />
              )}
            </Grid.Col>
          </Grid>

          {(game && !game.started_at) && (
            <Box className="absolute bottom-4 w-full right-0 text-right">
                <ArcadeButtonWide color="white" size="sm" label="INVITE PLAYERS" className="mr-4" callback={() => {
                  // Start game logic
                }} />
                <ArcadeButtonWide color="blue" size="sm" label="START GAME" className="" callback={handleStartGame} />
            </Box>
          )}
        </Box>
      </SolidSection>
    </Fragment>
  );
};

export default GameView;