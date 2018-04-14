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

var arr_account = [
  {
    username: "Alien",
    role: 10
  },
  {
    username: "Walker",
    role: 10
  },
  {
    username: "Faded",
    role: 10
  },
  {
    username: "Eng1",
    role: 20
  },
  {
    username: "Eng2",
    role: 20
  }
];
var arr_tickets = [
  {
    ID: "201804-00001",
    subject: "Printer cannot print",
    user: "Alien",
    engineer: "Eng1",
    created: "20180410",
    priority: "Urgent",
    status: "New"
  },
  {
    ID: "201804-00002",
    subject: "Printer cannot print",
    user: "Walker",
    engineer: "Eng2",
    created: "20180410",
    priority: "Urgent",
    status: "Pending"
  },
  {
    ID: "201804-00003",
    subject: "Printer cannot print",
    user: "Faded",
    engineer: "Eng2",
    created: "20180410",
    priority: "Normal",
    status: "Completed"
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
    this.state = {
      param: {
        arr_account: [],
        arr_tickets: [],
        arr_subtype: []
      }
    };
  }

  componentWillMount() {
    if (localStorage.getItem("arr_account")) {
      this.state.param.arr_account = JSON.parse(localStorage.getItem("arr_account"));
    } else {
      this.state.param.arr_account = arr_account;
      localStorage.setItem("arr_account", JSON.stringify(arr_account));
    }

    if (localStorage.getItem("arr_tickets")) {
      this.state.param.arr_tickets = JSON.parse(localStorage.getItem("arr_tickets"));
    } else {
      this.state.param.arr_tickets = arr_tickets;
      localStorage.setItem("arr_tickets", JSON.stringify(arr_tickets));
    }

    if (localStorage.getItem("arr_subtype")) {
      this.state.param.arr_subtype = JSON.parse(localStorage.getItem("arr_subtype"));
    } else {
      this.state.param.arr_subtype = arr_subtype;
      localStorage.setItem("arr_subtype", JSON.stringify(arr_subtype));
    }
  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard} />
                <Route
                  path="/tickets/create"
                  name="Create Ticket"
                  component={props => <CreateTicket param={this.state.param} {...props} />}
                />
                <Route
                  path="/tickets"
                  name="Tickets"
                  component={props => <Tickets param={this.state.param} {...props} />}
                />
                <Redirect from="/" to="/dashboard" />
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
