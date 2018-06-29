import * as React from "react";
import { IBaseTableProps } from "./IBaseTableProps";
//import styles from "./BaseTable.module.scss";
//import styles from './BaseTable.module.scss';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from "@microsoft/sp-loader";

import { escape } from "@microsoft/sp-lodash-subset";

import { sp, ItemAddResult } from "@pnp/sp";
import { find } from "lodash";

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
  projectId: number;
  newItem:string;
  showCreateNewItem: boolean;
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
    showCreateNewItem: true
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
   // this.handleChangeStatus = this.handleChangeStatus.bind(this, item);
    this.onStatusApply = this.onStatusApply.bind(this);
  } 
// componentWillReceiveProps(nextProps, prevProps){
// // TODO :Need to find better approch
//  // this.setState({items: this.props.items, colorCodes:this.props.colorCodes, ownerList: this.props.owners, managerList: this.props.owners})
//   // if(nextProps.items.length > 0 && nextProps.items.length != this.state.items.length)
//     this.setState({items: this.props.items })
// }
  private handleLoginClick(): void {
    jQuery("table").show();
  }
  private handleLogoutClick(): void {
    jQuery("table").hide();
  }

componentDidMount(){
  this._getColorCodes();
  this._getOwners();
  this._getListItems(this.props.list);
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
      <Popover id="popover-trigger-click">
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
    <div>
      <i className="fa fa-user"></i><span style={{marginLeft:"5px"}} onClick={(e) => this.setState({ ownerTarget: e.target, showOwnerPopover: !this.state.showOwnerPopover , ownerSearchString: '' })}>{rowData.AssignedTo && rowData.AssignedTo.length > 0 ? rowData.AssignedTo[0].Title : ""}</span>
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
 // this._updateTaskStatus();
}
statusTemplate(rowData, column) {
let status = rowData.Status0 ? rowData.Status0.Status : "";
let color = rowData.Status0 ? rowData.Status0.Color_x0020_Code: "";   
let statusPopOver;
  if(!this.state.showAddEditStatus){
    statusPopOver = (
      <div >
      {
        this.state.colorCodes.map((item,index)=>{
          return (
          <div key={index} style={{ backgroundColor: item.Color_x0020_Code,height:'2em', textAlign: 'center', marginBottom:'5px', padding:'3px'}} onClick={(e) => this._updateTaskStatus(item)}>
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
            this.state.colorCodes.map((item,index)=>{
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
        <Button id="statusApply" bsStyle="link" onClick={this.onStatusApply}>Apply</Button>
      </div>
    )
  }
     
   return(
    <div>      
      <div onClick={(e) => this.setState({ currentItem:rowData, statusTarget: e.target, showStatusPopover: !this.state.showStatusPopover })} style={{backgroundColor: color, height: '2.5em', width:'100%', textAlign: 'center'}}>{status}</div>
      
    <Overlay
      show={this.state.showStatusPopover}
      target={this.state.statusTarget}
      placement="bottom"
      container={this}
      containerPadding={20}
      onHide={this.onStatusPopoverHide}
      rootClose
    >
      <Popover id="popover-trigger-focus">
        { statusPopOver }
      </Popover>
    </Overlay>
  </div>)

  }

dueDateTemplate(rowData, column){
  let date= new Date(rowData.DueDate);
  return(<span>{date.toDateString()}</span>)
}

  taskEditor(props) {
    return <InputText type="text" value={props.rowData.title} />;
  }

  onChangeItem(e){
    this.setState({newItem : e.target.value});
  }

  onAddItem(e){
        sp.web.lists.getByTitle('NonPeriodicProjects').items.add({
          Title: this.state.newItem,
          ProjectsId: this.state.projectId
      }).then((iar: ItemAddResult) => {
        this.setState({showCreateNewItem : true, newItem: ""});
        this._getListItems(this.props.list); 
      });
  }

  // onCancelItem(e){
  //   this.setState({showCreateNewItem : true, newItem: ""});
  // }

  onCreateNewClick(e){
    this.setState({showCreateNewItem : false, newItem: ""});
  }
 // private _menuButtonElement: HTMLElement | null;
  public render(): React.ReactElement<IBaseTableProps> {
    var components: JSX.Element[] = [];
    let addItemDiv;
    if(this.state.showCreateNewItem){
      addItemDiv= (
        <Button bsStyle="link" onClick={(e) => this.onCreateNewClick(this)}>Create New Row</Button>
      )
    }else{
      addItemDiv= (
        <div>
          <input type="text" placeholder="Create New Task" value={this.state.newItem} style={{width:"91%", padding: "3px 0px 6px 0px", marginTop:"3px"}} onChange={(e)=> this.onChangeItem(e)}/>
          <Button onClick={(e) => this.onAddItem(e)}>Add</Button>
          {/* <Button onClick={(e) => this.onCancelItem(this)}>Cancel</Button> */}
        </div>
      )
    }
   
    return (
      <div>
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
          {addItemDiv}         
        </div>
      </div>   
    );
  }

  private _getTableHeaders(props) {
    if (props.fields.length === 0) return null;

    let _tableHeaders: string;
    this.props.fields.map((field: ISpField, index: number) => {
      _tableHeaders += "<th>" + field.Title + "</th>";
    });
    return _tableHeaders;
  }
  // private _getTableRows(props) {
  //   if (props.items.length === 0) return null;

  //   let _tableHeaders: string;
  //   this.props.items.map((item: ISpItem, index: number) => {
  //     _tableHeaders += "<td>" + item.Title + "</td>";
  //   });
  //   return _tableHeaders;
  // }

  handleClick(e) {
    this.setState({
      open: true,
      itemID: e.target.firstChild.textContent
    });
  }

  handleClickNew(e) {
    this.setState({
      show: true,
      itemID: e.target.firstChild.textContent
    });
    //console.log("itemID: ", e.target.firstChild.textContent);
  }

  handleClose(e) {
    this.setState({
      open: false
      //itemID: 0
    });
  }

  handleCloseNew(e) {
    this.setState({
      show: false
      //itemID: 0
    });
  }

  // private _alertClicked(e, text): void {
  //   let list = pnp.sp.web.lists.getByTitle("TaskList");
  //   list.items
  //     .getById(this.state.itemID)
  //     .update({
  //       Status: text
  //     })
  //     .then(i => {
  //       this.props.onRefreshItems();
  //       this.setState({
  //         open: false,
  //         itemID: 0
  //       });
  //       //alert("Status "+text+" saved succefully!!!");
  //     });
  // }

  // private _alertClickedNew(e, text): void {
  //   let list = pnp.sp.web.lists.getByTitle("TaskList");
  //   list.items
  //     .getById(this.state.itemID)
  //     .update({
  //       Priority: text
  //     })
  //     .then(i => {
  //       this.props.onRefreshItems();
  //       this.setState({
  //         show: false,
  //         itemID: 0
  //       });
  //       //alert("Priority "+text+" saved succefully!!!");
  //     });
  // }

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
        this._getListItems(this.props.list);     
      });
    });

    batch.execute().then(d => {
     // this._getListItems(this.props.list);
    });   
  }

  private _getColorCodes(): void {
    sp.web.lists.getById('f99f45bf-4e40-4c70-823f-d25818442853')
      .items
      .select("ID", "Title", "Status", "Color_x0020_Code")
      .get()
      .then((response) => {
       this.setState({
          colorCodes: response
        });
      });
  }
  private _getOwners(): void {
    sp.web.lists.getById('486f4cff-5602-413e-b471-e4765aff56a3')
      .items.filter("Project/ID eq 1 and Status eq 'Active'")
      .select("ProjectID", "TeamMember/ID","TeamMember/Title","Status").expand("TeamMember")
      .get()
      .then((response) => {
       this.setState({
          ownerList: response,
          managerList: response,
        });
      });
  }

  private _getListItems(list): void {
    
    if(list === "")
      return;
    //Get all list items
    sp.web.lists.getById(list)
      .items.filter("Projects/ID eq 1")
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

    let list = pnp.sp.web.lists.getByTitle("NonPeriodicProjects");
    list.items
      .getById(item.ID)
      .update({
        Status0Id: Status.ID
      })
      .then(i => {
        this._getListItems(this.props.list);
        // let activity = {
        //   projectId : this.state.projectId,
        //   taskId: item.ID,
        //   activityFor:'Status',
        //   activityByUserId:11,
        //   activityDate: new Date().toDateString(),
        //   oldValue: item.Status0.Status,
        //   newValue: Status.Status
        // };
        
        // this.addActivityLog(activity);
      });
  }

  public addActivityLog(activity){  
  sp.web.lists.getById('Activity Log').items.add({
          Project_x0020_NameId: activity.projectId,
          Task_x0020_NameId: activity.taskId,
          Activity_x0020_For: activity.activityFor,
          Activity_x0020_ById:activity.activityByUserId,
          Activity_x0020_Date: activity.activityDate,
          Old_x0020_Value: activity.oldValue,
          New_x0020_Value: activity.newValue
      }).then((iar: ItemAddResult) => {
      console.log(iar);
      });
  }
  
  //css starts
  HideSpan = {
    display: "none" as "none"
  };
  StatusPickerClass = {
    position: "relative" as "relative",
    background: "#fff" as "#fff"
  };

  NotStartedClass = {
    background: "#ff0066" as "#ff0066",
    color: "white" as "white",
    width: "120px" as "120px",
    margin: "5px" as "5px"
  };
  WorkingClass = {
    background: "#ffcc00" as "#ffcc00",
    color: "white" as "white",
    width: "120px" as "120px",
    margin: "5px" as "5px"
  };
  InProcessClass = {
    background: "#9966ff" as "#9966ff",
    color: "white" as "white",
    width: "120px" as "120px",
    margin: "5px" as "5px"
  };
  DoneClass = {
    background: "#99ff66" as "#99ff66",
    color: "white" as "white",
    width: "120px" as "120px",
    margin: "5px" as "5px"
  };

  WaitingClass = {
    background: "#ff6600" as "#ff6600",
    color: "white" as "white",
    width: "120px" as "120px",
    margin: "5px" as "5px"
  };
}
