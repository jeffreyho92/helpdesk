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

class Tickets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr_tickets: this.props.arr_tickets.sort((a, b) => a.ID < b.ID),
			arr_account: this.props.arr_account,
			primary: false,
			form: {
				ID: "",
				subject: "",
				user: "",
				engineer: "",
				created: "",
				priority: "",
				status: "",
				remark: ""
			},
			toggleIndex: ""
		};

		this.togglePrimary = this.togglePrimary.bind(this);
		this.togglePrimaryClose = this.togglePrimaryClose.bind(this);
		this.updateForm = this.updateForm.bind(this);
		this.deleteTicket = this.deleteTicket.bind(this);
	}

	componentWillMount() {
		console.log("componentWillMount");
		console.log(this.props);
	}

	togglePrimary(index) {
		if (!isNaN(parseFloat(index)) && isFinite(index)) {
			this.state.toggleIndex = index;

			this.state.form.ID = this.state.arr_tickets[index].ID;
			this.state.form.subject = this.state.arr_tickets[index].subject;
			this.state.form.user = this.state.arr_tickets[index].user;
			this.state.form.engineer = this.state.arr_tickets[index].engineer;
			this.state.form.created = this.state.arr_tickets[index].created;
			this.state.form.priority = this.state.arr_tickets[index].priority;
			this.state.form.status = this.state.arr_tickets[index].status;
			this.state.form.remark = this.state.arr_tickets[index].remark;
		}
		this.setState({
			primary: !this.state.primary
		});
	}

	togglePrimaryClose() {
		this.setState({
			primary: false,
			toggleIndex: ""
		});
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

	updateForm() {
		this.state.arr_tickets[this.state.toggleIndex] = this.state.form;

		this.setState({
			arr_tickets: this.state.arr_tickets,
			form: {
				ID: "",
				subject: "",
				user: "",
				engineer: "",
				created: "",
				priority: "",
				status: "",
				remark: ""
			}
		});

		localStorage.setItem("arr_tickets", JSON.stringify(this.state.arr_tickets));
	}

	deleteTicket() {
		var arr = this.state.arr_tickets.filter(t => t.ID != this.state.form.ID);
		this.setState({
			arr_tickets: arr,
			form: {
				ID: "",
				subject: "",
				user: "",
				engineer: "",
				created: "",
				priority: "",
				status: "",
				remark: ""
			}
		});
		localStorage.setItem("arr_tickets", JSON.stringify(arr));
		this.togglePrimaryClose();
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
											<Input type="text" id="input1-group2" name="input1-group2" placeholder="" />
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
											<Input type="select" name="select" id="select">
												<option value="1">All</option>
												<option value="2">New</option>
												<option value="3">Pending</option>
												<option value="3">Completed</option>
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
										<th>User</th>
										<th>Engineer</th>
										<th>Created</th>
										<th>Priority</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{this.state.arr_tickets.map(
										(ticket, index) => (
											<tr key={index} onClick={this.togglePrimary.bind(this, index)} className="hand-cursor">
												<td className="text-center">{ticket.ID}</td>
												<td>{ticket.subject}</td>
												<td>{ticket.user}</td>
												<td>{ticket.engineer}</td>
												<td>{ticket.created}</td>
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
										<PaginationLink href="#">1</PaginationLink>
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
									<Label>Subject</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="text" value={this.state.form.subject} onChange={e => this.handleChange({ subject: e.target.value })} />
								</Col>
								<Col md="2">
									<Label>User</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="text" value={this.state.form.user} disabled />
								</Col>
							</FormGroup>

							<FormGroup row>
								<Col md="2">
									<Label>Engineer</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="select" onChange={e => this.handleChange({ engineer: e.target.value })}>
										<option>{this.state.form.engineer}</option>
										{this.state.arr_account.map((acc, index) => {
											if (acc.role == 20 && acc.username != this.state.form.engineer) {
												return <option key={index}>{acc.username}</option>;
											}
										})}
									</Input>
								</Col>
								<Col md="2">
									<Label>Created</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="text" value={this.state.form.created} disabled />
								</Col>
							</FormGroup>

							<FormGroup row>
								<Col md="2">
									<Label>Priority</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="select" defaultValue={this.state.form.priority} onChange={e => this.handleChange({ priority: e.target.value })}>
										<option>Urgent</option>
										<option>Normal</option>
									</Input>
								</Col>
								<Col md="2">
									<Label>Status</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="select" defaultValue={this.state.form.status} onChange={e => this.handleChange({ status: e.target.value })}>
										<option>New</option>
										<option>Pending</option>
										<option>Completed</option>
									</Input>
								</Col>
							</FormGroup>

							<FormGroup row>
								<Col md="2">
									<Label>Remark</Label>
								</Col>
								<Col xs="12" md="4">
									<Input type="textarea" value={this.state.form.remark} onChange={e => this.handleChange({ remark: e.target.value })} />
								</Col>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<div className="col-auto mr-auto">
							<Button color="danger" onClick={this.deleteTicket}>
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
			</div>
		);
	}
}

export default Tickets;
