import { Title, Grid, Box, Button } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeltSection from "../components/FeltSection";
import { useEffect, useMemo, useCallback, useState } from "react";

interface SettingsPageProps {
  csrfToken: string;
}

const useUserProfile = () => {
  const [profile, setProfile] = useState<{ profile_image: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/userprofiles/me/")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching user profile:", err));
  }, []);

  return profile;
}

const SettingsPage = ({ csrfToken }: SettingsPageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const userProfile = useUserProfile();

  useEffect(() => {
    if (userProfile && userProfile.profile_image) {
      setImageUrl(userProfile.profile_image);
    }
  }, [userProfile]);

  // get Cloudinary object from window
  const cloudinary = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).cloudinary;
  }, []);

  useEffect(() => {
    if (cloudinary) {
      cloudinary.setCloudName("ddlsyquzw"); // your Cloudinary cloud name
      console.log("Cloudinary configured", cloudinary);
    }
  }, [cloudinary]);

  const openWidget = useCallback(() => {
    if (!cloudinary) {
      console.error("Cloudinary not loaded");
      return;
    }

    const widget = cloudinary.createUploadWidget(
      {
        cloudName: "ddlsyquzw",
        uploadPreset: "Rainy Day Profile Images",
        multiple: false,
        folder: "profile_images",
        sources: ["local", "camera", "url"],
        clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
        cropping: true,                     // enable cropping UI
        croppingAspectRatio: 1,             // enforce square
        croppingCoordinatesMode: "custom",  // client-side cropping
        croppingShowDimensions: true,
        showSkipCropButton: false,          // no bypass
        croppingValidateDimensions: true,   // ensures the cropped image is used
        croppingDefaultSelectionRatio: 1,   // start crop as perfect square
        croppingShowBackButton: false,      // keeps users in crop flow
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: unknown, result: any) => {
        if (error) {
          console.error("Upload error:", error);
          return;
        }
        if (result.event === "success") {
          console.log("Upload successful:", result.info);
          setImageUrl(result.info.secure_url);
          // optionally send it to your backend
          fetch("/api/upload-profile-image/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ image_url: result.info.secure_url }),
          });
        }
      }
    );

    widget.open();
  }, [cloudinary, csrfToken]);

  return (
    <Fragment>
      <Title className="text-white" order={2}>Settings</Title>
      <Grid columns={12} p={4}>
        <Grid.Col span={6}>
          <FeltSection>
            <Box
              my={8}
              w="100%"
              // h={{ base: '64px', sm: '96px', md: '128px', lg: '420px' }}
              className="border bg-white flex items-center justify-center overflow-hidden"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 text-sm">No image</span>
              )}
            </Box>

            <label className="text-white block mb-2">Profile Image</label>
            <Button onClick={openWidget}>Upload with Cloudinary</Button>
          </FeltSection>
        </Grid.Col>
        <Grid.Col span={6}></Grid.Col>
      </Grid>
    </Fragment>
  );
};

export default SettingsPage;
