import * as React from 'react';
import styles from './TaskManager.module.scss';
import { ITaskManagerProps } from './ITaskManagerProps';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';

import { escape } from '@microsoft/sp-lodash-subset';


export default class TaskManager extends React.Component<ITaskManagerProps, {}> {
  constructor(props) {
    super(props);
    SPComponentLoader.loadCss('https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css');
    SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css');
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');


    SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/broadcast.css');
    
    SPComponentLoader.loadCss('/sites/rms/SiteAssets/ProjectMngt/style.css');
    
    
    
  }

  public render(): React.ReactElement<ITaskManagerProps> {
    return (
      <div className={ styles.taskManager }>
        <div>Search Layout</div>
          <div>
              <div className="container">
                  <h2>Basic Table</h2>           
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                      </tr>
                      
                    </tbody>
                  </table>
              </div>
 
        </div>
        <div>Bulk Operation Component</div>

        <i className="fa fa-car"></i>
        <i className="fa fa-car" style={{fontSize:'48px'}}></i>
        <i className="fa fa-car" style={{fontSize:'48px', color:'red'}}></i>
        <div className="timeline-bar" style={{background: 'linear-gradient(to right, rgb(3, 127, 76) 11%, rgb(28, 31, 59) 11%)'}}>
        <span className="fa fa-angle-left IGNORE_OPEN_TIMELINE_CLASS"></span>Jun 18 - 27
        <span className="fa fa-angle-right IGNORE_OPEN_TIMELINE_CLASS"></span></div>

        <div className={styles["ds-text-component"]} dir="auto"><span>aasdadsasdsadsdads</span></div>
      </div>
    );
  }
}
