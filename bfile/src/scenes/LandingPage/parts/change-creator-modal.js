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
        bfile: this.props.bfile,
        user: this.props.user,
        users: [],
        agent: '',
    }
    componentDidMount = () => {
        const { bfile, user } = this.state;

        axios.get("/api/agency_associations/" + bfile.agency_id).then((res) => {
            let users = [];
            for(var i=0; i<res.data.length; i++) {
                let user = res.data[i];
                if (user.user_type === 'LSP' || user.user_type === 'EA') {
                    users.push({
                        name: user.first_name+" "+user.last_name,
                        id: user.id
                    });
                }
            }
            this.setState({
                loading: false,
                users
            });
        });
    }
    save = () => {
        const { bfile, user, agent } = this.state;

        if (agent === '') {
            message.error(F.translate(`Agent is required.`));

        } else {
            this.setState({ loading: true });
            axios.put("/api/b_file/" + bfile.id, { user_id: agent }).then((res) => {
                this.setState({ loading: false }, () => {
                    if (typeof this.props.refresh !== 'undefined') {
                        this.props.refresh();
                    } else {
                        this.props.history.push('/dashboard');
                    }
                });
            });
        }
    }
    render() {

        const { bfile, users, loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Change B-File Creator`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Change Creator`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Agent`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ agent: val})}>
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
