import { Box, Container, Grid, Title } from "@mantine/core";
import { Umbrella, Settings, MoreVertical, LogOut } from "feather-icons-react";

interface HeaderProps {
  username?: string;
  hideLogin?: boolean;
  settingsClick?: () => void;
  menuClick?: () => void;
}

const Header = ({ username, hideLogin, settingsClick, menuClick }: HeaderProps) => (
  <Box className="z-50 text-left backdrop-blur-xl p-4 fixed w-full top-0 left-0 align-items-middle text-sm h-[52px] bg-blend-color-burn text-white bg-blue-900">
    <Container>
      <Grid columns={2}>
        <Grid.Col span={1} className="relative top-[-2px]">
          <a className="text-lime-500 hover:text-yellow-500" href="/">
            <Umbrella className="relative inline" style={{ 
                marginRight: '0.5rem',
                top: '-0.125rem',
              }} 
            />
            <Title size="h5" display="inline">
              Rainy Days
            </Title>
          </a>
        </Grid.Col>
        <Grid.Col span={1} style={{ textAlign: 'right' }}>
          {username && (
            <p className="text-cyan-300">
              <a href="/profile" className="hover:underline relative text-white top-[2px] mr-2">{username}</a>
              <a href="/settings" onClick={settingsClick}>
                <Settings onClick={settingsClick} height={16} className="relative inline hover:text-white" />
              </a>
              <a href="/logout">
                <LogOut cursor="pointer" height={16} className="relative inline hover:text-white" />
              </a>
              <MoreVertical cursor="pointer" onClick={menuClick} height={16} className="relative inline hover:text-white" />
            </p>
          )}
          {!username && !hideLogin && (
            <p>
              <a href="/login">Log in or Register.</a>
            </p>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  </Box>
);

export default Header;