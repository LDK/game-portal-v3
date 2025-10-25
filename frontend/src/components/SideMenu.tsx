import { Box, Drawer, List, Title } from "@mantine/core";

const SideMenu = ({ drawerOpened, setDrawerOpened }: { drawerOpened: boolean; setDrawerOpened: (opened: boolean) => void }) => {
  return (
    <Drawer
      opened={drawerOpened}
      onClose={() => setDrawerOpened(false)}
      title="Menu"
      padding="md"
      position="right"
      size="md"
    >
      <Box>
				<Title component="h6" size="h3" className="mb-4 text-sm font-bold">Play Games</Title>
				<List>
					<List.Item><a className="font-bold text-blue-600" href="/ohno">Oh No!</a></List.Item>
				</List>
			</Box>
    </Drawer>
  );
};

export default SideMenu;