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
import { OverlayPanel } from "primereact/components/overlaypanel/OverlayPanel";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
export interface PopOverState {
  open: boolean;
  show: boolean;
  itemID: number;
  items: { title: string; owner: string; status: string; priority: string }[];
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
      itemID: 0,
      items: [
        {
          title: "title1",
          owner: "owner1",
          status: "Done",
          priority: "priority1"
        },
        {
          title: "title2",
          owner: "owner2",
          status: "Working On It",
          priority: "priority2"
        },
        {
          title: "title3",
          owner: "owner3",
          status: "Stuck",
          priority: "priority3"
        },
        {
          title: "title4",
          owner: "owner4",
          status: "Inprogress",
          priority: "priority4"
        },
        {
          title: "title5",
          owner: "owner5",
          status: "Completed",
          priority: "priority4"
        }
      ],
      selectedItems: []
    };
    this.statusTemplate = this.statusTemplate.bind(this);
    // this.onClick = this.onClick.bind(this);
  } 

  private handleLoginClick(): void {
    jQuery("table").show();
  }
  private handleLogoutClick(): void {
    jQuery("table").hide();
  }

  //   onClick(event) {
  //     this.op.toggle(event);
  // }

  statusTemplate(rowData, column) {
    const popoverFocus = (
      <Popover id="popover-trigger-click">      

        <div style={{padding: '5px;'}}>
          <div style={{ backgroundColor: 'rgb(0, 200, 117)',height:'2em', textAlign: 'center', marginBottom:'5px'}} onClick={(e) => alert('done')}>
            <span>Done</span>
          </div>
          <div style={{ backgroundColor: 'rgb(253, 171, 61)',height:'2em', textAlign: 'center', marginBottom:'5px'}}>
            <span>Working On It</span>
          </div>
          <div style={{ backgroundColor: 'rgb(226, 68, 92)',height:'2em', textAlign: 'center', marginBottom:'5px'}}>
            <span>Stuck</span>
          </div>
          <div style={{ backgroundColor: 'rgb(196, 196, 196)',height:'2em', textAlign: 'center', marginBottom:'5px'}}>
            <span>In Progress</span>
          </div>
          <div style={{ backgroundColor: 'rgb(255, 100, 46)',height:'2em', textAlign: 'center', marginBottom:'5px'}}>
            <span>Completed</span>
          </div>
        </div>
      </Popover>
    );

    let cellColor = "";
    switch (rowData["status"]) {
      case "Done":
        cellColor = "rgb(0, 200, 117)";
        break;
      case "Working On It":
        cellColor = "rgb(253, 171, 61)";
        break;
      case "Stuck":
        cellColor = "rgb(226, 68, 92)";
        break;
      case "Inprogress":
        cellColor = "rgb(196, 196, 196)";
        break;
      case "Completed":
        cellColor = "rgb(255, 100, 46)";
        break;
      default:
        cellColor = "";
        break;
    }
    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverFocus}>
        {/* <div style={{backgroundColor: cellColor, padding: '.5em .5em'}}>{rowData['status']}</div>; */}
        {/* <Button block>{rowData["status"]}</Button> */}
        <div style={{backgroundColor: cellColor, height: '2.5em', width:'100%', textAlign: 'center'}}>{rowData["status"]}</div>
      </OverlayTrigger>
    );
    // return <div style={{backgroundColor: cellColor, padding: '.5em .5em'}}>{rowData['status']}</div>;
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
        <Column selectionMode="multiple" style={{ width: "2em" }} />
        <Column rowReorder={true} style={{ width: "2em" }} />
        <Column field="title" header="Task" editor={this.taskEditor} />
        <Column field="owner" header="Owner" />
        <Column
          field="status"
          header="Status"
          body={this.statusTemplate}
          style={{ padding: 0 }}
        />
        <Column field="priority" header="Priority" />
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
