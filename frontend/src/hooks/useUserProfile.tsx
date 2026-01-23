import { useState, useEffect } from "react";
import type { User } from "../types/user";

const useUserProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/userprofiles/me/")
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setProfile(data)
        } else {
          setProfile(null);
        }
      })
      .catch((err) => console.error("Error fetching user profile:", err));
  }, []);

  return profile || undefined;
}

export default useUserProfile;