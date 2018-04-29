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

var new_form = {
	username: "",
	name: "",
	department: "",
	email: "",
	password: "",
	role: ""
};

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr_account: JSON.parse(localStorage.getItem("arr_account")).sort((a, b) => a.role > b.role),
			primary: false,
			form: Object.create(new_form),
			toggleIndex: "",
			search_id: ""
		};

		this.togglePrimary = this.togglePrimary.bind(this);
		this.togglePrimaryClose = this.togglePrimaryClose.bind(this);
		this.updateForm = this.updateForm.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
		this.statusChange = this.statusChange.bind(this);
		this.search = this.search.bind(this);
	}

	componentWillMount() {
		console.log("componentWillMount");
	}

	togglePrimary(username) {
		console.log("togglePrimary " + username);
		if (this.state.form.username != "") {
			return;
		}
		console.log(this.state.arr_account);

		this.state.arr_account.map(a => {
			if (a.username == username) {
				var form = Object.create(new_form);

				form.username = a.username;
				form.name = a.name;
				form.department = a.department;
				form.email = a.email;
				form.password = a.password;
				form.role = a.role;

				this.setState({
					form: form
				});
			}
		});

		this.setState({
			primary: !this.state.primary
		});
	}

	togglePrimaryClose() {
		this.setState({
			primary: false,
			toggleIndex: "",
			form: Object.create(new_form)
		});
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
			arr_account: JSON.parse(localStorage.getItem("arr_account")).filter(u => u.username.includes(value))
		});
	}

	statusChange(value) {
		if (value == "All") {
			this.setState({
				arr_account: JSON.parse(localStorage.getItem("arr_account"))
			});
		} else {
			this.setState({
				arr_account: JSON.parse(localStorage.getItem("arr_account")).filter(u => u.role == value)
			});
		}
	}

	updateForm() {
		console.log("updateForm " + this.state.form.username);

		//validation
		if (this.state.form.name == "" || this.state.form.password == "") {
			return alert("Please fill in required fields");
		}

		var update_value = this.state.form;
		var arr = [];
		this.state.arr_account.map(a => {
			if (a.username == this.state.form.username) {
				arr.push(update_value);
			} else {
				arr.push(a);
			}
		});

		this.setState({
			arr_account: arr,
			form: Object.create(new_form)
		});

		localStorage.setItem("arr_account", JSON.stringify(arr));
	}

	deleteAccount() {
		var confirmDel = confirm("Are you sure want to delete " + this.state.form.username + "?");
		if (!confirmDel) {
			return;
		}

		var arr = this.state.arr_account.filter(a => a.username != this.state.form.username);
		this.setState({
			arr_account: arr,
			form: Object.create(new_form)
		});
		localStorage.setItem("arr_account", JSON.stringify(arr));
		this.togglePrimaryClose();
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
					<Col>
						<Card>
							<CardHeader>
								<strong>Account</strong>
							</CardHeader>
							<CardBody>
								<Row>
									<div className="col-auto mr-auto">
										<InputGroup>
											<Link to={"/account/create"}>
												<Button color="primary">Create Account</Button>
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
												<option value="10">User</option>
												<option value="20">Engineer</option>
												<option value="50">Helpdesk</option>
											</Input>
										</InputGroup>
									</div>
								</Row>
							</CardBody>

							<Table hover responsive className="">
								<thead className="">
									<tr>
										<th className="text-center">Username</th>
										<th>Name</th>
										<th>Department</th>
										<th>Email</th>
										<th>Role</th>
									</tr>
								</thead>
								<tbody>
									{this.state.arr_account.map(
										(acc, index) => (
											<tr key={index} onClick={this.togglePrimary.bind(this, acc.username)} className="hand-cursor">
												<td className="text-center">{acc.username}</td>
												<td>{acc.name}</td>
												<td>{acc.department}</td>
												<td>{acc.email}</td>
												<td>
													{
														{
															10: "User",
															20: "Engineer",
															50: "Helpdesk",
															90: "Admin",
															default: ""
														}[acc.role]
													}
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
					<ModalHeader toggle={this.togglePrimaryClose}>Account : {this.state.form.username}</ModalHeader>
					<ModalBody>
						<Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
							<FormGroup row>
								<Col md="2">
									<Label>Name *</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="text"
										value={this.state.form.name}
										disabled={this.state.form.role == 90 ? true : false}
										onChange={e => this.handleChange({ name: e.target.value })}
									/>
								</Col>
								<Col md="2">
									<Label>Department</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.form.role == 90 ? true : false}
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
									<Label>Email</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="text"
										disabled={this.state.form.role == 90 ? true : false}
										value={this.state.form.email}
										onChange={e => this.handleChange({ email: e.target.value })}
									/>
								</Col>
								<Col md="2">
									<Label>Role</Label>
								</Col>
								<Col xs="12" md="4">
									<Input
										type="select"
										disabled={this.state.form.role == 90 ? true : false}
										defaultValue={this.state.form.role}
										onChange={e => this.handleChange({ role: e.target.value })}
									>
										{this.state.form.role == 90 ? <option value="90">Admin</option> : ""}
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
									<Input
										type="text"
										disabled={this.state.form.role == 90 ? true : false}
										value={this.state.form.password}
										onChange={e => this.handleChange({ password: e.target.value })}
									/>
								</Col>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<div className="col-auto mr-auto">
							<Button color="danger" onClick={this.deleteAccount} hidden={this.state.form.role == 90 ? true : false}>
								Delete
							</Button>
						</div>
						<div className="col-auto">
							<Button
								color="primary"
								hidden={this.state.form.role == 90 ? true : false}
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

export default Account;
