export default interface FileHandle {
  saveFile: (note: string) => Promise<void>;
  openFile: () => Promise<OpenFileResult | null>;
}
type OpenFileResult = {
  filePath: string;
  textData: string;
};

declare global {
  interface Window {
    FileHandle: FileHandle;
  }
}
