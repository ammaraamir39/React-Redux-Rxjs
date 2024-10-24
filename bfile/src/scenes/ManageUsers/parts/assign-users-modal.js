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
    message,
    Switch
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
        agent: '',
    }
    componentDidMount = () => {
        this.load();
    }
    load = () => {
        this.setState({ loading: true });
        axios.get("/api/mb_associations/" + this.props.user.id).then((res) => {
            let users = [];
            for (let x in res.data) {
                const agency = res.data[x];
                for (let i=0; i < agency.length; i++) {
                    const u = agency[i];
                    users.push({
                        ...u,
                        name: u.first_name+" "+u.last_name
                    });
                }
            }
            this.setState({
                loading: false,
                users
            });
        });
    }
    updateAssoc = (checked, user_id) => {
        this.setState({
            loading: true
        })
        if (checked) {
            axios.post("/api/add_mb_association", {
                parent_id: this.props.user.id,
                child_id: user_id
            }).then(() => {
                this.setState({ loading: false })
                this.load();
            })
        } else {
            axios.post("/api/remove_mb_association", {
                parent_id: this.props.user.id,
                child_id: user_id
            }).then(() => {
                this.setState({ loading: false })
                this.load();
            })
        }
    }
    render() {
        const { users, loading } = this.state;
        const { user } = this.props;

        return (
            <Modal
                title={<Translate text={`Assign Users`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={<div>
                    <Button onClick={() => this.props.hideModal()}><Translate text={`Cancel`} /></Button>
                </div>}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            {users.map((u, i) => (
                                <div className="inputField" key={i}>
                                    <label>
                                        <Switch checked={u.checked} disabled={u.disabled} onChange={(checked) => {
                                            this.updateAssoc(checked, u.id)
                                        }} />
                                        <span style={{marginLeft:10}}>{u.name}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
