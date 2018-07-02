import * as React from 'react';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Overlay, OverlayTrigger, Button, Popover, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { default as pnp, sp, ItemAddResult } from "sp-pnp-js";
import styles from './Projects.module.scss';
import PeoplePickerTypesExample from '../PeoplePickerComponent/PeoplePickerComponent';

export default class Projects extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            code: '',
            description: '',
            manager: '',
            options: [],
            projectTitles: [],
            collapsedNonPeriodicProject: true,
            collapsedPeriodicProject: false,
            showNonPeriodicProject: false,
            showPeriodicProject: false,
        }
        $('.nav-stacked>li:nth-child(2)').addClass('itemActive');
        // SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
        // SPComponentLoader.loadCss('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js');
        // SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js');
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getNonPeriodicUsers = this.getNonPeriodicUsers.bind(this);
        this.getPeriodicUsers = this.getPeriodicUsers.bind(this);
        this.handleNonPeriodicProjectClick = this.handleNonPeriodicProjectClick.bind(this);
        this.handlePeriodicProjectClick = this.handlePeriodicProjectClick.bind(this);
        this.hideNonPeriodicOverLay = this.hideNonPeriodicOverLay.bind(this);
        this.hidePeriodicOverLay = this.hidePeriodicOverLay.bind(this);
    }

    componentDidMount() {
        this._getAllSiteUsers();
        this._getListItems();
        $('.nav-stacked>li:nth-child(2)').addClass('itemActive');
    }

    handleNonPeriodicProjectClick = e => {
        this.setState({ target: e.target, showNonPeriodicProject: !this.state.showNonPeriodicProject });
    };

    handlePeriodicProjectClick = e => {
        this.setState({ target: e.target, showPeriodicProject: !this.state.showPeriodicProject });
    };


    private _getAllSiteUsers = (): void => {

        sp.web.siteUsers.get().then(function (data) {
            console.log("data", data);
        });
    };

    private _getListItems(): void {
        let vm = this;
        let tempArray = [];
        sp.web.lists.getByTitle('Projects').items
            .select("ID", "Title")
            .get()
            .then((response) => {
                console.log('response', response);
                if (response.length > 0) {
                    response.forEach((item, index) => {
                        tempArray.push({ Id: item.Id, Title: item.Title });
                        if (index === 0) {
                            this.props.projectIdCallout(item.Id);
                        }
                    });
                }
                vm.setState({
                    projectTitles: tempArray
                });
            });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getNonPeriodicUsers = (usersList) => {
        console.log('usersList', usersList);
        let usersLists = usersList;
        let usersId = [];
        usersLists.forEach(item => {
            usersId.push(item.key);
        });
        this.setState({
            options: usersId
        });
        // this.setState({ showNonPeriodicProject: true });
    }

    getPeriodicUsers = (usersList) => {
        console.log('usersList', usersList);
        let usersLists = usersList;
        let usersId = [];
        usersLists.forEach(item => {
            usersId.push(item.key);
        });
        this.setState({
            options: usersId
        });
        //this.setState({ showPeriodicProject: true });
    }


    handleSubmit(event) {
        event.preventDefault();
        if (this.state.name) {
            sp.web.lists.getByTitle('Projects').items.add({
                Title: this.state.name,
                ManagersId: {
                    results: this.state.options
                },
                Is_x0020_Active: true,
                Project_x0020_Code: this.state.code,
                Project_x0020_Description: this.state.description

            }).then((project: ItemAddResult) => {
                console.log('projects....', project);
                this._getListItems();
                this.setState({ showNonPeriodicProject: false, showPeriodicProject: false });
                if (project != null) {
                    this.getStatusColorsMasters(project.data.Id);
                }
            });
        }

    }

    getStatusColorsMasters(projectId) {
        sp.web.lists.getByTitle('Status Colors Master')
            .items
            .select("Status", "Color_x0020_Code", "Is_x0020_Active")
            .get()
            .then((response) => {
                console.log('Status Colors Master', response);
                let list = pnp.sp.web.lists.getByTitle("Status Master");
                if (response != null) {
                    response.forEach(item => {
                        list.getListItemEntityTypeFullName().then(entityTypeFullName => {

                            let batch = pnp.sp.web.createBatch();
                            if (item.Is_x0020_Active == true) {
                                if (item.Status == "") {
                                    list.items.inBatch(batch).add({
                                        ProjectId: projectId,
                                        Status: item.Status,
                                        Color_x0020_Code: item.Color_x0020_Code,
                                        Is_x0020_Active: false
                                    }, entityTypeFullName).then(b => {
                                        console.log('added status items-', b);
                                    });

                                    batch.execute().then(d => console.log("Done"));
                                } else if (item.Is_x0020_Active == true) {
                                    {
                                        list.items.inBatch(batch).add({
                                            ProjectId: projectId,
                                            Status: item.Status,
                                            Color_x0020_Code: item.Color_x0020_Code,
                                            Is_x0020_Active: item.Is_x0020_Active
                                        }, entityTypeFullName).then(b => {
                                            console.log('added status items-', b);
                                        });

                                        batch.execute().then(d => console.log("Done"));
                                    }

                                }
                            }
                        });
                    });
                }


                //     sp.web.lists.getByTitle('Status Master').items.add({
                //             Title: this.state.newItem,
                //             ProjectsId: project.data.Id,
                //             Task_x0020_NameId: activity.taskId,
                //             Activity_x0020_For: activity.activityFor,
                //             Activity_x0020_ById:activity.activityByUserId,
                //             Activity_x0020_Date: activity.activityDate,
                //             Old_x0020_Value: activity.oldValue,
                //             New_x0020_Value: activity.newValue
                //         }).then((iar: ItemAddResult) => {
                //         console.log(iar);
                //   });
            });
    }

    handleNonPeriodicProjectList(selectedKey) {
        if (selectedKey == -1) {
            this.setState({
                collapsedNonPeriodicProject: !this.state.collapsedNonPeriodicProject
            });
            return false;
        }
        this.props.projectIdCallout(selectedKey);
        console.log('selectedKey', selectedKey);
    }

    handlePeriodicProjectList(selectedKey) {
        if (selectedKey == -1) {
            this.setState({
                collapsedPeriodicProject: !this.state.collapsedPeriodicProject
            });
            return false;
        }
        this.props.projectIdCallout(selectedKey);
        console.log('selectedKey', selectedKey);
    }

    hideNonPeriodicOverLay() {
        this.setState({ showNonPeriodicProject: false });
    }

    hidePeriodicOverLay() {
        this.setState({ showPeriodicProject: false });
    }

    public render() {
        let projectTitles = this.state.projectTitles.map((item) => {
            return (
                <NavItem eventKey={item.Id}>{item.Title}</NavItem>
            );
        });
        return (
            <div className="projectOuterContainer">
                <div>
                    <Nav
                        bsStyle="tabs"
                        stacked
                        activeKey={-1}
                        onSelect={key => this.handleNonPeriodicProjectList(key)}
                    >
                        <NavItem eventKey={-1}><i className="fa fa-bars"></i> Non Periodic Projects</NavItem>
                        {this.state.collapsedNonPeriodicProject ? projectTitles : null}
                        {this.state.collapsedNonPeriodicProject ? <Button id="btnAddNonPeriodic" className="btn icon-btn addBtn" onClick={this.handleNonPeriodicProjectClick}>
                            <span className="glyphicon btn-glyphicon glyphicon-plus addIcon"></span>
                            Add
                        </Button> : null}
                    </Nav>
                    <Nav
                        bsStyle="tabs"
                        stacked
                        activeKey={-1}
                        onSelect={key => this.handlePeriodicProjectList(key)}
                    >
                        <NavItem eventKey={-1}><i className="fa fa-bars"></i> Periodic Projects</NavItem>
                        {this.state.collapsedPeriodicProject ? projectTitles : null}
                        {this.state.collapsedPeriodicProject ? <Button id="btnAddPeriodic" className="btn icon-btn addBtn" onClick={this.handlePeriodicProjectClick}>
                            <span className="glyphicon btn-glyphicon glyphicon-plus addIcon"></span>
                            Add
                        </Button> : null}
                    </Nav>
                </div>
                <div>
                    <Overlay
                        show={this.state.showNonPeriodicProject}
                        onHide={this.hideNonPeriodicOverLay}
                        target={this.state.target}
                        placement="right"
                        container={this}
                        containerPadding={20}
                    >
                        <Popover id="popover-positioned-scrolling-right">
                            <form>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="name">Project Name</label>
                                    <div>
                                        <input id="name" className="form-control" name="name" type="text" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="username">Project Code</label>
                                    <div>
                                        <input id="code" className="form-control" name="code" type="text" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="description">Project Description</label>
                                    <div>
                                        <input id="description" className="form-control" name="description" type="text" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="manager">Manager</label>
                                    <PeoplePickerTypesExample optionsCallback={this.getNonPeriodicUsers} />
                                </div>

                                <div className="form-group">
                                    <button id="btnNonPeriodic" type="button" className="btn btn-info" onClick={this.handleSubmit}>Save</button>
                                </div>
                            </form>
                        </Popover>
                    </Overlay>
                    <Overlay
                        show={this.state.showPeriodicProject}
                        onHide={this.hidePeriodicOverLay}
                        target={this.state.target}
                        placement="right"
                        container={this}
                        containerPadding={20}
                    >
                        <Popover id="popover-positioned-scrolling-right">
                            <form>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="name">Project Name</label>
                                    <div>
                                        <input id="name" className="form-control" name="name" type="text" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="username">Project Code</label>
                                    <div>
                                        <input id="code" className="form-control" name="code" type="text" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="description">Project Description</label>
                                    <div>
                                        <input id="description" className="form-control" name="description" type="text" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label" htmlFor="manager">Manager</label>
                                    <PeoplePickerTypesExample optionsCallback={this.getPeriodicUsers} />
                                </div>

                                <div className="form-group">
                                    <button id="btnPeriodic" type="button" className="btn btn-info" onClick={this.handleSubmit}>Save</button>
                                </div>
                            </form>
                        </Popover>
                    </Overlay>
                </div>
            </div>
        );
    }

}