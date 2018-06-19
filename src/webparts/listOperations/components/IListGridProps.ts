import { ItemAddResult } from "@pnp/sp";

export interface IListGridProps {
  fields: ISpField[];
  items: ISpItem[];
  onDeleteSelectedItems: (selectedItems: ISpItem[]) => Promise<void>;
  onSave: (item: ISpItem, oldItem: ISpItem) => Promise<ItemAddResult>;
  onRefreshItems: () => void;
}
