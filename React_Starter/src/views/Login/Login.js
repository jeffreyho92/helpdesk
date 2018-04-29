import React, { Component } from "react";
import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

var arr_account = [
  {
    username: "alien",
    name: "Alien",
    password: "123",
    role: 10
  },
  {
    username: "walker",
    name: "Walker",
    password: "123",
    role: 10
  },
  {
    username: "eng1",
    name: "Eng1",
    password: "123",
    role: 20
  },
  {
    username: "eng2",
    name: "Eng2",
    password: "123",
    role: 20
  },
  {
    username: "helpdesk",
    name: "HELPDESK",
    password: "123",
    role: 50
  },
  {
    username: "admin",
    name: "Admin",
    password: "123",
    role: 90
  }
];

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr_account: JSON.parse(localStorage.getItem("arr_account")),
      username: "",
      password: ""
    };

    this.login = this.login.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem("login_session")) {
      if (JSON.parse(localStorage.getItem("login_session")).role == 10) {
        this.props.history.push("/tickets");
      } else {
        this.props.history.push("/dashboard");
      }
    }

    if (!localStorage.getItem("arr_account")) {
      localStorage.setItem("arr_account", JSON.stringify(arr_account));
    }
  }

  handleChange(newPartialInput) {
    this.setState(state => ({
      ...newPartialInput
    }));
  }

  login() {
    let acc_exist = false;
    this.state.arr_account.map(acc => {
      if (this.state.username.toLowerCase() == acc.username.toLowerCase() && this.state.password.toLowerCase() == acc.password.toLowerCase()) {
        localStorage.setItem("login_session", JSON.stringify(acc));
        acc_exist = true;
      }
    });

    if (acc_exist) {
      if (JSON.parse(localStorage.getItem("login_session")).role == 10) {
        this.props.history.push("/tickets");
      } else {
        this.props.history.push("/dashboard");
      }
    } else {
      console.log(this.state);
      alert("Wrong Username/Password!");
    }
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.login();
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" onChange={e => this.handleChange({ username: e.target.value })} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Password"
                        onKeyPress={this.handleKeyPress}
                        onChange={e => this.handleChange({ password: e.target.value })}
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-4"
                          onClick={event => {
                            this.login();
                          }}
                        >
                          Login
                        </Button>
                      </Col>
                      {/*
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                      */}
                    </Row>
                  </CardBody>
                </Card>
                {/*
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
                */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
