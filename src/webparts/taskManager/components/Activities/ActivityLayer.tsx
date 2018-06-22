import * as React from 'react';
import { Customizer } from '@uifabric/utilities';
import { Panel } from 'office-ui-fabric-react/lib/components/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/components/Checkbox';
import { LayerHost } from 'office-ui-fabric-react/lib/components/Layer';
import { IActivityState,IActivityDetails,IActivityList } from './IActivityState';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/components/Pivot';
import * as exampleStylesImport from 'office-ui-fabric-react/lib/common/_exampleStyles.scss';
const exampleStyles: any = exampleStylesImport;

import pnp from "sp-pnp-js";
let rows : any[];
let tableData : IActivityDetails[];

export default class Activities extends React.Component<{}, IActivityState> {
    constructor(props: {}) {
        super(props);

        //rows : [];

        this.state = {
            showPanel: false,
            trapPanel: false
        };

        this._getActivityDetails = this._getActivityDetails.bind(this);
        this._getActivityDetails();
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
                                        <div>
                                            <table className={exampleStyles.exampleLabel} style={{ innerWidth: '100%' }} >
                                                <tbody>{rows}</tbody>
                                            </table>

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

    private async _getActivityDetails(): Promise<void> {
        // var CustomRow = React.createClass({
        //     render: function() {
        //         return (
        //             <tr>
        //                 <td>{this.props.oldValue}</td>
        //                 <td>{this.props.newValue}</td>
        //             </tr>
        //         );
        //     }
        // });

        let items = await pnp.sp.web.lists.getByTitle('Activity Log').items.select("Old_x0020_Value", "New_x0020_Value")
          .orderBy("Modified", false).get();

        let itemDatableDatataTable = items.tableData;
        console.log('itemDatableDatataTable is:' + itemDatableDatataTable);
        items.array.forEach(element => {
             console.log('element is:' + element);
         });
                  
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