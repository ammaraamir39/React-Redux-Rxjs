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
import F from '../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: true,
        users: [],
        from: '',
        to: ''
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        axios.get("/api/my_associations").then((res) => {
            let users = [];
            for (let x in res.data) {
                const agency = res.data[x];
                for (let i=0; i < agency.length; i++) {
                    const u = agency[i];
                    if (u.user_type === 'LSP') {
                        users.push({
                            name: u.first_name+" "+u.last_name,
                            id: u.id,
                            user_type: u.user_type
                        });
                    }
                }
            }
            this.setState({
                loading: false,
                users
            });
        });
    }
    save = (action) => {
        const { from, to } = this.state;
        const { user } = this.props;

        if (from === '' || to === '') {
            message.error(F.translate(`Please fill all fields.`));

        } else {
            this.setState({ loading: true });
            axios.post("/api/change_bfile_user", {
                user_id: from,
                new_user_id: to
            }).then(() => {
                this.setState({ loading: false });
                message.success(F.translate(`B-Files has been transferred successfully.`));
                this.props.hideModal();
            }).catch(() => {
                this.setState({ loading: false });
                message.error(F.translate(`Can't transfer B-Files.`));
            });
        }
    }
    render() {

        const { users, loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Transfer B-Files`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={<div>
                    <Button type="primary" onClick={() => this.save()}><Translate text={`Transfer Ownership`} /></Button>
                    <Button onClick={() => this.props.hideModal()}><Translate text={`Cancel`} /></Button>
                </div>}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`From`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ from: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {users.map((user, i) => (
                                    <Option key={i} value={user.id}>{user.name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{marginBottom:10}}>
                            <label>To</label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ to: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
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
