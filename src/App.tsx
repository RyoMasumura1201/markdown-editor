import { useState } from "react";
import styles from "styles/app.module.scss";
import { Textarea } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="site-wrapper">
      <header></header>
      <main>
        <Grid templateColumns="repeat(2, 1fr)" gap={5} h="100vh">
          <GridItem w="100%" h="100%" bg="blue.500">
            <Textarea width="100%" height="100%" />
          </GridItem>
          <GridItem w="100%" h="100%" bg="blue.500" />
        </Grid>
      </main>
    </div>
  );
};

export default App;
