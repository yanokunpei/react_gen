import * as React from 'react'
import {Route, Switch} from "react-router";
import NotFound from "./NotFound";
import IDE from "./IDE/Container";
import Top from "./TOP/Container";
import Modal from "./Modal/Container";

export class Routes extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/ide" component={IDE}/>
          <Route path="/" component={Top}/>
          <Route component={NotFound}/>
        </Switch>
        <Modal/>
      </div>
    )
  }
}