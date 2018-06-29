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
            collapsed: true,
            show: false
        }   

        // SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
        // SPComponentLoader.loadCss('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js');
        // SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js');
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this._getAllSiteUsers();
        this._getListItems();
    }

    handleClick = e => {
        this.setState({ target: e.target, show: !this.state.show });
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
                        if(index === 0){
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

    getUsers = (usersList) => {
        console.log('usersList', usersList);
        let usersLists = usersList;
        let usersId = [];
        usersLists.forEach(item => {
            usersId.push(item.key);
        });
        this.setState({
            options: usersId
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        sp.web.lists.getByTitle('Projects').items.add({
            Title: this.state.name,
            ManagersId: {
                results: this.state.options
            },
            Is_x0020_Active: true,
            Project_x0020_Code: this.state.code,
            Project_x0020_Description: this.state.description

        }).then((iar: ItemAddResult) => {
            console.log(iar);
            this._getListItems();
            this.setState({ show: false });
        });
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    handleProjectList(selectedKey) {
        this.props.projectIdCallout(selectedKey);
        console.log('selectedKey', selectedKey);
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
                        activeKey={1}
                        onSelect={key => this.handleProjectList(key)}
                    >
                        {projectTitles}
                    </Nav>
                </div>
                <div>
                <Overlay
                        show={this.state.show}
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
                                    <PeoplePickerTypesExample optionsCallback={this.getUsers} />
                                </div>

                                <div className="form-group">
                                    <button type="button" className="btn btn-info" onClick={this.handleSubmit}>Save</button>
                                </div>
                            </form>
                        </Popover>
                    </Overlay>
                    <Button className="btn icon-btn addBtn" onClick={this.handleClick}>
                        <span className="glyphicon btn-glyphicon glyphicon-plus addIcon"></span>
                        Add
                        </Button>
                    
                </div>
            </div>
        );
    }

}