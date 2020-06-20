import React from "react";
import ContactDetail from "./ContactDetail";

import DatePicker from "react-datepicker";
import axios from "axios";
import ImageUpload from "./ImageUpload";

import CandidateEmail from "../templates/CandidateEmail";
import InterviewerEmail from "../templates/InterviewerEmail";
import { renderToString } from "react-dom/server";
import AssessmentComponent from "./assessment/AssessmentComponent";

import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import generate from "@babel/generator";

class ScheduleInterviewForm extends React.Component {
  state = {
    interviewers: [
      {
        id: 0,
        fnameint: "",
        lnameint: "",
        emailint: "",
        phoneint: "",
        videoAccessUrlint: "",
      },
    ],
    candidate: {
      cid: 0,
      fnamecan: "",
      lnamecan: "",
      emailcan: "",
      phonecan: "",
      photocan: "",
      videoAccessUrlcan: "",
    },
    interviewDetail: {
      dateTime: new Date(),
      sessionId: "Session" + Math.floor(Math.random() * 100),
      clientName: "",
      jobTitle: "",
    },
  };

  constructor() {
    super();
    this.OPENVIDU_SERVER_URL = "https://" + window.location.hostname;
    this.TWILLIO_TOKEN_URL = this.OPENVIDU_SERVER_URL + ":5000";
    this.TOKEN_URL =
      "https://" + window.location.hostname + ":3000" + "/video?token=";
    this.OPENVIDU_SERVER_SECRET = "MY_SECRET";
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getToken = this.getToken.bind(this);
    this.createToken = this.createToken.bind(this);
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.id, e.target.value);

    if (
      [
        "fnameint",
        "lnameint",
        "emailint",
        "phoneint",
        "videoAccessUrlint",
      ].includes(e.target.name)
    ) {
      let interviewers = [...this.state.interviewers];
      interviewers[e.target.id - 1][
        e.target.name
      ] = e.target.value.toUpperCase();
      this.setState({ interviewers }, () =>
        console.log("Interviewer changed-->", this.state.interviewers)
      );
    } else if (
      [
        "fnamecan",
        "lnamecan",
        "emailcan",
        "phonecan",
        "videoAccessUrlcan",
        "photocan",
      ].includes(e.target.name)
    ) {
      let candidate = this.state.candidate;
      candidate[e.target.name] = e.target.value.toUpperCase();
      this.setState({ candidate }, () =>
        console.log("Candidate ---->", this.state.candidate)
      );
    } else if (["dateTime", "clientName", "jobTitle"].includes(e.target.name)) {
      let interviewDetail = this.state.interviewDetail;
      interviewDetail[e.target.name] = e.target.value.toUpperCase();
      this.setState({ interviewDetail }, () =>
        console.log("InterviewDetail ---->", this.state.interviewDetail)
      );
    } else {
      console.log("Value ---->", e.target.name, e.target.value);
      this.setState({ [e.target.name]: [e.target.value] });
    }
  };
  addInterViewer = (e) => {
    const row = { fnameint: "", lnameint: "", emailint: "", phoneint: "" };
    this.setState((prevState) => ({
      interviewers: [
        ...prevState.interviewers,
        {
          id: this.state.interviewers.length,
          row,
        },
      ],
    }));
  };

  // getToken() {
  //   return this.createSession(this.state.interviewDetail.sessionId)
  //     .then((sessionId) => this.createToken(this.state.interviewDetail.sessionId))
  //     .catch((Err) => console.error(Err));
  // }

  getToken(fullname) {
    return this.createToken(fullname);
  }

  createToken(fullname) {
    return new Promise((resolve, reject) => {
      const url =
        this.TWILLIO_TOKEN_URL + "/video/token?identity=" + fullname + "&room=";
      console.log("URL-->" + url);
      axios
        .get(url)
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  // createSession(sessionId) {
  //   return new Promise((resolve, reject) => {
  //     var data = JSON.stringify({
  //       customSessionId: sessionId,
  //       recordingMode: "ALWAYS",
  //       defaultOutputMode: "INDIVIDUAL",
  //     });
  //     axios
  //       .post(this.OPENVIDU_SERVER_URL + "/api/sessions", data, {
  //         headers: {
  //           Authorization:
  //             "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((response) => {
  //         console.log("CREATE SESION", response);
  //         resolve(response.data.id);
  //       })
  //       .catch((response) => {
  //         var error = Object.assign({}, response);
  //         if (error.response && error.response.status === 409) {
  //           resolve(sessionId);
  //         } else {
  //           console.log(error);
  //           console.warn(
  //             "No connection to OpenVidu Server. This may be a certificate error at " +
  //               this.OPENVIDU_SERVER_URL
  //           );
  //           if (
  //             window.confirm(
  //               'No connection to OpenVidu Server. This may be a certificate error at "' +
  //                 this.OPENVIDU_SERVER_URL +
  //                 '"\n\nClick OK to navigate and accept it. ' +
  //                 'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
  //                 this.OPENVIDU_SERVER_URL +
  //                 '"'
  //             )
  //           ) {
  //             window.location.assign(
  //               this.OPENVIDU_SERVER_URL + "/accept-certificate"
  //             );
  //           }
  //         }
  //       });
  //   });
  // }

  deleteInterViewer = (e) => {
    console.log("ID-->", e.target.id);
    let deleteId = e.target.id - 1;
    const interviewers = this.state.interviewers.filter(
      (item) => item.id !== deleteId
    );
    this.setState({ interviewers }, () =>
      console.log(this.state.interviewers, interviewers)
    );
  };

  async handleSubmit(e) {
    e.preventDefault();

    console.log("Status", await this.populateTokensCandidate());
    console.log("Status", await this.populateTokensInterviewers());

    this.generateCandidateSendEmail();

    this.state.interviewers.map((interviewer) =>
      this.generateInterviewersSendEmail(interviewer)
    );
  }

  async populateTokensCandidate() {
    const fullname =
      this.state.candidate.fnamecan + this.state.candidate.lnamecan;
    let status = await this.getToken(fullname).then((token) => {
      console.log("Token Candidate", token);
      let candidate = this.state.candidate;
      //let temp = token.split("?");
      candidate.videoAccessUrlcan = this.TOKEN_URL + token;
      this.setState({ candidate });
      console.log(
        "Candidate-->VideoURL",
        this.state.candidate.videoAccessUrlcan
      );
    });
    return status;
  }
  populateTokensInterviewers() {
    let status = undefined;
    this.state.interviewers.map(
      (interviewer) =>
        (status = this.createToken(
          interviewer.fnameint + interviewer.lnameint
        ).then((token) => {
          //let temp = token.split("?");
          interviewer.videoAccessUrlint = this.TOKEN_URL + token;
          console.log("Interviewer-->VideoURL", interviewer.videoAccessUrlint);
          this.setState({ interviewer });
        }))
    );
    return status;
  }

  generateInterviewersSendEmail(interviewer) {
    let contact = {
      fullname: "",
      email: "",
      messageHtml: "",
    };
    contact.fullname = interviewer.fnameint + " " + interviewer.lnameint;
    contact.email = interviewer.emailint;

    contact.messageHtml = renderToString(
      <InterviewerEmail
        interviewer={interviewer}
        interviewDetail={this.state.interviewDetail}
        candidate={this.state.candidate}
      />
    );

    console.log("interviewer.messageHtml", contact.messageHtml);
    this.sendEmail(contact);
  }

  generateCandidateSendEmail() {
    let contact = {
      fullname: "",
      email: "",
      messageHtml: "",
    };
    contact.fullname =
      this.state.candidate.fnamecan + " " + this.state.candidate.lnamecan;
    contact.email = this.state.candidate.emailcan;
    contact.messageHtml = renderToString(
      <CandidateEmail
        candidate={this.state.candidate}
        interviewDetail={this.state.interviewDetail}
      />
    );

    console.log("candidate.messageHtml", contact.messageHtml);
    this.sendEmail(contact);
  }

  sendEmail(contact) {
    axios({
      method: "POST",
      url: this.OPENVIDU_SERVER_URL + ":5001" + "/send",
      data: {
        name: contact.fullname,
        email: contact.email,
        messageHtml: contact.messageHtml,
      },
    }).then((response) => {
      if (response.data.msg === "success") {
        alert("Email sent, awesome!");
      } else if (response.data.msg === "fail") {
        alert("Oops, something went wrong. Try again");
      }
    });
  }

  onChange = (date) => {
    let interviewDetail = this.state.interviewDetail;
    interviewDetail.dateTime = date;
    this.setState({
      interviewDetail,
    });
  };

  render() {
    return (
      <Container className="ScheduleInterviewForm">
        <h4>Candidate Detail</h4>
        <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <Row className="mb-2">
            <ContactDetail
              id={this.state.candidate.cid + 1}
              key={this.state.candidate.cid + 10}
              type={"can"}
            ></ContactDetail>
          </Row>
          <Row>
            <Col>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                type="text"
                name="clientName"
                className="clientName"
                placeholder="Please Enter Client Name"
              />
              <Label htmlFor="dateTime">Interview Time</Label>
              <DatePicker
                selected={this.state.interviewDetail.dateTime}
                showTimeSelect
                dateFormat="Pp"
                onChange={this.onChange}
                placeholderText="Click to select a Interview Date"
              ></DatePicker>
            </Col>
            <Col>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                type="text"
                name="jobTitle"
                className="jobTitle"
                placeholder="Please Enter Job Title"
              />
              <ImageUpload id={this.state.candidate.cid + 1}></ImageUpload>
            </Col>
          </Row>
          <Row className="ml-2">
            <Button
              onClick={this.addInterViewer}
              className="btn btn-primary btn-sm m-2"
            >
              Add Interviewer
            </Button>
          </Row>

          <Row className="mb-2">
            {this.state.interviewers.map((interviewer, idx) => (
              <React.Fragment key={idx}>
                <h4>Interviewer {idx + 1} Detail</h4>
                <ContactDetail
                  id={idx + 1}
                  key={idx + 1}
                  interviewer={interviewer}
                  type={"int"}
                />
                <Button
                  id={idx + 1}
                  onClick={this.deleteInterViewer}
                  key={"btn" + idx + 1}
                  className="btn btn-danger btn-sm m-2"
                >
                  Delete Interviewer
                </Button>
              </React.Fragment>
            ))}
          </Row>

          <Button>Schedule Interview</Button>
        </Form>
      </Container>
    );
  }
}
export default ScheduleInterviewForm;
