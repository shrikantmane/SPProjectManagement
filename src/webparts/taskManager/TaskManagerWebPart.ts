import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
// import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TaskManagerWebPartStrings';
import TaskManager from './components/TaskManager';
import { ITaskManagerProps } from './components/ITaskManagerProps';

import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy
} from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

export interface ITaskManagerWebPartProps {
  list: string;
}

export default class TaskManagerWebPart extends BaseClientSideWebPart<ITaskManagerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITaskManagerProps > = React.createElement(
      TaskManager,
      {
        list: this.properties.list,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
