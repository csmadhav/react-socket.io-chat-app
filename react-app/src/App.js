import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import Modal from "react-bootstrap/lib/Modal";
import UserList from "./components/UserList";
import ChatBox from "./components/ChatBox";
import ErrorModal from "./components/ErrorModal";
import LoadingModal from "./components/LoadingModal";
import "react-chat-elements/dist/main.css";
import "./index.css";
import io from "socket.io-client";
import { fetchUsers } from "./requests";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";

/**
 * Fetches socket server URL from env
 */
const SOCKET_URI = process.env.REACT_APP_SERVER_URI;

/**
 * App Component
 *
 * initiaites Socket connection and handle all cases like disconnected,
 * reconnected again so that user can send messages when he is back online
 *
 * handles Error scenarios if requests from Axios fails.
 *
 */

class App extends Component {
  socket = null;

  state = {
    signInModalShow: false,
    users: [], // Avaiable users for signing-in
    userChatData: [], // this contains users from which signed-in user can chat and its message data.
    user: null, // Signed-In User
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    error: false,
    errorMessage: ""
  };

  /**
   *
   * Setups Axios to monitor XHR errors.
   * Initiates and listen to socket.
   * fetches User's list from backend to populate.
   */

  componentDidMount() {
    this.initAxios();
    this.initSocketConnection();
    fetchUsers().then(users => this.setState({ users, signInModalShow: true }));
    this.setupSocketListeners();
  }

  initSocketConnection() {
    this.socket = io.connect(SOCKET_URI);
  }

  /**
   *
   * Checks if request from axios fails
   * and if it does then shows error modal.
   */
  initAxios() {
    axios.interceptors.request.use(
      config => {
        this.setState({ loading: true });
        return config;
      },
      error => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true
        });
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      response => {
        this.setState({ loading: false });
        return response;
      },
      error => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Some error occured. try after sometime`,
          error: true
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   *
   * Shows error if client gets disconnected.
   */
  onClientDisconnected() {
    NotificationManager.error(
      "Connection Lost from server please check your connection.",
      "Error!"
    );
  }

  /**
   *
   * Established new connection if reconnected.
   */
  onReconnection() {
    if (this.state.user) {
      this.socket.emit("sign-in", this.state.user);
      NotificationManager.success("Connection Established.", "Reconnected!");
    }
  }

  /**
   *
   * Setup all listeners
   */

  setupSocketListeners() {
    this.socket.on("message", this.onMessageRecieved.bind(this));
    this.socket.on("reconnect", this.onReconnection.bind(this));
    this.socket.on("disconnect", this.onClientDisconnected.bind(this));
  }

  /**
   *
   * @param {MessageRecievedFromSocket} message
   *
   * Triggered when message is received.
   * It can be a message from user himself but on different session (Tab).
   * so it decides which is the position of the message "right" or "left".
   *
   * increments unread count and appends in the messages array to maintain Chat History
   */

  onMessageRecieved(message) {
    let userChatData = this.state.userChatData;
    let messageData = message.message;
    let targetId;
    if (message.from === this.state.user.id) {
      messageData.position = "right";
      targetId = message.to;
    } else {
      messageData.position = "left";
      targetId = message.from;
    }
    let targetIndex = userChatData.findIndex(u => u.id === targetId);
    if (!userChatData[targetIndex].messages) {
      userChatData[targetIndex].messages = [];
    }
    if (targetIndex !== this.state.selectedUserIndex) {
      if (!userChatData[targetIndex].unread) {
        userChatData[targetIndex].unread = 0;
      }
      userChatData[targetIndex].unread++;
    }
    userChatData[targetIndex].messages.push(messageData);
    this.setState({ userChatData });
  }

  /**
   *
   * @param {User} e
   *
   * called when user clicks to sign-in
   */
  onUserClicked(e) {
    let user = e.user;
    this.socket.emit("sign-in", user);
    let userChatData = this.state.users.filter(u => u.id !== user.id);
    this.setState({ user, signInModalShow: false, userChatData });
  }

  /**
   *
   * @param {ChatItem} e
   *
   * handles if user clickes on ChatItem on left.
   */
  onChatClicked(e) {
    this.toggleViews();
    let users = this.state.userChatData;
    for (let index = 0; index < users.length; index++) {
      if (users[index].id === e.user.id) {
        users[index].unread = 0;
        this.setState({ selectedUserIndex: index, userChatData: users });
        return;
      }
    }
  }

  /**
   *
   * @param {messageText} text
   *
   * creates message in a format in which messageList can render.
   * position is purposely omitted and will be appended when message is received.
   */
  createMessage(text) {
    let message = {
      to: this.state.userChatData[this.state.selectedUserIndex].id,
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message"
      },
      from: this.state.user.id
    };
    this.socket.emit("message", message);
  }

  /**
   * Toggles views from 'ChatList' to 'ChatBox'
   *
   * only on Phone
   */
  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList
    });
  }

  render() {
    let chatBoxProps = this.state.showChatBox
      ? {
          xs: 12,
          sm: 12
        }
      : {
          xsHidden: true,
          smHidden: true
        };

    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12
        }
      : {
          xsHidden: true,
          smHidden: true
        };

    return (
      <div>
        <NavBar signedInUser={this.state.user} />
        <Grid>
          <Row className="show-grid">
            <Col {...chatListProps} md={4}>
              <UserList
                userData={this.state.userChatData}
                onChatClicked={this.onChatClicked.bind(this)}
              />
            </Col>
            <Col {...chatBoxProps} md={8}>
              <ChatBox
                signedInUser={this.state.user}
                onSendClicked={this.createMessage.bind(this)}
                onBackPressed={this.toggleViews.bind(this)}
                targetUser={
                  this.state.userChatData[this.state.selectedUserIndex]
                }
              />
            </Col>
          </Row>
        </Grid>
        <Modal show={this.state.signInModalShow}>
          <Modal.Header>
            <Modal.Title>Sign In as:</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <UserList
              userData={this.state.users}
              onUserClicked={this.onUserClicked.bind(this)}
              showSignInList
            />
          </Modal.Body>
        </Modal>
        <ErrorModal
          show={this.state.error}
          errorMessage={this.state.errorMessage}
        />
        <LoadingModal show={this.state.loading} />
        <NotificationContainer />
      </div>
    );
  }
}

export default App;
