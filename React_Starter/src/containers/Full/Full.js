import React, { Component } from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import Header from "../../components/Header/";
import Sidebar from "../../components/Sidebar/";
import Breadcrumb from "../../components/Breadcrumb/";
import Aside from "../../components/Aside/";
import Footer from "../../components/Footer/";

import Dashboard from "../../views/Dashboard/";
import Tickets from "../../views/Tickets/List/";
import CreateTicket from "../../views/Tickets/Create/";
import Account from "../../views/Account/List/";
import CreateAccount from "../../views/Account/Create/";

var arr_account = [
  {
    username: "alien",
    name: "Alien",
    department: "Department A",
    email: "alien@gmail.com",
    password: "123",
    role: 10
  },
  {
    username: "walker",
    name: "Walker",
    department: "Department B",
    email: "walker@gmail.com",
    password: "123",
    role: 10
  },
  {
    username: "eng1",
    name: "Eng1",
    department: "",
    email: "eng1@gmail.com",
    password: "123",
    role: 20
  },
  {
    username: "eng2",
    name: "Eng2",
    department: "",
    email: "eng2@gmail.com",
    password: "123",
    role: 20
  },
  {
    username: "helpdesk",
    name: "HELPDESK",
    department: "",
    email: "helpdesk@gmail.com",
    password: "123",
    role: 50
  },
  {
    username: "admin",
    name: "Admin",
    department: "",
    email: "",
    password: "123",
    role: 90
  }
];
var arr_tickets = [
  {
    ID: "201804-00001",
    subject: "Printer cannot print",
    user: "alien",
    engineer: "eng1",
    priority: "Urgent",
    status: "New",
    defect_subtype: "PC",
    defect_type: "Hardware",
    department: "Department B"
  },
  {
    ID: "201804-00002",
    subject: "Printer cannot print",
    user: "walker",
    engineer: "eng2",
    priority: "Urgent",
    status: "Pending",
    defect_subtype: "PC",
    defect_type: "Hardware",
    department: "Department A"
  },
  {
    ID: "201804-00003",
    subject: "Printer cannot print",
    user: "alien",
    engineer: "eng2",
    priority: "Normal",
    status: "Completed",
    defect_subtype: "PC",
    defect_type: "Hardware",
    department: "Department C"
  }
];
var arr_tickets_action = [
  {
    ID: "201804-00001",
    datetime: "2018-04-15T15:36:50+08:00",
    action: 1
  },
  {
    ID: "201804-00002",
    datetime: "2018-04-15T15:36:50+08:00",
    action: 1
  },
  {
    ID: "201804-00003",
    datetime: "2018-04-15T15:36:50+08:00",
    action: 1
  },
  {
    ID: "201804-00002",
    datetime: "2018-04-15T15:36:50+08:00",
    action: 2
  },
  {
    ID: "201804-00003",
    datetime: "2018-04-15T15:36:50+08:00",
    action: 2
  },
  {
    ID: "201804-00003",
    datetime: "2018-04-15T15:36:50+08:00",
    action: 3
  }
];

var arr_subtype = [
  { cat: 1, name: "PC" },
  { cat: 1, name: "Laptop" },
  { cat: 1, name: "Printer" },
  { cat: 1, name: "Scanner" },
  { cat: 1, name: "Projector" },
  { cat: 1, name: "Others" },
  { cat: 2, name: "System A" },
  { cat: 2, name: "System B" },
  { cat: 2, name: "System C" },
  { cat: 2, name: "Others" }
];

class Full extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (!localStorage.getItem("arr_account")) {
      localStorage.setItem("arr_account", JSON.stringify(arr_account));
    }

    if (!localStorage.getItem("arr_subtype")) {
      localStorage.setItem("arr_subtype", JSON.stringify(arr_subtype));
    }

    if (!localStorage.getItem("arr_tickets")) {
      localStorage.setItem("arr_tickets", JSON.stringify(arr_tickets));
    }

    if (!localStorage.getItem("arr_tickets_action")) {
      localStorage.setItem("arr_tickets_action", JSON.stringify(arr_tickets_action));
    }

    if (!localStorage.getItem("login_session")) {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div className="app">
        <Header {...this.props} />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard} />
                <Route path="/tickets/create" name="Create Ticket" component={CreateTicket} />
                <Route path="/tickets" name="Tickets" component={Tickets} />
                <Route path="/account/create" name="Create Account" component={CreateAccount} />
                <Route path="/account" name="Account" component={Account} />
                <Redirect from="/" to="/login" />
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
