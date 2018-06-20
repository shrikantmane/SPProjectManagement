import * as React from 'react';
import Rnd from "react-rnd";
import { IGunttChartProps } from './IGunttChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import styles from '../../../listOperations/components/ListOperations.module.scss';
//import { ResizableArea } from 'react-resizable-area'
//import { Resizable, ResizableBox } from 'react-resizable';
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#E6B719"
};

const boldText={
   display:"none"
};

export interface IReactSpfxState {

  
    width: number,
      height: number,
      x: number,
      y: number
   
}

export default class HelloWorld extends React.Component<IGunttChartProps, IReactSpfxState> {
  public constructor(props: IGunttChartProps, state: IReactSpfxState) {
    super(props);
    this.state = {
    
      width: 726,
      height: 200,
      x: 0,
      y: 0,
      
 };
    // subscribe for event by event name.


    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }
  private handleLoginClick(): void {
    jquery("table").show();

  }
  private handleLogoutClick(): void {
    jquery("table").hide();

  }
  
  public render(): React.ReactElement<IGunttChartProps> {
 
    return (
    
      <div >
      
      <table id="tab" style={boldText} >
       <Rnd
        style={style}
        size={{ width: this.state.width, height: this.state.height }}
        position={{ x: this.state.x, y: this.state.y }}
        disableDragging={true}
        onDragStop={(e, d) => {
          this.setState({ x: d.x, y: d.y });
         
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            // ...position,
           
          });
        }}
      >
         <img src="/sites/rms/SiteAssets/timeline9.png" className={styles.header}></img> 
      </Rnd>
      
      </table>
<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      </div>
      
      
    );
  }
}
