import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  saveFile: async (content: string) =>
    await ipcRenderer.invoke("save", content),
  openFile: async () => {
    const result = await ipcRenderer.invoke("open");
    return result;
  },
});
