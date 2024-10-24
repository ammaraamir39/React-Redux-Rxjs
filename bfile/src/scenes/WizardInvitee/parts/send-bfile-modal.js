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
    Input,
    Tooltip,
    message
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';

const { TextArea } = Input;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        action: null,
        agent: null,
        notes: '',
        expiration_date: moment(new Date()).add(15, 'days'),
        financial_users: [],
        onboarding_users: []
    }
    componentDidMount = () => {
        const { wizard } = this.props;

        axios.get("/api/agency_associations/" + wizard.agency_id).then((res) => {
            const onboarding_users = [];
            const financial_users = [];
            for(var i=0; i<res.data.length; i++) {
                let user = res.data[i];
                if (user.user_type === 'EA') {
                    onboarding_users.push({
                        name: user.first_name+" "+user.last_name,
                        user_type: user.user_type,
                        id: user.id
                    });
                    financial_users.push({
                        name: user.first_name+" "+user.last_name,
                        user_type: user.user_type,
                        id: user.id
                    });
                }
                if (user.user_type === 'LSP' && user.jobs !== null && user.jobs !== '') {
                    const jobs = JSON.parse(user.jobs);
                    if (jobs.onboarding) {
                        onboarding_users.push({
                            name: user.first_name+" "+user.last_name,
                            user_type: user.user_type,
                            id: user.id
                        })
                    }
                    if (jobs.life_licensed) {
                        financial_users.push({
                            name: user.first_name+" "+user.last_name,
                            user_type: user.user_type,
                            id: user.id
                        })
                    }
                }
                if (user.user_type === 'EFS') {
                    financial_users.push({
                        name: user.first_name+" "+user.last_name,
                        user_type: user.user_type,
                        id: user.id
                    });
                }
            }
            onboarding_users.push(
                {
                    name: 'Virtual Onboarder',
                    id: 'Virtual Onboarder'
                }
            )
            this.setState({
                loading: false,
                onboarding_users,
                financial_users,
                agent: 'Virtual Onboarder'
            })
        });
    }
    send = () => {
        const { wizard, updateField, save, user } = this.props;
        const { agent, expiration_date, notes } = this.state;

        let has_error = false;

        if ((this.state.action === 1 || this.state.action === 2) && (agent === '' || agent === null)) {
            has_error = true;
            message.error("Who do you want to send to?");
            return false;
        }
        if ((this.state.action === 2 || this.state.action === 3) && (expiration_date === '' || expiration_date === null)) {
            has_error = true;
        }

        if (!has_error) {
            this.setState({ loading: true });
            updateField("is_saved_for_later", 0);

            if (this.state.action === 0) {
                updateField("status", "Renewal");
                updateField("archive", 1);
                updateField("is_renewal", 1);
            }
            if (this.state.action === 1) {
                updateField("financial_id", agent);
                updateField("need_attention", 1);
            }
            if (this.state.action === 2) {
                if (agent === "Virtual Onboarder") {
                    updateField("vonboard", 1);
                    updateField("is_onboarded", 1);
                    updateField("onboarder_id", user.id);
                    updateField("vo_sent_date", moment().utc().format('YYYY-MM-DD HH:mm:ss'));
                    updateField("expiration_date", moment(expiration_date).format("YYYY-MM-DD"));
                } else {
                    updateField("onboarding_id", agent);
                    updateField("onboarder_id", user.id);
                    updateField("is_onboarded", 1);
                    updateField("expiration_date", moment(expiration_date).format("YYYY-MM-DD"));
                }
            }
            if (this.state.action === 3) {
                updateField("vonboard", 1);
                updateField("is_onboarded", 1);
                updateField("onboarder_id", user.id);
                updateField("vo_sent_date", moment().utc().format('YYYY-MM-DD HH:mm:ss'));
                updateField("expiration_date", moment(expiration_date).format("YYYY-MM-DD"));
            }

            save((bfile) => {
                this.setState({ loading: false });
                if (notes !== null && notes !== '') {
                    axios.post("/api/bfile_notes", {
                        "bfile_id": bfile.id,
                        "note": notes,
                        "user_id": user.id
                    });
                }

                if (this.state.action === 1) {
                    axios.post("/api/need_attention", {
                        bfile_id: bfile.id,
                        sent_from: user.id,
                        user_id: agent,
                        note: notes
                    });
                    axios.post("/api/send_invite", {
                        bfile_id: bfile.id,
                        date_time: new Date().toUTCString(),
                        location: '',
                        type: "immediate-attention",
                        user_id: user.id
                    });
                }

                if (this.state.action === 3) {
                    axios.get("/api/get_mb_association").then((res) => {
                        if (res.data.assoc) {
                            axios.put("/api/b_file/"+bfile.id, {
                                vo_claim_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                                onboarder_id: res.data.assoc.id
                            });
                        }
                    })
                }
            })

        } else {
            message.error("Please fill all required fields.");
        }
    }
    disabledDate(current) {
        return current && current < moment().startOf('day');
    }
    render() {

        const { loading, action, financial_users, onboarding_users, expiration_date } = this.state;
        const { wizard, updateField } = this.props;

        let title = "Send B-File";
        //if (action === 1) title = "Send via Immediate Attention for Financial Review";
        if (action === 1) title = "Send For Follow Up";
        if (action === 2) title = "Send For Follow Up";
        if (action === 3) title = "Send to Virtual On-boarder";

        return (
            <div style={{marginBottom: 20}}>
                <Modal
                    title={<Translate text={title} />}
                    visible={this.props.showModal}
                    footer={null}
                    onCancel={this.props.hideModal}
                >
                    <Spin indicator={antIcon} spinning={loading}>
                        {action === null || action === 0 ? (
                            <div id="send_bfile_modal">
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <Tooltip placement="bottom" title={
                                            <div>
                                                <strong><Translate text={`Send For Follow Up`} /></strong><br/>
                                                <Translate text={`The next step in the B-File process is to send this customer over to the Agency Owner or designated agent in charge of thanking the customer for his/her business, and introducing him/her to a life & retirement specialist.`} />
                                            </div>
                                        }>
                                            <span className="ant-badge">
                                                <Button type="primary" className="actionbtn btn-blue" onClick={() => this.setState({ action: 2})}>
                                                    <Translate text={`Send For Follow Up`} />
                                                </Button>

                                                <sup data-show="true" className="ant-scroll-number ant-badge-count ant-badge-multiple-words" title="Recommended" style={{left:62,right:'inherit'}}><Translate text={`Recommended`} /></sup>
                                            </span>
                                        </Tooltip>
                                    </Col>
                                    {/* <Col md={12} span={24}>
                                        <Tooltip placement="bottom" title={
                                            <div>
                                                <strong><Translate text={`Send to Virtual On-boarder`} /></strong>
                                            </div>
                                        }>
                                            <span className="ant-badge">
                                                <Button type="primary" className="actionbtn btn-blue" onClick={() => this.setState({ action: 3})}>
                                                    <Translate text={`Send to Virtual On-boarder`} />
                                                </Button>

                                                <sup data-show="true" className="ant-scroll-number ant-badge-count ant-badge-multiple-words" title="Recommended" style={{left:62,right:'inherit'}}><Translate text={`Recommended`} /></sup>
                                            </span>
                                        </Tooltip>
                                    </Col> */}
                                    {/* <Col md={12} span={24}>
                                        <Tooltip placement="bottom" title={
                                            <div>
                                                <strong><Translate text={`Send via Immediate Attention for Financial Review`} /></strong><br/>
                                                <Translate text={`If the customer is in need of immediate assistance and wants to speak with someone regarding financial planning or life & retirement options, you can bypass the Welcome call and send the B-File customer directly to the Financial Specialist.`} />
                                            </div>
                                        }>
                                            <Button type="primary" className="actionbtn btn-gray" onClick={() => this.setState({ action: 1})}>
                                                <Translate text={`Send via Immediate Attention for Financial Review`} />
                                            </Button>
                                        </Tooltip>
                                    </Col> */}
                                    <Col md={12} span={24}>
                                        <Tooltip placement="bottom" title={
                                                <div>
                                                    <strong><Translate text={`No Follow-Up`} /></strong><br/>
                                                    <Translate text={`Using this function will bypass the B-File process and automatically put this customer in a renewal status. This is only recommended if the customer is a long term customer and has all his/her opportunities with the agency already.`} />
                                                </div>
                                            }>
                                            <Button type="primary" className="actionbtn btn-gray" onClick={() => this.setState({ action: 0}, () => {  this.send() })}>
                                                <Translate text={`No Follow-Up`} />
                                            </Button>
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}
                        {action === 1 || action === 2 || action === 3 ? (
                            <div className="formBox">
                                <div style={{marginBottom:20}}>
                                    <Button onClick={() => this.setState({ action: null })}><Icon type="arrow-left" /> <Translate text={`Back`} /></Button>
                                </div>
                                {action === 1 || action === 2 ? (
                                    <div style={{marginBottom:10}}>
                                        <label><Translate text={`Agent`} /></label>
                                        <Select value={this.state.agent} style={{ width: '100%' }} onChange={(val) => {
                                            var action = 2;
                                            for (let i = 0; i < financial_users.length; i++) {
                                                if (financial_users[i].id === val && financial_users[i].user_type === "EFS") {
                                                    action = 1;
                                                    break;
                                                }
                                                
                                            }
                                            this.setState({ agent: val, action })
                                        }}>
                                            <Option value={null}><Translate text={`Select`} />...</Option>
                                            {onboarding_users.map((user, i) => (
                                                <Option key={i} value={user.id}>{user.name}</Option>
                                            ))}
                                            {financial_users.map((user, i) => (
                                                <Option key={i} value={user.id}>{user.name}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                ) : null}
                                {action === 1 || action === 2 || action === 3 ? (
                                    <div style={{marginBottom:10}}>
                                        <label><Translate text={`Date to On-Board Customer`} /></label>
                                        <DatePicker
                                            format="MM/DD/YYYY"
                                            value={expiration_date}
                                            disabledDate={this.disabledDate}
                                            onChange={(val) => this.setState({ expiration_date: val })}
                                        />
                                    </div>
                                ) : null}
                                <div style={{marginBottom:10}}>
                                    <label><Translate text={`Notes`} /></label>
                                    <TextArea rows={4} onChange={(e) => this.setState({ notes: e.target.value })} />
                                </div>
                                <div className="right-align">
                                    <Button type="primary" onClick={this.send.bind(this)}><Translate text={`Send`} /></Button>
                                </div>
                            </div>
                        ) : null}
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default DashModal;
