import * as React from 'react';
import styles from './TaskManager.module.scss';
import { ITaskManagerProps } from './ITaskManagerProps';
import { ITaskManagerState } from './ITaskManagerState';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';

import { escape } from '@microsoft/sp-lodash-subset';
import BaseTable from './BaseTable/BaseTable'
import {sp, ItemAddResult} from "@pnp/sp";
import  Activities from '../components/Activities/ActivityLayer';

export default class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
  constructor(props){
    super(props);
    this.state = {
      fields: [],
      items: []
    }
  }
  public render(): React.ReactElement<ITaskManagerProps> {
    return (
      <div>
      <Activities />
      <BaseTable 
        fields = {this.state.fields}
        items = {this.state.items}
        list = {this.props.list}
      />

      </div>
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
    
    if(props.list === "")
      return;
    //Get all list items
    sp.web.lists.getById(props.list)
      .items
      .select("Title", "AssignedTo/Title", "AssignedTo/ID", "DueDate", "Status","Priority").expand("AssignedTo")
      .get()
      .then((response) => {
        console.log(response);
        this.setState({
          items: response
        });
      });
  }
}
