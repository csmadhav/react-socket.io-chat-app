import React, { Component } from "react";
import Navbar from "react-bootstrap/lib/Navbar";

/**
 *
 * Renders top navbar and shows the current signed in user.
 */
export default class NavBar extends Component {
  state = {};
  render() {
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>Cool Chat</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Text pullRight>
            Signed in as:&nbsp;
            <span className="signed-in-user">{(this.props.signedInUser || {}).name}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
