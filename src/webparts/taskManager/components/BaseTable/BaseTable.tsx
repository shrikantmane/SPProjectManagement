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
export default class BaseTable extends React.Component<IBaseTableProps, {}> {
 
  constructor(props) {
    super(props);
    // SPComponentLoader.loadCss('https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css');
    // SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css');
    // SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    // SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/broadcast.css');
    // SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/style.css');
   // this.child = React.createRef();
  }
  private handleLoginClick(): void {
    jQuery("table").show();

  }
  private handleLogoutClick(): void {
    jQuery("table").hide();

  }
  

//   onClick = () => {
//     this.child.current.handleLoginClick();
//   };
  public render(): React.ReactElement<IBaseTableProps> {
      
    return (
        
      <div>
       {/* <Child ref={this.child} /> */}
       {/* <GunttChart ref={instance => { this.child = instance; }} /> */}
       <table style={boldText}>
       <button  onClick={this.handleLogoutClick}  >Close </button>
       <GunttChart 
       
     />
     </table>
        <div className={styles.baseTable}>
            {/* <div className={styles.headerCaptionStyle} > Task Manager</div> */}
             <div className={styles.tableStyle} >  
                <div className={styles.headerStyle} > 
                    <div className={styles.CellStyle}>Task Name</div> 
                    <div className={styles.CellStyle}>Status</div> 
                    <div className={styles.CellStyle}    >Due Date </div> 
                    <div className={styles.CellStyle}>Assigned To</div> 
                </div> 

                  {
                      this.props.items.map((item, index) => {
                          debugger;
                          return(<div className={styles.rowStyle} > 
                            <div className={styles.CellStyle}>
                                <div className={`${styles["name-cell-component"]} ${styles["name-text"]}`}>{item.Title}</div> 
                            </div> 
                            <div className={styles.CellStyle}>{item.Status}</div> 
                            <div className={styles.CellStyle} onClick={this.handleLoginClick}  >{item.DueDate}</div>
                            <div className={styles.CellStyle}>{item.AssignedTo[0].Title}</div>
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
}
