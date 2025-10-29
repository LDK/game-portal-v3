import { Box, Card, Text, Title } from "@mantine/core";
import type { User } from "../../../types/user";
import type { Game } from "../../../types/game";
import YourGameListing from "./YourGameListing";

interface YourGamesProps {
	games: Game[];
	user: User;
}

const YourGames = ({ games, user }: YourGamesProps) => {
	return (
		<Card padding="md" shadow="sm" bg="yellow.2">
			<Title order={3} className="text-red-500 text-center mx-auto">Your Games</Title>
			<Text mt={8} size="sm">Ongoing games where you are a player. Jump back in!</Text>

			<Box h="300px" mt={8} pt={8} className="overflow-y-auto cursor-pointer">
				{/* List user's ongoing games here */}
				{games.map((game, index) => (
					<YourGameListing key={index} game={game} user={user} />
				))}

				<Text size="sm" fw={700} className="text-center font-bolder mt-4 text-blue-600 hover:underline cursor-pointer">
					Plus 3 more...
				</Text>
			</Box>
		</Card>
	);
};

export default YourGames;