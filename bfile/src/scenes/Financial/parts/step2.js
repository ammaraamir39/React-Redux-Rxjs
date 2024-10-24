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
    Rate
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';
import DatePicker from 'react-datepicker';

const RadioGroup = Radio.Group;

class Step extends Component {
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
    render() {

        const { wizard, bfile, updateField, user } = this.props;

        let onboarding_name = bfile.user.first_name+' '+bfile.user.last_name;
        if (bfile.onboarding_id) {
            onboarding_name = bfile.onboarding_user.first_name+' '+bfile.onboarding_user.last_name;
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Introduction to Financial Services`} />
                    </div>
                }>
                    {wizard.financial_script === 0 ? (
                        <div>
                            <p><Translate text={`I believe you spoke with {ea_name} from our agency the other day and he/she wanted me to contact you to schedule a time for us to get together and perform a complimentary Life Insurance review.`} data={{ea_name: onboarding_name}} /></p>
                            <p><Translate text={`My notes indicate`} /></p>
                            <p style={{fontSize:16, background:'#009688', color:'#FFF', padding:10 }}>
                                <Icon type="arrow-left" style={{color:"#FFF", marginRight: 10}} />
                                <Translate text={`See Profile Data`} />
                            </p>
                            <p><Translate text={`Our agency's commitment is to become your trusted advisor. I'd like to schedule a meeting at your convenience to introduce myself and educate you on Life Insurance Strategies.`} /></p>
                            <p><Translate text={`Would you prefer a day or evening appointment?`} /></p>
                        </div>
                    ) : null}

                    {wizard.financial_script === 1 ? (
                        <div>
                            <p><Translate text={`I believe you spoke with {ea_name} from our agency the other day and he/she wanted me to contact you to schedule a time for us to get together and perform a complimentary Retirement review.`} data={{ea_name: onboarding_name}} /></p>

                            <p><Translate text={`My notes indicate`} />:</p>
                            <p style={{fontSize:16, background:'#009688', color:'#FFF', padding:10 }}>
                                <Icon type="arrow-left" style={{color:"#FFF", marginRight: 10}} />
                                <Translate text={`See Profile Data`} />
                            </p>
                            <p><Translate text={`Our agency's commitment is to become your trusted advisor. I'd like to schedule a meeting at your convenience to introduce myself and educate you on Retirement Strategies.`} /></p>
                            <p><Translate text={`Would you prefer a day or evening appointment?`} /></p>
                        </div>
                    ) : null}

                    {wizard.financial_script === 2 ? (
                        <div>
                            <p><Translate text={`I believe you spoke with {ea_name} from our agency the other day and he/she wanted me to contact you to schedule a time for us to get together and perform a complimentary Life Insurance and Retirement review.`} data={{ea_name: onboarding_name}}/></p>

                            <p><Translate text={`My notes indicate`} />:</p>
                            <p style={{fontSize:16, background:'#009688', color:'#FFF', padding:10 }}>
                                <Icon type="arrow-left" style={{color:"#FFF", marginRight: 10}} />
                                <Translate text={`See Profile Data`} />
                            </p>
                            <p><Translate text={`Our agency's commitment is to become your trusted advisor. I'd like to schedule a meeting at your convenience to introduce myself and educate you on Life Insurance and Retirement Strategies.`} /></p>
                            <p><Translate text={`Would you prefer a day or evening appointment?`} /></p>
                        </div>
                    ) : null}

                    <Card className="wizardBox center-align" type="inner" bordered={false}>
                        <RadioGroup value={wizard.interested_in_appointment_toggle} onChange={(e) => updateField('interested_in_appointment_toggle', e.target.value)}>
                            <Radio className="btnYes" value="1"><Translate text={`Schedule Appointment`} /></Radio>
                            <Radio className="btnYes" value="0"><Translate text={`Not Interested`} /></Radio>
                            <Radio className="btnYes" value="2"><Translate text={`Call-Back to Schedule`} /></Radio>
                            <Radio className="btnYes" value="3"><Translate text={`Appointment Outcome`} /></Radio>
                        </RadioGroup>
                    </Card>

                    {wizard.interested_in_appointment_toggle === '2' ? (
                        <Card title={<Translate text={`"When would the customer like a call back to schedule"`} />} type="inner" className="wizardBox center-align">
                            <DatePicker
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeSelect
                                timeIntervals={15}
                                timeFormat="hh:mm aa"
                                selected={
                                    (wizard.callback_to_schedule && wizard.callback_to_schedule !== "")
                                    ? new Date(wizard.callback_to_schedule)
                                    : null
                                }
                                shouldCloseOnSelect={false}
                                onChange={(val) => {
                                    const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                    updateField('callback_to_schedule', date)
                                }}
                            />
                        </Card>
                    ) : null}

                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`On the phone, without visual cues, it is essential to pause for at least three seconds after the client has spoken to avoid cutting them off.`} /></p>
                    </Card>

                </Card>

                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
