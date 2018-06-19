import * as React from 'react';
import styles from './ListOperations.module.scss';
import { IListOperationsProps } from './IListOperationsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";

import {sp, ItemAddResult} from "@pnp/sp";
import ListGrid from "./ListGrid";

import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';


export default class ListOperations extends React.Component<IListOperationsProps, IListOperationsState> {
  constructor(props){
    super(props);
    this.state = {
      fields: [],
      items: []
    }
  }
  public render(): React.ReactElement<IListOperationsProps> {
    return (
      <div>{this._getComponent()}</div>
    );
  }

  public componentDidMount() {
    this._getListFields(this.props);
    this._getListItems(this.props);
  }

  public componentWillReceiveProps(nextProps) {
    this._getListFields(nextProps);
    this._getListItems(nextProps);
  }

  private _getListFields(props): void {
    debugger;
    if(props.list === "")
      return;
    //Get all list columns
    sp.web.lists.getById(props.list)
      .fields.filter("Hidden eq false and ReadOnlyField eq false and Group eq 'Custom Columns'")
      .get().then((response: ISpField[]) => {
        console.log(response);
        this.setState({
          fields: response
        });
      });
  }

  private _getListItems(props): void {
    debugger;
    if(props.list === "")
      return;
    //Get all list items
    sp.web.lists.getById(props.list)
      .items
      .get().then((response) => {
        console.log(response);
        this.setState({
          items: response
        });
      });
  }

  private _getComponent() {
    if(!this.props.list)
      return(
        <Placeholder
          iconName='Edit'
          iconText='Configure your web part'
          description='Please select the list to get started..'
          buttonLabel='Configure'
          onConfigure={this._onConfigure.bind(this)} />
      )
    else
      return(
        <div>
          <ListGrid
            fields = {this.state.fields}
            items = {this.state.items}
            onDeleteSelectedItems={this._deleteItems.bind(this)}
            onSave= {this._onSaveItemForm.bind(this)}
            onRefreshItems= {this._onRefreshItems.bind(this)}
          />
        </div>
      )
  }
  
  private _onSaveItemForm(formItem: ISpItem, oldFormItem: ISpItem): Promise<ItemAddResult> {
    if (oldFormItem === undefined) {
      // add an item to the list
      return sp.web.lists.getById(this.props.list).items.add(formItem);
    } else {
      // update item in the list
      return sp.web.lists.getById(this.props.list).items.getById(oldFormItem.Id).update(formItem);
    }
  }
  private _onRefreshItems(): void {
    this._getListItems(this.props);
  }
  private _deleteItems(items: ISpItem[]){
    let list = sp.web.lists.getById(this.props.list);

    let batch = sp.web.createBatch();

    items.map((item, index) => {
      list.items.getById(item.Id).inBatch(batch).delete().then(_ => {});
    });

    return batch.execute().then(d => {
      this._getListItems(this.props);
    });
  }

  private _onConfigure() {
    // Context of the web part
    this.props.context.propertyPane.open();
  }
}
