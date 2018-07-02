export interface ITaskManagerState{
    fields: ISpField[];
    items:ISpTaskItem[];
    colorCodes:ISpColorCode[];
    owners:ISpOwner[];
    projectId: number,
    updateTeamMember:boolean;
}