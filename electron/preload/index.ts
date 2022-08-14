import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  saveFile: async (content: string, filePath: string) => {
    const result = await ipcRenderer.invoke("save", content, filePath);
    return result;
  },
  openFile: async () => {
    const result = await ipcRenderer.invoke("open");
    return result;
  },
});
