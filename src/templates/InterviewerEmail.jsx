import React from "react";
import "./Email.css";

const InterviewerEmail = props => {
  return (
    <div id="container">
      <div id="main">
        <br />
        <div id="sub"></div>
        <h2>
          Dear {props.interviewer.fnameint} {props.interviewer.lnameint},
        </h2>
        <p>
          A Video call scheduled for candidate{" "}
          <b>
            {props.candidate.fnamecan} {props.candidate.lnamecan}
          </b>{" "}
          with below details
        </p>
        <table id="table" border="1">
          <tr>
            <td>
              <b>Client Name:</b>
            </td>
            <td>{props.interviewDetail.clientName}</td>
          </tr>
          <tr id="row">
            <td>
              <b>Job Title:</b>
            </td>
            <td>{props.interviewDetail.jobTitle}</td>
          </tr>
          <tr id="row">
            <td>
              <b>Schedule Date Time:</b>
            </td>
            <td>{props.interviewDetail.dateTime.toUTCString()}</td>
          </tr>
          <tr id="row">
            <td>
              <b>Video call join Link:</b>
            </td>
            <td>
              <a href={props.interviewer.videoAccessUrlint} target="_blank">
                Click here
              </a>{" "}
              to join the video call.
            </td>
          </tr>
        </table>
        <br />
        <br />
        <b>Thanks</b>
        <br />
        Veriklick Support
        <br />
        USA New York
        <br />
      </div>
    </div>
  );
};
export default InterviewerEmail;
