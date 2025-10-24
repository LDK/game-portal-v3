import { Card, TextInput, Box } from "@mantine/core";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import FeltSection from "../../../components/FeltSection";
import type { SettingsSectionProps } from "../Section";
import axios from "axios";
import { toast } from "react-toastify";

const InfoSection = ({ csrfToken, userProfile }: SettingsSectionProps) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		
		const formData = new FormData(event.currentTarget);
		axios.post("/api/account/info/", formData, {
			headers: {
				"X-CSRFToken": csrfToken,
			},
		})
		.then((result) => {
			// alert("Account info updated successfully.");
			if (result?.data.display_name && result.data.display_name !== userProfile.display_name) {
				window.location.reload();
			} else {
				toast.success("Account info updated successfully.");
			}
		})
		.catch((error) => {
			console.error("There was an error updating the account info!", error);
			toast.error("Error updating account info. Please try again.");
		});
	};

	return (
		<FeltSection color="indigo" colorLevel={6}>
				<label className="text-white block my-2 font-bold">Account Info</label>

				<form onSubmit={handleSubmit} method="POST" action="/account/info/">
					<input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
					<Card className="p-4 mb-4 text-black">
							<TextInput
									label="Email"
									name="email"
									defaultValue={userProfile?.email}
									mb={8}
									disabled
							/>

							<TextInput
									label="Display Name"
									name="display_name"
									mb={8}
									defaultValue={userProfile?.display_name}
							/>

							<TextInput
									label="First Name"
									name="first_name"
									mb={8}
									defaultValue={userProfile?.first_name}
							/>

							<TextInput
									label="Last Name"
									name="last_name"
									mb={8}
									defaultValue={userProfile?.last_name}
							/>

							<Box className="text-end w-full pt-4 pb-0">
							<ArcadeButtonWide color="violet" type="submit" label="Save Info" />
							</Box>
					</Card>
				</form>
		</FeltSection>
	);
};

export default InfoSection;