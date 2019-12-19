import React, { Component } from "react";
import { Label } from "reactstrap";
class RemoteVideoComponent extends Component {
  state = {};
  render() {
    return (
      <div className="OT_root OT_publisher custom-class" id="remoteUsers">
        <div ref={this.props.value.sid} id={this.props.value.sid} />
        <Label> {this.props.value.identity}</Label>
      </div>
    );
  }
}

export default RemoteVideoComponent;
