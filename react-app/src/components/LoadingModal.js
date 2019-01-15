import React, { Component } from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Modal from "react-bootstrap/lib/Modal";

/**
 *
 * Renders a loader modal.
 */

export default class LoadingModal extends Component {
  state = {};
  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Body>
          <h1 className="text-center">
            <Glyphicon glyph="refresh" />
          </h1>
          <h5 className="text-center">Loading...</h5>
        </Modal.Body>
      </Modal>
    );
  }
}
