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
import { Translate } from 'react-translated';

class OnboardSentBfiles extends Component {
    state = {
        loading: true,
        stats_agency: [],
        stats_lsp: []
    }
    componentDidMount = () => {
        this.loadStats();
    }
    loadStats = (page) => {
        this.setState({ loading: true });
        axios.get("/api/admin/onboard_sent_bfiles").then((res) => {
            this.setState({
                loading: false,
                stats_agency: res.data.by_agency,
                stats_lsp: res.data.by_lsp
            })
        }).catch(() => {
            this.setState({ loading: false });
        });
    }
    download_agency = () => {
        this.setState({ loading: true });
        axios.get("/api/admin/download/onboard_sent_bfiles_by_agency").then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "/bfile/assets/files/onboard_sent_bfiles/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the csv.`));
            }
        });
    }
    download_lsp = () => {
        this.setState({ loading: true });
        axios.get("/api/admin/download/onboard_sent_bfiles_by_lsp").then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "/bfile/assets/files/onboard_sent_bfiles/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the csv.`));
            }
        });
    }
    render() {

        const { loading, stats_agency, stats_lsp } = this.state;

        const columns = [
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name'
            },
            {
                title: 'EA Name',
                dataIndex: 'ea_name',
                key: 'ea_name'
            },
            {
                title: 'Total B-Files Sent',
                dataIndex: 'total_bfiles_sent',
                key: 'total_bfiles_sent'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data_agency = [];
        const data_lsp = [];

        for (let i=0; i < stats_agency.length; i++) {
            let stats = stats_agency[i];
            data_agency.push({
                key: i,
                agency_name: stats.agency_name,
                ea_name: stats.first_name+" "+stats.last_name,
                total_bfiles_sent: stats.bfile_count
            })
        }

        for (let i=0; i < stats_lsp.length; i++) {
            let stats = stats_lsp[i];
            data_lsp.push({
                key: i,
                agency_name: stats.agency_name,
                ea_name: stats.first_name+" "+stats.last_name,
                total_bfiles_sent: stats.bfile_count
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="area-chart" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Onboard Sent B-Files`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div>
                            <Button onClick={() => this.download_agency()}>
                                <Translate text={`Stats by Agency CSV`} />
                            </Button>
                            <Button onClick={() => this.download_lsp()}>
                                <Translate text={`Stats by LSP CSV`} />
                            </Button>
                        </div>
                    }
                >
                    <Card bordered={false}><h2><Translate text={`Stats by Agency`} /></h2></Card>
                    <Table
                        columns={columns}
                        dataSource={data_agency}
                        bordered={false}
                        pagination={false}
                    />
                    <Card bordered={false}><h2><Translate text={`Stats by LSP`} /></h2></Card>
                    <Table
                        columns={columns}
                        dataSource={data_lsp}
                        bordered={false}
                        pagination={false}
                    />
                </Card>
            </div>
        );

    }
}

export default OnboardSentBfiles;
