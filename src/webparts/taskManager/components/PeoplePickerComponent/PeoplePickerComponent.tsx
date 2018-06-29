/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { BaseComponent, assign } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import {
  CompactPeoplePicker,
  IBasePickerSuggestionsProps,
  IBasePicker,
  ListPeoplePicker,
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.types';
import { people, mru } from './PeoplePickerSampleData';
import { default as pnp, sp, ItemAddResult } from "sp-pnp-js";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Promise } from 'es6-promise';
import styles from './PeoplePickerComponent.module.scss';

export interface IPeoplePickerExampleState {
  currentPicker?: number | string;
  delayResults?: boolean;
  peopleList: IPersonaProps[];
  mostRecentlyUsed: IPersonaProps[];
  currentSelectedItems?: IPersonaProps[];
}

export interface IPeoplePickerExampleProps {
  options: any;
}

const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts'
};

const limitedSearchAdditionalProps: IBasePickerSuggestionsProps = {
  searchForMoreText: 'Load all Results',
  resultsMaximumNumber: 10,
  searchingText: 'Searching...'
};

//const limitedSearchSuggestionProps: IBasePickerSuggestionsProps = assign(limitedSearchAdditionalProps, suggestionProps);

export default class PeoplePickerTypesExample extends BaseComponent<any, IPeoplePickerExampleState> {
  private _picker: IBasePicker<IPersonaProps>;

  constructor(props) {
    super(props);

    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList: [],
      mostRecentlyUsed: mru,
      currentSelectedItems: []
    };
  }


  componentDidMount() {
    this._getAllSiteUsers();
  }
  private _getAllSiteUsers = (): void => {
    let vm = this;
    sp.web.siteUsers.get().then(function (data) {

      console.log("data", data);
      const peopleList: IPersonaWithMenu[] = [];
      data.forEach((persona) => {
        const target: IPersonaWithMenu = {};
        let tempPersona = {
          key: persona.Id,
          text: persona.Title
        }
        assign(target, tempPersona);
        peopleList.push(target);

      });
      vm.setState({
        peopleList: peopleList
      });
    });
  };

  public render() {
    let currentPicker: JSX.Element | undefined = undefined;

    switch (this.state.currentPicker) {
      case 1:
        currentPicker = this._renderControlledPicker();
        break;
      default:
    }

    return (
      <div>
        {currentPicker}
      </div>
    );
  }

  private _getTextFromItem(tempPersona: IPersonaProps): string {
    return tempPersona.text as string;
  }

  private _renderControlledPicker() {
    const controlledItems = [];
    for (let i = 0; i < 5; i++) {
      const item = this.state.peopleList[i];
      if (this.state.currentSelectedItems!.indexOf(item) === -1) {
        controlledItems.push(this.state.peopleList[i]);
      }
    }

    return (
      <div>
        <NormalPeoplePicker
          onResolveSuggestions={this._onFilterChanged}
          getTextFromItem={this._getTextFromItem}
          className={'ms-PeoplePicker'}
          key={'controlled'}
          selectedItems={this.state.currentSelectedItems}
          onChange={this._onItemsChange}
          inputProps={{
            onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
            onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called')
          }}
          componentRef={this._resolveRef('_picker')}
          resolveDelay={300}
        />

      </div>
    );
  }

  private _onItemsChange = (items: any[]): void => {
    this.setState({
      currentSelectedItems: items
    });
    this.props.optionsCallback(this.state.currentSelectedItems);
  };

  private _onSetFocusButtonClicked = (): void => {
    if (this._picker) {
      this._picker.focusInput();
    }
  };

  private _renderFooterText = (): JSX.Element => {
    return <div>No additional results</div>;
  };

  private _onRemoveSuggestion = (item: IPersonaProps): void => {
    const { peopleList, mostRecentlyUsed: mruState } = this.state;
    const indexPeopleList: number = peopleList.indexOf(item);
    const indexMostRecentlyUsed: number = mruState.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople: IPersonaProps[] = peopleList
        .slice(0, indexPeopleList)
        .concat(peopleList.slice(indexPeopleList + 1));
      this.setState({ peopleList: newPeople });
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople: IPersonaProps[] = mruState
        .slice(0, indexMostRecentlyUsed)
        .concat(mruState.slice(indexMostRecentlyUsed + 1));
      this.setState({ mostRecentlyUsed: newSuggestedPeople });
    }
  };

  private _onItemSelected = (item: IPersonaProps): Promise<IPersonaProps> => {
    const processedItem = Object.assign({}, item);
    processedItem.text = `${item.text} (selected)`;
    return new Promise<IPersonaProps>((resolve, reject) => setTimeout(() => resolve(processedItem), 250));
  };

  private _onFilterChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[],
    limitResults?: number
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = this._filterPersonasByText(filterText);

      filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
      return this._filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  private _onFilterChangedWithLimit = (
    filterText: string,
    currentPersonas: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    return this._onFilterChanged(filterText, currentPersonas, 3);
  };

  private _filterPromise(personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

  private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
  }

  private _filterPersonasByText(filterText: string): IPersonaProps[] {
    return this.state.peopleList.filter(item => this._doesTextStartWith(item.text as string, filterText));
  }

  private _doesTextStartWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
    return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

  private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
    return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }

  private _toggleDelayResultsChange = (toggleState: boolean): void => {
    this.setState({ delayResults: toggleState });
  };

  private _dropDownSelected = (option: IDropdownOption): void => {
    this.setState({ currentPicker: option.key });
  };

  private _validateInput = (input: string): ValidationState => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  };
  
  private _onInputChange(input: string): string {
    const outlookRegEx = /<.*>/g;
    const emailAddress = outlookRegEx.exec(input);

    if (emailAddress && emailAddress[0]) {
      return emailAddress[0].substring(1, emailAddress[0].length - 1);
    }

    return input;
  }
}