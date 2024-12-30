interface File {
  FileID: number;
  Title: string;
  FilePath: string;
  FileType: 'Info' | 'ToDo';
  TargetRoleName: string;
  CreatedAt: string;
  CreatedByName: string;
}

export type { File };