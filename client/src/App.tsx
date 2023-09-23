import {
  Box,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";

import { useLocalStorage } from "@mantine/hooks";

import AppHeader from "./components/AppHeader";
import TodoPage from "./components/TodoPage";

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppHeader />
        <Box
          w={"100%"}
          p={32}
          maw={720}
          sx={{
            margin: "0 auto",
          }}
        >
          <TodoPage />
        </Box>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
