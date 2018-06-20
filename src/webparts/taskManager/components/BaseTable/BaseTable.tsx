import * as React from 'react';
import { IBaseTableProps } from './IBaseTableProps';
import styles from './BaseTable.module.scss';
//import styles from './BaseTable.module.scss';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';

import { escape } from '@microsoft/sp-lodash-subset';

import {sp, ItemAddResult} from "@pnp/sp";

import GunttChart from '.././GunttChart/GunttChart'
const boldText={
    display:"none"
 };
import Popover from 'react-simple-popover';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import pnp from "sp-pnp-js";

 export interface PopOverState {
    open: boolean,
    show: boolean,
    itemID : number
 }

export default class BaseTable extends React.Component<IBaseTableProps, PopOverState > {
  constructor(props) {
    super(props);
    // SPComponentLoader.loadCss('https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css');
    // SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css');
    // SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    // SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/broadcast.css');
    // SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/style.css');
    this.state = {
        open: false,
        show: false,
        itemID : 0
      };
  }
  private handleLoginClick(): void {
    jQuery("table").show();

  }
  private handleLogoutClick(): void {
    jQuery("table").hide();

  }
  private _menuButtonElement: HTMLElement | null;
  public render(): React.ReactElement<IBaseTableProps> {
    
    var components: JSX.Element[] = [];
    return (
        
      <div>
       
       <div>
        <Popover
          placement='bottom'
          container={this}
          target={this.refs.status}
          show={this.state.open}
          onHide={this.handleClose.bind(this)} 
          style={this.StatusPickerClass}
          beakWidth="180px"
          
        >
         <DefaultButton
            data-automation-id="NotStarted"
            onClick={(e) => this._alertClicked(e,"Not Started")}
            text="Not Started"
            style={this.NotStartedClass}
          />

           <DefaultButton
            data-automation-id="InProcess"
            onClick={(e) => this._alertClicked(e,"In Process")}
            text="In Process"
            style={this.InProcessClass}
          />

          <DefaultButton
            data-automation-id="Completed"
            onClick={(e) => this._alertClicked(e,"Completed")}
            text="Completed"
            style={this.WorkingClass}
          />
          
          <DefaultButton
            data-automation-id="Deferred"
            onClick={(e) => this._alertClicked(e,"Deferred")}
            text="Deferred"
            style={this.DoneClass}
          />

          <DefaultButton
            data-automation-id="Waiting "
            onClick={(e) => this._alertClicked(e,"Waiting on someone else")}
            text="Waiting "
            style={this.WaitingClass}
          />

        </Popover>
        </div>

       <div>
        <Popover
          placement='bottom'
          container={this}
          target={this.refs.priority}
          show={this.state.show}
          onHide={this.handleCloseNew.bind(this)} 
          style={this.StatusPickerClass}
          beakWidth="180px"
          
        >
         <DefaultButton
            data-automation-id="High"
            onClick={(e) => this._alertClickedNew(e,"(1) High")}
            text="(1) High"
            style={this.NotStartedClass}
          />

           <DefaultButton
            data-automation-id="Normal"
            onClick={(e) => this._alertClickedNew(e,"(2) Normal")}
            text="(2) Normal"
            style={this.InProcessClass}
          />

          <DefaultButton
            data-automation-id="Low"
            onClick={(e) => this._alertClickedNew(e,"(3) Low")}
            text="(3) Low"
            style={this.WorkingClass}
          />
          
        </Popover>
        </div>
       
       <table style={boldText}>
       <button  onClick={this.handleLogoutClick}  >Close </button>
       <GunttChart 
       
     />

     </table>
        <div className={styles.baseTable}>
        
            {/* <div className={styles.headerCaptionStyle} > Task Manager</div> */}
             <div className={styles.tableStyle} >  
                <div className={styles.headerStyle} > 
                    <div className={styles.CellStyle}>Task</div> 
                    <div className={styles.CellStyle}>Owner</div> 
                    <div className={styles.CellStyle}>Status</div> 
                    <div className={styles.CellStyle}>Priority </div> 
                    {/* <div className={styles.CellStyle}>Timeline </div>  */}
                </div> 

                  {
                    
                      this.props.items.map((item, index) => {
                         var taskTitleElement;
                          var statusElement;
                          var priorityElement;
                          var ownerElement;
                          var timelineElement;

                          taskTitleElement = <div className={[styles.CellStyle, styles["task-title"]].join(' ')}  style={{width: '300'}}><span>{item.Title}</span></div>
                          if(item.Status === "Completed"){
                            statusElement = <div ref="status" onClick={this.handleClick.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#00c875', width: '170',fontSize:'12', fontWeight: 400, color:'#fff'}}><span>{item.Status}</span></div>
                          } else {
                            statusElement = <div ref="status" onClick={this.handleClick.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#e2435c', width: '170', fontSize:'12', fontWeight: 400, color:'#fff'}}><span>{item.Status}</span></div>
                          }
                          if(item.Priority ===   "(2) Normal"){
                            priorityElement = <div ref="priority" onClick={this.handleClickNew.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#00c875',width: '150', fontSize:'12', fontWeight: 400, color:'#fff', textAlign: 'left', paddingLeft:'8px'}}><span>{item.Priority}</span></div>
                          } else {
                            priorityElement = <div ref="priority" onClick={this.handleClickNew.bind(this)} className={styles.CellStyle} style={{backgroundColor: '#e2435c',width: '150', fontSize:'12', fontWeight: 400, color:'#fff', textAlign: 'left', paddingLeft:'8px'}}><span>{item.Priority}</span></div>
                          }    
                          if(item.AssignedTo[0].Title ===   "Shrikant Mane"){
                            ownerElement = <div onClick={this.handleLoginClick} className={styles.CellStyle}><img src="https://files.monday.com/photos/4038149/thumb_small/4038149-dapulse_green.png?1528873676" className="inline-image" title={item.AssignedTo[0].Title} alt={item.AssignedTo[0].Title} style={{position: 'relative', width: 25, height: 25, margin: 'auto', display: 'inline-block', verticalAlign: 'top', overflow: 'hidden', borderRadius: '50%', border: 0}} /></div>
                          } else {
                            ownerElement = <div onClick={this.handleLoginClick} className={styles.CellStyle}><img src="https://cdn1.monday.com/dapulse_default_photo.png" className="inline-image" title={item.AssignedTo[0].Title} alt={item.AssignedTo[0].Title} style={{position: 'relative', width: 25, height: 25, margin: 'auto', display: 'inline-block', verticalAlign: 'top', overflow: 'hidden', borderRadius: '50%', border: 0}} /></div>
                          }
                          //timelineElement= <div className="timeline-bar" style={{background: 'linear-gradient(to right, rgb(3, 127, 76) 22%, rgb(28, 31, 59) 22%)'}}><span className="fa fa-angle-left IGNORE_OPEN_TIMELINE_CLASS" />Jun 18 - 27<span className="fa fa-angle-right IGNORE_OPEN_TIMELINE_CLASS" /></div>


                        return(<div className={styles.rowStyle} >
                        {/* <div className={styles.CellStyle}>
                                <div className={`${styles["name-cell-component"]} ${styles["name-text"]}`}>{item.Title}</div> 
                            </div>  */}
                           {/* <div className={styles.CellStyle}>{item.AssignedTo[0].Title}</div> */}
                           
                            {/* <div className={styles.CellStyle}>{item.Status}</div>  */}
                           
                            {/* <div className={styles.CellStyle} style={{backgroundColor: '#00c875 !important'}}><span>{item.Status}</span></div> */}
                            {/* <div className={styles.CellStyle}>{item.Priority}</div>  */}
                            
                            { taskTitleElement }
                            { ownerElement }
                            { statusElement }
                            { priorityElement }
                            {/* {timelineElement} */}
                          </div>);
                    })
                  }
                  
            </div>

        </div>
        
            {/* <div className={styles["tableStyle"]} >  
                <div className={styles.headerStyle} > 
                    <div className={styles.CellStyle}>Employee Name</div> 
                    <div className={styles.CellStyle}>Employee Id </div> 
                    <div className={styles.CellStyle}>Experience</div> 
                    <div className={styles.CellStyle}>Location</div> 
                </div> 
            </div>  */}
        </div>

    );
  }

 


    private _getTableHeaders(props){
        if(props.fields.length === 0)
            return null;

        let _tableHeaders: string;
        this.props.fields.map((field: ISpField, index: number) => {
            _tableHeaders += "<th>" + field.Title + "</th>";
        });
        return _tableHeaders;
    }
    private _getTableRows(props){
        if(props.items.length === 0)
            return null;

        let _tableHeaders: string;
        this.props.items.map((item: ISpItem, index: number) => {
            _tableHeaders += "<td>" + item.Title + "</td>";
        });
        return _tableHeaders;
    }

    handleClick(e,itemId) {
        this.setState({
            open: true
            //itemID: itemId
        });
      }
    
        handleClickNew(e,itemId) {
        this.setState({
            show: true
            //itemID: itemId
        });
        console.log("itemID: ", this.state.itemID);
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
    
        private _alertClicked(e,text): void {
        let list = pnp.sp.web.lists.getByTitle("TaskList");
        list.items.getById(1).update({
            Status : text
        }).then(i => {
            alert("Status "+text+" saved succefully!!!");
        });
      }
    
        private _alertClickedNew(e,text): void {
        let list = pnp.sp.web.lists.getByTitle("TaskList");
        list.items.getById(1).update({
            Priority : text
        }).then(i => {
            alert("Priority "+text+" saved succefully!!!");
        });
      }
    
      //css starts
          StatusPickerClass ={
              position: 'relative' as 'relative',
              background: '#fff' as '#fff'
          }
    
          NotStartedClass  = {
             background: '#ff0066' as '#ff0066',
             color: 'white' as 'white',
             width: '120px' as '120px',
             margin: '5px' as '5px'
           }
           WorkingClass  = {
             background: '#ffcc00' as '#ffcc00',
             color: 'white' as 'white',
             width: '120px' as '120px',
             margin: '5px' as '5px'
           }
           InProcessClass  = {
             background: '#9966ff' as '#9966ff',
             color: 'white' as 'white',
             width: '120px' as '120px',
             margin: '5px' as '5px'
           }
           DoneClass  = {
             background: '#99ff66' as '#99ff66',
             color: 'white' as 'white',
             width: '120px' as '120px',
             margin: '5px' as '5px'
           }
    
           WaitingClass = {
             background: '#ff6600' as '#ff6600',
             color: 'white' as 'white',
             width: '120px' as '120px',
             margin: '5px' as '5px'
           }
    
}
