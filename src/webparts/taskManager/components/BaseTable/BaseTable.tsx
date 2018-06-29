import * as React from "react";
import { IBaseTableProps } from "./IBaseTableProps";
import styles from "./BaseTable.module.scss";
//import styles from './BaseTable.module.scss';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from "@microsoft/sp-loader";

import { escape } from "@microsoft/sp-lodash-subset";

import { sp, ItemAddResult } from "@pnp/sp";

import GunttChart from ".././GunttChart/GunttChart";
const boldText = {
  display: "none"
};
// import Popover from 'react-simple-popover';
import { DefaultButton, IButtonProps } from "office-ui-fabric-react/lib/Button";
import pnp from "sp-pnp-js";
import { DataTable } from "primereact/components/datatable/DataTable";
import { Column } from "primereact/components/column/Column";
import { Row } from "primereact/components/row/Row";
import { InputText } from "primereact/components/inputtext/InputText";
import { OverlayTrigger, Popover, Overlay, Button, ButtonToolbar } from "react-bootstrap";
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
  itemID: number;
  items:ISpTaskItem[];
  //items: { id :number, title: string; owner: string; status: string; priority: string, tag:string }[];
  //colorCodes:ISpColorCode[];
  // ownerList:{id:number; name:string}[];
  // ownerList:ISpOwner[];
  // managerList:ISpOwner[];
  ownerSearchString : string;
  managerSearchString : string;
  tagSearchString : string;
  currentItem : any;
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
      target:'',
      statusTarget:'',
      ownerTarget:'',
      managerTarget:'',
      tagTarget:'',
      itemID: 0,
      items: [],
      //colorCodes:[],
      selectedItems: [],
      //ownerList:[],
     // managerList:[],
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
      currentItem:{}
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
    this.dueDateTemplate = this.dueDateTemplate.bind(this);
  } 
componentWillReceiveProps(nextProps, prevProps){
// TODO :Need to find better approch
  // this.setState({items: this.props.items, colorCodes:this.props.colorCodes, ownerList: this.props.owners, managerList: this.props.owners})
  if(nextProps.items.length > 0 && nextProps.items.length != this.state.items.length)
      this.setState({items: this.props.items })
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
  let owners= this.props.owners;
  let ownerSearchString = this.state.ownerSearchString.trim().toLowerCase();
  if(ownerSearchString.length > 0){
   owners = this.props.owners.filter(function(item){
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
  let managers= this.props.owners;
  let managerSearchString = this.state.managerSearchString.trim().toLowerCase();
  if(managerSearchString.length > 0){
    managers = this.props.owners.filter(function(item){
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
statusTemplate(rowData, column) {
  
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
      <div onClick={(e) => this.setState({currentItem: rowData, statusTarget: e.target, showStatusPopover: !this.state.showStatusPopover })} style={{backgroundColor: cellColor,color: '#fff',  paddingTop: 7, height: '2.6em', width:'100%', textAlign: 'center'}}>{rowData["Status"]}</div>
      
    <Overlay
      show={this.state.showStatusPopover}
      target={this.state.statusTarget}
      placement="bottom"
      container={this}
      containerPadding={20}
      onHide={() => this.setState({ showStatusPopover: false })}
      rootClose
    >
      <Popover id="popover-trigger-focus">
        <div>
          {
            this.props.colorCodes.map((item,index)=>{
              return (<div key={index} style={{ backgroundColor: item.Color_x0020_Code,  height:'2em', textAlign: 'center', marginBottom:'5px', padding:'3px'}} onClick={(e) => this._updateTaskStatus(item)}>
                  <span>{item.Status}</span>
              </div>)
            })
          }
        </div>
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
  private _menuButtonElement: HTMLElement | null;
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
            <Column field="Priority" header="Priority" style={{ width: "6em" }}  />
          </DataTable>
     
    );
  }

  private _updateTaskStatus(Status) {
    let item = this.state.currentItem;

    console.log("item",item);
    console.log("Status",Status);
    let list = pnp.sp.web.lists.getByTitle("NonPeriodicProjects");
    list.items
      .getById(item.ID)
      .update({
        Status0Id: Status.ID
      })
      .then(i => {
        alert("Item Updated!");
      });

      //Code to refresh Task List after updating the status
      //END - Code to refresh Task List after updating the status
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
