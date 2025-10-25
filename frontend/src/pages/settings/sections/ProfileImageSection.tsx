import { Box } from "@mantine/core";
import { ArcadeButtonWide } from "../../../components/buttons/ArcadeButtonWide";
import FeltSection from "../../../components/FeltSection";

interface ProfileImageSectionProps {
	imageUrl: string | null;
	openWidget: () => void;
	onClearImage: () => void;
}

const ProfileImageSection = ({ imageUrl, openWidget, onClearImage }: ProfileImageSectionProps) => (
	<FeltSection>
    <label className="text-white block my-2 font-bold">Profile Image</label>
    <Box
			my={8}
			w="100%"
			className="border bg-white flex items-center justify-center overflow-hidden"
    >
    {imageUrl ? (
			<img
			src={imageUrl}
			alt="Profile"
			className="object-cover w-full h-full"
			/>
    ) : (
			<Box mih={{ base: 64, sm: 96, md: 128, lg: 420 }} className="flex items-center justify-center">
			<span className="text-gray-500 text-sm">No image</span>
			</Box>
    )}
    </Box>

    <Box className="text-end w-full py-1">
    <ArcadeButtonWide className="mr-2" textSize="sm" color="lime" label="Upload Image" callback={openWidget} />
    <ArcadeButtonWide textSize="sm" color="rose" label="Clear Image" callback={onClearImage} />
    </Box>
	</FeltSection>
);

export default ProfileImageSection;