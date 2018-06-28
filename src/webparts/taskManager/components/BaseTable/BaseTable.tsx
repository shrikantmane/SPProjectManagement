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
    ]
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
componentWillReceiveProps(nextProps, prevProps){
// TODO :Need to find better approch
  this.setState({items: this.props.items, colorCodes:this.props.colorCodes, ownerList: this.props.owners, managerList: this.props.owners})
  // if(nextProps.items.length > 0 && nextProps.items.length != this.state.items.length)
  //     this.setState({items: this.props.items })
}
  private handleLoginClick(): void {
    jQuery("table").show();
  }
  private handleLogoutClick(): void {
    jQuery("table").hide();
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
    this.setState({ showStatusPopover: false, showAddEditStatus: !this.state.showAddEditStatus })
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
}
statusTemplate(rowData, column) {
let statusPopOver;
  if(!this.state.showAddEditStatus){
    statusPopOver = (
      <div >
      {
        this.state.colorCodes.map((item,index)=>{
          return (
          <div key={index} style={{ backgroundColor: item.Color_x0020_Code,height:'2em', textAlign: 'center', marginBottom:'5px', padding:'3px'}} onClick={(e) => alert(item)}>
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
                    // onChange={this.handleChangeStatus(item)}
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
     
  let cellColor = "";
  switch (rowData["Status"]) {
    case "Done":
      cellColor = "#00c875";
      break;
    case "Deployed":
      cellColor = "#ff158a";
      break;     
    case "In Process":
      cellColor = "#579bfc";
      break;
    case "Not Started":
      cellColor = "#fdab3d";
      break;
    default:
      cellColor = "";
      break;
  }
   return(
    <div>      
      <div onClick={(e) => this.setState({ statusTarget: e.target, showStatusPopover: !this.state.showStatusPopover })} style={{backgroundColor: cellColor, height: '2.5em', width:'100%', textAlign: 'center'}}>{rowData["Status"]}</div>
      
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
 // private _menuButtonElement: HTMLElement | null;
  public render(): React.ReactElement<IBaseTableProps> {
    var components: JSX.Element[] = [];
    return (
      <DataTable
        value={this.state.items}
        scrollable={true}
        reorderableColumns={true}
        onRowReorder={e => this.setState({ items: e.value })}
        selection={this.state.selectedItems}
        onSelectionChange={e => this.setState({ selectedItems: e.data })}
      >
        <Column columnKey="checkbox" selectionMode="multiple" style={{ width: "2em" }} />
        <Column columnKey="rowIcon" rowReorder={true} style={{ width: "2em" }} />
        <Column field="Title" header="Task Name" editor={this.taskEditor} />
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
        <Column
          field="Managers[0].Title"
          header="Managers"
          body={this.managerTemplate}
          style={{ padding: 0 }}
        />
        <Column field="Priority" header="Priority" />
      </DataTable>

      //   <div>

      //    <div>
      //     <Popover
      //       placement='bottom'
      //       container={this}
      //       target={this.refs.status}
      //       show={this.state.open}
      //       onHide={this.handleClose.bind(this)}
      //       style={this.StatusPickerClass}
      //       beakWidth="180px"

      //     >
      //      <DefaultButton
      //         data-automation-id="NotStarted"
      //         onClick={(e) => this._alertClicked.bind(this)}
      //         text="Not Started"
      //         style={this.NotStartedClass}
      //       />

      //        <DefaultButton
      //         data-automation-id="InProcess"
      //         onClick={(e) => this._alertClicked(e,"In Process")}
      //         text="In Process"
      //         style={this.InProcessClass}
      //       />

      //       <DefaultButton
      //         data-automation-id="Completed"
      //         onClick={(e) => this._alertClicked(e,"Completed")}
      //         text="Completed"
      //         style={this.WorkingClass}
      //       />

      //       <DefaultButton
      //         data-automation-id="Deferred"
      //         onClick={(e) => this._alertClicked(e,"Deferred")}
      //         text="Deferred"
      //         style={this.DoneClass}
      //       />

      //       <DefaultButton
      //         data-automation-id="Waiting "
      //         onClick={(e) => this._alertClicked(e,"Waiting on someone else")}
      //         text="Waiting "
      //         style={this.WaitingClass}
      //       />

      //     </Popover>
      //     </div>

      //    <div>
      //     <Popover
      //       placement='bottom'
      //       container={this}
      //       target={this.refs.priority}
      //       show={this.state.show}
      //       onHide={this.handleCloseNew.bind(this)}
      //       style={this.StatusPickerClass}
      //       beakWidth="180px"

      //     >
      //      <DefaultButton
      //         data-automation-id="High"
      //         onClick={(e) => this._alertClickedNew(e,"(1) High")}
      //         text="(1) High"
      //         style={this.NotStartedClass}
      //       />

      //        <DefaultButton
      //         data-automation-id="Normal"
      //         onClick={(e) => this._alertClickedNew(e,"(2) Normal")}
      //         text="(2) Normal"
      //         style={this.InProcessClass}
      //       />

      //       <DefaultButton
      //         data-automation-id="Low"
      //         onClick={(e) => this._alertClickedNew(e,"(3) Low")}
      //         text="(3) Low"
      //         style={this.WorkingClass}
      //       />

      //     </Popover>
      //     </div>

      //    <table style={boldText}>
      //    <button  onClick={this.handleLogoutClick}  >Close </button>
      //    <GunttChart

      //  />

      //  </table>
      //     <div className={styles.baseTable}>

      //         {/* <div className={styles.headerCaptionStyle} > Task Manager</div> */}
      //          <div className={styles.tableStyle} >
      //             <div className={styles.headerStyle} >
      //                 <div className={styles.CellStyle}>Task</div>
      //                 <div className={styles.CellStyle}>Owner</div>
      //                 <div className={styles.CellStyle}>Status</div>
      //                 <div className={styles.CellStyle}>Priority </div>
      //                 {/* <div className={styles.CellStyle}>Timeline </div>  */}
      //             </div>

      //               {

      //                   this.props.items.map((item, index) => {
      //                      var taskTitleElement;
      //                       var statusElement;
      //                       var priorityElement;
      //                       var ownerElement;
      //                       var timelineElement;

      //                       taskTitleElement = <div className={[styles.CellStyle, styles["task-title"]].join(' ')}  style={{width: '300'}}><span>{item.Title}</span></div>
      //                       if(item.Status === "Completed"){
      //                         statusElement = <div ref="status" onClick={this.handleClick.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#00c875', width: '170',fontSize:'12', fontWeight: 400, color:'#fff'}}><span style={this.HideSpan}>{item.Id}</span>{item.Status}</div>
      //                       } else {
      //                         statusElement = <div ref="status" onClick={this.handleClick.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#e2435c', width: '170', fontSize:'12', fontWeight: 400, color:'#fff'}}><span style={this.HideSpan}>{item.Id}</span>{item.Status}</div>
      //                       }
      //                       if(item.Priority ===   "(2) Normal"){
      //                         priorityElement = <div ref="priority" onClick={this.handleClickNew.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#00c875',width: '150', fontSize:'12', fontWeight: 400, color:'#fff', textAlign: 'left', paddingLeft:'8px'}}><span style={this.HideSpan}>{item.Id}</span>{item.Priority}</div>
      //                       } else {
      //                         priorityElement = <div ref="priority" onClick={this.handleClickNew.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#e2435c',width: '150', fontSize:'12', fontWeight: 400, color:'#fff', textAlign: 'left', paddingLeft:'8px'}}><span style={this.HideSpan}>{item.Id}</span>{item.Priority}</div>
      //                       }
      //                       if(item.AssignedTo[0].Title ===   "Shrikant Mane"){
      //                         ownerElement = <div onClick={this.handleLoginClick} className={styles.CellStyle}><img src="https://files.monday.com/photos/4038149/thumb_small/4038149-dapulse_green.png?1528873676" className="inline-image" title={item.AssignedTo[0].Title} alt={item.AssignedTo[0].Title} style={{position: 'relative', width: 25, height: 25, margin: 'auto', display: 'inline-block', verticalAlign: 'top', overflow: 'hidden', borderRadius: '50%', border: 0}} /></div>
      //                       } else {
      //                         ownerElement = <div onClick={this.handleLoginClick} className={styles.CellStyle}><img src="https://cdn1.monday.com/dapulse_default_photo.png" className="inline-image" title={item.AssignedTo[0].Title} alt={item.AssignedTo[0].Title} style={{position: 'relative', width: 25, height: 25, margin: 'auto', display: 'inline-block', verticalAlign: 'top', overflow: 'hidden', borderRadius: '50%', border: 0}} /></div>
      //                       }
      //                       //timelineElement= <div className="timeline-bar" style={{background: 'linear-gradient(to right, rgb(3, 127, 76) 22%, rgb(28, 31, 59) 22%)'}}><span className="fa fa-angle-left IGNORE_OPEN_TIMELINE_CLASS" />Jun 18 - 27<span className="fa fa-angle-right IGNORE_OPEN_TIMELINE_CLASS" /></div>

      //                     return(<div className={styles.rowStyle} >
      //                     {/* <div className={styles.CellStyle}>
      //                             <div className={`${styles["name-cell-component"]} ${styles["name-text"]}`}>{item.Title}</div>
      //                         </div>  */}
      //                        {/* <div className={styles.CellStyle}>{item.AssignedTo[0].Title}</div> */}

      //                         {/* <div className={styles.CellStyle}>{item.Status}</div>  */}

      //                         {/* <div className={styles.CellStyle} style={{backgroundColor: '#00c875 !important'}}><span>{item.Status}</span></div> */}
      //                         {/* <div className={styles.CellStyle}>{item.Priority}</div>  */}

      //                         { taskTitleElement }
      //                         { ownerElement }
      //                         { statusElement }
      //                         { priorityElement }
      //                         {/* {timelineElement} */}
      //                       </div>);
      //                 })
      //               }

      //         </div>

      //     </div>

      //     <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      //         {/* <div className={styles["tableStyle"]} >
      //             <div className={styles.headerStyle} >
      //                 <div className={styles.CellStyle}>Employee Name</div>
      //                 <div className={styles.CellStyle}>Employee Id </div>
      //                 <div className={styles.CellStyle}>Experience</div>
      //                 <div className={styles.CellStyle}>Location</div>
      //             </div>
      //         </div>  */}
      //     </div>
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
  private _getTableRows(props) {
    if (props.items.length === 0) return null;

    let _tableHeaders: string;
    this.props.items.map((item: ISpItem, index: number) => {
      _tableHeaders += "<td>" + item.Title + "</td>";
    });
    return _tableHeaders;
  }

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

  private _alertClicked(e, text): void {
    let list = pnp.sp.web.lists.getByTitle("TaskList");
    list.items
      .getById(this.state.itemID)
      .update({
        Status: text
      })
      .then(i => {
        this.props.onRefreshItems();
        this.setState({
          open: false,
          itemID: 0
        });
        //alert("Status "+text+" saved succefully!!!");
      });
  }

  private _alertClickedNew(e, text): void {
    let list = pnp.sp.web.lists.getByTitle("TaskList");
    list.items
      .getById(this.state.itemID)
      .update({
        Priority: text
      })
      .then(i => {
        this.props.onRefreshItems();
        this.setState({
          show: false,
          itemID: 0
        });
        //alert("Priority "+text+" saved succefully!!!");
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
