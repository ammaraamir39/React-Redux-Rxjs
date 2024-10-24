import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Tag,
    Input,
    Radio,
    Divider,
    DatePicker,
    Alert
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';

const RadioGroup = Radio.Group;

class Step extends Component {
    state = {
        loading: false,
        wizard: {
            id: '',
            bfile_id: 0,
            call_attempts: 0,
            call_reached_toggle: '',
            call_not_reached_toggle: '',
            call_continue: false,
            ok_time_toggle: '',
            good_time_call: ''
        }
    }
    componentDidMount = () => {
        const bfile = this.props.wizard;
        let wizard = this.state.wizard;

        if (bfile.questions.length > 0) {
            const onboarding = bfile.questions[0];
            wizard = {
                id: onboarding.id,
                bfile_id: onboarding.bfile_id,
                call_attempts: onboarding.call_attempts,
                call_reached_toggle: onboarding.call_reached_toggle,
                call_not_reached_toggle: '',
                call_continue: false,
                ok_time_toggle: onboarding.ok_time_toggle,
                good_time_call: ''
            };

            if (wizard.call_attempts > 0 && wizard.call_attempts % 3 === 0 && wizard.call_reached_toggle !== '1') {
                wizard.call_continue = true;
            } else {
                wizard.call_continue = false;
            }
        } else {
            wizard.bfile_id = bfile.id;
        }

        this.setState({ wizard });
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    disabledDate = (current) => {
        return current && current < moment().add(-1, 'days');
    }
    disabledDateTime = () => {
        return {
            disabledHours: () => this.range(0, 6),
            //disabledMinutes: () => this.range(30, 60)
        };
    }
    updateField = (name, value) => {
        const { wizard } = this.state;
        wizard[name] = value;

        this.setState(wizard, () => {
            if (name === 'ok_time_toggle' && value === '1') {
                this.ok_time_yes();
            }
        });
    }
    continue = (e) => {
        const { user } = this.props;
        const wizard = this.state.wizard;
        const bfile = this.props.wizard;

        if (e.target.value === '1') {
            this.updateField('call_continue', false);
        } else {

            this.setState({ loading: true });

            let ajax = null;
            if (user.user_type == "VONBOARDER") {
                ajax = axios.put("/api/b_file/" + bfile.id, {
                    vob_attempted: 1,
                    vob_archived: 1
                });
            } else {
                ajax = axios.put("/api/b_file/" + bfile.id, {
                    archive: 1,
                    status: 'Renewal'
                });
            }

            ajax.then((res) => {
                this.setState({ loading: false }, () => {
                    this.props.history.push('/dashboard');
                });
            })
        }
    }
    ok_time = (val) => {
        const { user } = this.props;
        const wizard = this.state.wizard;
        const bfile = this.props.wizard;

        val = new Date(val);
        let data = {
            bfile_id: bfile.id,
            call_attempts: wizard.call_attempts + 1,
            call_reached_toggle: wizard.call_reached_toggle,
            ok_time_toggle: wizard.ok_time_toggle,
            good_time_call: val.toUTCString(),
            was_invite_sent: false
        };
        let bfile_data = {attempts: wizard.call_attempts + 1};

        this.setState({ loading: true });

        if (wizard.id === '') data.user_id = user.id;

        axios.put("/api/b_file/" + bfile.id, bfile_data);

        if (wizard.ok_time_toggle === '0') {
            axios.post("/api/bfile_notes", {
                bfile_id: bfile.id,
                note: "Call # Reached - Call Back Later (" + moment(wizard.good_time_call).format('MM/DD/YYYY hh:mmA') + ")",
                user_id: user.id
            });
            axios.post("/api/appointment", {
                appointment_date_time: moment(val, 'MM/DD/YYYY h:mm a').format('YYYY-MM-DDTHH:mm:ss'),
                created_by: user.id,
                bfile_id: bfile.id
            });
            axios.post("/api/send_invite", {
                "bfile_id": bfile.id,
                "date_time": val.toUTCString(),
                "location": "",
                "type": "call-back-later",
                "user_id": user.id
            });
            data.was_invite_sent = true;
        }
        let ajax = null;
        if (wizard.id !== '') {
            ajax = axios.put("/api/ea_questions/" + wizard.id, data);
        } else {
            ajax = axios.post("/api/ea_questions", data);
        }

        ajax.then((res) => {
            this.setState({ loading: false }, () => {
                this.props.history.push('/dashboard');
            });
        })

    }
    ok_time_yes = () => {
        const { user } = this.props;
        const wizard = this.state.wizard;
        const bfile = this.props.wizard;

        let data = {
            bfile_id: bfile.id,
            call_reached_toggle: wizard.call_reached_toggle,
            ok_time_toggle: wizard.ok_time_toggle,
            was_invite_sent: false
        };
        this.setState({ loading: true });

        if (wizard.id === '') data.user_id = user.id;

        let ajax = null;
        if (wizard.id !== '') {
            ajax = axios.put("/api/ea_questions/" + wizard.id, data);
        } else {
            ajax = axios.post("/api/ea_questions", data);
        }

        ajax.then((res) => {
            this.setState({ loading: false }, () => {
                this.props.updateField("stepIndex", 1);
            });
        }).catch(() => {
            this.props.updateField("stepIndex", 1);
        })

    }
    not_reached = (val) => {
        const { user } = this.props;
        const wizard = this.state.wizard;
        const bfile = this.props.wizard;

        this.setState({ loading: true });

        let call_not_reached_val = "No Answer";
        if (val === '0') {
            call_not_reached_val = "Left Message";
        }

        const call_not_reached_note = "Call #" + (wizard.call_attempts + 1) +" Not Reached - " + call_not_reached_val;

        let ajax = null;
        if (wizard.id !== '') {
            ajax = axios.put('/api/ea_questions/' + wizard.id, {
                call_attempts: wizard.call_attempts + 1
            });
        } else {
            ajax = axios.post('/api/ea_questions', {
                bfile_id: bfile.id,
                call_attempts: wizard.call_attempts + 1,
                was_invite_sent: false
            });
        }
        ajax.then((res) => {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": call_not_reached_note,
                "user_id": user.id
            });

            let ajax2 = null;
            if (user.user_type == "VONBOARDER") {
                ajax2 = axios.put("/api/b_file/" + bfile.id, {
                    attempts: (parseInt(bfile.attempts, 10) + 1),
                    vob_attempted: 1
                });
            } else {
                ajax2 = axios.put("/api/b_file/" + bfile.id, {
                    attempts: (parseInt(bfile.attempts, 10) + 1)
                });
            }

            ajax2.then(() => {
                this.setState({ loading: false });

                axios.get("/api/user_need_attention").then((res) => {
                    for(let i = 0; i < res.data.length; i++) {
                        if (res.data[i].bfile_id === bfile.id) {
                            axios.delete("/api/need_attention/" + res.data[i].id);
                        }
                    }
                });

                this.props.history.push('/dashboard');
            });
        })


    }
    render() {

        const updateField = this.updateField;
        const bfile = this.props.wizard;
        const wizard = this.state.wizard;

        if (wizard.bfile_id === 0) {
            return null;
        }

        let onboarding_name = bfile.user.first_name+' '+bfile.user.last_name;
        if (bfile.onboarding_id) {
            onboarding_name = bfile.onboarding_user.first_name+' '+bfile.onboarding_user.last_name;
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={<div>P&C Renewal Conversation</div>}>
                    <div>
                        <Card title={"Call #" + (wizard.call_attempts+1) + " Reached?"} className="wizardBox center-align" type="inner">
                            {wizard.call_continue === true ? (
                                <div>
                                    <Card title={`You've tried 3 attempts to contact this customer. Do you want to keep trying?`} className="center-align">
                                        <Alert message={<div><strong>Hint:</strong> Look at the profile and determine if you want to keep pursuing this customer.</div>} type="info" style={{marginBottom:20}} />
                                        <RadioGroup defaultValue={''} onChange={this.continue.bind(this)}>
                                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> Yes</Radio>
                                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> No</Radio>
                                        </RadioGroup>
                                    </Card>
                                </div>
                            ) : (
                                <div>
                                    <RadioGroup defaultValue={wizard.call_reached_toggle} onChange={(e) => updateField('call_reached_toggle', e.target.value)}>
                                        <Radio className="btnYes" value="1"><Icon type="check" style={{marginRight:10,color:"#388E3C"}} /> Reached</Radio>
                                        <Radio className="btnNo" value="0"><Icon type="close" style={{marginRight:10,color:"#FF3D00"}} /> Not Reached</Radio>
                                    </RadioGroup>
                                    {wizard.call_reached_toggle === '0' ? (
                                        <div>
                                            <Divider />
                                            <div className="center-align">
                                                <RadioGroup defaultValue={wizard.call_not_reached_toggle} onChange={(e) => this.not_reached(e.target.value)}>
                                                    <Radio className="btnYes" value="1">No Answer</Radio>
                                                    <Radio className="btnNo" value="0">Left Message</Radio>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {wizard.call_reached_toggle === '1' ? (
                                <div>
                                    <Card className="wizardBox center-align" bordered={false}>
                                        <div className="script_text">
                                            {`Hello Mr./Mrs. ${bfile.first_name+' '+bfile.last_name}. This is ${onboarding_name} calling from ${bfile.agency.name}. How are you today?`}
                                        </div>
                                    </Card>
                                    <Card title={`"Did I catch you at an OK time?"`} type="inner" className="wizardBox center-align">
                                        <RadioGroup defaultValue={wizard.ok_time_toggle} onChange={(e) => updateField('ok_time_toggle', e.target.value)}>
                                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> Yes</Radio>
                                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> No</Radio>
                                        </RadioGroup>
                                    </Card>
                                    {wizard.ok_time_toggle === '0' ? (
                                        <Card title={`"No problem. When is a good time for me to call you back?"`} type="inner" className="wizardBox center-align">
                                            <DatePicker
                                                format="MM/DD/YYYY HH:mm"
                                                disabledDate={this.disabledDate}
                                                //disabledTime={this.disabledDateTime}
                                                showTime={{
                                                    defaultValue: moment('10:00:00', 'h:mm:ss'),
                                                    use12Hours: true,
                                                    disabledSeconds: () => {
                                                        return this.range(0, 60)
                                                    },
                                                    hideDisabledOptions: true
                                                }}
                                                onChange={(val) => updateField('good_time_call', val)}
                                                onOk={() => this.ok_time(wizard.good_time_call)}
                                            />
                                        </Card>
                                    ) : null}
                                </div>
                            ) : null}
                        </Card>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
