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
      items: [],
      colorCodes: [],
      owners: []
    }
  }
  public render(): React.ReactElement<ITaskManagerProps> {
    return (
      <div>
      <Activities />
      <div className="BaseTableOuterContainer">
      <BaseTable 
        fields = {this.state.fields}
        list= {this.props.list}
      />
        </div>
      </div>
    );
  }

  public componentDidMount() {
  //  this._getListFields(this.props);
   // this._getListItems(this.props);
    // this._getColorCodes();
    // this._getOwners();
  }
  public componentWillReceiveProps(nextProps) {
   // this._getListFields(nextProps);
   // this._getListItems(nextProps);
  }
  private _getListFields(props): void {
    
    if(props.list === "")
      return;
    //Get all list columns
    sp.web.lists.getById(props.list)
      .fields.filter("Hidden eq false and ReadOnlyField eq false and Group eq 'Custom Columns'")
      .get().then((response: ISpField[]) => {
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
      .items.filter("Projects/ID eq 1")
      .select("ID","Title", "AssignedTo/Title", "AssignedTo/ID", "Managers/Title", "Managers/ID","DueDate", "Status","Status0/Color_x0020_Code", "Status0/ID", "Status0/Status","Priority","Tags").expand("AssignedTo", "Managers", "Status0")
      .get()
      .then((response) => {
        this.setState({
          items: response
        });
      });
  }
  // private _getColorCodes(): void {
  //   sp.web.lists.getById('f99f45bf-4e40-4c70-823f-d25818442853')
  //     .items
  //     .select("ID", "Title", "Status", "Color_x0020_Code")
  //     .get()
  //     .then((response) => {
  //      this.setState({
  //         colorCodes: response
  //       });
  //     });
  // }
  // private _getOwners(): void {
  //   sp.web.lists.getById('486f4cff-5602-413e-b471-e4765aff56a3')
  //     .items.filter("Project/ID eq 1 and Status eq 'Active'")
  //     .select("ProjectID", "TeamMember/ID","TeamMember/Title","Status").expand("TeamMember")
  //     .get()
  //     .then((response) => {
  //      this.setState({
  //         owners: response
  //       });
  //     });
  // }
  private _onRefreshItems(): void {
    this._getListItems(this.props);
  }
}