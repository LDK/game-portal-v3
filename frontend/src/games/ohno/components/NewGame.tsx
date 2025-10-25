import { Modal, Select, Switch, TextInput, Box } from "@mantine/core";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import axios from "axios";

interface OhNoNewGameProps {
	newGameOpen: boolean;
	setNewGameOpen: (open: boolean) => void;
	setLoading: (loading: boolean) => void;
	csrfToken: string;
}

const OhNoNewGame = ({ newGameOpen, setNewGameOpen, setLoading, csrfToken }: OhNoNewGameProps) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const maxPlayers = formData.get("max_players");
		const inviteOnly = formData.get("invite_only") === "on";
		const password = formData.get("password");

		setLoading(true);

		// Send data to backend to create new game
		axios.post("/ohno/new/", {
			max_players: maxPlayers,
			invite_only: inviteOnly,
			password: password
		}, {
			headers: {
				"X-CSRFToken": csrfToken
			}
		}).then((response) => {
			// On success, redirect to the new game page
			const gameId = response.data.id;
			window.location.href = `/ohno/game/${gameId}/`;
		}).catch((error) => {
			setLoading(false);
			// Handle error (e.g., show notification)
			console.error("Error creating game:", error);
		});
	};

	return (
		<Modal opened={newGameOpen} onClose={() => {}} title="Create New Game of Oh No!">
			<form method="POST" onSubmit={handleSubmit}>
				<Select
					name="max_players"
					label="Max # of Players"
					placeholder="Select number of players"
					defaultValue="4"
					data={[
						{ value: "2", label: "2 Players" },
						{ value: "3", label: "3 Players" },
						{ value: "4", label: "4 Players" },
						{ value: "5", label: "5 Players" },
						{ value: "6", label: "6 Players" },
						{ value: "7", label: "7 Players" },
						{ value: "8", label: "8 Players" },
						{ value: "0", label: "No Limit" },
					]}
				/>

				<Switch
					className="my-4"
					name="invite_only"
					label="Invite Only"
					description="Only invited players can join this game"
					defaultChecked={false}
				/>

				<TextInput
					name="password"
					label="Game Password (Optional)"
					placeholder="Enter a password to restrict access"
				/>

				<Box w="100%" className="text-right">
					<ArcadeButtonWide
						color="red"
						size="sm"
						label="Cancel"
						className="mt-4"
						callback={() => {
							setNewGameOpen(false);
						}}
					/>
					<ArcadeButtonWide
						color="green"
						size="sm"
						label="Create Game"
						className="mt-4 ml-2"
						type="submit"
					/>
				</Box>
			</form>
		</Modal>
	);
};

export default OhNoNewGame;