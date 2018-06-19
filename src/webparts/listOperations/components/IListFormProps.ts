import { ItemAddResult } from "@pnp/sp";
export interface IListFormProps{
    fields: ISpField[];
    showEditPanel: boolean;
    item?: ISpItem;
    onDismiss: () => void;
    onSave: (item: ISpItem, oldItem: ISpItem) => Promise<ItemAddResult>;
    onSaved?: () => void;
}