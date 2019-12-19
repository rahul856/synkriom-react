import React, { Component } from "react";
import { Col, Row, Label, Input } from "reactstrap";
import StarRatingComponent from "react-star-rating-component";
class Skill extends Component {
  state = {
    rating: 1
  };
  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  render() {
    const { rating } = this.state;
    React.createElement("div");
    return (
      <React.Fragment>
        <Row className="mt-2">
          <Col>
            <Input
              name={"skillName"}
              data-id={this.props.id}
              id={this.props.id}
              className="skillName"
              placeholder="SkillName "
            />
          </Col>
          <Col>
            <Input
              name={"comment"}
              data-id={this.props.id}
              id={this.props.id}
              className="comment"
              placeholder="Please Enter comment "
            />
          </Col>
          <Col>
            <Label htmlFor={"rating" + this.props.id}>Rating</Label>
            <StarRatingComponent
              name={"rating_" + this.props.id}
              starCount={5}
              id={this.props.id}
              className="rating"
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default Skill;
