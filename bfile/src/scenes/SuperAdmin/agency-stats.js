import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Input,
    Table,
    Button,
    Select,
    Menu,
    Dropdown,
    DatePicker,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import EditAgencyModal from './edit-agency-modal';
import EditUserModal from './edit-user-modal';
import Cookies from 'js-cookie';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const today = new Date();

class AgencyStats extends Component {
    state = {
        loading: false,
        bfiles: [],
        page: 1,
        total_pages: 0,
        agency_id: null,
        agencies: [],
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth() + 1, 1)
    }
    componentDidMount = () => {
        axios.get("/api/rs_all_agencies").then((res) => {
            this.setState({
                agencies: res.data
            })
        })
    }
    loadStats = (page) => {
        const { start_date, end_date, agency_id } = this.state;

        if (agency_id) {
            console.log("Inside Agency ID")
            const filters = [];
            filters.push({ "name": "agency_id", "op": "==", "val": agency_id });

            const from = moment(start_date).utc().format("YYYY-MM-DD");
            const to = moment(end_date).utc().format("YYYY-MM-DD");
            filters.push({ "name": "created_on", "op": ">=", "val": from });
            filters.push({ "name": "created_on", "op": "<", "val": to });

            //filters.push({"name":"liability_calculator_value","op":">=","val": 100000 });

            filters.push({ "name": "deleted", "op": "==", "val": 0 });
            filters.push({ "name": "archive", "op": "==", "val": 0 });
            filters.push({ "name": "is_saved_for_later", "op": "==", "val": 0 });

            this.setState({ loading: true });

            const url = '/api/b_file?page=' + page + '&results_per_page=9999&q={"filters":' + JSON.stringify(filters) + ',"order_by":[{"field":"id","direction":"desc"}]}';

            axios.get(url).then((res) => {
                this.setState({
                    loading: false,
                    bfiles: res.data.objects,
                    page: res.data.page,
                    total_pages: res.data.total_pages
                });
            });
        }
    }
    download = () => {
        const bfiles = this.state.bfiles;

        this.setState({ loading: true })

        const data = [];
        for (let i = 0; i < bfiles.length; i++) {
            let bfile = bfiles[i];

            data.push({
                "created_date": moment(bfile.created_on).format('MM/DD/YYYY hh:mmA'),
                "expiration_date": moment(bfile.expiration_date).format('MM/DD/YYYY hh:mmA'),
                "scheduled_date": bfile.rs_scheduled_date ? moment(bfile.rs_scheduled_date).format('MM/DD/YYYY hh:mmA') : '-',
                "appointment_date": bfile.rs_appointment_date ? moment(bfile.rs_appointment_date).format('MM/DD/YYYY hh:mmA') : '-',
                "call_attempts": bfile.rs_attempts,
                "customer_name": bfile.first_name + " " + bfile.last_name,
                "phone_number": bfile.phone,
                "agency_name": bfile.agency.name,
                "rs_name": bfile.reviewer_user.first_name + " " + bfile.reviewer_user.last_name
            })
        }

        axios.post("/api/download_report_csv", {
            bfiles: data
        }).then((res) => {
            this.setState({ loading: false });
            if (res.data.success && res.data.token !== "") {
                window.location = "/api/download_file/report-" + res.data.token + ".csv";
            } else {
                message.error(F.translate(`Can't export the report.`));
            }
        });
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1]
        }, () => {
            this.loadStats(1);
        })
    }
    render() {

        const { loading, bfiles, page, total_pages, start_date, end_date } = this.state;
        const dateFormat = 'MM/DD/YYYY';

        const columns = [
            {
                title: 'Created Date',
                dataIndex: 'created_date',
                key: 'created_date'
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date'
            },
            {
                title: 'Scheduled Date',
                dataIndex: 'scheduled_date',
                key: 'scheduled_date'
            },
            {
                title: 'Appointment Date',
                dataIndex: 'appointment_date',
                key: 'appointment_date'
            },
            {
                title: 'Call Attempts',
                dataIndex: 'call_attempts',
                key: 'call_attempts'
            },
            {
                title: 'Customer Name',
                dataIndex: 'customer_name',
                key: 'customer_name'
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone_number',
                key: 'phone_number'
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name'
            },
            {
                title: 'RS Name',
                dataIndex: 'rs_name',
                key: 'rs_name'
            },
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i = 0; i < bfiles.length; i++) {
            let bfile = bfiles[i];

            data.push({
                key: i,
                created_date: moment(bfile.created_on).format('MM/DD/YYYY hh:mmA'),
                expiration_date: moment(bfile.expiration_date).format('MM/DD/YYYY hh:mmA'),
                scheduled_date: bfile.rs_scheduled_date ? moment(bfile.rs_scheduled_date).format('MM/DD/YYYY hh:mmA') : '-',
                appointment_date: bfile.rs_appointment_date ? moment(bfile.rs_appointment_date).format('MM/DD/YYYY hh:mmA') : '-',
                call_attempts: bfile.rs_attempts,
                customer_name: bfile.first_name + " " + bfile.last_name,
                phone_number: bfile.phone,
                agency_name: bfile.agency.name,
                rs_name: bfile.reviewer_user.first_name + " " + bfile.reviewer_user.last_name
            })
        }


        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{ paddingTop: 7 }}>
                            <Icon type="gift" style={{ marginRight: 10, color: "#1890ff" }} />
                            Stats by Agency
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div>
                            <Button onClick={this.download.bind(this)}>Download CSV</Button>
                        </div>
                    }
                >
                    <Card bordered={false} className="filters">
                        <Row gutter={16}>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <div>
                                        <Select value={this.state.agency_id} style={{ width: '100%' }} onChange={(value) => this.setState({ agency_id: value }, () => { this.loadStats(1) })}>
                                            <Option value={null}>{"Select agency..."}</Option>
                                            {this.state.agencies.map((agency) => (
                                                <Option key={agency.id} value={agency.id}>{agency.name}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <RangePicker
                                        value={[moment(start_date), moment(end_date)]}
                                        onChange={this.onChangeDateRange}
                                        format={dateFormat}
                                    />
                                </Col>
                            </Row>
                        </Row>
                    </Card>
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadStats(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default AgencyStats;
