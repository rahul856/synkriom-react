import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import { Input, Button, Label } from "reactstrap";

import OpenViduLayout from "../layout/openvidu-layout";
import ToolbarComponent from "./toolbar/ToolbarComponent";
import DialogExtensionComponent from "./dialog-extension/DialogExtension";
import { OpenVidu } from "openvidu-browser";
import UserModel from "../models/user-model";
import StreamComponent from "./stream/StreamComponent";
import AssessmentComponent from "./assessment/AssessmentComponent";
import RemoteVideoComponent from "./RemoteVideoComponent";
import ChatComponent from "./chat/ChatComponent";

var localUser = new UserModel();
var faker = require("faker");
export default class VideoComponent extends Component {
  constructor(props) {
    super();
    this.layout = new OpenViduLayout();
    this.state = {
      identity: null,
      roomName: "Room1",
      localUser: undefined,
      roomNameErr: false, // Track error for room name TextField
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      remoteUserName: "",
      subscribers: [],
      activeRoom: "", // Track the current active room
      chatDisplay: "none",
      remoteParticipantAvailable: false
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.leaveSession = this.leaveRoom.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.checkSize = this.checkSize.bind(this);
    this.camStatusChanged = this.camStatusChanged.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.screenShare = this.screenShare.bind(this);
    this.closeDialogExtension = this.closeDialogExtension.bind(this);
    this.stopScreenShare = this.stopScreenShare.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.handleError = this.handleError.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
  }
  async componentDidMount() {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
      minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
      fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
      bigClass: "OV_big", // The class to add to elements that should be sized bigger
      bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
      bigFixedRatio: false, // fixedRatio for the big ones
      bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
      bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
      bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
      animate: true // Whether you want to animate the transitions
    };

    this.layout.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );
    window.addEventListener("beforeunload", this.onbeforeunload);
    window.addEventListener("resize", this.updateLayout);
    window.addEventListener("resize", this.checkSize);
    var identity = faker.name.findName();
    console.log("Identity", identity);
    const response = await fetch("/video/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: `identity=${encodeURIComponent(identity)}`
    });
    const myJson = await response.json();
    console.log(JSON.stringify(myJson));
    // .then(results => {
    const { token } = myJson;

    this.setState({
      identity,
      token
    });
    // })
    // .catch(this.handleError);

    console.log("component Mounted", this.props.id);

    this.joinRoom();
  }

  handleError(error) {
    console.error(error);
    this.setState({
      error: "Could not load chat."
    });
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    window.removeEventListener("resize", this.updateLayout);
    window.removeEventListener("resize", this.checkSize);
    this.leaveRoom();
  }
  updateLayout() {
    setTimeout(() => {
      this.layout.updateLayout();
    }, 20);
  }

  checkSize() {
    if (
      document.getElementById("layout").offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
      this.toggleChat("none");
      this.hasBeenUpdated = true;
    }
    if (
      document.getElementById("layout").offsetWidth > 700 &&
      this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = false;
    }
  }

  onbeforeunload(event) {
    this.leaveRoom();
  }

  handleRoomNameChange(e) {
    let roomName = e.target.value;
    this.setState({
      roomName
    });
  }

  joinRoom() {
    this.OV = new OpenVidu();
    if (!this.state.roomName.trim()) {
      this.setState({
        roomNameErr: true
      });
      return;
    }

    console.log("Joining room '" + this.state.roomName + "'...");
    let connectOptions = {
      name: this.state.roomName
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(this.state.token, connectOptions).then(
      this.roomJoined,
      error => {
        alert("Could not connect to Twilio: " + error.message);
      }
    );
  }

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  // Attaches a track to a specified DOM container
  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  roomJoined(room) {
    this.updateLayout();

    // Called when a participant joins a room
    console.log("Joined as '" + this.state.identity + "'");
    localUser.setNickname(this.state.identity);
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true,
      localUser: localUser
    });

    // Attach LocalParticipant's Tracks, if not already attached.
    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector("video")) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'");

      this.updateLayout();

      var previewContainer = document.getElementById(participant.sid);
      console.log("Element", document.getElementById(participant.sid));
      this.attachParticipantTracks(participant, previewContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on("participantConnected", participant => {
      this.updateLayout();
      console.log("Joining: '" + participant.identity + "'");
      this.setState({ remoteParticipantAvailable: true });
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on("trackAdded", (track, participant) => {
      console.log(participant.identity + " added track: " + track.kind);
      console.log("participant.key", participant.sid);
      var previewContainer = document.getElementById(participant.sid);
      this.attachTracks([track], previewContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on("trackRemoved", (track, participant) => {
      console.log(participant.identity + " removed track: " + track.kind);
      this.setState({ remoteParticipantAvailable: false });
      this.detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on("participantDisconnected", participant => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
      this.setState({ remoteParticipantAvailable: false });
      this.updateLayout();
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on("disconnected", () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);

      this.setState({
        activeRoom: null,
        hasJoinedRoom: false,
        localMediaAvailable: false
      });
    });
    this.updateLayout();
  }

  leaveRoom() {
    console.log(
      "Leaving Room",
      this.state.activeRoom.localParticipant.identity
    );
    if (
      this.state.activeRoom !== null &&
      this.state.activeRoom.participants !== undefined &&
      this.state.activeRoom.participants.size !== 0
    ) {
      var remoteUsers = this.state.activeRoom.participants;
      console.log("remoteUsers", remoteUsers);
      remoteUsers.delete(this.state.activeRoom.localParticipant.identity);
    }
    this.state.activeRoom.disconnect();

    this.setState({
      hasJoinedRoom: false,
      localMediaAvailable: false,
      participants: remoteUsers
    });
    this.updateLayout();
    window.open("about:blank", "_self");
    window.close();
  }
  stopScreenShare() {
    this.state.session.unpublish(localUser.getStreamManager());
    this.connectWebCam();
  }

  camStatusChanged() {
    localUser.setVideoActive(!localUser.isVideoActive());

    let room = this.state.activeRoom;
    console.log("LocalVideoTrack", room.localParticipant.tracks);
    let tracks = room.localParticipant.tracks;
    tracks.forEach(element => {
      console.log("Track", element.kind);
      if (element.kind.match("video")) {
        if (localUser.isVideoActive()) {
          element.enable();
        } else element.disable();
      }
    });
    console.log("LocalVideoTrack", tracks.value);
    this.setState({ localUser: localUser });
  }

  closeDialogExtension() {
    this.setState({ showExtensionDialog: false });
  }

  screenShare() {
    const videoSource =
      navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";
    console.log("videoSource", videoSource);
    const publisher = this.OV.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false
      },
      error => {
        if (error && error.name === "SCREEN_EXTENSION_NOT_INSTALLED") {
          this.setState({ showExtensionDialog: true });
        } else if (error && error.name === "SCREEN_SHARING_NOT_SUPPORTED") {
          alert("Your browser does not support screen sharing");
        } else if (error && error.name === "SCREEN_EXTENSION_DISABLED") {
          alert("You need to enable screen sharing extension");
        } else if (error && error.name === "SCREEN_CAPTURE_DENIED") {
          alert("You need to choose a window or application to share");
        }
      }
    );
    console.log("publisher", publisher);
    publisher.once("accessAllowed", () => {
      this.state.session.unpublish(localUser.getStreamManager());
      console.log("publisher", publisher);
      localUser.setStreamManager(publisher);
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true);
        console.log("publisher", publisher);
        this.state.activeRoom.localParticipant.publishtrack(publisher);
        this.setState({ localUser: localUser }, () => {
          this.sendSignalUserChanged({
            isScreenShareActive: localUser.isScreenShareActive()
          });
        });
      });
    });
    publisher.on("streamPlaying", () => {
      this.updateLayout();
      publisher.videos[0].video.parentElement.classList.remove("custom-class");
    });
  }

  toggleFullscreen() {
    const document = window.document;
    const fs = document.getElementById("container");
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen();
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen();
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen();
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive());
    let room = this.state.activeRoom;
    console.log("LocalVideoTrack", room.localParticipant.tracks);
    let tracks = room.localParticipant.tracks;
    tracks.forEach(element => {
      console.log("Track", element.kind);
      if (element.kind.match("audio")) {
        if (localUser.isAudioActive()) {
          element.enable();
        } else element.disable();
      }
    });
    this.setState({ localUser: localUser });
  }

  toggleChat(property) {
    let display = property;

    if (display === undefined) {
      display = this.state.chatDisplay === "none" ? "block" : "none";
    }
    if (display === "block") {
      this.setState({ chatDisplay: display, messageReceived: false });
    } else {
      console.log("chat", display);
      this.setState({ chatDisplay: display });
    }
    this.updateLayout();
  }

  render() {
    const mySessionId = this.state.roomName;
    const localUser = this.state.localUser;
    console.log("localUser", localUser);
    var chatDisplay = { display: this.state.chatDisplay };
    // Only show video track after user has joined a room
    let showLocalTrack = this.state.localMediaAvailable;
    if (
      this.state.activeRoom != null &&
      this.state.activeRoom.participants !== undefined &&
      this.state.activeRoom.participants.size !== 0
    ) {
      let participants = this.state.activeRoom.participants;
      var array = Array.from(participants.values());

      console.log("participants", participants);
    }

    return (
      <div className="container" id="container">
        <ToolbarComponent
          sessionId={mySessionId}
          user={localUser}
          showNotification={this.state.messageReceived}
          camStatusChanged={this.camStatusChanged}
          micStatusChanged={this.micStatusChanged}
          screenShare={this.screenShare}
          stopScreenShare={this.stopScreenShare}
          toggleFullscreen={this.toggleFullscreen}
          leaveSession={this.leaveSession}
          toggleChat={this.toggleChat}
        />
        <DialogExtensionComponent
          showDialog={this.state.showExtensionDialog}
          cancelClicked={this.closeDialogExtension}
        />
        <div id="layout" className="bounds">
          {localUser !== undefined && showLocalTrack && (
            <div className="OT_root OT_publisher custom-class">
              <div ref="localMedia" />
            </div>
          )}

          {array !== undefined &&
            array.map((participant, i) => (
              <RemoteVideoComponent
                id={i}
                key={i}
                value={participant}
              ></RemoteVideoComponent>
            ))}

          {localUser !== undefined && showLocalTrack && (
            <div
              className="OT_root OT_publisher custom-class"
              style={chatDisplay}
            >
              <ChatComponent
                username={this.state.identity}
                chatDisplay={this.state.chatDisplay}
                close={this.toggleChat}
              />
            </div>
          )}
          {localUser !== undefined && showLocalTrack && (
            <div className="OT_root OT_publisher custom-class">
              <AssessmentComponent />
            </div>
          )}
        </div>
      </div>
    );
  }
}
