import React, { Component } from "react";
import FormControl from "react-bootstrap/lib/FormControl";
import InputGroup from "react-bootstrap/lib/InputGroup";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Col from "react-bootstrap/lib/Col";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import {
  MessageList,
  Navbar as NavbarComponent,
  Avatar
} from "react-chat-elements";

/**
 *
 * ChatBox Component
 *
 * displays all the messages from chat history.
 * renders message text box for input.
 */

export default class ChatBox extends Component {
  state = {
    messageText: ""
  };
  /**
   *
   * Sends a message only if it is not falsy.
   */
  onSendClicked() {
    if (!this.state.messageText) {
      return;
    }
    this.props.onSendClicked(this.state.messageText);
    this.setState({ messageText: "" });
  }
  onMessageInputChange(e) {
    this.setState({ messageText: e.target.value });
  }
  /**
   *
   * @param {KeyboardEvent} e
   *
   * listen for enter pressed and sends the message.
   */
  onMessageKeyPress(e) {
    if (e.key === "Enter") {
      this.onSendClicked();
    }
  }

  render() {
    return (
      <div>
        {this.props.targetUser ? (
          <div>
            <NavbarComponent
              left={
                <div>
                  <Col mdHidden lgHidden>
                    <p className="navBarText">
                      <Glyphicon
                        onClick={this.props.onBackPressed}
                        glyph="chevron-left"
                      />
                    </p>
                  </Col>
                  <Avatar
                    src={require(`../static/images/avatar/${
                      this.props.targetUser.id
                    }.jpg`)}
                    alt={"logo"}
                    size="large"
                    type="circle flexible"
                  />
                  <p className="navBarText">{this.props.targetUser.name}</p>
                </div>
              }
            />
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={this.props.targetUser.messages}
            />
            <FormGroup>
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.messageText}
                  onChange={this.onMessageInputChange.bind(this)}
                  onKeyPress={this.onMessageKeyPress.bind(this)}
                  placeholder="Type a message here (Limit 3000 characters)..."
                  ref="messageTextBox"
                  className="messageTextBox"
                  maxLength="3000"
                  autoFocus
                />
                <InputGroup.Button>
                  <Button
                    disabled={!this.state.messageText}
                    className="sendButton"
                    onClick={this.onSendClicked.bind(this)}
                  >
                    Send
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </div>
        ) : (
          <div>
            <Jumbotron>
              <h1>Hello, {(this.props.signedInUser || {}).name}!</h1>
              <p>Select a friend to start a chat.</p>
            </Jumbotron>
          </div>
        )}
      </div>
    );
  }
}
