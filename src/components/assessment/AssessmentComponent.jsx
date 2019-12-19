import React from "react";
import DatePicker from "react-datepicker";
import { Container, Col, Row, Label, Input, Button, Form } from "reactstrap";
import Skill from "./Skill";
import "./AssessmentComponent.css";
class AssessmentComponent extends React.Component {
  state = {
    dateTime: new Date(),
    fullName: "",
    years: "",
    position: "",
    email: "",
    phone: "",
    status: "",
    remarks: "",
    skills: [
      {
        id: 0,
        skillName: "",
        rating: 1,
        comment: ""
      }
    ]
  };
  addSkills = e => {
    const row = { skillName: "", rating: "", comment: "" };
    this.setState(prevState => ({
      skills: [
        ...prevState.skills,
        {
          id: this.state.skills.length,
          row
        }
      ]
    }));
  };

  handleChange = e => {
    if (["skillName", "comment"].includes(e.target.name)) {
      let skills = [...this.state.skills];
      skills[e.target.id - 1][e.target.name] = e.target.value.toUpperCase();
      this.setState({ skills }, () =>
        console.log("skills changed-->", this.state.skills)
      );
    } else if (["dv-star-rating-input"].includes(e.target.className)) {
      let name = e.target.name;
      console.log(
        e.target.className,
        e.target.name,
        e.target.id,
        e.target.value
      );

      let array = name.split("_");
      console.log("array", array);
      let idx = array[1];
      let elementName = array[0];

      let skills = [...this.state.skills];
      skills[idx - 1][elementName] = e.target.value.toUpperCase();
      this.setState({ skills }, () =>
        console.log("skills changed-->", this.state.skills)
      );
    } else {
      console.log(
        "Value ---->",

        e.target.name,
        e.target.value
      );
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  deleteSkill = e => {
    console.log("ID-->", e.target.id);
    let deleteId = e.target.id - 1;
    const skills = this.state.skills.filter(item => item.id !== deleteId);
    this.setState({ skills }, () => console.log(this.state.skills, skills));
  };
  onChange = date => {
    this.setState({
      dateTime: date
    });
  };
  render() {
    React.createElement("div");
    return (
      <Container className="AssessmentComponent">
        <h4>Assessment Form</h4>
        <Form
          id="assessmentform"
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          <Row className="mt-2">
            <Col>
              <Label htmlFor="dateTime">Date</Label>
              <DatePicker
                selected={this.state.dateTime}
                showTimeSelect
                dateFormat="Pp"
                onChange={this.onChange}
                placeholderText="Click to select a Interview Date"
              ></DatePicker>
            </Col>
            <Col>
              <Input
                type="text"
                name="fullName"
                data-id={this.props.id}
                id={this.props.id}
                className="fullName"
                placeholder="Please Enter Full Name"
              />
            </Col>
            <Col>
              <Input
                type="text"
                name="position"
                data-id={this.props.id}
                id={this.props.id}
                className="position"
                placeholder="Position"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Label htmlFor={"email" + this.props.id}>Email </Label>
              <Input
                type="email"
                name="email"
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
                name="phone"
                data-id={this.props.id}
                id={this.props.id}
                className="phone"
                placeholder="Phone Number"
              />
            </Col>
            <Col>
              <Label htmlFor={"status" + this.props.id}>Status </Label>
              <Input
                type="status"
                name="status"
                data-id={this.props.id}
                id={this.props.id}
                className="status"
                placeholder="Status"
              />
            </Col>
          </Row>
          <Row>
            <Col id="years">
              <Label htmlFor={"years" + this.props.id}>Years </Label>
              <Input
                type="years"
                name="years"
                data-id={this.props.id}
                id="{this.props.id}"
                className="years"
              />
            </Col>

            <Col id="remarks">
              <Label htmlFor={"remarks" + this.props.id}>
                Interviewer Remarks{" "}
              </Label>
              <Input
                type="remarks"
                name="remarks"
                data-id={this.props.id}
                id={this.props.id}
                className="remarks"
                placeholder="Remarks"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={this.addSkills}
                className="btn btn-primary btn-sm m-2"
              >
                {" "}
                Add Skills
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            {this.state.skills.map((skill, idx) => (
              <React.Fragment key={idx}>
                <Skill id={idx + 1} key={idx + 1} skill={skill} type={""} />
                <Button
                  id={idx + 1}
                  onClick={this.deleteSkill}
                  key={"btn" + idx + 1}
                  className="btn btn-danger btn-sm m-2"
                >
                  Delete Skill
                </Button>
              </React.Fragment>
            ))}
          </Row>
          <Button>Submit Assessment</Button>
        </Form>
      </Container>
    );
  }
}

export default AssessmentComponent;
