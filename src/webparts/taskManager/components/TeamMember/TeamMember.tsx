import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter, IDialogStyleProps  } from 'office-ui-fabric-react/lib/Dialog';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import {sp, ItemAddResult} from "@pnp/sp";
import { TooltipHost, DirectionalHint  } from 'office-ui-fabric-react/lib/Tooltip';
import { IPersonaProps, Persona, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import {
  CompactPeoplePicker,
  IBasePickerSuggestionsProps,
  IBasePicker,
  ListPeoplePicker,
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { BaseComponent, assign } from 'office-ui-fabric-react/lib/Utilities';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.types';
import * as jquery from 'jquery';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button';

export interface ITeamMemberState {
 hideDialog: boolean;
 hideMsgBox: boolean;
 currentMemberId: number;
 items:ISpTaskItem[];
 selectedUser: ISelectedUser[];
 currentPicker?: number | string;
 delayResults?: boolean;
 peopleList: IPersonaProps[];
 currentSelectedItems?: IPersonaProps[];
 mostRecentlyUsed: IPersonaProps[];
 projectId : number | string;
}

export interface ISelectedUser{
    key : number | string;
    text : string;
}

export interface ISpTaskItem{
    Id?: number;
    ProjectID?: string;
    StartDate?: string;
    EndDate?: string;
    Status?: string;
    TeamMember: {
      ID: number,
      Title: string
    }
    Project: {
      ID: number,
      Title: string
    }
  }

  export interface IUserData {
    key : number;
    text : string;
    email : string;
    imageUrl : string;
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

const limitedSearchSuggestionProps: IBasePickerSuggestionsProps = assign(limitedSearchAdditionalProps, suggestionProps);

export default class TeamMember extends React.Component<{}, ITeamMemberState> {

private _picker: IBasePicker<IPersonaProps>;
  constructor(props: {}) {
    super(props);

    this.state = {
      hideDialog: true,
      hideMsgBox: true,
      currentMemberId: 0,
      items: [],
      selectedUser : [],
      currentPicker: 1,
      delayResults: false,
      peopleList: [],
      currentSelectedItems: [],
      mostRecentlyUsed: [],
      projectId : 1
    };

    this._addListItem = this._addListItem.bind(this);
    this. _deleteListItem = this. _deleteListItem.bind(this);
    this._showMsgBox = this._showMsgBox.bind(this);
  }

   public componentDidMount() {
       this._getListItems();
       this._getAllSiteUsers();
  }

   public render(): React.ReactElement<ITeamMemberState> {
        var reactHandler = this; 
        limitedSearchSuggestionProps.resultsFooter = this._renderFooterText;
        return (
            <div>  
               <div> 
                    <Dialog
                      hidden={this.state.hideMsgBox}
                      onDismiss={this._closeMsgBox}
                      dialogContentProps={{
                        type: DialogType.normal,
                        subText: 'Would you like to remove this team member?'
                      }}
                      modalProps={{
                        isBlocking: true,
                        containerClassName: 'ms-dialogMainOverride'
                      }}
                    >
                      <DialogFooter>
                        <PrimaryButton onClick={this._deleteListItem} text="Yes" />
                        <DefaultButton onClick={this._closeMsgBox} text="No" />
                      </DialogFooter>
                    </Dialog>
               </div>
                <div  onClick={this._showDialog} style={{float: "right" }}>  
                 <TooltipHost directionalHint={DirectionalHint.bottomCenter} content="People on this board" id="ppl" calloutProps={{ gapSpace: 0 }}>
                  <Icon id="ppl" iconName="people" className="ms-IconExample" style={{width: "30"}} />
                   </TooltipHost>
                </div>
                <Dialog
                
                hidden={this.state.hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.close,
                    title: 'Add Team Members'
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'ms-dialogMainOverride'
                }}
                >
                <div>
                     <table style={{width: '100%'}}>
                           <tr> 
                               <td> 
                                    <CompactPeoplePicker
                                    onResolveSuggestions={this._onFilterChangedWithLimit}
                                    onEmptyInputFocus={this._returnMostRecentlyUsedWithLimit}
                                    getTextFromItem={this._getTextFromItem}
                                    className={'ms-PeoplePicker'}
                                    onGetMoreResults={this._onFilterChanged}
                                    pickerSuggestionsProps={limitedSearchSuggestionProps}
                                    onRemoveSuggestion={this._onRemoveSuggestion}
                                    selectedItems={this.state.selectedUser}
                                    onChange={this._onItemsChange}
                                    inputProps={{
                                    onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called', ev),
                                    onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called', ev),
                                    'aria-label': 'People Picker'
                                    }}
                                    resolveDelay={300}
                                    />
                               </td>
                               <td> 
                                    <Icon iconName="add" className="ms-IconExample" onClick={this._addListItem} style={{float : "right"}} />
                               </td>
                           </tr>
                    </table>
                  </div>
                  <br/>
                  <div>
                        {this.state.items.map(function(item,key){  
                            if(item.EndDate == null)
                            {
                                return (
                                        <table className="table-users table" style={{ Border : "0", marginBottom: "0px"}} >
                                            <tbody>
                                                 <tr>
                                                      <td style={{width: "90%"}} >{item.TeamMember.Title} </td>
                                                      <td style={{width: "10%"}} > <Icon iconName="clear" className="ms-IconExample" onClick={(e) => reactHandler._showMsgBox(e,item.Id)} /></td>
                                                 </tr>
                                            </tbody>
                                        </table>
                                      );
                            }
                        })}
                 </div>
                 <DialogFooter></DialogFooter>
                </Dialog>
            </div>
        );
      } // end of render()

// Get all site users for peoplePicker
  private _getAllSiteUsers = (): void => {
    var reactHandler = this;  
    sp.web.siteUsers.get().then(function(data) {  

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

      const mru: IPersonaProps[] = peopleList.slice(0, 5);
      reactHandler.setState({
        peopleList: peopleList,
        mostRecentlyUsed : mru
      });
    }); 
  };

  GetUserPictureUrl(userID,userName,userEmail){  
            var i = 0;
            var reactHandler = this;    
            jquery.ajax({    
                url:` https://esplrms.sharepoint.com/sites/rms/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='PictureURL')?@v=%27i:0%23.f|membership|`+ userEmail +`%27` , 
                type: "GET",    
                headers:{'Accept': 'application/json; odata=verbose;'},    
                success: function(PicData) {
                var img;
                if(PicData.d.GetUserProfilePropertyFor != "" )
                {    
                     img = PicData.d.GetUserProfilePropertyFor;
                }
                else
                    img = "https://esplrms.sharepoint.com/sites/rms/SiteAssets/default.jpg";
                },    
                error : function(PicData) {
                    console.log('Error Occurred !');     
                }    
            });    
 }

// dilogue
  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  };

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  };

  private _onRefreshItems(): void {
    this._getListItems();
  }

   private _getListItems(): void {
    let list = sp.web.lists.getByTitle("Project Team Member");
       list.items
      .select("ID","ProjectID", "StartDate", "EndDate", "Status","TeamMember/Title", "TeamMember/ID", "Project/Title", "Project/ID").expand("TeamMember","Project").filter("Project/ID eq "+ this.state.projectId +" and Status eq 'Active'")
      .get()
      .then((response) => {
        this.setState({
          items: response
        });
      });
  }

// Delete team member from UI & update in the list
   private _showMsgBox = (e,itemID): void => {
    console.log("test");
    this.setState({ 
          hideMsgBox : false,
          currentMemberId:itemID
      });
  };

  private _closeMsgBox = (): void => {
    this.setState({ 
            hideMsgBox : true,
            currentMemberId: 0 
      });
  };

  private _deleteListItem() : void {
     let list = sp.web.lists.getByTitle("Project Team Member");
        let date: any;
        date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        list.items.getById(this.state.currentMemberId).update({
            Status : "Inactive",
            EndDate : date
        }).then(i => {
            this._onRefreshItems();
            this._closeMsgBox();
        });
  }

// Add team member to list
  private _addListItem() : void { 
    let date: any;
    date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

   for (var i = 0; i < this.state.selectedUser.length; i++) {
       var key = this.state.selectedUser[i].key;

           let list = sp.web.lists.getByTitle("Project Team Member").items.add({
                Title: "No Title",
                StartDate : date,
                Status : "Active", 
                TeamMemberId : key,
                ProjectId : this.state.projectId
            }).then(response => {
                this._onRefreshItems();
                this.setState({
                  selectedUser : []
                });
               }).catch(console.log);
           }
  }

// PeoplePicker
  private _onItemsChange = (items: any[]): void => {
    this.setState({
      selectedUser : items
    });
  };

  private _onItemSelected = (item: IPersonaProps): Promise<IPersonaProps> => {
    const processedItem = Object.assign({}, item);
    processedItem.text = `${item.text} (selected)`;
    return new Promise<IPersonaProps>((resolve, reject) => setTimeout(() => resolve(processedItem), 250));
  };

    private _renderFooterText = (): JSX.Element => {
    return <div>No additional results</div>;
  };

    private _onFilterChangedWithLimit = (
    filterText: string,
    currentPersonas: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
     return this._onFilterChanged(filterText, currentPersonas, 3);
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

    private _filterPersonasByText(filterText: string): IPersonaProps[] {
     return this.state.peopleList.filter(item => this._doesTextStartWith(item.text as string, filterText));
  }
    private _doesTextStartWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

    private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
    return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }

    private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
  }

    private _filterPromise(personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

    private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
    return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

    private _returnMostRecentlyUsedWithLimit = (
    currentPersonas: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
    mostRecentlyUsed = mostRecentlyUsed.splice(0, 3);
    return this._filterPromise(mostRecentlyUsed);
  };

    private _getTextFromItem(persona: IPersonaProps): string {
    return persona.text as string;
  }

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
}