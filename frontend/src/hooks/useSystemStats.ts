import { useEffect, useState } from "react";

interface UseSystemStatsProps {
    setLoading: (loading: boolean) => void;
}

export type StatTitle = {
    id: string;
    name: string;
    slug: string;
    cover_image: string | null;
    games_played: number;
    release_date: string;
};

const useSystemStats = ({ setLoading }: UseSystemStatsProps) => {
  interface SystemStats {
    most_played_titles?: StatTitle[];
    newest_titles?: StatTitle[];
    total_users?: number;
  };

  const [stats, setStats] = useState<SystemStats | null>(null);
  useEffect(() => {
    const fetchSystemStats = async () => {
        setLoading(true);
        try {
        const response = await fetch(`/api/stats/`);
        const data = await response.json() as SystemStats
        console.log('data', data);
        setStats(data);
        } catch (error) {
        console.error("Error fetching system stats:", error);
        } finally {
        setLoading(false);
        }
    }

    fetchSystemStats();
  }, [setLoading]);

    return stats;
};

export default useSystemStats;