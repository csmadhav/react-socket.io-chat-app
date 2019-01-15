import React from "react";
import { mount } from "enzyme";
import NavBar from "../components/NavBar";
import users from "../dummy-users-for-jest";

/**
 * 
 * It Should display the name of the user signed-in 
 */
describe("NavBar", () => {
  describe("when provided signed-in user should show user name", () => {
    it("should render users", () => {
      const wrapper = mount(<NavBar signedInUser={users[0]} />);
      expect(wrapper.find(".signed-in-user").text()).toBe(users[0].name);
      wrapper.unmount();
    });
  });
});
