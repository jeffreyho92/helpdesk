import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, InputGroup, InputGroupAddon, Button, Label, Input } from "reactstrap";

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

class CreateTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr_tickets: this.props.param.arr_tickets,
			arr_account: this.props.param.arr_account,
			arr_subtype: this.props.param.arr_subtype,
			form: {
				ID: "",
				subject: "",
				user: "",
				engineer: "",
				created: "",
				priority: "",
				status: "",
				desc: "",
				defect_type: "Hardware",
				defect_subtype: "PC",
				department: "",
				asset_no: "",
				asset_sn: ""
			},
			subtype: []
		};

		this.createForm = this.createForm.bind(this);
		this.refreshSubType = this.refreshSubType.bind(this);
	}

	componentWillMount() {
		console.log("componentWillMount");

		this.refreshSubType();
	}

	refreshSubType(){
		console.log('refreshSubType ' + this.state.form.defect_type)
		var arr = []; 
		this.state.arr_subtype.map((type) => {
			if (this.state.form.defect_type == "Hardware" && type.cat == 2) {
				arr.push(type.name);
			}else if (this.state.form.defect_type == "Software" && type.cat == 1) {
				arr.push(type.name);
			}
		});
		this.setState({ subtype: arr });
		console.log(this.state.form)
	}

	handleChange(newPartialInput) {
		console.log(newPartialInput)

		this.setState(state => ({
			...state,
			form: {
				...state.form,
				...newPartialInput
			}
		}));
		
		//console.log(this.state.form)

		if(newPartialInput.defect_type){
			this.refreshSubType();
		}
	}

	createForm() {
		//get latest ID
		var arr = this.state.arr_tickets.sort((a, b) => a.ID < b.ID);
		var id = arr[0].ID;
		id = id.split("-");
		id = id[0] + "-" + pad(++id[1], 5);

		this.state.form.ID = id;

		this.state.arr_tickets.push(this.state.form);

		this.setState({
			arr_tickets: this.state.arr_tickets
		});

		localStorage.setItem("arr_tickets", JSON.stringify(this.state.arr_tickets));

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
											<Label>Subject</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.subject} onChange={e => this.handleChange({ subject: e.target.value })} />
										</Col>
										<Col md="2">
											<Label>User</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="select" onChange={e => this.handleChange({ user: e.target.value })}>
												<option>{this.state.form.user}</option>
												{this.state.arr_account.map((acc, index) => {
													if (acc.role == 10 && acc.username != this.state.form.user) {
														return <option key={index}>{acc.username}</option>;
													}
												})}
											</Input>
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Defect Type</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="select" defaultValue={this.state.form.defect_type} onChange={e => this.handleChange({ defect_type: e.target.value })}>
												<option>Hardware</option>
												<option>Software</option>
											</Input>
										</Col>
										<Col md="2">
											<Label>Defect Sub-type</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="select" defaultValue={this.state.form.defect_subtype} onChange={e => this.handleChange({ defect_subtype: e.target.value })}>
											{this.state.subtype.map((type, index) => {
												return <option key={index}>{type}</option>
											})}
											</Input>
										</Col>
									</FormGroup>

									<FormGroup row>
										<Col md="2">
											<Label>Asset number</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.asset_no} />
										</Col>
										<Col md="2">
											<Label>Hardware serial number</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.asset_sn} />
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
											<Label>Department</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="text" value={this.state.form.department} />
										</Col>
										<Col md="2">
											<Label>Description</Label>
										</Col>
										<Col xs="12" md="4">
											<Input type="textarea" value={this.state.form.desc} onChange={e => this.handleChange({ desc: e.target.value })} />
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
