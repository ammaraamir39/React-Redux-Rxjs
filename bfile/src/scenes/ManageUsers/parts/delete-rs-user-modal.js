import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Card,
    Modal,
    Select,
    Radio,
    Button,
    Spin,
    DatePicker,
    Checkbox,
    Input,
    message
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import F from '../../../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: true,
        users: [],
        agencies: [],
        from_agency: '',
        agent: '',
    }
    componentDidMount = () => {
        axios.get("/api/rs_agencies").then((res) => {
            this.setState({
                loading: false,
                agencies: res.data
            });
        });
        axios.get("/api/rs_users").then((res) => {
            this.setState({
                loading: false,
                users: res.data
            });
        });
    }
    save = () => {
        const { agent, from_agency, to_agency } = this.state;
        const { user } = this.props;

        if (from_agency !== '' && agent !== '') {
            this.setState({ loading: true });

            axios.post("/api/rs_transfer_bfiles", {
                user_id: user.id,
                new_user_id: agent,
                from_agency,
            }).then((res) => {
                this.props.hideModal();
                this.props.refresh();
                message.success(F.translate(`B-Files has been transfered successfully.`));
                this.setState({ loading: false });
            }).catch(() => {
                message.error(F.translate(`Can't transfer B-Files.`));
                this.setState({ loading: false });
            });
        } else {
            message.error(F.translate(`Please fill all required fields.`));
        }
    }
    render() {

        const { agencies, users, loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Transfer B-Files`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={<div>
                    <Button type="primary" onClick={() => this.save()}><Translate text={`Transfer B-Files`} /></Button>
                    <Button onClick={() => this.props.hideModal()}><Translate text={`Cancel`} /></Button>
                </div>}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{ marginBottom: 10 }}>
                            <label><Translate text={"Agency"} />*:</label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ from_agency: val })}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {agencies.map((agency, i) => (
                                    <Option key={i} value={agency.id}>{agency.name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label><Translate text={"User"} />*:</label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ agent: val })}>
                                <Option value={''}><Translate text={`Same User`} /></Option>
                                {users.map((user, i) => (
                                    <Option key={i} value={user.id}>{user.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
