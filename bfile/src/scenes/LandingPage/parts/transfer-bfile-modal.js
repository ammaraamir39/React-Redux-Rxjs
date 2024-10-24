import React, { Component } from 'react';
import {
    Icon,
    Modal,
    Select,
    Radio,
    Spin,
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
        can_onboard: false,
        can_do_financial: false,
        note: '',
        action: '',
        agree: false
    }
    componentDidMount = () => {
        const { bfile, user } = this.state;

        axios.get("/api/agency_associations/" + bfile.agency_id).then((res) => {
            let users = [];

            for(var i=0; i<res.data.length; i++) {
                let user = res.data[i];
                user.can_onboard = false;
                user.can_do_financial = false;

                if (user.user_type === 'LSP' && user.jobs !== null && user.jobs !== '') {
                    const jobs = JSON.parse(user.jobs);
                    if (jobs.onboarding) {
                        user.can_onboard = true;
                    }
                    if (jobs.life_licensed) {
                        user.can_do_financial = true;
                    }
                }
                if (user.user_type === 'EA') {
                    user.can_onboard = true;
                    user.can_do_financial = true;
                }
                if (user.user_type === 'EFS') {
                    user.can_do_financial = true;
                }

                if (this.props.user.user_type !== 'EFS') {
                    users.push({
                        name: user.first_name+" "+user.last_name,
                        id: user.id,
                        can_onboard: user.can_onboard,
                        can_do_financial: user.can_do_financial
                    });
                } else {
                    if (user.can_do_financial) {
                        users.push({
                            name: user.first_name+" "+user.last_name,
                            id: user.id,
                            can_onboard: false,
                            can_do_financial: user.can_do_financial
                        });
                    }   
                }
            }

            if (this.props.user.user_type !== 'EFS') {
                if (bfile.agency.vonboard === 1) {
                    if (user.user_type === "EA" || user.user_type === "LSP") {
                        users.push({
                            name: "Send to Virtual Onboarding",
                            id: 0,
                            can_onboard: false,
                            can_do_financial: false
                        })
                    }
                }
            }

            this.setState({
                loading: false,
                users
            });
        });
    }
    save = () => {
        const { bfile, user, agent, action, note } = this.state;

        if (this.state.action === 'life_licensed' && this.state.agree === false)  {
            message.error(F.translate(`Please confirm first.`));
        } else {

            let data = {};

            if (agent === "") {
                message.error(F.translate(`Please fill all fields.`));
            } else if (action === "" && (this.state.can_onboard || this.state.can_do_financial)) {
                message.error(F.translate(`Please fill all fields.`));
            } else {

                this.setState({ loading: true });

                if (agent !== 0) {
                    if (action === "onboarding") {
                        data.onboarding_id = agent;
                        data.expiration_date = bfile.expiration_date;
                    }
                    if (action === "life_licensed") {
                        data.financial_id = agent;
                        data.need_attention = 1;
                    }
                    data.vonboard = 0;
                } else {
                    data.onboarding_id = null;
                    data.vonboard = 1;
                    data.vo_sent_date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
                    data.vo_claim_date = null;
                }

                if (note !== '') {
                    axios.post("/api/bfile_notes", {
                        bfile_id: bfile.id,
                        note: note,
                        user_id: user.id
                    });
                }

                if (action === 'life_licensed') {
                    if (bfile.questions.length  > 0) {
                        axios.put("/api/ea_questions/" + bfile.questions[0].id, { skip: 1});
                    } else {
                        axios.post("/api/ea_questions", {
                            bfile_id: bfile.id,
                            user_id: user.id,
                            skip: 1
                        });
                    }
                    axios.post("/api/need_attention", {
                        bfile_id: bfile.id,
                        user_id: agent,
                        sent_from: user.id,
                        note: note
                    });
                }

                axios.get("/api/user_need_attention").then((res) => {
                    for (let i=0; i < res.data.length; i++) {
                        if (res.data[i].bfile_id == bfile.id) {
                            axios.delete("/api/need_attention/"+ res.data[i].id);
                        }
                    }
                });

                axios.put("/api/b_file/" + bfile.id, data).then((res) => {
                    this.setState({ loading: true }, () => {
                        if (typeof this.props.refresh !== 'undefined') {
                            this.props.refresh();
                        } else {
                            this.props.history.push('/dashboard');
                        }
                    });
                });
            }
        }
    }
    render() {

        const { bfile, users, loading, action } = this.state;

        return (
            <Modal
                title={<Translate text={`Transfer B-File`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Send`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Agent`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => {
                                const index = users.findIndex(item => item.id === val);
                                let user = {
                                    id: '',
                                    can_onboard: false,
                                    can_do_financial: false
                                }
                                if (index >= 0) {
                                    user = users[index];
                                }
                                this.setState({
                                    agent: user.id,
                                    can_onboard: user.can_onboard,
                                    can_do_financial: user.can_do_financial,
                                    action: '',
                                    agree: false
                                })
                            }}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {users.map((user, i) => (
                                    <Option key={i} value={user.id}>{user.name}</Option>
                                ))}
                            </Select>
                        </div>

                        {this.state.agent !== '' && (this.state.can_onboard || this.state.can_do_financial) ? (
                            <div style={{marginBottom:10}}>
                                <RadioGroup value={action} onChange={(e) => this.setState({ action: e.target.value, agree: false })}>
                                    {this.state.can_onboard ? (
                                        <Radio value="onboarding"><Translate text={`Welcome Call/Thank You Call`} /></Radio>
                                    ) : null}
                                    {this.state.can_do_financial ? (
                                        <Radio value="life_licensed"><Translate text={`Life & Retirement Conversation`} /></Radio>
                                    ) : null}
                                    {this.state.can_onboard ? (
                                        <Radio value="renewal_call"><Translate text={`Renewal Call`} /></Radio>
                                    ) : null}
                                    {this.state.can_onboard ? (
                                        <Radio value="scheduled_call"><Translate text={`Scheduled Call`} /></Radio>
                                    ) : null}
                                </RadioGroup>
                            </div>
                        ) : null}

                        {this.state.action === 'life_licensed' ? (
                            <div style={{marginBottom:10}}>
                                <Checkbox checked={this.state.agree} onChange={(e) => this.setState({ agree: e.target.checked })}>
                                    <Translate text={`I understand that I am skipping the Welcome Call`} />
                                </Checkbox>
                            </div>
                        ) : null}
                        <div>
                            <label><Translate text={`Note`} /></label>
                            <TextArea rows={4} onChange={(e) => this.setState({ note: e.target.value })} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;