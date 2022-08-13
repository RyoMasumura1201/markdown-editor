export default interface FileHandle {
  saveFile: (note: string) => Promise<any>;
}

declare global {
  interface Window {
    FileHandle: FileHandle;
  }
}
