import * as React from 'react'
import Css, {CssValue} from "../../../Css/Css";
import {CssValueTypes} from "../../../Css/Type";

interface Props {
  className: string
  css: Css
}

export default class CssEditor extends React.Component<Props, {}> {
  render() {
    const attrs = this.props.css.getAll();
    // const els = attrs.map((value, key) => { return(<CssAttr key={key!!} name={key!!} attr={value!!} />) });
    const nodes = attrs.keySeq().toArray().map(v => { return(<CssAttr key={v} name={v} attr={attrs.get(v)} />) });
    console.log(attrs);
    return(
        <div>
          <p>class::{this.props.className}</p>
          {nodes}
        </div>
    )
  }
}

interface AttrProps {
  name: string
  attr: CssValue
}

class CssAttr extends React.Component<AttrProps, {}> {
  createInput(type: CssValueTypes) {
    switch(type) {
      case CssValueTypes.Color: {
        return(<input type="color"/>)
      }
      case CssValueTypes.Float: {
        return(<input type="number"/>)
      }
      case CssValueTypes.Int: {
        return(<input type="number"/>)
      }
      case CssValueTypes.Len: {
        return(<input type="text"/>)
      }
      case CssValueTypes.Other: {
        return(<input type="text"/>)
      }
      case CssValueTypes.Merge: {
        return ""
      }
      default: throw new Error("ERROR INVALID CSS_VALUE_TYPE")
    }
  }
  render() {
    const input = this.createInput(this.props.attr.type);
    return(
        <div>
          <p>{this.props.name}</p>
          {input}
        </div>
    )
  }
}