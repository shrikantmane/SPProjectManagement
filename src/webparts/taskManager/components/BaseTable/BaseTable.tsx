import * as React from "react";
import { IBaseTableProps } from "./IBaseTableProps";
//import styles from "./BaseTable.module.scss";
//import styles from './BaseTable.module.scss';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from "@microsoft/sp-loader";

import { escape } from "@microsoft/sp-lodash-subset";

import { sp, ItemAddResult } from "@pnp/sp";
import { find, filter } from "lodash";

import GunttChart from ".././GunttChart/GunttChart";
const boldText = {
  display: "none"
};
// import Popover from 'react-simple-popover';
import { DefaultButton, IButtonProps } from "office-ui-fabric-react/lib/Button";
// import { Callout } from 'office-ui-fabric-react/lib/Callout';
// import { createRef } from 'office-ui-fabric-react/lib/Utilities';
// import { getTheme, FontWeights, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Link } from 'office-ui-fabric-react/lib/Link';
import pnp from "sp-pnp-js";
import { DataTable } from "primereact/components/datatable/DataTable";
import { Column } from "primereact/components/column/Column";
import { Row } from "primereact/components/row/Row";
import { InputText } from "primereact/components/inputtext/InputText";
import { OverlayTrigger, Popover, Overlay, Button, ButtonToolbar } from "react-bootstrap";
import { inputProperties } from "@uifabric/utilities";

export interface PopOverState {
  open: boolean;
  show: boolean;
  show1: boolean;
  statusTarget:any,
  ownerTarget:any,
  managerTarget:any,
  tagTarget:any,
  target:any,
  showStatusPopover: boolean;
  showOwnerPopover: boolean;
  showManagerPopover: boolean;
  showTagPopover: boolean;
  showAddEditStatus:boolean;
  itemID: number;
  items:ISpTaskItem[];
  //items: { id :number, title: string; owner: string; status: string; priority: string, tag:string }[];
  colorCodes:ISpColorCode[];
  colors:{ ID :number, Color: string;}[];
  // ownerList:{id:number; name:string}[];
  ownerList:ISpOwner[];
  managerList:ISpOwner[];
  ownerSearchString : string;
  managerSearchString : string;
  tagSearchString : string;
  tagList:{id:number; name:string}[];
  selectedItems: {
    title: string;
    owner: string;
    status: string;
    priority: string;
  }[];
  currentItem: any;
  projectId: number,
  newItem:string;
}

export default class BaseTable extends React.Component<
  IBaseTableProps,
  PopOverState
> {
  
  constructor(props) {
    super(props);
    SPComponentLoader.loadCss(
      "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css"
    );
    SPComponentLoader.loadCss(
      "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    );
    SPComponentLoader.loadCss(
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    );
    // SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/broadcast.css');
    // SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/style.css');
    // SPComponentLoader.loadCss('/node_modules/primereact/resources/themes/omega/theme.css');
    // SPComponentLoader.loadCss('/node_modules/primereact/resources/primereact.min.css');
    // SPComponentLoader.loadCss('/node_modules/primeicons/primeicons.css');
    this.state = {
      open: false,
      show: false,
      show1: false,
      showStatusPopover: false,
      showOwnerPopover: false,
      showManagerPopover: false,
      showTagPopover:false,
      showAddEditStatus: false,
      target:'',
      statusTarget:'',
      ownerTarget:'',
      managerTarget:'',
      tagTarget:'',
      itemID: 0,
      items: [],
      colorCodes:[],
      selectedItems: [],
      ownerList:[],
      managerList:[],
      tagList:[{
          id:1,
          name:'#abcd'   
        },{
          id:2,
          name:'#sdgf'   
        },
        {
          id:3,
          name:'#aertgr'   
        },
        {
          id:4,
          name:'#fgjhdf'   
        }     
      ],
      ownerSearchString: '',
      managerSearchString: '',
      tagSearchString: '',
      colors : [{
        ID:1,
        Color:'blue'
      },
      {
        ID:2,
        Color:'green'
      },
      {
        ID:3,
        Color:'red'
      }
    ],
    currentItem:{},
    projectId: 1,
    newItem:"",
    };
    this.statusTemplate = this.statusTemplate.bind(this);
    this.ownerTemplate = this.ownerTemplate.bind(this);
    this.tagsTemplate = this.tagsTemplate.bind(this);
    this.managerTemplate = this.managerTemplate.bind(this);
    this.onOwnerChange = this.onOwnerChange.bind(this);
    this.onManagerChange = this.onManagerChange.bind(this);  
    this.onOwnerPopoverHide = this.onOwnerPopoverHide.bind(this);
    this.onManagerPopoverHide = this.onManagerPopoverHide.bind(this);
    this.onTagPopoverHide = this.onTagPopoverHide.bind(this);
    this.onStatusPopoverHide = this.onStatusPopoverHide.bind(this);
    this.dueDateTemplate = this.dueDateTemplate.bind(this);
    this.onStatusAddEdit = this.onStatusAddEdit.bind(this);
    this.taskEditor = this.taskEditor.bind(this);
    this.onStatusApply = this.onStatusApply.bind(this);
  } 

  componentWillReceiveProps(nextProps){
    this.setState({projectId:nextProps.projectId});
    this._getListItems(this.props.list, nextProps.projectId);
    this._getOwners(nextProps.projectId);
  }
  private handleLoginClick(): void {
    jQuery("table").show();
  }
  private handleLogoutClick(): void {
    jQuery("table").hide();
  }

componentDidMount(){
  this._getColorCodes();
  this._getOwners(this.props.projectId);
  this._getListItems(this.props.list, this.props.projectId);
}
onOwnerChange(e){
  this.setState({ownerSearchString:e.target.value});
}

onManagerChange(e){
  this.setState({managerSearchString:e.target.value});
}

onTagChange(e){
  this.setState({tagSearchString:e.target.value});
}

onOwnerPopoverHide = e => {
  if(e.target.id !="ownerSearchId")
  this.setState({ showOwnerPopover: false })
};
onManagerPopoverHide = e => {
  if(e.target.id !="managerSearchId")
  this.setState({ showManagerPopover: false })
};
onTagPopoverHide = e => {
  if(e.target.id !="tagSearchId")
  this.setState({ showTagPopover: false })
};

onStatusPopoverHide = e => {
  if(e.target.id !="statusAddEdit" && e.target.className !="statusPopover" && e.target.id !="statusApply"){
    this.setState({ showStatusPopover: false, showAddEditStatus: false })
  } 
};

tagsTemplate(rowData, column){
  let tags= this.state.tagList;
  let tagSearchString = this.state.tagSearchString.trim().toLowerCase();
  if(tagSearchString.length > 0){
    tags = this.state.tagList.filter(function(item){
        return item.name.toLowerCase().match(tagSearchString);
    });
  }  
  return(
    <div>
      <div onClick={(e) => this.setState({ tagTarget: e.target, showTagPopover: !this.state.showTagPopover, tagSearchString: '' })}>{rowData["Tags"]}</div>
      
    <Overlay
      show={this.state.showTagPopover}
      target={this.state.tagTarget}
      placement="bottom"
      container={this}
      containerPadding={20}
      onHide={this.onTagPopoverHide}
      rootClose
    >
   
      <Popover id="popover-trigger-click" >
        <div >
        <input id="tagSearchId" type="text" placeholder="Tag" onChange={this.onTagChange.bind(this)}/>
          { 
            tags.map(function(item, index){
                return <div key={index} style = {{ padding:'5px 0px 5px 0px', cursor: 'pointer'}}>{item.name}</div>
            }) 
          }
        </div> 
    </Popover>

    </Overlay>
  </div>)

}

ownerTemplate(rowData, column){
  let owners= this.state.ownerList;
  let ownerSearchString = this.state.ownerSearchString.trim().toLowerCase();
  if(ownerSearchString.length > 0){
   owners = this.state.ownerList.filter(function(item){
        return item.TeamMember.Title.toLowerCase().match(ownerSearchString);
    });
  }
 return(
    <div onClick={(e) => this.setState({ ownerTarget: e.target, showOwnerPopover: !this.state.showOwnerPopover , ownerSearchString: '' })}>
     <span> <i className="fa fa-user" style={{marginLeft:"5px"}}></i> {rowData.AssignedTo && rowData.AssignedTo.length > 0 ? rowData.AssignedTo[0].Title : ""}</span>
    <Overlay
      show={this.state.showOwnerPopover}
      target={this.state.ownerTarget}
      placement="bottom"
      container={this}
      containerPadding={20}
      onHide={this.onOwnerPopoverHide}
      rootClose
    >
    <Popover id="popover-trigger-click">
      <div className="test">
      <input id="ownerSearchId" type="text" placeholder="Person Name" onChange={this.onOwnerChange.bind(this)}/>
        { 
          owners.map(function(item, index){
              return <div key={index} style = {{ padding:'5px 0px 5px 0px', cursor: 'pointer'}}>{item.TeamMember.Title}</div>
          }) 
        }
      </div> 
    </Popover>
    </Overlay>
  </div>)
}
managerTemplate(rowData, column){
  let managers= this.state.managerList;
  let managerSearchString = this.state.managerSearchString.trim().toLowerCase();
  if(managerSearchString.length > 0){
    managers = this.state.managerList.filter(function(item){
        return item.TeamMember.Title.toLowerCase().match(managerSearchString);
    });
  }
 return(
    <div>
     <span style={{marginLeft:"5px"}} onClick={(e) => this.setState({ managerTarget: e.target, showManagerPopover: !this.state.showManagerPopover , managerSearchString: '' })}>{rowData.Managers && rowData.Managers.length > 0 ? rowData.Managers[0].Title : ""}</span>
    <Overlay
      show={this.state.showManagerPopover}
      target={this.state.managerTarget}
      placement="bottom"
      container={this}
      containerPadding={20}
      onHide={this.onManagerPopoverHide}
      rootClose
    >
    <Popover id="popover-trigger-click">
      <div>
      <input id="managerSearchId" type="text" placeholder="Person Name" onChange={this.onManagerChange.bind(this)}/>
        { 
          managers.map(function(item, index){
              return <div key={index} style = {{ padding:'5px 0px 5px 0px', cursor: 'pointer'}}>{item.TeamMember.Title}</div>
          }) 
        }
      </div> 
    </Popover>
    </Overlay>
  </div>)
}

onChangeItem(e){
  this.setState({newItem : e.target.value});
}

onNewTaskKeyPress(e){
  if(e.key==="Enter"){
    this.onAddItem(e);
  }
}

onAddItem(e){
      sp.web.lists.getByTitle('NonPeriodicProjects').items.add({
        Title: this.state.newItem,
        ProjectsId: this.state.projectId
    }).then(() => {
      this.setState({ newItem: ""});
      this._getListItems(this.props.list, this.state.projectId); 
    });
}

onCreateNewClick(e){
  this.setState({ newItem: ""});
}

onStatusAddEdit(){
  // let colors = this.state.colorCodes;
  // colors.push({
  //   ID : 1111111111,
  //   Status: "",
  //   Title:"",
  //   Color_x0020_Code:""
  // });
  // this.setState({showAddEditStatus : !this.state.showAddEditStatus, colorCodes : colors});
  this.setState({showAddEditStatus : !this.state.showAddEditStatus});
}

handleChangeStatus(item, e){
 let colorCodes = this.state.colorCodes;
  let color = find(colorCodes, { 'ID': item.ID });
  color.Status = e.target.value;
  this.setState({colorCodes : colorCodes});
}

onStatusApply(e){
  this.setState({showAddEditStatus : !this.state.showAddEditStatus});
  this.updateStatus();
}

statusTemplate(rowData, column) {
let activeStatus = filter(this.state.colorCodes, {'Is_x0020_Active' : true});
let status = rowData.Status0 ? rowData.Status0.Status : "";
let color = rowData.Status0 ? rowData.Status0.Color_x0020_Code: "";   
let statusPopOver;
  if(!this.state.showAddEditStatus){
    statusPopOver = (
      <div >
      {
        activeStatus.map((item,index)=>{
          return (
          <div key={index} style={{ backgroundColor: item.Color_x0020_Code,height:'2em', color:'#fff', textAlign: 'center', marginBottom:'5px', padding:'3px'}} onClick={(e) => this._updateTaskStatus(item)}>
              <span>{item.Status}</span>
          </div>)
        })
      }
      <Button id="statusAddEdit" bsStyle="link" onClick={this.onStatusAddEdit}>Add/Edit Labels</Button>
    </div>
    )
  }else {
    statusPopOver= (
      <div>
          <div>
          {
            activeStatus.map((item,index)=>{
              return (
                  <input key={index} style={{margin:"2px", borderColor:item.Color_x0020_Code}}
                    className="statusPopover"
                    type="text"
                    value={item.Status}
                    onChange={(e) => this.handleChangeStatus(item, e)}
                  />         
              )
            })
          }           
        </div>
        <Button id="statusApply" bsStyle="link" style={{marginTop: 8}} onClick={this.onStatusApply}>Apply</Button>
      </div>
    )
  }
     
   return(
    <div>      
      <div onClick={(e) => this.setState({ currentItem:rowData, statusTarget: e.target, showStatusPopover: !this.state.showStatusPopover })} style={{backgroundColor: color, height: '2.9em', width:'100%', textAlign: 'center', paddingTop: 7, color: '#fff'}}>{status}</div>
      
    <Overlay
      show={this.state.showStatusPopover}
      target={this.state.statusTarget}
      placement="bottom"
      container={this}
      containerPadding={20}
      onHide={this.onStatusPopoverHide}
      rootClose
    >
      <Popover id="popover-trigger-focus" className="statusPopoverContent">
        { statusPopOver }
      </Popover>
    </Overlay>
  </div>)

  }

dueDateTemplate(rowData, column){
  let date= new Date(rowData.DueDate);
  return(<span>{date.toDateString()}</span>)
}

onUpdateTitle(rowData){
  sp.web.lists.getByTitle('NonPeriodicProjects').items.getById(rowData.ID).update({
    Title: rowData.Title,
    ProjectsId: this.state.projectId
}).then(() => {
  //this._getListItems(this.props.list, this.state.projectId); 
});
}

onEditorValueChange(props, target) {
    let updatedItems = [...props.value];
    let currentItem = find(updatedItems, { 'Id' : props.rowData.Id }); 
    currentItem.Title = target.value;
    this.setState({items: updatedItems});
}

taskEditor(props) {
  return (<InputText type="text" style={{backgroundColor:'white'}} value={props.rowData.Title} onChange={(e) => this.onEditorValueChange(props, e.target)} onBlur={(e) => this.onUpdateTitle(props.rowData)}/>)
}

 // private _menuButtonElement: HTMLElement | null;
  public render(): React.ReactElement<IBaseTableProps> {
    var components: JSX.Element[] = [];
    return (
      <div style={{position:'relative'}}>
      <DataTable
        value={this.state.items}
        scrollable={true}
        reorderableColumns={true}
        resizableColumns={true}
        onRowReorder={e => this.setState({ items: e.value })}
        selection={this.state.selectedItems}
        onSelectionChange={e => this.setState({ selectedItems: e.data })}
      >
        <Column columnKey="checkbox" selectionMode="multiple" style={{ width: "2em" }} />
        <Column columnKey="rowIcon" rowReorder={true} style={{ width: "2em" }} />
        <Column field="Title" header="Task Name" style={{ width: "11.5em" }} editor={this.taskEditor} />
        <Column
          field="DueDate"
          header="Due Date"
          body={this.dueDateTemplate}
          style={{ padding: 0 }}
        />
        <Column
          field="AssignedTo[0].Title"
          header="Owner"
          body={this.ownerTemplate} 
          style={{ width: "9em" }}        
        />
        <Column
          field="Status"
          header="Status"
          body={this.statusTemplate}
          style={{ padding: 0 }}
        />
        <Column
          field="Tags"
          header="Tags"
          body={this.tagsTemplate}
          style={{ padding: 0 }}
        />
        {/* <Column
          field="Managers[0].Title"
          header="Managers"
          body={this.managerTemplate}
          style={{ padding: 0 }}
        /> */}
        <Column field="Priority" header="Priority" style={{ width: "6em" }}/>
      </DataTable>   
      <div>
        <input type="text" placeholder="Create New Task" value={this.state.newItem} style={{width:"91%", padding: "3px 0px 6px 0px", marginTop:"3px"}} onKeyPress={(e)=>this.onNewTaskKeyPress(e)} onChange={(e)=> this.onChangeItem(e)} />
        <Button onClick={(e) => this.onAddItem(e)}>Add</Button>
      </div>
      </div>   
    );
  }

  /* Api Call */
  private updateStatus(): void {
    let colors = this.state.colorCodes;
    let list = pnp.sp.web.lists.getByTitle("Status Master");

    let batch = sp.web.createBatch();

    colors.map((item, index) => {
      list.items
      .getById(item.ID)
      .update({
        Status:item.Status,      
        Title:item.Title
      })
      .then(i => {  
        this._getListItems(this.props.list, this.state.projectId);     
      });
    });

    batch.execute().then(d => {
     // this._getListItems(this.props.list);
    });   
  }

  private _getColorCodes(): void {
    sp.web.lists.getById('f99f45bf-4e40-4c70-823f-d25818442853')
      .items
      .select("ID", "Title", "Status", "Color_x0020_Code","Is_x0020_Active")
      .get()
      .then((response) => {
       this.setState({
          colorCodes: response
        });
      });
  }
  private _getOwners(projectId): void {
    sp.web.lists.getById('486f4cff-5602-413e-b471-e4765aff56a3')
      .items.filter("Project/ID eq " + projectId + " and Status eq 'Active'")
      .select("ProjectID", "TeamMember/ID","TeamMember/Title","Status").expand("TeamMember")
      .get()
      .then((response) => {
       this.setState({
          ownerList: response,
          managerList: response,
        });
      });
  }

  private _getListItems(list, projectId): void {
    
    if(list === "")
      return;
    //Get all list items
   // let filter = ""
    sp.web.lists.getById(list)
      .items.filter("Projects/ID eq " + projectId)
      .select("ID","Title", "AssignedTo/Title", "AssignedTo/ID", "Managers/Title", "Managers/ID","DueDate", "Status","Status0/Color_x0020_Code", "Status0/ID", "Status0/Status","Priority","Tags").expand("AssignedTo", "Managers", "Status0")
      .get()
      .then((response) => {
        this.setState({
          items: response
        });
      });
  }

  private _updateTaskStatus(Status) {
    let item = this.state.currentItem;
    item.Status0 = Status;
    this.setState({
      currentItem : item
    })
    let list = pnp.sp.web.lists.getByTitle("NonPeriodicProjects");
    list.items
      .getById(item.ID)
      .update({
        Status0Id: Status.ID
      })
      .then(i => {
        this._getListItems(this.props.list, this.state.projectId);
        let activity = {
          projectId : this.state.projectId,
          taskId: item.ID,
          activityFor:'Status',
          activityByUserId:11,
          activityDate: new Date().toDateString(),
          oldValue: item.Status0===undefined ? "" :item.Status0.Status,
          newValue: Status.Status,
        };
        
        this.addActivityLog(activity);
      });
  }

  public addActivityLog(activity){  
  sp.web.lists.getByTitle('Activity Log').items.add({
          ProjectNameId: activity.projectId,
          Task_x0020_NameId: activity.taskId,
          Activity_x0020_For: activity.activityFor,
          Activity_x0020_ById:activity.activityByUserId,
          Activity_x0020_Date: activity.activityDate,
          Old_x0020_Value: activity.oldValue,
          New_x0020_Value: activity.newValue
      }).then(() => {
      });
  } 
  
}
