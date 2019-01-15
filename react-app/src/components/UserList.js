import React, { Component } from "react";
import { ChatList } from "react-chat-elements";
import FormControl from "react-bootstrap/lib/FormControl";
import FormGroup from "react-bootstrap/lib/FormGroup";

/**
 *
 * Renders user list
 *
 * Used on both places Sign-in modal and as ChatList
 */

export default class UserList extends Component {
  state = {
    userData: [],
    searchQuery: null
  };
  componentDidMount() {}
  searchInput(e) {
    let value = e.target.value;
    let searchQuery = null;
    if (value) {
      searchQuery = value;
    }
    this.setState({ searchQuery });
  }
  /**
   *
   * Implement filter logic on basis of search query.
   */
  getFilteredUserList() {
    return !this.state.searchQuery
      ? this.props.userData
      : this.props.userData.filter(user =>
          user.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
        );
  }
  render() {
    let users = this.getFilteredUserList();
    return (
      <div>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Search for a user here..."
            onInput={this.searchInput.bind(this)}
          />
        </FormGroup>
        {users.length ? (
          <ChatList
            className={!this.props.showSignInList ? "chat-list" : "user-list"}
            dataSource={users.map((f, i) => {
              let date = null;
              let subtitle = "";
              if (
                !this.props.showSignInList &&
                f.messages &&
                f.messages.length
              ) {
                let lastMessage = f.messages[f.messages.length - 1];
                date = new Date(lastMessage.timeStamp);
                subtitle =
                  (lastMessage.position === "right" ? "You: " : f.name + ": ") +
                  lastMessage.text;
              }
              return {
                avatar: require(`../static/images/avatar/${f.id}.jpg`),
                alt: f.name,
                title: f.name,
                subtitle: subtitle,
                date: date,
                unread: f.unread,
                user: f
              };
            })}
            onClick={
              !this.props.showSignInList
                ? this.props.onChatClicked
                : this.props.onUserClicked
            }
          />
        ) : (
          <div className="text-center no-users">No users to show.</div>
        )}
      </div>
    );
  }
}
