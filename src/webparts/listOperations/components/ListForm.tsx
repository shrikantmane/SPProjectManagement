import * as React from "react";
// import styles from "./ListForm.module.scss";
import { IListOperationsProps } from "./IListOperationsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { IListFormProps } from './IListFormProps';
import { IListFormStats } from './IListFormStats';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

let moment = require('moment');
import { ItemAddResult } from "@pnp/sp";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DatePicker, IDatePickerStrings, IDatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { ITextField } from 'office-ui-fabric-react/lib/components/TextField';
import { stringIsNullOrEmpty } from '@pnp/common';

const DayPickerStrings: IDatePickerStrings = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
  
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
  
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
  
    shortDays: [
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S'
    ],
  
    goToToday: 'Go to today',
  
    isRequiredErrorMessage: 'Cannot be empty'
  };

export default class ListForm extends React.Component<IListFormProps, IListFormStats> {
  private _formComponents: any[] = [];
  
  constructor(props) {
    super(props);

    this.state = {
        item: this.props.item === undefined? {} : this.props.item,
        editFormErrors: {}
    }
  }
  

  public render(): React.ReactElement<IListOperationsProps> {
    var headerText = "";

    if (this.props.item === undefined) {
      headerText = "New Item";
    } else {
      headerText = `Edit ${this.props.item.Title}`;
    }

    var components: JSX.Element[] = [];
    this.props.fields.map((field: ISpField, index: number) => {
      components.push(
        this._getComponentByField(field)
      );
    });

    return ( <div>
                <Panel
                    isOpen={this.props.showEditPanel}
                    type={PanelType.smallFixedFar}
                    headerText={headerText}
                    onDismiss={this.props.onDismiss}
                    onRenderFooterContent={this._onRenderFooterContent.bind(this)}
                > 
                    {components}
                </Panel>
            </div>
    );
  }

  private _getComponentByField(field: ISpField): JSX.Element {
    switch (field.TypeAsString) {
      case "Currency":
        return (
          <TextField
            componentRef={(component: ITextField) => { this._formComponents.push(component); }}
            label={field.Title}
            type='number'
            required={field.Required}
            onGetErrorMessage={(value) => { return this._validate(value, field); }}
            errorMessage={this.state.editFormErrors[field.InternalName]}
            onChanged={(value) => { return this._onValueChanged(value, field); }}
            validateOnFocusOut={true}
            validateOnLoad={false}
            value={this.state.item[field.InternalName]}
          />
        );
      case "DateTime":
        return (
          <DatePicker
            componentRef={(component: IDatePicker) => { this._formComponents.push(component); }}
            label={field.Title}
            isRequired={field.Required}
            //minDate={moment().toDate()}
            value={this._getDateOfField(field)}
            onSelectDate={(date) => { return this._onValueChanged(date, field); }}
            strings={DayPickerStrings}
          />
        );
      case "Note":
        return (
          <TextField
            componentRef={(component: ITextField) => { this._formComponents.push(component); }}
            label={field.Title}
            required={field.Required}
            multiline
            rows={4}
            onChanged={(val) => { return this._onValueChanged(val, field); }}
            onGetErrorMessage={(value) => { return this._validate(value, field); }}
            errorMessage={this.state.editFormErrors[field.InternalName]}
            validateOnFocusOut={true}
            validateOnLoad={false}
            value={this.state.item[field.InternalName]}
          />
        );
      case "Text":
        return (
          <TextField
            componentRef={(component: ITextField) => { this._formComponents.push(component); }}
            label={field.Title}
            required={field.Required}
            onChanged={(value) => { return this._onValueChanged(value, field); }}
            onGetErrorMessage={(value) => { return this._validate(value, field); }}
            errorMessage={this.state.editFormErrors[field.InternalName]}
            validateOnFocusOut={true}
            validateOnLoad={false}
            value={this.state.item[field.InternalName]}
          />
        );
      default:
        return (
          <TextField
            label={field.Title}
            disabled={true}
            placeholder={`${field.TypeAsString} is not supported yet`}
          />
        );
    }
  }

  public componentWillReceiveProps() {
    this.state = {
      item: this.props.item === undefined ? {} : this.props.item,
      editFormErrors: {},
    };
  }

  private _onRenderFooterContent(){
    return (
        <div>
          <PrimaryButton
            onClick={this._onSaveEditForm.bind(this)}
          >
            Save
          </PrimaryButton>
          <DefaultButton
            onClick={this.props.onDismiss}
          >
            Cancel
          </DefaultButton>
        </div>
      );
  }

  private _onSaveEditForm(): void {

    var canSave: boolean = true;
    var editFormErrors: {} = {};
    this.props.fields.map((field, index) => {
      var error = this._validate(this.state.item[field.InternalName], field);
      editFormErrors[field.InternalName] = error;
      canSave = canSave && stringIsNullOrEmpty(error);
    });

    this.setState({ editFormErrors: editFormErrors });

    var item = {};
    console.log(this.state.item);

    this.props.fields.map((field, index) => {
      item[field.InternalName] = this.state.item[field.InternalName];
    });

    if (canSave) {
      this.props.onSave(item, this.props.item).then((iar: ItemAddResult) => {
        this.props.onSaved();
      }).catch((error: any) => {
        console.log(error);
      });

      this.props.onDismiss();
    }
  }

  private _onValueChanged(value: any, field: ISpField) {
    var item = this.state.item;
    item[field.InternalName] = value;
    this.setState({
      item: item
    }, () => { console.log(this.state.item); });
  }

  private _validate(value: string, field: ISpField): string {
    if (field.Required && stringIsNullOrEmpty(value)) {
      return "Cannot be empty";
    }

    switch (field.TypeAsString) {
      case "Currency": {
        if (Number(value) < 0) {
          return "Cannot be smaller then 0";
        }
        return "";
      }
    }

    return "";
  }

  private _getDateOfField(field: ISpField) {
    var value: any = this.state.item[field.InternalName];

    if (typeof value === "string") {
      //return moment(value).toDate();
      return value;
    }

    return value;
  }
}
