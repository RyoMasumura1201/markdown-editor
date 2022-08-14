export default interface FileHandle {
  saveFile: (note: string) => Promise<SaveFileResult>;
  openFile: () => Promise<OpenFileResult | null>;
}

type OpenFileResult = {
  path: string;
  textData: string;
};

type SaveFileResult = {
  status: boolean;
  path?: string;
  message?: string;
};

declare global {
  interface Window {
    FileHandle: FileHandle;
  }
}
