import { Card, Group, Switch, Divider, Text, Box } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import FeltSection from "../../../components/FeltSection";
import type { SettingsSectionProps } from "../Section";
import axios from "axios";
import { toast } from "react-toastify";

const SettingsSection = ({ csrfToken, userProfile }: SettingsSectionProps) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		
		const formData = new FormData(event.currentTarget);
		axios.post("/api/account/settings/", formData, {
			headers: {
				"X-CSRFToken": csrfToken,
			},
		})
		.then(() => {
			toast.success("Account settings updated successfully.");
		})
		.catch((error) => {
			console.error("There was an error updating the account info!", error);
			toast.error("Error updating account info. Please try again.");
		});
	};
	return (
		<FeltSection color="cyan" colorLevel={6}>
			<label className="text-white block my-2 font-bold">Account Settings</label>
			<form onSubmit={handleSubmit}>
				<input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
				<Card className="p-4 mb-4 text-black">
					<Fragment>
						<label className="block mb-2 font-bold">Public Listing</label>
						<Text size="sm" mb={8} component="p">
							If turned on, your account will appear in public user listings.
							<strong> This will allow other users to challenge you to games.</strong>
						</Text>

						<Group>
							<Switch
								id="public_listing"
								name="public_listing"
								value="1"
								defaultChecked={userProfile?.public_listing}
							/>
							<label htmlFor="public_listing" className="ml-0">Enable Public Listing</label>
						</Group>
					</Fragment>

					<Divider my={16} />

					<Fragment>
						<label className="block mb-2 font-bold">Are you 18 or older?</label>
						<Text size="sm" mb={8} component="p">
							<strong>This site is for all ages! </strong>
							However, some features may be restricted to users who are 18 or older.
						</Text>

						<Group>
							<Switch
								id="over_18"
								name="over_18"
								value="1"
								defaultChecked={userProfile?.over_18}
							/>
							<label htmlFor="over_18" className="ml-0">I am 18 years or older</label>
						</Group>
					</Fragment>

					<Box className="text-end w-full pt-4 pb-0">
						<ArcadeButtonWide color="blue" type="submit" label="Save Settings" />
					</Box>
				</Card>
			</form>
		</FeltSection>
	);
};

export default SettingsSection;