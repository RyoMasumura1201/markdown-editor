import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  saveFile: async (content: string) =>
    await ipcRenderer.invoke("save", content),
});
