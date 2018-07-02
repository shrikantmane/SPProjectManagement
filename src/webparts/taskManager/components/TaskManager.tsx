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
import  TeamMember from './TeamMember/TeamMember';
import Projects from './Projects/Projects';

export default class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
  constructor(props){
    super(props);
    this.state = {
      fields: [],
      items: [],
      colorCodes: [],
      owners: [],
      projectId:0,
      updateTeamMember :false
    }
    this.projectIdHandler = this.projectIdHandler.bind(this);
  }
  public render(): React.ReactElement<ITaskManagerProps> {
    let table;
    if(this.state.projectId != 0){
    table = (<BaseTable 
        list= {this.props.list}
        projectId = {this.state.projectId}
        updateTeamMember = {this.state.updateTeamMember}
      />)
    }

    let activities;
    if(this.state.projectId != 0){
      activities = (<Activities 
          projectId = {this.state.projectId}
          // taskId = {this.state.taskId}
        />)
      }

    //let  BaseTable()
    return (
      <div className="row">
      <div className="col-md-3">
      <Projects projectIdCallout = {this.projectIdHandler} />
      </div>
      <div className="col-md-9">
          <TeamMember projectId = {this.state.projectId}
          callbackFromParent={this.updateTeamMemberCallback}
          />
          {/* <Activities /> */}
          {activities}
          <br/><br/>
          <div className="BaseTableOuterContainer">
          {/* <BaseTable 
            list= {this.props.list}
            projectId = {this.state.projectId}
          /> */}
              {table}
            </div>
        </div>
      </div>
    );
  }
  private updateTeamMemberCallback = (UpdateTM) => {
    console.log('UpdateTM', UpdateTM);
    this.setState({
        updateTeamMember : UpdateTM
    });
   }
  private projectIdHandler(project){
    this.setState({
      projectId: project
    });
    console.log('SelectedProject', this.state.projectId);
  }

  componentDidMount() {
  //  this._getListFields(this.props);
   // this._getListItems(this.props);
    // this._getColorCodes();
    // this._getOwners();
  }
  componentWillReceiveProps(nextProps) {
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