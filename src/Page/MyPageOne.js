import React,{Component} from 'react';
import {v4} from 'uuid'
// import PropTypes from 'prop-types';
import {AddColorForm,Color} from "../Component/Common"

import "./MyPageOne.css"

const ColorList = ({colors=[]})=>
    <div className={"color-list"}>
        {(colors.length===0)?<p>No Colors Listed</p>:colors.map(color=><Color key={color.id}{...color} />)}
    </div>;


export class MyPageOne extends Component {
    constructor(props){
        super(props);
        this.state={
            colors:[],
        };
        this.addColor.bind(this);
        this.rateColor.bind(this);
        this.removeColor.bind(this);
    }

    addColor = (title,color) => {
        const colors = [
          ...this.state.colors,
          {
              id:v4(),
              title,
              color,
              rating:0,
          }
        ];
        this.setState({
            colors:colors,
        });
    };

    rateColor = (id,rating) => {
      const colors = this.state.colors.map(color=>
          (color.id!==id)?color:{...color,rating}
      );
      this.setState(colors);
    };

    removeColor=(id)=>{
      const colors = this.state.color.filter(color=>color.id !==id);
      this.setState(colors)
    };

    render() {
        return (
            <div className={"divCon"}>
                <AddColorForm onNewColor={(title,color)=>{
                    this.addColor(title,color);
                }} />
                <ColorList colors={this.state.colors} />
            </div>
        )
    }
}
