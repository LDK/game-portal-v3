import { Card, Box, Text } from "@mantine/core";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import SolidSection from "../../../components/layout/SolidSection";
import type { SettingsSectionProps } from "../Section";
import { useState } from "react";

const PasswordSection = ({ csrfToken }: SettingsSectionProps) => {
	const [linkSent, setLinkSent] = useState(false);

	return (
    <SolidSection color="red" colorLevel={7}>
			<label className="text-white block my-2 font-bold">Reset Password</label>
			<form method="POST" action="/settings/">
				<input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
				<Card className="p-4 mb-4 text-black">
					<Text size="sm" mb={8} component="p">
						If you have lost or forgotten your password, you can reset it by clicking the button below.&nbsp;
						<strong>A reset link will be sent to your registered email address.</strong>
					</Text>

					{linkSent && (
						<Box my={8} className="p-4 bg-green-100 border border-green-400 text-green-800 rounded">
							A password reset link has been sent to your email address.
						</Box>
					)}

					<Box className="text-end w-full pt-4 pb-0">
						<ArcadeButtonWide
							color="orange"
							label={linkSent ? "Send Reset Link Again" : "Reset Password"}
							callback={() => {
								setLinkSent(true);
							}}
						/>
					</Box>
				</Card>
			</form>
    </SolidSection>
	);
};

export default PasswordSection;