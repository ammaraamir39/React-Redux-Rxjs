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
    Checkbox,
    Alert
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';
import DatePicker from 'react-datepicker';

import SP500 from '../../Wizard/parts/images/sandp.png';
import VIP from '../../Wizard/parts/images/vip.png';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Step extends Component {
    state = {
        loading: false
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
    continue = (e) => {
        const { bfile, user } = this.props;

        if (e.target.value === '1') {
            this.props.updateField('call_continue', false);
        } else {

            this.setState({ loading: true });

            axios.put("/api/b_file/" + bfile.id, {
                archive: 1,
                status: 'Renewal'
            }).then((res) => {
                this.setState({ loading: false }, () => {
                    this.props.history.push('/dashboard');
                });
            })
        }
    }
    ok_time = (val) => {
        const { bfile, wizard, user } = this.props;
        val = new Date(val);
        let data = {
            bfile_id: bfile.id,
            call_attempts: wizard.call_attempts + 1,
            call_reached_toggle: wizard.call_reached_toggle,
            ok_time_toggle: wizard.ok_time_toggle,
            good_time_call: val.toUTCString()
        };

        this.setState({ loading: true });

        if (data.user_id === null) {
            if (bfile.questions.length > 0 && bfile.questions[0].financial_conversion_specialist !== null) {
                data.user_id = bfile.questions[0].financial_conversion_specialist;
            } else {
                data.user_id = user.id;
            }
        }

        let bfile_data = {
            sp_500: wizard.sp_500,
            vip: wizard.vip
        };
        axios.put("/api/b_file/" + bfile.id, bfile_data);

        axios.get("/api/user_need_attention").then((res) => {
            for(let i = 0; i < res.data.length; i++) {
                if (res.data[i].bfile_id === bfile.id) {
                    axios.delete("/api/need_attention/" + res.data[i].id);
                }
            }
        });

        if (wizard.ok_time_toggle === '0') {
            axios.post("/api/bfile_notes", {
                bfile_id: bfile.id,
                note: "Call " + (wizard.call_attempts + 1) + " Reached - Call Back Later (" + moment(wizard.good_time_call).format('MM/DD/YYYY hh:mmA') + ")",
                user_id: user.id
            });
            axios.post("/api/send_invite", {
                "bfile_id": bfile.id,
                "date_time": val.toUTCString(),
                "location": "",
                "type": "call-back-later",
                "user_id": user.id
            });
        }

        if (wizard.notes !== null && wizard.notes !== '') {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": wizard.notes,
                "user_id": user.id
            });
        }

        let ajax = null;
        if (wizard.id !== '') {
            ajax = axios.put("/api/financial_conversions/" + wizard.id, data);
        } else {
            ajax = axios.post("/api/financial_conversions", data);
        }

        ajax.then((res) => {
            this.setState({ loading: false }, () => {
                this.props.history.push('/dashboard');
            });
        })

    }
    not_reached = (val) => {
        const { wizard, bfile, user } = this.props;

        this.setState({ loading: true });

        let call_not_reached_val = "No Answer";
        if (val === '0') {
            call_not_reached_val = "Left Message";
        }

        const call_not_reached_note = "Call #" + (wizard.call_attempts + 1) +" Not Reached - " + call_not_reached_val;

        let ajax = null;
        if (wizard.id !== '') {
            ajax = axios.put('/api/financial_conversions/' + wizard.id, {
                call_attempts: wizard.call_attempts + 1
            });
        } else {
            ajax = axios.post('/api/financial_conversions', {
                bfile_id: bfile.id,
                call_attempts: wizard.call_attempts + 1
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

        const { loading } = this.state;
        const { wizard, bfile, updateField, user } = this.props;

        if (bfile.onboarding_user === null) {
            bfile.onboarding_user = {
                first_name: user.first_name,
                last_name: user.last_name
            }
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                        <div>
                            <Translate text={`Continuing the Journey as the Trusted Advisor`} />
                        </div>
                    }
                    loading={loading || !wizard.ready}
                >
                    {wizard.ready ? (
                        <div>
                            <Card title={<Translate text={`Call #{count} Reached?`} data={{count: wizard.call_attempts+1}} />} className="wizardBox center-align" type="inner">
                                {wizard.call_continue === true ? (
                                    <div>
                                        <Card title={<Translate text={`You've tried 3 attempts to contact this customer. Do you want to keep trying?`} />} className="center-align">

                                            <Alert message={<div><Translate text={`Hint: Look at the profile and determine if you want to keep pursuing this customer.`} /></div>} type="info" style={{marginBottom:20}} />

                                            <RadioGroup defaultValue={''} onChange={this.continue.bind(this)}>
                                                <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </Card>
                                    </div>
                                ) : (
                                    <div>
                                        <RadioGroup defaultValue={wizard.call_reached_toggle} onChange={(e) => updateField('call_reached_toggle', e.target.value)}>
                                            <Radio className="btnYes" value="1"><Icon type="check" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Reached`} /></Radio>
                                            <Radio className="btnNo" value="0"><Icon type="close" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`Not Reached`} /></Radio>
                                        </RadioGroup>
                                        {wizard.call_reached_toggle === '0' ? (
                                            <div>
                                                <Divider />
                                                <div className="center-align">
                                                    <RadioGroup defaultValue={wizard.call_not_reached_toggle} onChange={(e) => this.not_reached(e.target.value)}>
                                                        <Radio className="btnYes" value="1"><Translate text={`No Answer`} /></Radio>
                                                        <Radio className="btnNo" value="0"><Translate text={`Left Message`} /></Radio>
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
                                                <Translate text={`"Hello Mr./Mrs. {customer_name}. This is {ea_name} calling from {agency_name}. How are you today?"`} data={{
                                                    customer_name: bfile.first_name + ' ' + bfile.last_name,
                                                    ea_name: bfile.onboarding_user.first_name + ' ' + bfile.onboarding_user.last_name,
                                                    agency_name: bfile.agency.name
                                                }} />
                                            </div>
                                        </Card>
                                        <Card title={<Translate text={`"Did I catch you at an OK time?"`} />} type="inner" className="wizardBox center-align">
                                            <RadioGroup value={wizard.ok_time_toggle} onChange={(e) => updateField('ok_time_toggle', e.target.value)}>
                                                <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </Card>
                                        {wizard.ok_time_toggle === '0' ? (
                                            <Card title={<Translate text={`"No problem. When is a good time for me to call you back?"`} />} type="inner" className="wizardBox center-align">
                                                <DatePicker
                                                    dateFormat="MM/dd/yyyy h:mm aa"
                                                    showTimeSelect
                                                    timeIntervals={15}
                                                    timeFormat="hh:mm aa"
                                                    selected={
                                                        (wizard.good_time_call && wizard.good_time_call !== "")
                                                        ? new Date(wizard.good_time_call)
                                                        : null
                                                    }
                                                    shouldCloseOnSelect={false}
                                                    onChange={(val) => {
                                                        const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                                        updateField('good_time_call', date)
                                                    }}
                                                    onBlur={() => {
                                                        if (wizard.good_time_call && wizard.good_time_call !== "") {
                                                            this.ok_time(wizard.good_time_call);
                                                        }
                                                    }}
                                                />
                                            </Card>
                                        ) : null}
                                    </div>
                                ) : null}
                            </Card>

                            <Card title={<Translate text={`Notes`} />} className="wizardBox center-align" type="inner">
                                <TextArea rows={4} onChange={(e) => updateField('notes', e.target.value)} />
                            </Card>
                            <Card className="wizardBox center-align" bordered={false} type="inner" style={{padding:0}}>
                                <div className="radioIcons" style={{maxWidth:350,margin:'0 auto'}}>
                                    <Row gutter={16}>
                                        <Col md={12} span={24}>
                                            <Checkbox checked={(wizard.sp_500) ? true : false} onChange={(e) => updateField('sp_500', (e.target.checked) ? 1 : 0)}>
                                                <div className="radioIconOption">
                                                    <div className="icon"><img src={SP500} alt="S&P 500" /></div>
                                                    <div className="title"><Translate text={`S&P 500`} /></div>
                                                </div>
                                            </Checkbox>
                                        </Col>
                                        <Col md={12} span={24}>
                                            <Checkbox checked={(wizard.vip) ? true : false} onChange={(e) => updateField('vip', (e.target.checked) ? 1 : 0)}>
                                                <div className="radioIconOption">
                                                    <div className="icon"><img src={VIP} alt="VIP" /></div>
                                                    <div className="title"><Translate text={`VIP`} /></div>
                                                </div>
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className="wizardBox center-align didYouKnowBox" type="inner">
                                <h2><Translate text={`DID YOU KNOW`} /></h2>
                                <p><Translate text={`Always ask "Did I catch you at an OK time"`} /></p>
                            </Card>
                        </div>
                    ) : null}
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
