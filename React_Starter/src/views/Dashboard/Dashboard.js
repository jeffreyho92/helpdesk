import React, { Component } from "react";
import { Row, Col, Card, CardTitle, CardHeader, CardBody, CardFooter, Button, Progress } from "reactstrap";
import { Line } from "react-chartjs-2";
import Widget02 from "../../components/Widgets/Widget02";

const brandInfo = "#63c2de";
//Random Numbers
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var days = 31;
var data1 = [];
var arr_labels = [];

for (var i = 1; i <= days; i++) {
	arr_labels.push(i);
	data1.push(random(0, 10));
}

const mainChart = {
	labels: arr_labels,
	datasets: [
		{
			label: "New Ticket",
			backgroundColor: convertHex(brandInfo, 10),
			borderColor: brandInfo,
			pointHoverBackgroundColor: "#fff",
			borderWidth: 2,
			data: data1
		}
	]
};

const mainChartOpts = {
	maintainAspectRatio: false,
	legend: {
		display: false
	},
	scales: {
		xAxes: [
			{
				gridLines: {
					drawOnChartArea: false
				}
			}
		],
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
					maxTicksLimit: 5,
					stepSize: Math.ceil(5 / 1),
					max: 15
				}
			}
		]
	},
	elements: {
		point: {
			radius: 0,
			hitRadius: 10,
			hoverRadius: 4,
			hoverBorderWidth: 3
		}
	}
};

// convert Hex to RGBA
function convertHex(hex, opacity) {
	hex = hex.replace("#", "");
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	var result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
	return result;
}

class Dashboard extends Component {
	componentWillMount() {
		if (localStorage.getItem("login_session")) {
			if (JSON.parse(localStorage.getItem("login_session")).role == 10) {
				this.props.history.push("/tickets");
			}
		}
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
					<Col xs="12" sm="6" lg="3">
						<Widget02 header="123" mainText="Total tickets" icon="fa fa-tags" color="primary" variant="2" />
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Widget02 header="58" mainText="Minor" icon="fa fa-smile-o" color="success" variant="2" />
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Widget02 header="40" mainText="Major" icon="fa fa-meh-o" color="warning" variant="2" />
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Widget02 header="25" mainText="Critical" icon="fa fa-frown-o" color="danger" variant="2" />
					</Col>
				</Row>
				<Row>
					<Col>
						<Card>
							<CardBody>
								<Row>
									<Col sm="5">
										<CardTitle className="mb-0">New Tickets</CardTitle>
										<div className="small text-muted">May 2018</div>
									</Col>
									<Col sm="7" className="d-none d-sm-inline-block">
										<Button color="primary" className="float-right">
											<i className="icon-tag" />
										</Button>
									</Col>
								</Row>
								<div className="chart-wrapper" style={{ height: 300 + "px", marginTop: 40 + "px" }}>
									<Line data={mainChart} options={mainChartOpts} height={15} />
								</div>
							</CardBody>
							<CardFooter>
								<ul>
									<li>
										<div className="text-muted">Department A</div>
										<strong>40 Tickets (40%)</strong>
										<Progress className="progress-xs mt-2" color="success" value="40" />
									</li>
									<li className="d-none d-md-table-cell">
										<div className="text-muted">Department B</div>
										<strong>20 Tickets (20%)</strong>
										<Progress className="progress-xs mt-2" color="info" value="20" />
									</li>
									<li>
										<div className="text-muted">Department C</div>
										<strong>30 Tickets (30%)</strong>
										<Progress className="progress-xs mt-2" color="warning" value="30" />
									</li>
									<li className="d-none d-md-table-cell">
										<div className="text-muted">Others</div>
										<strong>10 Tickets (10%)</strong>
										<Progress className="progress-xs mt-2" color="danger" value="10" />
									</li>
								</ul>
							</CardFooter>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Dashboard;
