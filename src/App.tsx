import { useState, useEffect } from "preact/hooks";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

const App = () => {
  const [content, setContent] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setContent(inputValue);
    // 半角を2つ追加することでレンダー側を改行させる
    setRenderedContent(inputValue.replace(/\r\n|\r|\n/g, "  \n"));
    setIsSaved(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    let charCode = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && charCode === "s") {
      e.preventDefault();
      const { status, path, message } = await window.FileHandle.saveFile(
        content,
        filePath
      );
      if (status && path) {
        setFilePath(path);
        setIsSaved(true);
      } else if (message) {
        alert(message);
      }
    }
  };
  useEffect(() => {
    window.FileHandle.on("openFile", (_: any, fileData: any) => {
      setFilePath(fileData.path);
      setContent(fileData.textData);
      setRenderedContent(fileData.textData.replace(/\r\n|\r|\n/g, "  \n"));
      setIsSaved(false);
    });
  }, []);
  return (
    <>
      <head>
        <title>
          Makda Editor {filePath} {isSaved ? "(保存済み)" : ""}
        </title>
      </head>
      <div className="site-wrapper" onKeyDown={handleKeyDown}>
        <main>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              height: "100vh",
            }}
          >
            <textarea
              style={{ width: "100%", height: "100%", fontSize: "20px" }}
              value={content}
              onChange={handleInputChange}
            />

            <ReactMarkdown
              remarkPlugins={[gfm]}
              className="markdown-body render-area"
            >
              {renderedContent}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
