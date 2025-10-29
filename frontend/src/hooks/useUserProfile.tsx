import { useState, useEffect } from "react";
import type { User } from "../types/user";

const useUserProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/userprofiles/me/")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching user profile:", err));
  }, []);

  return profile || undefined;
}

export default useUserProfile;