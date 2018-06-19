import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { sp, ItemAddResult } from "@pnp/sp";
import * as strings from 'ListOperationsWebPartStrings';
import ListOperations from './components/ListOperations';
import { IListOperationsProps } from './components/IListOperationsProps';

import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy
} from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

export interface IListOperationsWebPartProps {
  list: string;
}

export default class ListOperationsWebPart extends BaseClientSideWebPart<IListOperationsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IListOperationsProps > = React.createElement(
      ListOperations,
      {
        list: this.properties.list,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('list', {
                  label: strings.DescriptionFieldLabel,
                  selectedList:this.properties.list,
                  includeHidden:false,
                  orderBy:PropertyFieldListPickerOrderBy.Title,
                  disabled:false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties:this.properties,
                  context:this.context,
                  onGetErrorMessage:null,
                  deferredValidationTime:0,
                  key: 'listPickerFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
