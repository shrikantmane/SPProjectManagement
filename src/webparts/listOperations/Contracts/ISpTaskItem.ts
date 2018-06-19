interface ISpTaskItem{
    Id?: number;
    Title?: string;
    Status?: string;
    DueDate?: string;
    AssignedTo: {
      ID: number,
      Title: string
    }
  }
  