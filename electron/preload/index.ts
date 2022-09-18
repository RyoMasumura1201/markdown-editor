import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  saveFile: async (content: string, filePath: string) => {
    const result = await ipcRenderer.invoke("save", content, filePath);
    return result;
  },
  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, argv) => callback(event, argv)),
});
