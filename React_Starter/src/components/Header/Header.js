import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { Nav, NavItem, NavbarToggler, NavbarBrand, Button } from "reactstrap";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };

    this.logout = this.logout.bind(this);
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-hidden");
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-minimized");
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-mobile-show");
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("aside-menu-hidden");
  }

  componentWillMount() {
    if (localStorage.getItem("login_session")) {
      this.setState({
        username: JSON.parse(localStorage.getItem("login_session")).name
      });
    } else {
      this.props.history.push("/login");
    }
  }

  logout() {
    localStorage.removeItem("login_session");
    this.props.history.push("/login");
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        {/*
        <NavbarBrand href="#" />
        */}
        &emsp;<b>ICT HELPDESK</b>
        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        {this.state.username}
        &emsp;
        <Button
          outline
          size="sm"
          color="secondary"
          onClick={event => {
            this.logout();
          }}
        >
          Logout
        </Button>
        &emsp; &emsp;
        {/*
        <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        */}
      </header>
    );
  }
}

export default Header;
