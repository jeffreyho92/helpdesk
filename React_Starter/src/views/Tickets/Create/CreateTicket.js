import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, InputGroup, InputGroupAddon, Button, Label, Input } from "reactstrap";
import moment from "moment";
import sendMail from "../../../function.js";

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

class CreateTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr_tickets: JSON.parse(localStorage.getItem("arr_tickets")),
			arr_account: JSON.parse(localStorage.getItem("arr_account")),
			arr_subtype: JSON.parse(localStorage.getItem("arr_subtype")),
			arr_tickets_action: JSON.parse(localStorage.getItem("arr_tickets_action")),
			form: {
				ID: "",
				subject: "",
				user: "",
				engineer: "",
				priority: "Low",
				status: "New",
				desc: "",
				defect_type: "Hardware",
				defect_subtype: "PC",
				department: "",
				asset_name: "",
				serial_no: "",
				contact_no: ""
			},
			shouldHide: false
		};

		this.createForm = this.createForm.bind(this);
	}

	componentWillMount() {
		if (localStorage.getItem("login_session")) {
			if (JSON.parse(localStorage.getItem("login_session")).role == 10) {
				this.setState(state => ({
					...state,
					form: {
						...state.form,
						user: JSON.parse(localStorage.getItem("login_session")).username,
						department: JSON.parse(localStorage.getItem("login_session")).department
					},
					shouldHide: true
				}));
			}
		}
	}

	subtype_option() {
		let items = [];
		this.state.arr_subtype.map((type, index) => {
			if (this.state.form.defect_type == "Hardware" && type.cat == 1) {
				items.push(<option key={index}>{type.name}</option>);
			} else if (this.state.form.defect_type == "Software" && type.cat == 2) {
				items.push(<option key={index}>{type.name}</option>);
			}
		});
		return items;
	}

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
		if (this.state.form.subject == "" || this.state.form.department == "" || this.state.form.user == "") {
			return alert("Please fill in required fields");
		}

		//get latest ID
		var arr = this.state.arr_tickets.sort((a, b) => a.ID < b.ID);
		var id = arr[0] ? arr[0].ID : "201804-00000";
		id = id.split("-");
		id = id[0] + "-" + pad(++id[1], 5);

		this.state.form.ID = id;

		var action = {
			ID: id,
			datetime: moment().format(),
			action: 1
		};

		this.state.arr_tickets.push(this.state.form);
		this.state.arr_tickets_action.push(action);

		this.setState({
			arr_tickets: this.state.arr_tickets,
			arr_tickets_action: this.state.arr_tickets_action
		});

		localStorage.setItem("arr_tickets", JSON.stringify(this.state.arr_tickets));
		localStorage.setItem("arr_tickets_action", JSON.stringify(this.state.arr_tickets_action));

		var subject = "ICT HELPDESK - New ticket " + id;
		var message = "Ticket id: " + id + "<br/>";
		message += "Subject: " + this.state.form.subject + "<br/>";
		message += "User: " + this.state.form.user + "<br/>";
		message += "Defect Type: " + this.state.form.defect_type + "<br/>";
		message += "Defect Subtype: " + this.state.form.defect_subtype + "<br/>";
		message += "<br/><br/>*DO-NOT-REPLY* Auto mail send from ICT HELPDESK";

		//get email
		var e_helpdesk = "";
		var e_user = "";
		var e_engineer = "";
		this.state.arr_account.map(arr => {
			if (arr.role == 50) {
				e_helpdesk = arr.email;
			} else if (arr.username == this.state.form.user) {
				e_user = arr.email;
			} else if (arr.username == this.state.form.engineer) {
				e_engineer = arr.email;
			}
		});

		if (e_helpdesk) {
			//send email to helpdesk
			var msg = "Dear Helpdesk, <br/><br/>" + message;
			sendMail(e_helpdesk, subject, msg);
		}
		if (e_user) {
			//send email to user
			var msg = "Dear " + this.state.form.user + ", <br/><br/>" + message;
			sendMail(e_user, subject, msg);
		}
		if (e_engineer) {
			//send email to engineer
			var msg = "Dear " + this.state.form.engineer + ", <br/><br/>" + message;
			sendMail(e_engineer, subject, msg);
		}

		this.props.history.push("/tickets");
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
					<Col>
						<Card>
							<CardHeader>
								<strong>Create Ticket</strong>
							</CardHeader>
							<CardBody>
								<Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
									<FormGroup row>
										<Col md="2">
											<Label>Subject *</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.subject} onChange={e => this.handleChange({ subject: e.target.value })} />
										</Col>
										<Col md="2">
											<Label>Department *</Label>
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
										<Col md="2" className={this.state.shouldHide ? "hidden" : ""}>
											<Label>User *</Label>
										</Col>
										<Col xs="12" md="4" className={this.state.shouldHide ? "hidden" : ""}>
											<Input type="select" onChange={e => this.handleChange({ user: e.target.value })}>
												<option>
													{this.state.arr_account.map((a, index) => {
														if (a.username == this.state.form.user) {
															return a.name;
														}
													})}
												</option>
												{this.state.arr_account.map((acc, index) => {
													if (acc.role == 10 && acc.username != this.state.form.user) {
														return (
															<option key={index} value={acc.username}>
																{acc.name}
															</option>
														);
													}
												})}
											</Input>
										</Col>
										<Col md="2" className={this.state.shouldHide ? "hidden" : ""}>
											<Label>Engineer</Label>
										</Col>
										<Col xs="12" md="4" className={this.state.shouldHide ? "hidden" : ""}>
											<Input type="select" onChange={e => this.handleChange({ engineer: e.target.value })}>
												<option>
													{this.state.arr_account.map((a, index) => {
														if (a.username == this.state.form.engineer) {
															return a.name;
														}
													})}
												</option>
												{this.state.arr_account.map((acc, index) => {
													if (acc.role == 20 && acc.username != this.state.form.engineer) {
														return (
															<option key={index} value={acc.username}>
																{acc.name}
															</option>
														);
													}
												})}
											</Input>
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Defect Type *</Label>
										</Col>
										<Col xs="12" md="4">
											<Input
												type="select"
												defaultValue={this.state.form.defect_type}
												onChange={e => this.handleChange({ defect_type: e.target.value })}
											>
												<option>Hardware</option>
												<option>Software</option>
											</Input>
										</Col>
										<Col md="2">
											<Label>Defect Sub-type *</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="select" onChange={e => this.handleChange({ defect_subtype: e.target.value })}>
												{this.subtype_option()}
											</Input>
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Asset name</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.asset_name} />
										</Col>
										<Col md="2">
											<Label>Serial number</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.serial_no} />
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Contact no.</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.contact_no} onChange={e => this.handleChange({ contact_no: e.target.value })} />
										</Col>
										<Col md="2">
											<Label>Description</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="textarea" value={this.state.form.desc} onChange={e => this.handleChange({ desc: e.target.value })} />
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2" className={this.state.shouldHide ? "hidden" : ""}>
											<Label>Priority</Label>
										</Col>
										<Col xs="12" md="4" className={this.state.shouldHide ? "hidden" : ""}>
											<Input type="select" defaultValue={this.state.form.priority} onChange={e => this.handleChange({ priority: e.target.value })}>
												<option>Low</option>
												<option>Medium</option>
												<option>High</option>
											</Input>
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

export default CreateTicket;
