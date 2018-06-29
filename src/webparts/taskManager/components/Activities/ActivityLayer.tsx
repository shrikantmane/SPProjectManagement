import * as React from 'react';
import { Customizer } from '@uifabric/utilities';
import { Panel,PanelType  } from 'office-ui-fabric-react/lib/components/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/components/Checkbox';
import { LayerHost } from 'office-ui-fabric-react/lib/components/Layer';
import { IActivityState } from './IActivityState';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/components/Pivot';
import * as exampleStylesImport from 'office-ui-fabric-react/lib/common/_exampleStyles.scss';
const exampleStyles: any = exampleStylesImport;
import styles from './ActivityLayer.module.scss';

import pnp from "sp-pnp-js";
import {TooltipHost,TooltipDelay,DirectionalHint,ITooltipProps,TooltipOverflowMode} from 'office-ui-fabric-react/lib/components/Tooltip';

export default class Activities extends React.Component<{}, IActivityState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            showPanel: false,
            trapPanel: false,
            projectId:"2", 
            taskId:"4"
        };

        this._getActivityDetails = this._getActivityDetails.bind(this);       
    }

    public render(): React.ReactElement<IActivityState> {
        return (
            <div>
                <Checkbox label="Show activity" checked={this.state.showPanel} onChange={this._onShowPanelChange} />
                <Customizer scopedSettings={
                    this.state.trapPanel
                        ? {
                            Layer: {
                                hostId: 'test'
                            }
                        }
                        : {}
                }>

                    {this.state.showPanel ? (
                        <Panel
                            isOpen={true}
                            isFooterAtBottom={true}

                            hasCloseButton={true}
                            headerText="Manage Task Activity"

                            type= {PanelType.medium }

                            focusTrapZoneProps={{
                                isClickableOutsideFocusTrap: true,
                                forceFocusInsideTrap: false
                            }}
                            onDismissed={this._onDismissPanel}
                        >

                            <div>
                                <Pivot>
                                    <PivotItem
                                        headerText="Activity"
                                        linkText="No recent activity found"
                                        headerButtonProps={{
                                            'data-order': 1,
                                            'data-title': 'My Activity'
                                        }}
                                    >
                                        <div className={styles["activity-log-container"]} style={{"width": "auto","max-width": "600px","position": "relative"}}>
                                            {this.state.rows}
                                        </div>
                                    </PivotItem>
                                    <PivotItem linkText="Updates">
                                        {/* <Label className={exampleStyles.exampleLabel} >No recent updates available.</Label> */}
                                        <div>
                                            <table style={{ innerWidth: '100%' }} >
                                                <tbody>
                                                    <tr>
                                                        <td>Testing Title 1</td>
                                                        <td>loren ipsum 21</td>
                                                        <td>loren ipsum 21</td>

                                                    </tr>
                                                    <tr>
                                                        <td>Testing Title 2</td>
                                                        <td>loren ipsum 22</td>
                                                        <td>loren ipsum 22</td>

                                                    </tr>
                                                    <tr>
                                                        <td>Testing Title 3</td>
                                                        <td>loren ipsum 23</td>
                                                        <td>loren ipsum 23</td>

                                                    </tr>

                                                </tbody>
                                            </table>

                                        </div>
                                    </PivotItem>
                                </Pivot>
                            </div>

                        </Panel>
                    ) : (
                            <div />
                        )}
                </Customizer>
                <LayerHost
                    id="test"
                    style={{
                        position: 'relative',
                        //height: 'auto',
                        overflow: 'hidden'
                    }}
                />
            </div>
        );
    }

    public componentDidMount() {
        this._getActivityDetails();
    }
    public componentWillReceiveProps() {
        this._getActivityDetails();
    }

    private async _getActivityDetails(): Promise<void> {
        let items;
        if(this.state.projectId != "" && this.state.projectId != null){
            items = await pnp.sp.web.lists.getByTitle('Activity Log').items.filter(`ProjectName/Id eq '${this.state.projectId}'`).select("ProjectName/Id","Activity_x0020_Date","Activity_x0020_By/Title","Task_x0020_Name/Title","Activity_x0020_For","Old_x0020_Value", "New_x0020_Value")
            .expand("Activity_x0020_By","Task_x0020_Name","ProjectName").orderBy("Modified", false).get();
        }
        else if(this.state.taskId != "" && this.state.taskId != null){
            items = await pnp.sp.web.lists.getByTitle('Activity Log').items.filter(`Task_x0020_Name/Id eq '${this.state.taskId}'`).select("Activity_x0020_Date","Activity_x0020_By/Title","Task_x0020_Name/Title","Activity_x0020_For","Old_x0020_Value", "New_x0020_Value")
            .expand("Activity_x0020_By","Task_x0020_Name").orderBy("Modified", false).get();
        }
        
        var activityRows = [];
        var CustomRow;
       
        items.forEach((element) =>{
            var timeDetails;
            var user;var taskName;
            var ActivityForIcon;var ActivityFor;var additionalValues; 

            timeDetails = this.parseDateTime(element.Activity_x0020_Date);
            user = <img title={element.Activity_x0020_By.Title} width="30" height="30" className={styles["img-circle"]} src="https://files.monday.com/photos/4179724/thumb_small/4179724-dapulse_pink.png?1530079712"/>;
            taskName = element.Task_x0020_Name.Title;
            ActivityForIcon = this.getIconWithAdditionalValues(element)[0];
            ActivityFor = element.Activity_x0020_For.trim();

            additionalValues = this.getIconWithAdditionalValues(element)[1];

            CustomRow = 
                        <div className={styles["single-activity-log-container"]} >
                            <div className={styles["single-activity-log"]}>
                                <div className={styles["activity-box"]}>                                 
                                    <div style={{"width": "46px"}}>
                                    <time className={styles["humanize"]}>
                                       <i className={`ms-Icon ms-Icon--Clock ${styles["timeIcon"]}`} title='Clock' aria-hidden='true'></i>
                                       {timeDetails} 
                                    </time>
                                    </div>

                                    <div className={styles["separator"]}></div>
                                    <div className={styles["activity-and-user"]}>
                                        <div className={styles["user"]}>
                                            <a className={styles["profile_photo router"]} style={{"height": "30px"}}>
                                                {user}
                                            </a>
                                        </div>
                                        <div className={styles["ds-text-component"]} dir="auto">
                                            <div className={styles["hostClassTask"]}>
                                                <TooltipHost content={taskName} overflowMode={TooltipOverflowMode.Parent}>
                                                    <span>{taskName}</span>
                                                </TooltipHost>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles["additional-values"]}>
                                        <div className={styles["separator"]}></div>
                                        <div className={styles["column-type"]}>
                                             {ActivityForIcon}
                                            <div className={styles["ds-text-component"]} dir="auto">
                                                <div className={styles["hostClassColumnType"]}>
                                                    <TooltipHost content={ActivityFor} overflowMode={TooltipOverflowMode.Parent}>
                                                        <span>{ActivityFor}</span>
                                                    </TooltipHost>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles["separator"]}></div>
                                        {additionalValues}
                                    </div>

                                </div>
                            </div>
                        </div>;

            activityRows.push(CustomRow);
        });
        
        this.setState({
           rows : activityRows
        });
    }
 
    private getIconWithAdditionalValues(element){
        var arr = [];
        arr = [];

        switch(element.Activity_x0020_For.replace('/^\s+|\s+$/g', '')){
            case "Status":{
                arr[0] = this.getActivityIcon(element.Activity_x0020_For);
                arr[1] = this.getAdditionalValues_Status(element.Old_x0020_Value,element.New_x0020_Value);
                return arr;
            };
            case "Priority":{
                arr[0] = this.getActivityIcon(element.Activity_x0020_For);
                arr[1] = this.getAdditionalValues_Priority(element.Old_x0020_Value,element.New_x0020_Value);
                return arr;
            };
            case "Timeline":{
                arr[0] = this.getActivityIcon(element.Activity_x0020_For);
                arr[1] = this.getAdditionalValues_Timeline(element.Old_x0020_Value,element.New_x0020_Value);
                return arr;
            }
            case "Comment":{
                arr[0] = this.getActivityIcon(element.Activity_x0020_For);
                arr[1] = this.getAdditionalValues_Comment(element.Old_x0020_Value,element.New_x0020_Value);
                return arr;
            }
            case "Tags":{
                arr[0] = this.getActivityIcon(element.Activity_x0020_For);
                arr[1] = this.getAdditionalValues_Tags(element.Old_x0020_Value,element.New_x0020_Value);
                return arr;
            }
            case "Phase":{
                arr[0] = this.getActivityIcon(element.Activity_x0020_For);
                arr[1] = this.getAdditionalValues_Phase(element.Old_x0020_Value,element.New_x0020_Value);
                return arr;
            }
            default:{
                break;
            }
        }

        return arr;
    }

    private getAdditionalValues_Tags(oldValue, newValue){
        var additionalValuesTags;
        var tagAction;

        if(oldValue != null){
            additionalValuesTags =<div className={styles["tags-value"]}>
                                    <span className={styles["tag-value"]} style={{"color": "rgb(51, 51, 51)","float": "right"}}>
                                        <div className={styles["ds-text-component"]} dir="auto">
                                            <div className={styles["hostClassTags"]}>
                                                <TooltipHost content={`Removed ${oldValue}`} overflowMode={TooltipOverflowMode.Parent}>
                                                    <span>Removed {oldValue}</span>
                                                </TooltipHost>
                                            </div>
                                        </div>
                                    </span> 
                                </div>
        }   
        else if(newValue != null){
            additionalValuesTags =<div className={styles["tags-value"]}>
                                    <span className={styles["tag-value"]} style={{"color": "rgb(51, 51, 51)","float": "right"}}>
                                        <div className={styles["ds-text-component"]} dir="auto">
                                            <div className={styles["hostClassTags"]}>
                                                <TooltipHost content={`Added ${newValue}`} overflowMode={TooltipOverflowMode.Parent}>
                                                    <span>Added {newValue}</span>
                                                </TooltipHost>
                                            </div>
                                        </div>
                                    </span> 
                                </div>
        }
        return additionalValuesTags;
    }

    private getAdditionalValues_Phase(oldValue, newValue){
        var additionalValuesPhase;
        var oldValueDiv;var newValueDiv;  

        if(oldValue == null){
            oldValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "lightgray"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <span> </span>
                            </div>
                        </div>
        }
        else {
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["color"]} ${styles["previous"]} `} style={{"background-color": "rgb(253, 171, 61)", "color": "white"}}>
                             <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={oldValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{oldValue}</span>
                                    </TooltipHost>
                                </div>
                              </div>
                          </div>
        }

        if(newValue == null){
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "lightgray"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <span> </span>
                            </div>
                        </div>
        }
        else{
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "rgb(226, 68, 92)", "color": "white"}}>
                            <div className={styles["ds-text-component"]} dir="auto">  
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{newValue}</span>
                                    </TooltipHost>
                                </div>
                            </div>
                        </div>
        }

        additionalValuesPhase =<div className={styles["old-new-values-container"]}>
                                    <div className={styles["old-value"]}>
                                       {oldValueDiv}
                                    </div>
                                    <div className={`${styles["separator"]} ${styles["before-arrow"]} `}></div>
                                    <div className={styles["arrow-separator"]}></div>
                                    <div className={`${styles["separator"]} ${styles["after-arrow"]} `}></div>
                                    <div className={styles["new-value"]}>
                                        {newValueDiv}
                                    </div>
                                </div>
        return additionalValuesPhase;
    }

    private getAdditionalValues_Comment(oldValue, newValue){
        var additionalValuesComment;
        var oldValueDiv;var newValueDiv;  

        if(oldValue == null){
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["text"]} ${styles["previous"]} ${styles["empty"]} `}>
                            <div className={styles["empty"]}></div>
                          </div>
        }
        else {
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["text"]} ${styles["previous"]} `} >
                             <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{newValue}</span>
                                    </TooltipHost>
                                </div>
                              </div>
                          </div>

            // oldValueDiv = <div className={styles["hostClass"]}>
            //                 <TooltipHost content={oldValue} overflowMode={TooltipOverflowMode.Parent}>
            //                     <span>{oldValue}</span>
            //                 </TooltipHost>
            //              </div>
        }

        if(newValue == null){
            newValueDiv = <div className={`${styles["single-log-value"]} ${styles["text"]} ${styles["previous"]} ${styles["empty"]} `}>
                               <div className={styles["empty"]}></div>
                          </div>
        }
        else{
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["text"]} ${styles["new"]} `} >
                            <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{newValue}</span>
                                    </TooltipHost>
                                </div>
                            </div>
                        </div>
            // newValueDiv = <div className={styles["hostClass"]}>
            //                 <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
            //                     <span>{newValue}</span>
            //                 </TooltipHost>
            //              </div>
        }

        additionalValuesComment =<div className={styles["old-new-values-container"]}>
                                    <div className={styles["old-value"]}>
                                       {oldValueDiv}  
                                    </div>
                                    <div className={`${styles["separator"]} ${styles["before-arrow"]} `}></div>
                                    <div className={styles["arrow-separator"]}></div>
                                    <div className={`${styles["separator"]} ${styles["after-arrow"]} `}></div>
                                    <div className={styles["new-value"]}>
                                        {newValueDiv}
                                    </div>
                                </div>
        return additionalValuesComment;
    }

    private getAdditionalValues_Timeline(oldValue, newValue){
        var additionalValuesTimeline;
        var oldValueDiv;var newValueDiv;  

        if(oldValue == null){
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["numeric"]} ${styles["previous"]} ${styles["empty"]} `}>
                            <div className={styles["empty"]}></div>
                          </div>
        }
        else {
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["numeric"]} ${styles["previous"]} `} >
                             <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={oldValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{oldValue}</span>
                                    </TooltipHost>
                                </div>
                              </div>
                          </div>
        }

        if(newValue == null){
            newValueDiv = <div className={`${styles["single-log-value"]} ${styles["numeric"]} ${styles["previous"]} ${styles["empty"]} `}>
                               <div className={styles["empty"]}></div>
                          </div>
        }
        else{
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["numeric"]} ${styles["new"]} `} >
                            <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{newValue}</span>
                                    </TooltipHost>
                                </div>
                            </div>
                        </div>
        }

        additionalValuesTimeline =<div className={styles["old-new-values-container"]}>
                                    <div className={styles["old-value"]}>
                                       {oldValueDiv}
                                    </div>
                                    <div className={`${styles["separator"]} ${styles["before-arrow"]} `}></div>
                                    <div className={styles["arrow-separator"]}></div>
                                    <div className={`${styles["separator"]} ${styles["after-arrow"]} `}></div>
                                    <div className={styles["new-value"]}>
                                        {newValueDiv}
                                    </div>
                                </div>
        return additionalValuesTimeline;
    }

    private getAdditionalValues_Priority(oldValue, newValue){
        var additionalValuesPriority;
        var oldValueDiv;var newValueDiv;  

        if(oldValue == null){
            oldValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "lightgray"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <span> </span>
                            </div>
                        </div>
        }
        else {
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["color"]} ${styles["previous"]} `} style={{"background-color": "rgb(253, 171, 61)", "color": "white"}}>
                             <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={oldValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{oldValue}</span>
                                    </TooltipHost>
                                </div>
                              </div>
                          </div>
        }

        if(newValue == null){
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "lightgray"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <span> </span>
                            </div>
                        </div>
        }
        else{
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "rgb(226, 68, 92)", "color": "white"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                            <div className={styles["hostClass"]}>
                                    <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{newValue}</span>
                                    </TooltipHost>
                                </div>
                            </div>
                        </div>
        }

        additionalValuesPriority =<div className={styles["old-new-values-container"]}>
                                    <div className={styles["old-value"]}>
                                       {oldValueDiv}
                                    </div>
                                    <div className={`${styles["separator"]} ${styles["before-arrow"]} `}></div>
                                    <div className={styles["arrow-separator"]}></div>
                                    <div className={`${styles["separator"]} ${styles["after-arrow"]} `}></div>
                                    <div className={styles["new-value"]}>
                                        {newValueDiv}
                                    </div>
                                </div>
        return additionalValuesPriority;
    }

    private getAdditionalValues_Status(oldValue, newValue){
        var additionalValuesStatus;
        var oldValueDiv;var newValueDiv;  

        if(oldValue == null){
            oldValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "lightgray"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <span> </span>
                            </div>
                        </div>
        }
        else {
            oldValueDiv = <div className={`${styles["single-log-value"]} ${styles["color"]} ${styles["previous"]} `} style={{"background-color": "rgb(253, 171, 61)", "color": "white"}}>
                             <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={oldValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{oldValue}</span>
                                    </TooltipHost>
                                </div>
                              </div>
                          </div>
        }

        if(newValue == null){
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "lightgray"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <span> </span>
                            </div>
                        </div>
        }
        else{
            newValueDiv = <div className={` ${styles["single-log-value"]} ${styles["color"]} ${styles["new"]} `} style={{"background-color": "rgb(226, 68, 92)", "color": "white"}}>
                            <div className={styles["ds-text-component"]} dir="auto">
                                <div className={styles["hostClass"]}>
                                    <TooltipHost content={newValue} overflowMode={TooltipOverflowMode.Parent}>
                                        <span>{newValue}</span>
                                    </TooltipHost>
                                </div>
                            </div>
                        </div>
        }

        additionalValuesStatus =<div className={styles["old-new-values-container"]}>
                                    <div className={styles["old-value"]}>
                                       {oldValueDiv}
                                    </div>
                                    <div className={`${styles["separator"]} ${styles["before-arrow"]} `}></div>
                                    <div className={styles["arrow-separator"]}></div>
                                    <div className={`${styles["separator"]} ${styles["after-arrow"]} `}></div>
                                    <div className={styles["new-value"]}>
                                        {newValueDiv}
                                    </div>
                                </div>
        return additionalValuesStatus;
    }

    private getActivityIcon(activityFor){
        var activityIcon;
        if(activityFor.replace('/^\s+|\s+$/g', '') == "Status")
            activityIcon = <i className={`ms-Icon ms-Icon--GlobalNavButton ${styles["statusIcon"]}`} title="GlobalNavButton" aria-hidden="true"></i>;
        else if(activityFor.replace('/^\s+|\s+$/g', '') == "Priority")
            activityIcon = <i className={`ms-Icon ms-Icon--CheckList ${styles["priorityIcon"]}`} title="CheckList" aria-hidden="true"></i>;
        else if(activityFor.replace('/^\s+|\s+$/g', '') == "Timeline")
            activityIcon = <i className={`ms-Icon ms-Icon--TimelineProgress ${styles["timelineIcon"]}`} title="TimelineProgress" aria-hidden="true"></i>;
        else if(activityFor.replace('/^\s+|\s+$/g', '') == "Comment")
            activityIcon = <i className={`ms-Icon ms-Icon--TextBox ${styles["commentIcon"]}`} title="TextBox" aria-hidden="true"></i>;
        else if(activityFor.replace('/^\s+|\s+$/g', '') == "Tags")
            activityIcon = <i className={`ms-Icon ms-Icon--Tag x-hidden-focus ${styles["tagsIcon"]} `} title="Tag" aria-hidden="true"></i>;
        else if(activityFor.replace('/^\s+|\s+$/g', '') == "Phase")
            activityIcon = <i className={`ms-Icon ms-Icon--ForwardEvent x-hidden-focus ${styles["phaseIcon"]} `} title="ForwardEvent" aria-hidden="true"></i>;

        return activityIcon;
    }

    private parseDateTime(then){
        var MINUTE = 60;
        var HOUR = MINUTE * 60;
        var DAY = HOUR * 24;
        var WEEK = DAY * 7;
        var MONTH = DAY * 30;
        var YEAR = DAY * 365;
        then = new Date(then).getTime();
        if (!then) {
          return null;
        }
        var timeNow = Date.now();
        var seconds = Math.round(Math.abs(timeNow - then) / 1000);
        var suffix = then < timeNow ? 'ago' : 'from now';
  
        var _ref2 = seconds < MINUTE ? [Math.round(seconds), 'second'] : seconds < HOUR ? [Math.round(seconds / MINUTE), 'minute'] : seconds < DAY ? [Math.round(seconds / HOUR), 'hour'] : seconds < WEEK ? [Math.round(seconds / DAY), 'day'] : seconds < MONTH ? [Math.round(seconds / WEEK), 'week'] : seconds < YEAR ? [Math.round(seconds / MONTH), 'month'] : [Math.round(seconds / YEAR), 'year'];
        var unit = _ref2[1];
        return _ref2[0] + unit.toString().charAt(0);
    }

    private _onDismissPanel = (): void => {
        this.setState({
            showPanel: false
        });
    };

    private _onShowPanelChange = (event: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
        this.setState({
            showPanel: !!checked
        });
    };

    private _onShowPanelClick = (event: React.FormEvent<HTMLElement | HTMLButtonElement>): void => {
        this.setState({
            showPanel: !this.state.showPanel
        });
    };

    private _onTrapPanelChange = (event: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
        this.setState({
            trapPanel: !!checked
        });
    };
}



