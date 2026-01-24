import { Box, Card, Text, Title } from "@mantine/core";
import type { User } from "../../../types/user";
import type { Game } from "../../../types/game";
import GameListing from "./GameListing";
import LoadingOverlay from "../../../components/LoadingOverlay";

interface OpenGamesProps {
	games: Game[];
	moreGamesCount: number;
	userProfile: User;
	loading?: boolean;
}

const OpenGames = ({ games, moreGamesCount, userProfile, loading = false }: OpenGamesProps) => {
	return (
		<Card padding="md" shadow="sm" bg="cyan.2">
			<LoadingOverlay visible={loading} color1="teal" color2="cyan" />
			<Title order={3} className="text-green-900 text-center mx-auto">Open Games</Title>
			<Text mt={8} size="sm">Games that are open for anyone to hop in. Join the fun!</Text>

			<Box h="300px" mt={8} pt={8} className="overflow-y-auto cursor-pointer">
				{/* List user's ongoing games here */}
				{games.map((game, index) => (
					<GameListing key={index} game={game} user={userProfile} />
				))}

				{moreGamesCount > 0 && (
					<Text size="sm" fw={700} className="text-center font-bolder mt-4 text-blue-600 hover:underline cursor-pointer">
						Plus {moreGamesCount} more...
					</Text>
				)}
			</Box>
		</Card>
	);
};

export default OpenGames;