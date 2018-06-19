import * as React from 'react';
import styles from './TaskManager.module.scss';
import { ITaskManagerProps } from './ITaskManagerProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class TaskManager extends React.Component<ITaskManagerProps, {}> {
  public render(): React.ReactElement<ITaskManagerProps> {
    return (
      <div className={ styles.taskManager }>
        <div>Search Layout</div>
        <div>Table Layout</div>
        <div>Bulk Operation Component</div>
      </div>
    );
  }
}
