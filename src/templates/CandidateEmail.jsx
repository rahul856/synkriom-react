import React from "react";
import "./Email.css";

const CandiateEmail = props => {
  return (
    <div id="container">
      <div id="main">
        <br />
        <div id="sub"></div>
        <h2>
          Dear {props.candidate.fnamecan} {props.candidate.lnamecan},
        </h2>
        <h4>A video interview schedule for you with below details</h4>
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
              <a href={props.candidate.videoAccessUrlcan} target="_blank">
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
export default CandiateEmail;
