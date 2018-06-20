import * as React from 'react';
import { IBaseTableProps } from './IBaseTableProps';
import styles from './BaseTable.module.scss';
//import styles from './BaseTable.module.scss';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';

import { escape } from '@microsoft/sp-lodash-subset';

import {sp, ItemAddResult} from "@pnp/sp";
// Added
import Popover from 'react-simple-popover';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import pnp from "sp-pnp-js";

export interface PopOverState {
   open: boolean,
   show: boolean,
   itemID : number
}

export default class BaseTable extends React.Component<IBaseTableProps, PopOverState> {
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

//     componentDidMount() {
//     document.addEventListener('mousedown', this.handleClick.bind(this));
//   }

//   componentWillUnmount() {
//     document.removeEventListener('mousedown', this.handleClick.bind(this));
//   }

  public render(): React.ReactElement<IBaseTableProps> {
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
       
        <div className={styles.baseTable}>
            {/* <div className={styles.headerCaptionStyle} > Task Manager</div> */}
             <div className={styles.tableStyle} >  
                <div className={styles.headerStyle} > 
                    <div className={styles.CellStyle}>Task Name</div> 
                    <div className={styles.CellStyle}>Status</div> 
                    <div className={styles.CellStyle}>Due Date </div> 
                    <div className={styles.CellStyle}>Priority </div> 
                    <div className={styles.CellStyle}>Assigned To</div> 
                </div> 

                  {
                      this.props.items.map((item, index) => {
                          return(<div className={styles.rowStyle} > 
                            <div className={styles.CellStyle}>
                                <div className={`${styles["name-cell-component"]} ${styles["name-text"]}`}>{item.Title}</div> 
                            </div> 
                            <div  className={styles.CellStyle} ref="status" onClick={this.handleClick.bind(this)} ><span style={this.HideSpan}>{item.Id}</span> {item.Status}</div> 
                            <div className={styles.CellStyle} >{item.DueDate}</div>
                            <div className={styles.CellStyle}  ref="priority" onClick={this.handleClickNew.bind(this)} ><span style={this.HideSpan}>{item.Id}</span> {item.Priority}</div>
                            <div className={styles.CellStyle}>{item.AssignedTo[0].Title}</div>
                          </div>);
                    })
                  }
                  
            </div>

        </div>
        
       
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
 
  // Ashwini 
  handleClick(e) {

    console.log("sta -", e.target.firstChild.textContent);
    

    this.setState({
        open: true,
        itemID: e.target.firstChild.textContent
    });
  }

    handleClickNew(e) {
        console.log("pri -", e.target.firstChild.textContent);
    this.setState({
        show: true,
        itemID: e.target.firstChild.textContent
    });
  }
 
  handleClose(e) {
    this.setState({
        open: false,
        itemID: 0
    });
  }

    handleCloseNew(e) {
    this.setState({
        show: false,
        itemID: 0
    });
  }

    private _alertClicked(e,text): void {
    let list = pnp.sp.web.lists.getByTitle("TaskList");
    list.items.getById(this.state.itemID).update({
        Status : text
    }).then(i => {
         this.props.onRefreshItems();
         this.setState({
            open: false,
            itemID: 0
        });
        //alert("Status "+text+" saved succefully!!!");
    });
  }

    private _alertClickedNew(e,text): void {
    let list = pnp.sp.web.lists.getByTitle("TaskList");
    list.items.getById(this.state.itemID).update({
        Priority : text
    }).then(i => {
         this.props.onRefreshItems();
          this.setState({
            show: false,
            itemID: 0
        });
        //alert("Priority "+text+" saved succefully!!!");
    });
  }

  //css starts
      HideSpan ={
          display: 'none' as 'none'
      }

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





} // class end

