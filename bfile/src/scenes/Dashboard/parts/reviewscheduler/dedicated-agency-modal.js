import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Card,
    Modal,
    Select,
    Button,
    Spin
} from 'antd';
import axios from 'axios';
import { Translate } from 'react-translated';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: true,
        agencies: [],
        agency: ''
    }
    componentDidMount = () => {
        axios.get("/api/rs_agencies").then((res) => {
            this.setState({
                loading: false,
                agencies: res.data
            })
        });
        if ("rs_agency_id" in window.localStorage && window.localStorage.rs_agency_id !== "null" && window.localStorage.rs_agency_id !== "") {
            this.setState({
                agency: parseInt(window.localStorage.rs_agency_id)
            })
        }
    }
    agencySelect = (agency_id) => {
        this.props.hideModal();
        if (agency_id === '') {
            window.localStorage.rs_agency_id = "null";
        } else {
            window.localStorage.rs_agency_id = agency_id;
        }
        this.props.history.push('/dashboard');
    }
    render() {

        const { agencies, loading } = this.state;

        return (
            <div style={{marginBottom: 20}}>
                <Modal
                    title={<Translate text={`Dedicated Agency Dashboard`} />}
                    visible={this.props.showModal}
                    onOk={this.props.hideModal}
                    onCancel={this.props.hideModal}
                    footer={null}
                >
                    <Spin indicator={antIcon} spinning={loading}>
                        <Select value={this.state.agency} style={{ width: 220 }} onChange={(val) => {
                            this.agencySelect(val)
                        }}>
                            <Option value={''}><Translate text={`All Agencies`} /></Option>
                            {agencies.map((agency, i) => (
                                <Option key={i} value={agency.id}>{agency.name}</Option>
                            ))}
                        </Select>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default DashModal;
