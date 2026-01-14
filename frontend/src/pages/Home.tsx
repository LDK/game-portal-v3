import { Box, Card, Grid, LoadingOverlay, Text, Title } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeltSection from "../components/layout/FeltSection";
import type { User } from "../types/user";
import { useState } from "react";
import useSystemStats, { type StatTitle } from "../hooks/useSystemStats";

interface HomePageProps {
  userProfile?: User;
  systemStats?: {
    most_played_titles?: {
      title: {
        id: string;
        name: string;
        slug: string;
        cover_image: string | null;
      };
      count: number;
    }[];
  };
}

const HomePage = ({ userProfile }: HomePageProps) => {
  const [statsLoading, setStatsLoading] = useState(true);
  const stats = useSystemStats({ setLoading: setStatsLoading });

  const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (<>
    <Box m={0} p={0} className="hidden md:block lg:hidden">
      <Title size="h4" className={`${className ? className : "text-black"}`}>
        {children}
      </Title>
    </Box>
    <Box m={0} p={0} className="block md:hidden lg:block">
      <Title size="h3" className={`${className ? className : "text-black"}`}>
        {children}
      </Title>
    </Box>
  </>);

  const StatTitleListing = ({ title, color, children } : { title: StatTitle; color: string; children?: React.ReactNode }) => (
    <Box component="a" href={`/${title.slug}/`} key={title.id} mt={6} mb={4} className="flex items-top hover:contrast-200 hover:bg-white/10" c={color}>
      {title.cover_image ? (
        <img src={title.cover_image} alt={title.name} className="w-10 h-10 mr-4 rounded" />
      ) : (
        <Box c="black" className="w-10 h-10 mr-4 bg-gray-300 mt-1 ml-1 flex items-top justify-center rounded">
          <Text size="sm" className="text-gray-600">No Image</Text>
        </Box>
      )}
      <Box>
        <Text className="font-bold">{title.name}</Text>
        <Text size="sm" className="text-gray-600" pt={0} mt={0}>
          {children}
        </Text>
      </Box>
    </Box>
  );

  return (
    <Fragment>
      <FeltSection color="green" colorLevel={9}>
        <Box py={12}>
            <Title className="text-yellow-500" order={2}>Welcome to Rainy Days Game Portal!</Title>
          <Card mt={12} bg="gray.1" padding="md" shadow="sm">
            <Text size="lg" fw="700" lh="normal">
              Sit back, relax and settle into a world of familiar and new games to play with friends, family and strangers alike.
            </Text>
            <Text mt={8}>
              <strong>Rainy Days Game Portal</strong> is your one-stop destination for a diverse collection of online games that you can enjoy directly from your browser. Whether you're looking to challenge yourself, compete with others, or simply have fun, we've got something for everyone!
            </Text>
          </Card>
        </Box>

        {userProfile && (
          <Box pb={12}>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 4 }} className="text-left">
                <Card bg="yellow.3" padding="md" shadow="sm" h="100%">
                  <CardTitle className="text-green-700">Your Most Played</CardTitle>
                  <Text mt={8} mih={{ xs: "40px", sm: "62px" }} size="sm">The games that keep bringing you back!</Text>

                  {userProfile.most_played_titles && userProfile.most_played_titles.length > 0 ? (
                    userProfile.most_played_titles.slice(0, 5).map(({ title, count }) => (
                      <StatTitleListing key={title.id} title={title} color="black">
                        Played {count} times
                      </StatTitleListing>
                    ))
                  ) : (
                    <Text mt={8} size="sm">You haven't played any games yet. Start playing to see your most played titles here!</Text>
                  )}
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Card bg="blue.5" padding="md" shadow="sm" h="100%">
                  {statsLoading && <LoadingOverlay visible={true} />}
                  <CardTitle className="text-yellow-200">Most Popular</CardTitle>
                  <Text c="white" mt={8} mih={{ xs: "40px", sm: "62px" }} size="sm">The titles with the most game played across our system!</Text>
                  {stats?.most_played_titles && stats.most_played_titles.length > 0 ? (
                      stats.most_played_titles.slice(0, 5).map((title) => (
                        <StatTitleListing key={title.id} title={title} color="white">
                          Played {title.games_played} times
                        </StatTitleListing>
                      ))
                    ) : (
                      <Text mt={8} size="sm">No popular titles data available.</Text>
                    )
                  }
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Card bg="orange.5" padding="md" shadow="sm" h="100%">
                  {statsLoading && <LoadingOverlay visible={true} />}
                  <CardTitle>Newest Titles</CardTitle>
                  <Text mt={8} mih={{ xs: "40px", sm: "62px" }} size="sm">See which games have just been released here on Rainy Day!</Text>

                  {stats?.newest_titles && stats.newest_titles.length > 0 ? (
                      stats.newest_titles.slice(0, 5).map((title) => (
                        <StatTitleListing key={title.id} title={title} color="black">
                          Released on {new Date(title.release_date).toLocaleDateString()}
                        </StatTitleListing>
                      ))
                    ) : (
                      <Text mt={8} size="sm">No new titles data available.</Text>
                    )
                  }

                </Card>
              </Grid.Col>
            </Grid>
          </Box>
        )}
      </FeltSection>
    </Fragment>
  );
};

export default HomePage;