import React from "react";

import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
class ContactDetail extends React.Component {
  render() {
    React.createElement("div");
    return (
      <React.Fragment>
        <Row className="mt-2">
          <Col>
            <Label htmlFor={"fname" + this.props.id}>FirstName</Label>
            <Input
              type="text"
              name={"fname" + this.props.type}
              data-id={this.props.id}
              id={this.props.id}
              className="fname"
              placeholder="Please Enter First Name"
            />
          </Col>
          <Col>
            <Label htmlFor={"lname" + this.props.id}>LastName</Label>
            <Input
              type="text"
              name={"lname" + this.props.type}
              data-id={this.props.id}
              id={this.props.id}
              className="lname"
              placeholder="Please Enter Last Name"
            />
          </Col>
          <Col>
            <Label htmlFor={"email" + this.props.id}>Email </Label>
            <Input
              type="email"
              name={"email" + this.props.type}
              data-id={this.props.id}
              id={this.props.id}
              className="email"
              placeholder="Enter in myemail@myemail.com"
            />
          </Col>
          <Col>
            <Label htmlFor={"phone" + this.props.id}>Phone </Label>
            <Input
              type="phone"
              name={"phone" + this.props.type}
              data-id={this.props.id}
              id={this.props.id}
              className="phone"
              placeholder="Phone Number"
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ContactDetail;
