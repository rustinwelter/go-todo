import {
  Header,
  ActionIcon,
  useMantineColorScheme,
  Grid,
  Title,
  Image,
  Flex,
} from "@mantine/core";
import { SunIcon, MoonIcon } from "@primer/octicons-react";

function AppHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Header height={70} p={10}>
      <Grid align="center">
        <Grid.Col span={2}>
          <ActionIcon
            variant="subtle"
            color={dark ? "yellow.4" : "cyan.9"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
            size={40}
            sx={{
              transition: "200ms",
              ":hover": {
                transform: "rotate(90deg)",
              },
            }}
          >
            {dark ? <SunIcon size={30} /> : <MoonIcon size={30} />}
          </ActionIcon>
        </Grid.Col>
        <Grid.Col span={10}>
          <Flex mih={50} gap="sm" justify="flex-start" align="center">
            <Image width={40} height={40} src="./icon.png" />
            <Title order={1}>{import.meta.env.VITE_APP_NAME}</Title>
          </Flex>
        </Grid.Col>
      </Grid>
    </Header>
  );
}
export default AppHeader;
