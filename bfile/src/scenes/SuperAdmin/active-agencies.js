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

class ActiveAgencies extends Component {
    state = {
        loading: true,
        agencies: [],
        page: 1,
        total_pages: 0,
        agency: {},
        user: {},
        edit_agency_modal: false,
        search: '',
        search_address: '',
        current_agency_index: null
    }
    componentDidMount = () => {
        this.loadAgencies(1);
    }
    loadAgencies = (page) => {

        const filters = [];
        filters.push({"name":"active","op":"==","val":1});

        if (this.state.search !== "") {
            filters.push(
                {"or": [
                    {"name":"name","op":"like","val":encodeURIComponent("%"+this.state.search+"%")},
                    {"name":"primary","op":"has","val":{"name":"first_name","op":"like","val":encodeURIComponent("%"+this.state.search+"%")}},
                    {"name":"primary","op":"has","val":{"name":"last_name","op":"like","val":encodeURIComponent("%"+this.state.search+"%")}}
                ]}
            );
        }

        if (this.state.search_address !== "") {
            filters.push(
                {"name":"address","op":"like","val":encodeURIComponent("%"+this.state.search_address+"%")}
            );
        }

        const api = "/api/admin_feed?page="+page+'&q={"filters":' + JSON.stringify(filters) + '}';
        this.setState({ loading: true });
        axios.get(api).then((res) => {
            this.setState({
                loading: false,
                agencies: res.data.objects,
                page: res.data.page,
                total_pages: res.data.total_pages
            });
        });
    }
    updateAgency = (name, value) => {
        const { agencies, current_agency_index } = this.state;
        agencies[current_agency_index][name] = value;
        this.setState({ agencies });
    }
    updateUser = (user) => {
        const { agencies, current_agency_index } = this.state;
        agencies[current_agency_index].primary = user;
        this.setState({ agencies });
    }
    switchUser = (user) => {
        this.setState({ loading: true });
        axios.post("/api/switchuser/"+user.id).then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                const user = res.data.user;
                Cookies.set("user_info", JSON.stringify({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    id: user.id,
                    user_type: user.user_type,
                    default_date: user.default_date,
                    last_login: user.last_login,
                    language: user.language
                }));
                this.props.history.push('/dashboard');
            } else {
                message.error(F.translate(`Can't switch to the user.`));
            }
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't switch to the user.`));
        });
    }

    sort=()=>{
        if(this.state.agencies.length){
            let sortedAgencies = this.state.agencies.sort((a,b)=>(a.name > b.name)?1:-1)
            console.log("Sorted Agencies = > ",sortedAgencies)
            this.setState({
                agencies:sortedAgencies
            })
        }
    }


    render() {

        const { loading, agencies, page, total_pages } = this.state;

        const states = [
            {name: 'Alabama', value: 'AL'},
            {name: 'Alaska', value: 'AK'},
            {name: 'Arizona', value: 'AZ'},
            {name: 'Arkansas', value: 'AR'},
            {name: 'California', value: 'CA'},
            {name: 'Colorado', value: 'CO'},
            {name: 'Connecticut', value: 'CT'},
            {name: 'Delaware', value: 'DE'},
            {name: 'District Of Columbia', value: 'DC'},
            {name: 'Florida', value: 'FL'},
            {name: 'Georgia', value: 'GA'},
            {name: 'Hawaii', value: 'HI'},
            {name: 'Idaho', value: 'ID'},
            {name: 'Illinois', value: 'IL'},
            {name: 'Indiana', value: 'IN'},
            {name: 'Iowa', value: 'IA'},
            {name: 'Kansas', value: 'KS'},
            {name: 'Kentucky', value: 'KY'},
            {name: 'Louisiana', value: 'LA'},
            {name: 'Maine', value: 'ME'},
            {name: 'Maryland', value: 'MD'},
            {name: 'Massachusetts', value: 'MA'},
            {name: 'Michigan', value: 'MI'},
            {name: 'Minnesota', value: 'MN'},
            {name: 'Mississippi', value: 'MS'},
            {name: 'Missouri', value: 'MO'},
            {name: 'Montana', value: 'MT'},
            {name: 'Nebraska', value: 'NE'},
            {name: 'Nevada', value: 'NV'},
            {name: 'New Hampshire', value: 'NH'},
            {name: 'New Jersey', value: 'NJ'},
            {name: 'New Mexico', value: 'NM'},
            {name: 'New York', value: 'NY'},
            {name: 'North Carolina', value: 'NC'},
            {name: 'North Dakota', value: 'ND'},
            {name: 'Ohio', value: 'OH'},
            {name: 'Oklahoma', value: 'OK'},
            {name: 'Oregon', value: 'OR'},
            {name: 'Pennsylvania', value: 'PA'},
            {name: 'Rhode Island', value: 'RI'},
            {name: 'South Carolina', value: 'SC'},
            {name: 'South Dakota', value: 'SD'},
            {name: 'Tennessee', value: 'TN'},
            {name: 'Texas', value: 'TX'},
            {name: 'Utah', value: 'UT'},
            {name: 'Vermont', value: 'VT'},
            {name: 'Virginia', value: 'VA'},
            {name: 'Washington', value: 'WA'},
            {name: 'West Virginia', value: 'WV'},
            {name: 'Wisconsin', value: 'WI'},
            {name: 'Wyoming', value: 'WY'}
        ];

        const columns = [
            {
                title: 'Agency',
                dataIndex: 'agency',
                key: 'agency'
            },
            {
                title: 'Ranking',
                dataIndex: 'ranking',
                key: 'ranking'
            },
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
                title: '',
                dataIndex: 'action',
                key: 'action'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i<agencies.length; i++) {
            let agency = agencies[i];

            data.push({
                key: i,
                agency: <Link to={'/super-admin/agency/' + agency.id}>{agency.name}</Link>,
                ranking: (agency.ranking !== '') ? agency.ranking : '-',
                first_name: agency.primary.first_name,
                last_name: agency.primary.last_name,
                action: (
                    <div className="right-align">
                        <Button onClick={() => {
                            this.setState({
                                agency: agency,
                                edit_agency_modal: true,
                                current_agency_index: i
                            })
                        }}><Icon type="edit" /> Edit Agency</Button>
                        <Button onClick={() => {
                            this.setState({
                                user: agency.primary,
                                edit_user_modal: true,
                                current_agency_index: i
                            })
                        }} style={{marginLeft:10}}><Icon type="" /> Edit EA</Button>
                        <Button onClick={() => this.switchUser(agency.primary)} style={{marginLeft:10}}><Icon type="export" /> Switch to EA</Button>
                    </div>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="team" style={{marginRight: 10,color:"#1890ff"}} />
                            Active Agencies
                            <span style={{marginLeft: 10,cursor:"pointer",fontSize:"20px"}} onClick={() => this.sort()} >↑</span>
                           
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div>
                            <Row gutter={16}>
                                <Col md={8} span={24}>
                                 {/* <  Button > */}
                                        {/* <Translate text={`Sort Agencies`} /> */}
                                        {/* <span onClick={() => this.sort()} disabled={!this.state.agencies.length}>↑</span> */}
                                    {/* </Button> */}
                                </Col>
                                <Col md={8} span={24}>
                                    <Input placeholder="Search User (LSP, EFS...)" onChange={(e) => this.setState({ search: e.target.value })} style={{ width: '100%' }} onPressEnter={() => this.loadAgencies(1)} />
                                </Col>
                                <Col md={8} span={24}>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        defaultValue={''} style={{ width: '100%' }} onChange={(value) => {
                                        this.setState({ search_address: ' ' + value + ' ' }, () => {
                                            this.loadAgencies(1);
                                        })
                                    }}>
                                        <Option value={''}>{"Select..."}</Option>
                                        {states.map((item, i) => (
                                            <Option value={item.value} key={i}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Col>
                                
                            </Row>
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
                        this.loadAgencies(page);
                    }} />
                </Card>
                <EditAgencyModal
                    history={this.props.history}
                    showModal={this.state.edit_agency_modal}
                    hideModal={() => this.setState({ edit_agency_modal: false })}
                    agency={this.state.agency}
                    updateAgency={this.updateAgency.bind(this)}
                />
                <EditUserModal
                    history={this.props.history}
                    showModal={this.state.edit_user_modal}
                    hideModal={() => this.setState({ edit_user_modal: false })}
                    user={this.state.user}
                    updateUser={this.updateUser.bind(this)}
                />
            </div>
        );

    }
}

export default ActiveAgencies;
