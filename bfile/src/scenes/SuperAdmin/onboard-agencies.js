import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

class OnboardAgencies extends Component {
    state = {
        loading: true,
        agencies: [],
        page: 1,
        total_pages: 0
    }
    componentDidMount = () => {
        this.loadAgencies(1);
    }
    loadAgencies = (page) => {
        const api = '/api/agencies?page='+page+'&q={"filters":[{"name":"vonboard","op":"==","val":1}]}';

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const agencies = res.data.objects;
            this.setState({
                loading: false,
                page: res.data.page,
                total_pages: res.data.total_pages,
                agencies
            });
        });
    }
    download = () => {
        this.setState({ loading: true });
        axios.get("/api/admin/download/onboard_agencies").then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "/bfile/assets/files/onboard-agencies/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the csv.`));
            }
        });
    }
    render() {

        const { loading, agencies, page, total_pages, user } = this.state;

        const columns = [
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name'
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Agency Owner Name',
                dataIndex: 'agency_owner_name',
                key: 'agency_owner_name'
            },
            {
                title: 'Agency Owner Email',
                dataIndex: 'agency_owner_email',
                key: 'agency_owner_email'
            },
            {
                title: 'Active',
                dataIndex: 'active',
                key: 'active'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < agencies.length; i++) {
            let agency = agencies[i];

            data.push({
                key: i,
                agency_name: agency.name,
                phone: agency.primary.phone,
                agency_owner_name: agency.primary.first_name+' '+agency.primary.last_name,
                agency_owner_email: agency.primary.email,
                active: (agency.active === 1) ? 'Yes' : 'No'
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="area-chart" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Onboard Agencies`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Button onClick={() => this.download()}>
                            <Translate text={`Download CSV`} />
                        </Button>
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
            </div>
        );

    }
}

export default OnboardAgencies;
