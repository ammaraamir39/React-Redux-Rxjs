import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    Select,
    message,
    DatePicker
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

const Option = Select.Option;

class RSUpload extends Component {
    state = {
        loading: false,
        agency_id: null,
        ready: false,
        date: null,
        agencies: [],
        bfiles: [],
        ids: []
    }
    componentDidMount = () => {
        axios.get("/api/rs_all_agencies").then((res) => {
            this.setState({
                agencies: res.data
            })
        })
    }
    search = () => {
        this.loadBFiles();
    }
    loadBFiles = () => {
        const { agency_id, date} = this.state;
        this.setState({
            loading: true,
            ready: true 
        });
        axios.post("/api/get_rs_bfiles", {
            agency_id,
            date: moment(new Date(date)).format("YYYY-MM-DD")
        }).then((res) => {
            this.setState({
                loading: false,
                bfiles: res.data.bfiles,
            });
        });
    }
    deleteAll = () => {
        this.setState({ loading: true });
        if (this.state.ids.length > 0) {
            axios.post("/api/delete_rs_bfiles_ids", { ids: this.state.ids.join(",") }).then((res) => {
                this.setState({ loading: false, ids: [] });
                if (res.data.success) {
                    message.success(F.translate(`Bfiles has been deleted successfully.`));
                    this.loadBFiles();
                } else {
                    message.error(F.translate(`Can't delete bfiles.`));
                }
            });
        } else {
            message.error(F.translate(`Please select at least one bfile.`));
        }
    }
    render() {

        const { loading, bfiles } = this.state;

        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
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
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < bfiles.length; i++) {
            let bfile = bfiles[i];

            data.push({
                key: i,
                date: moment(new Date(bfile.created_on)).format("MM/DD/YYYY hh:mmA"),
                id: bfile.id,
                first_name: bfile.first_name || '-',
                last_name: bfile.last_name || '-',
                email: bfile.email || '-',
                phone: F.phone_format(bfile.phone) || '-'
            })
        }

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                var ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    const item = selectedRows[i];
                    ids.push(item.id);
                }
                this.setState({
                    ids
                })
            },
            getCheckboxProps: (record) => ({
                name: record.name,
            }),
        };

        return (
            <div>
                <Card bordered={false} className="filters">
                    <Row gutter={16}>
                        <Col md={10} span={24}>
                            <Select value={this.state.agency_id} style={{ width: '100%' }} onChange={(value) => this.setState({ agency_id: value })}>
                                <Option value={null}>{"Select agency..."}</Option>
                                {this.state.agencies.map((agency) => (
                                    <Option key={agency.id} value={agency.id}>{agency.name}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col md={10} span={24}>
                            <DatePicker
                                value={this.state.date}
                                style={{ width: '100%' }}
                                onChange={(date) => this.setState({ date })}
                                format={"MM/DD/YYYY"}
                            />
                        </Col>
                        <Col md={4} span={24}>
                            <Button onClick={() => this.search()}>Search</Button>
                        </Col>
                    </Row>
                </Card>

                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="team" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`RS Upload`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Button onClick={() => this.deleteAll()}>
                            <Translate text={`Delete`} />
                        </Button>
                    }
                >
                    {this.state.agency_id && this.state.date && this.state.ready ? (
                        <Table
                            rowSelection={{
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={data}
                            bordered={false}
                            pagination={false}
                        />
                    ) : (
                        <p style={{padding: 22}}>Select an agency and upload date</p>
                    )}
                </Card>
            </div>
        );

    }
}

export default RSUpload;
