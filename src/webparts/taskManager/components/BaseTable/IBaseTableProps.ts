export interface IBaseTableProps {
    fields: ISpField[];
    items: ISpTaskItem[];
    colorCodes:ISpColorCode[];
    owners:ISpOwner[];
    onRefreshItems: () => void;
  }
  