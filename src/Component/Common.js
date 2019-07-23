import React,{Component} from "react";
import {PropTypes} from 'prop-types';

import "./Common.css"

export const Color2 = ({title,color,rating=0})=>
    <section className={"color"}>
        <h1>{title}</h1>
        <div className={"divColor"} style={{backgroundColor:color}} />
        <div>
            <StarRating starsSelected={rating} />
        </div>
    </section>;


export class Color extends Component {
    componentWillMount() {
        const {title} = this.props;
        console.log("Color componentWillMount " + title );
        this.style={backgroundColor:"#CCC"};
    }
    componentDidMount() {
        const {title} = this.props;
        console.log("Color componentDidMount " + title);
    }
    componentWillUnmount() {
        const {title} = this.props;
        console.log("Color componentWillUnmount" + title)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        const {title} = this.props;
        const {newTitle} = nextProps;
        console.log("Color componentWillReceiveProps " + title + " - " + newTitle);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {rating} = this.props;
        if (rating === nextProps.rating) {
            return false
        }
        
        const {title} = this.props;
        const {newTitle} = nextProps;
        console.log("Color shouldComponentUpdate " + title + " - " + newTitle);
        return true
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        const {title} = this.props;
        const {newTitle} = nextProps;
        console.log("Color componentWillUpdate " + title + " - " + newTitle);
        this.style = null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const {title} = this.props;
        console.log("Color componentDidUpdate " + title);
    }


    render (){
        const {title,color,rating,onRate} = this.props;
        return (
            <section style={this.style}>
                <h1>{title}</h1>
                <div className={"divColor"} style={{backgroundColor:color}} />
                <div>
                    <StarRating starsSelected={rating} onRate={onRate} />
                </div>
            </section>
        )
    }
}

Color.propTypes = {
    title:PropTypes.string,
    rating:PropTypes.number,
    color:PropTypes.string,
    onRate:PropTypes.func,
};

Color.defaultProps = {
    title:undefined,
    rating:0,
    color:"#000000",
};



export const AddColorForm = ({onNewColor=f=>f}) => {
    let _title,_color;
    const submit = e => {
        e.preventDefault();
        onNewColor(_title.value,_color.value);
        _title.value = "";
        _color.valuie = "#000000";
        _title.focus();
    };
    return (
        <form onSubmit={submit}>
            <input ref={input => _title = input}
                   type={"text"}
                   placeholder={"color title ..."}
                   required />
            <input ref={input=>_color=input}
                   type={"color"}
                   required />
               <button>Add</button>
        </form>
    )
};



export const Star = ({selected=false,onClick=f=>f})=><div className={(selected)?"star selected":"star"} onClick={onClick} />;

Star.propTypes = {
    selected:PropTypes.bool,
    onClick:PropTypes.func,
};

export class StarRating extends Component {
    constructor(props){
        super(props);
        this.state = {
            startsSelected:0,
        };
        this.change.bind(this);
    }

    change = (startsSelected) => {
        this.setState({startsSelected});
    };

    render() {
        const {totalStars} = this.props;
        const {startsSelected} = this.state;
        const strTitle = `${startsSelected} of ${totalStars}`;
        const intW = totalStars * 29;
        const w = "" + intW + "px";

        return (
            <div className={"star-rating"} style={{width:w}}>
                {[...Array(totalStars)].map((n,i)=>
                    <Star
                        key={i}
                        selected={i<startsSelected}
                        onClick={()=>this.change(i+1)}
                    />
                )}
                <div className={"clear"} />
                <div style={{textAlign:"center",width:"100%"}}>{strTitle}</div>
            </div>
        )
    }
}

StarRating.propTypes = {
    totalStars:PropTypes.number,
};

StarRating.defaultProps = {
    totalStars:5,
};

