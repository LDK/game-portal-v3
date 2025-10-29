import { Title, Grid, LoadingOverlay } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useCallback, useState } from "react";
import InfoSection from "./sections/InfoSection";
import PasswordSection from "./sections/PasswordSection";
import ProfileImageSection from "./sections/ProfileImageSection";
import SettingsSection from "./sections/SettingsSection";
import useUserProfile from "../../hooks/useUserProfile";

interface SettingsPageProps {
  csrfToken: string;
}

const SettingsPage = ({ csrfToken }: SettingsPageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userProfile = useUserProfile();

  useEffect(() => {
    if (userProfile) {
      setLoading(false);

      if (userProfile.profile_image) {
        setImageUrl(userProfile.profile_image);
      }
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

  const onClearImage = useCallback(() => {
    setImageUrl(null);
    fetch("/api/clear-profile-image/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });
  }, [csrfToken]);

  return (
    <Fragment>
      <Title className="text-white" order={2}>Settings</Title>
      <LoadingOverlay visible={loading} />
      { userProfile && (
        <Grid columns={12} p={4} gutter={{ base: 0, sm: 16 }}>
          <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 2, sm: 1 }}>
            <ProfileImageSection {...{ imageUrl, openWidget, onClearImage }} />
            <PasswordSection {...{ csrfToken, userProfile }} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
            <InfoSection {...{ csrfToken, userProfile }} />
            <SettingsSection {...{ csrfToken, userProfile }} />
          </Grid.Col>
        </Grid>
      ) }
    </Fragment>
  );
};

export default SettingsPage;
