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
        agent: '',
    }
    componentDidMount = () => {
        axios.get("/api/my_associations").then((res) => {
            let users = [];
            for (let x in res.data) {
                const agency = res.data[x];
                for (let i=0; i < agency.length; i++) {
                    const u = agency[i];
                    users.push({
                        name: u.first_name+" "+u.last_name,
                        id: u.id,
                        user_type: u.user_type
                    });
                }
            }
            this.setState({
                loading: false,
                users
            });
        });
    }
    save = (action) => {
        const { agent } = this.state;
        const { user } = this.props;

        if (action === 1 && agent === '') {
            message.error(F.translate(`User is required.`));

        } else {
            this.setState({ loading: true });

            if (action === 1) {
                axios.post("/api/change_bfile_user_efs", {
                    user_id: user.id,
                    new_user_id: agent
                }).then((res) => {
                    let ajax = null;
                    if (user.user_type === 'EFS') {
                        ajax = axios.delete("/api/unlink_user/" + user.id);
                    }
                    if (user.user_type === 'LSP') {
                        ajax = axios.put("/api/users/" + user.id, { active: 0 });
                    }
                    if (ajax) {
                        ajax.then((res) => {
                            this.props.hideModal();
                            this.props.refresh();
                            message.success(F.translate(`User has been unlinked successfully.`));
                            this.setState({ loading: false });
                        }).catch(() => {
                            message.error(F.translate(`Can't unlink the user.`));
                            this.setState({ loading: false });
                        })
                    } else {
                        message.error(F.translate(`Can't unlink the user.`));
                    }
                }).catch(() => {
                    message.error(F.translate(`Can't transfer B-Files.`));
                    this.setState({ loading: false });
                });
            } else if (action === 2) {
                let ajax = null;
                if (user.user_type === 'EFS') {
                    ajax = axios.delete("/api/unlink_user/" + user.id);
                }
                if (user.user_type === 'LSP' || user.user_type === 'AGENCY_MANAGER') {
                    ajax = axios.put("/api/users/" + user.id, { active: 0 });
                }
                if (ajax) {
                    ajax.then((res) => {
                        this.props.hideModal();
                        this.props.refresh();
                        user.user_type === 'AGENCY_MANAGER' || user.user_type === 'LSP' ? 
                            message.success(F.translate(`User has been disabled successfully.`)) : 
                        message.success(F.translate(`User has been unlinked successfully.`));
                        this.setState({ loading: false });
                    }).catch(() => {
                        message.error(F.translate(`Can't disable the user.`));
                        this.setState({ loading: false });
                    })
                } else {
                    message.error(F.translate(`Can't unlink the user.`));
                }
            } else {
                message.error(F.translate(`Action not found.`));
            }
        }
    }
    render() {

        const { users, loading } = this.state;
        const { user } = this.props;
        const users_list = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i].user_type === user.user_type) {
                users_list.push(users[i]);
            }
        }

        return (
            <Modal
                title={<Translate text={this.props.user.user_type === 'AGENCY_MANAGER' ? `Disable User` : `Unlink User`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={this.props.user.user_type === 'AGENCY_MANAGER'? (
                <div>
                    <Button type="primary" onClick={() => this.save(2)}><Translate text={`Disable User`} /></Button>
                  
                    <Button onClick={() => this.props.hideModal()}><Translate text={`Cancel`} /></Button>
                </div>
               ) : (
                <div>
                    <Button type="primary" onClick={() => this.save(1)}><Translate text={`Transfer Ownership`} /></Button>
                    <Button type="primary" onClick={() => this.save(2)}><Translate text={`Don't Transfer B-Files`} /></Button>
                    <Button onClick={() => this.props.hideModal()}><Translate text={`Cancel`} /></Button>
                </div>
                )}
            >
                {
                    user.user_type === 'AGENCY_MANAGER' ? (
                        <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={'Are you sure you want to disable the user ?'} /></label>
                      
                        </div>
                    </div>
                    ):(
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={user.user_type} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ agent: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {users_list.map((user, i) => (
                                    <Option key={i} value={user.id}>{user.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Spin>
                    )
                }
            </Modal>
        )
    }
}

export default DashModal;
