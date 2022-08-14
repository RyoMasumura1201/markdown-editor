import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  saveFile: async (content: string) => {
    const result = await ipcRenderer.invoke("save", content);
    return result;
  },
  openFile: async () => {
    const result = await ipcRenderer.invoke("open");
    return result;
  },
});
