import React, { useState } from "react";
import styles from "styles/app.module.scss";
import { Textarea } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

const App: React.FC = () => {
  const [note, setNote] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setNote(inputValue);
  };

  return (
    <div className="site-wrapper">
      <header></header>
      <main>
        <Grid templateColumns="repeat(2, 1fr)" gap={5} h="100vh">
          <GridItem w="100%" h="100%">
            <Textarea
              width="100%"
              height="100%"
              value={note}
              onChange={handleInputChange}
            />
          </GridItem>
          <GridItem w="100%" h="100%">
            {note}
          </GridItem>
        </Grid>
      </main>
    </div>
  );
};

export default App;
