import React, { useState } from "react";
import styles from "styles/app.module.scss";
import { Textarea } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

const App: React.FC = () => {
  const [note, setNote] = useState("");
  const [renderedNote, setRenderedNote] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setNote(inputValue);
    // 半角を2つ追加することでレンダー側を改行させる
    setRenderedNote(inputValue.replace(/\r\n|\r|\n/g, "  \n"));
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
            <ReactMarkdown remarkPlugins={[gfm]} className="markdown-body">
              {renderedNote}
            </ReactMarkdown>
          </GridItem>
        </Grid>
      </main>
    </div>
  );
};

export default App;
