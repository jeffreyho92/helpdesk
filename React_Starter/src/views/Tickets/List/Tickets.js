import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Form,
	FormGroup,
	InputGroup,
	InputGroupAddon,
	Button,
	Label,
	Input,
	Table,
	Badge,
	Pagination,
	PaginationItem,
	PaginationLink,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from "reactstrap";
import moment from "moment";
import sendMail from "../../../function.js";
import Lightbox from "react-images";

function BadgeStatus(props) {
	if (props.status == "New") {
		return (
			<Badge className="mr-1" color="warning">
				<span className="span-status">New</span>
			</Badge>
		);
	} else if (props.status == "Pending") {
		return (
			<Badge className="mr-1" color="primary">
				<span className="span-status">Pending</span>
			</Badge>
		);
	} else if (props.status == "KIV") {
		return (
			<Badge className="mr-1" color="primary">
				<span className="span-status">KIV</span>
			</Badge>
		);
	} else if (props.status == "Issue") {
		return (
			<Badge className="mr-1" color="primary">
				<span className="span-status">Issue</span>
			</Badge>
		);
	} else if (props.status == "Completed") {
		return (
			<Badge className="mr-1" color="success">
				<span className="span-status">Completed</span>
			</Badge>
		);
	} else {
		return null;
	}
}

var new_form = {
	ID: "",
	subject: "",
	user: "",
	engineer: "",
	priority: "",
	status: "",
	desc: "",
	defect_type: "Hardware",
	defect_subtype: "",
	department: "",
	asset_name: "",
	serial_no: "",
	engineer_remark: "",
	defect_condition: "",
	contact_no: ""
};

class Tickets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr_tickets: JSON.parse(localStorage.getItem("arr_tickets")).sort((a, b) => a.ID < b.ID),
			arr_account: JSON.parse(localStorage.getItem("arr_account")),
			arr_subtype: JSON.parse(localStorage.getItem("arr_subtype")),
			arr_tickets_action: JSON.parse(localStorage.getItem("arr_tickets_action")),
			arr_images: JSON.parse(localStorage.getItem("arr_images")),
			primary: false,
			form: Object.create(new_form),
			toggleIndex: "",
			search_id: "",
			user_role: 0,
			user_name: "",
			images: [],
			lightboxIsOpen: false,
			currentImage: 0
		};

		this.togglePrimary = this.togglePrimary.bind(this);
		this.togglePrimaryClose = this.togglePrimaryClose.bind(this);
		this.updateForm = this.updateForm.bind(this);
		this.deleteTicket = this.deleteTicket.bind(this);
		this.statusChange = this.statusChange.bind(this);
		this.search = this.search.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
		this.loadTicketImages = this.loadTicketImages.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
	}

	componentWillMount() {
		console.log("componentWillMount");

		var user = JSON.parse(localStorage.getItem("login_session"));
		if (user && user.role) {
			var arr = [];
			if (user.role == 10) {
				//user
				this.state.arr_tickets.map(t => {
					if (user.username == t.user) {
						arr.push(t);
					}
				});
			} else if (user.role == 20) {
				//engineer
				this.state.arr_tickets.map(t => {
					if (user.username == t.engineer) {
						arr.push(t);
					}
				});
			} else if (user.role >= 50) {
				//helpdesk
				arr = this.state.arr_tickets;
			}

			this.setState({
				arr_tickets: arr,
				user_role: user.role,
				user_name: user.username
			});
		}
	}

	togglePrimary(ID) {
		console.log("togglePrimary " + ID);
		if (this.state.form.ID != "") {
			return;
		}
		console.log(this.state.arr_tickets);

		this.state.arr_tickets.map(t => {
			if (t.ID == ID) {
				var form = Object.create(new_form);

				form.ID = t.ID;
				form.subject = t.subject;
				form.user = t.user;
				form.engineer = t.engineer;
				form.priority = t.priority;
				form.status = t.status;
				form.desc = t.desc;
				form.defect_type = t.defect_type;
				form.defect_subtype = t.defect_subtype;
				form.department = t.department;
				form.asset_name = t.asset_name;
				form.serial_no = t.serial_no;
				form.engineer_remark = t.engineer_remark;
				form.defect_condition = t.defect_condition;
				form.contact_no = t.contact_no;

				this.setState({
					form: form,
					images: [],
					currentImage: 0
				});
			}
		});

		this.setState({
			primary: !this.state.primary
		});

		if (this.state.arr_images) {
			this.loadTicketImages(ID);
		}
	}

	togglePrimaryClose() {
		this.setState({
			primary: false,
			toggleIndex: "",
			form: Object.create(new_form)
		});
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
		if (newPartialInput.search_id) {
			this.setState({
				search_id: newPartialInput.search_id
			});
		} else {
			this.setState(state => ({
				...state,
				form: {
					...state.form,
					...newPartialInput
				}
			}));
		}
	}

	search(value) {
		this.setState({
			arr_tickets: JSON.parse(localStorage.getItem("arr_tickets")).filter(t => t.ID.includes(value))
		});
	}

	statusChange(value) {
		if (value == "All") {
			this.setState({
				arr_tickets: JSON.parse(localStorage.getItem("arr_tickets"))
			});
		} else {
			this.setState({
				arr_tickets: JSON.parse(localStorage.getItem("arr_tickets")).filter(t => t.status == value)
			});
		}
	}

	updateForm() {
		console.log("updateForm " + this.state.form.ID);

		//validation
		if (this.state.form.subject == "" || this.state.form.department == "" || this.state.form.user == "") {
			return alert("Please fill in required fields");
		}

		var update_value = this.state.form;
		var arr = [];
		this.state.arr_tickets.map(t => {
			if (t.ID == this.state.form.ID) {
				arr.push(update_value);
			} else {
				arr.push(t);
			}
		});

		var action_id = 0;
		if (this.state.user_role == 10) {
			action_id = 2;
		} else if (this.state.user_role == 20) {
			action_id = 4;
		} else if (this.state.user_role == 50) {
			action_id = 3;
		}
		var action = {
			ID: this.state.form.ID,
			datetime: moment().format(),
			action: action_id,
			user: this.state.user_name
		};
		var arr2 = this.state.arr_tickets_action;
		arr2.push(action);

		this.setState({
			arr_tickets: arr,
			arr_tickets_action: arr2,
			form: Object.create(new_form)
		});

		var arr3 = [];
		JSON.parse(localStorage.getItem("arr_tickets")).map(t => {
			if (t.ID == this.state.form.ID) {
				arr3.push(update_value);
			} else {
				arr3.push(t);
			}
		});

		localStorage.setItem("arr_tickets", JSON.stringify(arr3));
		localStorage.setItem("arr_tickets_action", JSON.stringify(arr2));

		var id = this.state.form.ID;
		var subject = "ICT HELPDESK - Ticket updated " + id;
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

		if (this.state.user_role == 10) {
			e_user = "";
		} else if (this.state.user_role == 20) {
			e_engineer = "";
		} else if (this.state.user_role == 50) {
			e_helpdesk = "";
		}

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
	}

	deleteTicket() {
		var confirmDel = confirm("Are you sure want to delete " + this.state.form.ID + "?");
		if (!confirmDel) {
			return;
		}

		var arr = this.state.arr_tickets.filter(t => t.ID != this.state.form.ID);
		var arr2 = this.state.arr_tickets_action.filter(t => t.ID != this.state.form.ID);
		this.setState({
			arr_tickets: arr,
			arr_tickets_action: arr2,
			form: Object.create(new_form)
		});
		localStorage.setItem("arr_tickets", JSON.stringify(arr));
		localStorage.setItem("arr_tickets_action", JSON.stringify(arr2));
		this.togglePrimaryClose();
	}

	onChangeFile(e) {
		console.log(e.target.files);
		for (var i = 0; i < e.target.files.length; i++) {
			var file = e.target.files[i];

			console.log(file);
			let reader = new FileReader();

			reader.onloadend = () => {
				if (reader.result) {
					var arr = JSON.parse(localStorage.getItem("arr_images")) || [];
					arr.push({
						ID: this.state.form.ID,
						image: reader.result
					});
					this.setState({
						arr_images: arr
					});
					localStorage.setItem("arr_images", JSON.stringify(arr));
				}

				this.loadTicketImages(this.state.form.ID);
			};

			reader.readAsDataURL(file);
		}
	}

	loadTicketImages(ID) {
		var arr = [];
		var arr_images = JSON.parse(localStorage.getItem("arr_images")) || [];
		arr_images.map(i => {
			if (i.ID == ID) {
				arr.push({ src: i.image });
			}
		});
		this.setState({
			images: arr
		});
	}

	closeLightbox() {
		this.setState({
			lightboxIsOpen: false
		});
	}

	openLightbox() {
		this.setState({
			lightboxIsOpen: true
		});
	}

	gotoPrevious() {
		this.setState({
			currentImage: this.state.currentImage - 1
		});
	}
	gotoNext() {
		this.setState({
			currentImage: this.state.currentImage + 1
		});
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
					<Col>
						<Card>
							<CardHeader>
								<strong>Tickets</strong>
							</CardHeader>
							<CardBody>
								<Row>
									<div className="col-auto mr-auto">
										<InputGroup>
											<Link to={"/tickets/create"}>
												<Button color="primary">Create Ticket</Button>
											</Link>
											&emsp;
											<Input type="text" onChange={e => this.search(e.target.value)} />
											<InputGroupAddon addonType="prepend">
												<Button type="button" color="primary">
													<i className="fa fa-search" /> Search
												</Button>
											</InputGroupAddon>
										</InputGroup>
									</div>
									<div className="col-auto">
										<InputGroup>
											<div className="text-vertical-middle">Status: &emsp;</div>
											<Input type="select" onChange={e => this.statusChange(e.target.value)}>
												<option value="All">All</option>
												<option value="New">New</option>
												<option value="Pending">Pending</option>
												<option value="KIV">KIV</option>
												<option value="Issue">Issue</option>
												<option value="Completed">Completed</option>
											</Input>
										</InputGroup>
									</div>
								</Row>
							</CardBody>

							<Table hover responsive className="">
								<thead className="">
									<tr>
										<th className="text-center">ID</th>
										<th>Subject</th>
										<th>Department</th>
										<th>User</th>
										<th>Defect type</th>
										<th>Engineer</th>
										<th>Priority</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{this.state.arr_tickets.map(
										(ticket, index) => (
											<tr key={index} onClick={this.togglePrimary.bind(this, ticket.ID)} className="hand-cursor">
												<td className="text-center">{ticket.ID}</td>
												<td>{ticket.subject}</td>
												<td>{ticket.department}</td>
												<td>
													{this.state.arr_account.map((a, index) => {
														if (a.username == ticket.user) {
															return a.name;
														}
													})}
												</td>
												<td>{ticket.defect_type}</td>
												<td>
													{this.state.arr_account.map((a, index) => {
														if (a.username == ticket.engineer) {
															return a.name;
														}
													})}
												</td>
												<td>{ticket.priority}</td>
												<td>
													<BadgeStatus status={ticket.status} />
												</td>
											</tr>
										),
										this
									)}
								</tbody>
							</Table>

							<CardBody>
								<Pagination>
									<PaginationItem disabled>
										<PaginationLink previous href="#">
											Prev
										</PaginationLink>
									</PaginationItem>
									<PaginationItem active>
										<PaginationLink>1</PaginationLink>
									</PaginationItem>
									<PaginationItem disabled>
										<PaginationLink next href="#">
											Next
										</PaginationLink>
									</PaginationItem>
								</Pagination>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Modal isOpen={this.state.primary} toggle={this.togglePrimaryClose} className={"modal-lg modal-primary " + this.props.className}>
					<ModalHeader toggle={this.togglePrimaryClose}>Ticket : {this.state.form.ID}</ModalHeader>
					<ModalBody>
						<Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
							<FormGroup row>
								<Col md="2">
									<Label>Subject *</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="text"
										disabled={this.state.user_role == 20 ? true : false}
										value={this.state.form.subject}
										onChange={e => this.handleChange({ subject: e.target.value })}
									/>
								</Col>
								<Col md="2">
									<Label>Department *</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.user_role == 20 ? true : false}
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
									<Label>User *</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.user_role < 50 ? true : false}
										onChange={e => this.handleChange({ user: e.target.value })}
									>
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
								<Col md="2">
									<Label>Contact no.</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="text"
										disabled={this.state.user_role == 20 ? true : false}
										value={this.state.form.contact_no}
										onChange={e => this.handleChange({ contact_no: e.target.value })}
									/>
								</Col>
							</FormGroup>

							<FormGroup row>
								<Col md="2">
									<Label>Description</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="textarea"
										disabled={this.state.user_role == 20 ? true : false}
										value={this.state.form.desc}
										onChange={e => this.handleChange({ desc: e.target.value })}
									/>
								</Col>
							</FormGroup>

							<div className="col-xs-12 row_hr">
								<hr />
							</div>

							<FormGroup row>
								<Col md="2">
									<Label>Defect Type *</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="select" defaultValue={this.state.form.defect_type} onChange={e => this.handleChange({ defect_type: e.target.value })}>
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
									<Input type="text" value={this.state.form.asset_name} onChange={e => this.handleChange({ asset_name: e.target.value })} />
								</Col>
								<Col md="2">
									<Label>Serial number</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="text" value={this.state.form.serial_no} onChange={e => this.handleChange({ serial_no: e.target.value })} />
								</Col>
							</FormGroup>

							<FormGroup row>
								<Col md="2">
									<Label>Engineer</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.user_role < 50 ? true : false}
										onChange={e => this.handleChange({ engineer: e.target.value })}
									>
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
								<Col md="2">
									<Label>Defect Condition</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.user_role < 20 ? true : false}
										defaultValue={this.state.form.defect_condition}
										onChange={e => this.handleChange({ defect_condition: e.target.value })}
									>
										<option />
										<option>Minor</option>
										<option>Major</option>
										<option>Critical</option>
									</Input>
								</Col>
							</FormGroup>

							<FormGroup row>
								<Col md="2">
									<Label>Engineer Remark</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="textarea"
										disabled={this.state.user_role < 20 ? true : false}
										value={this.state.form.engineer_remark}
										onChange={e => this.handleChange({ engineer_remark: e.target.value })}
									/>
								</Col>
								<Col md="2">
									<Label>Upload image</Label>
									<Button outline size="sm" color="primary" onClick={this.openLightbox} hidden={this.state.images.length == 0}>
										View images
									</Button>
								</Col>
								<Col xs="12" md="4">
									<input type="file" onChange={this.onChangeFile} multiple />
								</Col>
							</FormGroup>

							<div className="col-xs-12 row_hr">
								<hr />
							</div>

							<FormGroup row>
								<Col md="2">
									<Label>Priority</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.user_role < 50 ? true : false}
										defaultValue={this.state.form.priority}
										onChange={e => this.handleChange({ priority: e.target.value })}
									>
										<option>Low</option>
										<option>Medium</option>
										<option>High</option>
									</Input>
								</Col>
								<Col md="2">
									<Label>Status</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.user_role < 20 ? true : false}
										defaultValue={this.state.form.status}
										onChange={e => this.handleChange({ status: e.target.value })}
									>
										<option>New</option>
										<option>Pending</option>
										<option>KIV</option>
										<option>Issue</option>
										<option>Completed</option>
									</Input>
								</Col>
							</FormGroup>
						</Form>

						<br />
						<br />

						<Row>
							<Col md="2" />
							<Col md="8">
								<Table responsive size="sm">
									<thead>
										<tr>
											<th>Datetime</th>
											<th>Event</th>
										</tr>
									</thead>
									<tbody>
										{this.state.arr_tickets_action.filter(act => act.ID == this.state.form.ID).map(
											(act, index) => (
												<tr key={index}>
													<td>{act.datetime.substring(0, act.datetime.length - 6).replace("T", " ")}</td>
													<td>
														{
															{
																1: "New Ticket had been created",
																2: "User update ticket information",
																3: "Helpdesk verify and update ticket information",
																4: "Engineer update ticket information",
																default: ""
															}[act.action]
														}
													</td>
												</tr>
											),
											this
										)}
									</tbody>
								</Table>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<div className="col-auto mr-auto">
							<Button color="danger" onClick={this.deleteTicket} hidden={this.state.user_role < 50 ? true : false}>
								Delete
							</Button>
						</div>
						<div className="col-auto">
							<Button
								color="primary"
								onClick={event => {
									this.updateForm();
									this.togglePrimaryClose();
								}}
							>
								Update
							</Button>
							&emsp;
							<Button color="secondary" onClick={this.togglePrimaryClose}>
								Cancel
							</Button>
						</div>
					</ModalFooter>
				</Modal>

				<Lightbox
					images={this.state.images}
					isOpen={this.state.lightboxIsOpen}
					onClose={this.closeLightbox}
					currentImage={this.state.currentImage}
					onClickPrev={this.gotoPrevious}
					onClickNext={this.gotoNext}
				/>
			</div>
		);
	}
}

export default Tickets;
