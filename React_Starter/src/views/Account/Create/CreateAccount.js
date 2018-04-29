import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, InputGroup, InputGroupAddon, Button, Label, Input } from "reactstrap";
import moment from "moment";

class CreateAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr_account: JSON.parse(localStorage.getItem("arr_account")),
			form: {
				username: "",
				name: "",
				department: "",
				email: "",
				password: "",
				role: "10"
			}
		};

		this.createForm = this.createForm.bind(this);
	}

	componentWillMount() {}

	handleChange(newPartialInput) {
		this.setState(state => ({
			...state,
			form: {
				...state.form,
				...newPartialInput
			}
		}));
	}

	createForm() {
		//validation
		if (this.state.form.username == "" || this.state.form.name == "" || this.state.form.password == "") {
			return alert("Please fill in required fields");
		}

		var arr = JSON.parse(localStorage.getItem("arr_account"));

		var username_exist = false;
		arr.map(a => {
			if (a.username == this.state.form.username) {
				username_exist = true;
			}
		});

		if (username_exist) {
			return alert("Username had been used");
		} else {
			arr.push(this.state.form);
		}

		this.setState({
			arr_account: arr
		});

		localStorage.setItem("arr_account", JSON.stringify(arr));

		this.props.history.push("/account");
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
					<Col>
						<Card>
							<CardHeader>
								<strong>Create Account</strong>
							</CardHeader>
							<CardBody>
								<Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
									<FormGroup row>
										<Col md="2">
											<Label>Username *</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.username} onChange={e => this.handleChange({ username: e.target.value })} />
										</Col>
										<Col md="2">
											<Label>Department</Label>
										</Col>
										<Col xs="12" md="4">
											<Input
												type="select"
												defaultValue={this.state.form.department}
												onChange={e => this.handleChange({ department: e.target.value })}
											>
												<option />
												<option>Department A</option>
												<option>Department B</option>
												<option>Department C</option>
												<option>Others</option>
											</Input>
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Name *</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.name} onChange={e => this.handleChange({ name: e.target.value })} />
										</Col>
										<Col md="2">
											<Label>Role</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="select" defaultValue={this.state.form.role} onChange={e => this.handleChange({ role: e.target.value })}>
												<option value="10">User</option>
												<option value="20">Engineer</option>
												<option value="50">Helpdesk</option>
											</Input>
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Password *</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.password} onChange={e => this.handleChange({ password: e.target.value })} />
										</Col>
										<Col md="2">
											<Label>Email</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.email} onChange={e => this.handleChange({ email: e.target.value })} />
										</Col>
									</FormGroup>
								</Form>

								<Row>
									<div className="col-auto mr-auto" />
									<div className="col-auto">
										<Button
											color="primary"
											onClick={event => {
												this.createForm();
											}}
										>
											Create
										</Button>
									</div>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

export default CreateAccount;
