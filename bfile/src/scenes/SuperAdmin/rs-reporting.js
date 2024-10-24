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
    message,
    Modal,
    Checkbox,
    Radio,
    Spin,
    DatePicker
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const today = new Date();

class RSActivity extends Component {
    state = {
        loading: true,
        users: [],
        page: 1,
        total_pages: 0,
        user: {},
        agencies_modal: false,
        agencies_modal_loading: false,
        agencies: [],
        user_agencies: [],
        search: '',
        periodAll: false,
        start_date: null,
        end_date: null,
        period: "mtd"
    }
    componentDidMount = () => {
        this.loadUsers();
    }
    loadUsers = () => {
        this.setState({ loading: true });
        const url = '/api/admin_rs_stats';

        let data = { window: this.state.period };
        if (this.state.period === "from_to") {
            data.from = moment(this.state.start_date).format('YYYY-MM-DD');
            data.to = moment(this.state.end_date).format('YYYY-MM-DD');
        }
        axios.post(url, data).then((res) => {
            this.setState({
                loading: false,
                users: res.data
            });
        });
    }
    all = () => {
        this.setState({
            start_date: new Date('2010-01-01'),
            end_date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            periodAll: true
        }, () => {
            this.loadUsers();
        })
    }
    changePeriod = (e) => {
        const value = e.target.value;
        if (value === "mtd") {
            this.setState({
                start_date: null,
                end_date: null,
                period: value
            }, () => {
                this.loadUsers();
            })
        } else {
            this.setState({
                // start_date: new Date('2010-01-01'),
                // end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
                period: value
            }, () => {
                this.loadUsers();
            })
        }
    }
    onChangeDateRange = (date) => {
        this.setState({
            start_date: date[0],
            end_date: date[1],
            period: "from_to",
            periodAll: false
        }, () => {
            this.loadUsers();
        })
    }
    download = () => {
        this.setState({ loading: true });
        axios.post("/api/admin/download/rs_admin_stats", {
            stats: JSON.stringify(this.state.users)
        }).then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "/bfile/assets/files/admin/" + res.data.token + ".csv";
            } else {
                message.error(F.translate(`Can't download the csv.`));
            }
        });
    }
    render() {
        const { loading, users, page, total_pages,
            start_date,
            end_date,
            period
        } = this.state;

        const columns = [
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name'
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Calls Made',
                dataIndex: 'calls_made',
                key: 'calls_made'
            },
            {
                title: 'Appointments Scheduled',
                dataIndex: 'appointments_scheduled',
                key: 'appointments_scheduled'
            },
            {
                title: 'Not Interested',
                dataIndex: 'not_interested',
                key: 'not_interested'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        let date_url = '?';
        if (period === 'from_to') {
            date_url = '/all/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY')) + "?"
        }
        if (period === 'all_bfiles') {
            date_url = '?all_bfiles&';
        }

        const data = [];
        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            data.push({
                key: i,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email || '-',
                phone: user.phone || '-',
                calls_made: <Link to={"/bfiles/user-rs-calls-made" + date_url + "reviewer_id=" + user.user_id}><a>{user.calls_made || 0}</a></Link>,
                appointments_scheduled: <Link to={"/bfiles/user-rs-appointments-scheduled" + date_url + "reviewer_id=" + user.user_id}><a>{user.appointments_scheduled || 0}</a></Link>,
                not_interested: <Link to={"/bfiles/user-rs-not-interested" + date_url + "reviewer_id=" + user.user_id}><a>{user.not_interested || 0}</a></Link>
            })
        }

        const dateFormat = 'MM/DD/YYYY';

        let defaultFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        if (start_date) defaultFromDate = start_date;

        let defaultToDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        if (end_date) defaultToDate = end_date;

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{ paddingTop: 7 }}>
                            <Icon type="team" style={{ marginRight: 10, color: "#1890ff" }} />
                            Review Scheduler Activity
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div className="right-align" style={{ marginTop: -5, marginBottom: -5 }}>
                            <div className="inlineField">
                                <Button onClick={() => this.download()}>
                                    Download CSV
                                </Button>
                            </div>
                            <div className="inlineField">
                                <Radio.Group value={this.state.period} onChange={this.changePeriod.bind(this)} style={{ width: '100%' }}>
                                    <Radio.Button value="mtd"><Translate text={`This Month`} /></Radio.Button>
                                    <Radio.Button value="all_bfiles"><Translate text={`All B-Files`} /></Radio.Button>
                                </Radio.Group>
                            </div>
                            <div className="inlineField">
                                <RangePicker
                                    style={{ width: '100%' }}
                                    value={[moment(defaultFromDate), moment(defaultToDate)]}
                                    onChange={this.onChangeDateRange}
                                    format={dateFormat}
                                />
                            </div>
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadUsers(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default RSActivity;
