interface ISpTaskItem{
    Id?: number;
    Title?: string;
    Status?: string;
    Priority?: string;
    DueDate?: string;
    AssignedTo: {
      ID: number,
      Title: string
    }
  }
  