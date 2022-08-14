import React, { useState } from "react";
import { Button, Textarea } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

const App: React.FC = () => {
  const [content, setContent] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setContent(inputValue);
    // 半角を2つ追加することでレンダー側を改行させる
    setRenderedContent(inputValue.replace(/\r\n|\r|\n/g, "  \n"));
  };

  const handleOnClick = async () => {
    const result = await window.FileHandle.openFile();
    if (result) {
      const { path, textData } = result;
      setFilePath(path);
      setContent(textData);
      setRenderedContent(textData.replace(/\r\n|\r|\n/g, "  \n"));
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    let charCode = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && charCode === "s") {
      e.preventDefault();
      const { status, path, message } = await window.FileHandle.saveFile(
        content
      );
      if (status && path) {
        setFilePath(path);
      } else {
        alert(message);
      }
    }
  };

  return (
    <>
      <head>
        <title>Markdown Editor {filePath}</title>
      </head>
      <div className="site-wrapper" onKeyDown={handleKeyDown}>
        <main>
          <Button onClick={handleOnClick}>open</Button>
          <Grid templateColumns="repeat(2, 1fr)" gap={5} h="100vh">
            <GridItem w="100%" h="100%">
              <Textarea
                width="100%"
                height="100%"
                value={content}
                onChange={handleInputChange}
              />
            </GridItem>
            <GridItem w="100%" h="100%">
              <ReactMarkdown remarkPlugins={[gfm]} className="markdown-body">
                {renderedContent}
              </ReactMarkdown>
            </GridItem>
          </Grid>
        </main>
      </div>
    </>
  );
};

export default App;
