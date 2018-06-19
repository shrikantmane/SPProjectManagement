import * as React from "react";
import { IListOperationsProps } from "./IListOperationsProps";
import { escape } from "@microsoft/sp-lodash-subset";

import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  SelectionMode
} from "office-ui-fabric-react/lib/DetailsList";

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import ListForm from "./ListForm"

import {IListGridProps} from "./IListGridProps";
import {IListGridState} from "./IListGridState";

export default class ListGrid extends React.Component<
  IListGridProps,
  IListGridState
> {

  private _selection: Selection = new Selection({
    onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
  });

  constructor(props) {
    super(props);

    this.state = {
      selectionDetails: this._getSelectionDetails(),
      hideDeleteDialog: true,
      showEditPanel: false,
      formItem: undefined
    }
  }

 

  public render(): React.ReactElement<IListOperationsProps> {
    return ( 
    <div>
      {this._getDetailedListComponent(this.props)}
      {this._getDeleteDialog()}
      {this._getEditPanel()}
    </div>
    );
  }

  private _getEditPanel() {
    return (
      <ListForm
          fields={this.props.fields}
          showEditPanel={this.state.showEditPanel}
          onDismiss={this._onCloseEditPanel.bind(this)}
          item={this.state.formItem}
          onSave={this.props.onSave}
          onSaved={this._onSaved.bind(this)}
        />
    );
  }

  public componentWillReceiveProps() {
  }

  private _getDetailedListComponent(props) {
    return <div>
      <CommandBar
        items={this._getCommandBarItems()}
        farItems={this._getCommandBarFarItems()}
      />
      <MarqueeSelection selection={this._selection}>
        <DetailsList
          items={this.props.items}
          columns={this._getColumns()}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selection={this._selection}
          selectionPreservedOnEmptyClick={true}
          selectionMode={SelectionMode.multiple}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          />
        </MarqueeSelection>
      </div>
  }

  private _getSelectionDetails(): string {
    debugger;
    return `${this._selection.getSelectedCount()} items selected`;
  }
 
  private _getCommandBarItems() : IContextualMenuItem[] {
    debugger;
    var items: IContextualMenuItem[] = [];
    if(this._selection.getSelectedCount() === 0) {
      items.push({
        key: 'newItem',
        name: 'New',
        iconProps: {iconName: 'Add' },
        onClick: this._addItem.bind(this)
      });
    }

    if(this._selection.getSelectedCount() === 1) {
      items.push({
        key: 'editItem',
        name: 'Edit',
        iconProps: {iconName: 'Edit' },
        onClick: this._editItem.bind(this),
      });
    }
    
    if(this._selection.getSelectedCount() > 0) {
      items.push({
        key: 'deletItem',
        name: 'Delete',
        iconProps: {iconName: 'Delete' },
        onClick: this._showDeleteDialog.bind(this),
      });
    }
    return items;
  }

  private _getCommandBarFarItems(): IContextualMenuItem[] {
    var items: IContextualMenuItem[] = []; 
    
    if(this._selection.getSelectedCount() > 0){
      items.push({
        key: 'cancelSelection',
        name:`${this._getSelectionDetails()}`,
        iconProps: {iconName: 'Cancel' },
        onClick: this._cancelSelection.bind(this)
      })
    }

    return items;

  }
  private _addItem() {
    this._showEditingPanel();
  }

  private _editItem() {
    if (this._selection.getSelectedCount() === 1) {
      this._showEditingPanel(this._selection.getSelection()[0] as ISpItem);
    }
  }

  private _showEditingPanel(selectedItem?: ISpItem): void {
    if (selectedItem) {
      this.setState({
        formItem: (selectedItem)
      }, () => {
        this.setState({
          showEditPanel: true
        });
      });
    } else {
      this.setState({
        formItem: undefined
      }, () => {
        this.setState({
          showEditPanel: true
        });
      });
    }
  }

  private _cancelSelection() {
    this._selection.setAllSelected(false);
  }

  private _getDeleteDialog() {
    return <Dialog 
      hidden = {this.state.hideDeleteDialog}
      onDismiss = {this._closeDeleteDialog}
      dialogContentProps = {{
        type:DialogType.normal,
        title: `${this._getDeleteDialogTitle()}`,
        subText: 'Are you sure you want to delete selected item(s)?'
      }}
      modalProps ={{
        isBlocking: false
      }}
    >
      <DialogFooter>
          <DefaultButton onClick = {this._deleteSelectedItems.bind(this)} text ="Delete" />
          <PrimaryButton onClick = {this._closeDeleteDialog.bind(this)} text ="Close" />
      </DialogFooter>
    </Dialog>  
  }

  private _deleteSelectedItems() {
    var selectedItems:ISpItem[] = [];
    
    this._selection.getSelection().map((item, index) => {
      selectedItems.push(item as ISpItem);
    });

    this.props.onDeleteSelectedItems(selectedItems).then(() => {
      this._closeDeleteDialog();
    })
  }

  private _closeDeleteDialog() {
    debugger;
    this.setState({
      hideDeleteDialog: true
    });
  }
  private _getDeleteDialogTitle() {
    switch(this._selection.getSelectedCount()){
      case 1:
        return `Delete ${(this._selection.getSelection()[0] as ISpItem).Title}?`
      default:
        return "Delete?"  
    }
  }

  private _showDeleteDialog() {
    this.setState({
      hideDeleteDialog: false
    });
  }
 
  private _onCloseEditPanel(): void {
    this.setState({
      showEditPanel: false,
      formItem: {}
    });
  }
  

  private _getColumns(): IColumn[] {
    var columns: IColumn[] = [];

    this.props.fields.map((item: ISpField, index: number) => {
      columns.push({
        key: item.Id,
        name: item.Title,
        fieldName: item.InternalName,
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        ariaLabel: item.Description
      });
    });

    return columns;
  }

  private _onSaved(): void {
    this.props.onRefreshItems();
  }
}
