import { LookupColumn, DateTimeColumn, PersonOrGroupColumn } from "@microsoft/microsoft-graph-types";

export interface IActivityState {
  showPanel: boolean;
  trapPanel: boolean;
}

export interface IActivityDetails {
  time?: Date;
  user?: string;
  taskTitle?: string;
  columnType?:string;
  oldValue?: string;
  newValue?:string;
  contentAddedText?:string;
  contentRemovedText?:string;
}

export interface IActivityList {
  Task_x0020_Name?: LookupColumn;
  Task_x0020_Name_x003a_ID?: LookupColumn;
  Activity_x0020_For?: string;
  Old_x0020_Value?: string;
  New_x0020_Value?: string;
  Activity_x0020_By?: PersonOrGroupColumn;
  Activity_x0020_Date?: DateTimeColumn; 
}