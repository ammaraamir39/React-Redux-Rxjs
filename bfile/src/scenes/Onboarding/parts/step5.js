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
    Rate,
    Select
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';
import DatePicker from 'react-datepicker';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class Step extends Component {
    state = {
        loading: false,
        child_users: []
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
    componentDidMount = () => {
        const child_users = [];
        const { bfile, user } = this.props;

        this.setState({ loading: true })

        let url = "/api/my_associations";
        if (user.user_type === "VONBOARDER") {
            url = "/api/associations_by_bfile_id/"+ bfile.id;
        }
        axios.get(url).then((res) => {
            const agencies = res.data;
            const keys = Object.keys(agencies);
            for (let a = 0; a < keys.length; a++) {
                const agency = keys[a];
                for (let i=0; i < agencies[agency].length; i++) {
                    if (agencies[agency][i].id !== user.id) {
                        if (agencies[agency][i].user_type == "LSP") {
                            var jobs = agencies[agency][i].jobs;
                            if (jobs !== '' && jobs !== null && jobs !== "null") {
                                jobs = JSON.parse(jobs);
                                if (jobs.life_licensed) {
                                    child_users.push({
                                        name: agencies[agency][i].first_name+" "+agencies[agency][i].last_name,
                                        id: agencies[agency][i].id,
                                        user_type: agencies[agency][i].user_type
                                    });
                                }
                            }
                        } else {
                            child_users.push({
                                name: agencies[agency][i].first_name+" "+agencies[agency][i].last_name,
                                id: agencies[agency][i].id,
                                user_type: agencies[agency][i].user_type
                            });
                        }
                    }
                }
            }
            this.setState({ child_users, loading: false })
        });
    }
    render() {

        const { loading, child_users } = this.state;
        const { wizard, bfile, updateField, user } = this.props;

        let financial_name = "EFS";
        for (let i = 0; i < child_users.length; i++) {
            if (child_users[i].id === wizard.financial_conversion_specialist) {
                financial_name = child_users[i].name;
            }
        }

        if (wizard.financial_conversion_script === null || wizard.financial_conversion_script === '') {
            wizard.financial_conversion_script = 0;
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Financial Conversation`} />
                    </div>
                }>
                    <Card title={<Translate text={`Choose A Financial Specialist`} />} className="wizardBox center-align" type="inner">
                        <Select value={wizard.financial_conversion_specialist} style={{ width: 250 }} onChange={(value) => updateField('financial_conversion_specialist', value)}>
                            <Option value={null}><Translate text={`Choose A Specialist`} /></Option>
                            {child_users.map((u, i) => (
                                <Option value={u.id} key={i}>{u.name}</Option>
                            ))}
                        </Select>
                    </Card>
                    <Card className="wizardBox center-align" type="inner" bordered={false}>
                        <RadioGroup value={wizard.financial_conversion_script} onChange={(e) => updateField('financial_conversion_script', e.target.value)}>
                            <Radio className="btnYes" value={0}><Translate text={`Life Insurance Conversation`} /></Radio>
                            <Radio className="btnYes" value={1}><Translate text={`Pension Fund`} /></Radio>
                            <Radio className="btnYes" value={2}><Translate text={`Life Insurance & Retirement`} /></Radio>
                        </RadioGroup>
                    </Card>

                    {wizard.financial_conversion_script === 0 ? (
                        <div>
                            <p><Translate text={`"Finally, I'd like to introduce you to the next step in our agency's process. We offer all of our valued customers a complimentary review of your Life Insurance needs."`} /></p>
                            <p><Translate text={`"From your file, it looks like we've identified the following Life Insurance needs you should consider when scheduling the Life Insurance review with us."`} /></p>
                            <p style={{fontSize:16, background:'#009688', color:'#FFF', padding:10 }}>
                                <Icon type="arrow-left" style={{color:"#FFF", marginRight: 10}} />
                                <Translate text={`See Profile Data`} />
                            </p>
                            {wizard.financial_conversion_specialist !== user.id ? (
                                <div>
                                    <p><Translate text={`"I'm going to have {financial_name} reach out to you and introduce himself or herself. {financial_name} is our agency's Personal Financial Representative. This is the commitment from the agency to become your trusted advisor and the objective is not to sell you anything but educate you on options and strategies."`} data={{financial_name: financial_name}} /></p>
                                    <p><Translate text={`"I can either have our financial specialist contact you to schedule a review or I can schedule the review with you right now."`} /></p>
                                </div>
                            ) : (
                                <p><Translate text={`"I'd like to schedule a time for us to get together and perform your complimentary Financial Services review. Do you need an Evening appointment or does the Day work for you?"`} /></p>
                            )}
                        </div>
                    ) : null}

                    {wizard.financial_conversion_script === 1 ? (
                        <div>
                            <p><Translate text={`"Finally, I'd like to introduce you to the next step in our agency's process. We offer all of our valued customers a complimentary review of your retirement needs.`} /></p>
                            <p><Translate text={`"Making sure your retirement assets are properly diversified according to your risk tolerance and ensuring that they are positioned correctly during market fluctuation is the purpose of the review we offer.`} /></p>
                            <p><Translate text={`"We've identified the following Retirement needs you should consider when scheduling the retirement review with us.`} /></p>
                            <p style={{fontSize:16, background:'#009688', color:'#FFF', padding:10 }}>
                                <Icon type="arrow-left" style={{color:"#FFF", marginRight: 10}} />
                                <Translate text={`See Profile Data`} />
                            </p>
                            {wizard.financial_conversion_specialist !== user.id ? (
                                <div>
                                    <p><Translate text={`"I'm going to have {financial_name} reach out to you and introduce himself or herself. {financial_name} is our agency's Personal Financial Representative. This is the commitment from the agency to become your trusted advisor and the objective is not to sell you anything but educate you on options and strategies."`} data={{financial_name: financial_name}} /></p>

                                    <p><Translate text={`"I can either have our financial specialist contact you to schedule a review or I can schedule the review with you right now`} /></p>
                                </div>
                            ) : (
                                <p><Translate text={`"I'd like to schedule a time for us to get together and perform your complimentary Financial Services review. Do you need an Evening appointment or does the Day work for you?`} /></p>
                            )}
                        </div>
                    ) : null}

                    {wizard.financial_conversion_script === 2 ? (
                        <div>
                            <p><Translate text={`"Finally, I'd like to introduce you to the next step in our agency's process. We offer all of our valued customers a complimentary review of your Life Insurance and Retirement needs.`} /></p>
                            <p><Translate text={`"From your file, it looks like we've identified the following Life Insurance and Retirement needs you should consider when scheduling the review with us.`} /></p>
                            <p style={{fontSize:16, background:'#009688', color:'#FFF', padding:10 }}>
                                <Icon type="arrow-left" style={{color:"#FFF", marginRight: 10}} />
                                <Translate text={`See Profile Data`} />
                            </p>
                            {wizard.financial_conversion_specialist !== user.id ? (
                                <div>
                                    <p><Translate text={`"I'm going to have {financial_name} reach out to you and introduce himself or herself. {financial_name} is our agency's Personal Financial Representative. This is the commitment from the agency to become your trusted advisor and the objective is not to sell you anything but educate you on options and strategies."`} data={{financial_name: financial_name}} /></p>
                                    <p><Translate text={`"I can either have our financial specialist contact you to schedule a review or I can schedule the review with you right now.`} /></p>
                                </div>
                            ) : (
                                <p><Translate text={`"I'd like to schedule a time for us to get together and perform your complimentary Financial Services review. Do you need an Evening appointment or does the Day work for you?`} /></p>
                            )}
                        </div>
                    ) : null}

                    <Card className="wizardBox center-align" type="inner">
                        <RadioGroup value={wizard.financial_conversion_action} onChange={(e) => updateField('financial_conversion_action', e.target.value)}>
                            {wizard.financial_conversion_specialist !== user.id ? (
                                <Radio className="btnOption btnBlock" value={1}><Translate text={`Forward to Financial Specialist to Schedule a Life/Retirement Appointment`} /></Radio>
                            ) : null}
                            <Radio className="btnOption btnBlock" value={2}><Translate text={`Schedule Appointment for Financial Specialist Now`} /></Radio>
                        </RadioGroup>
                    </Card>

                    {wizard.financial_conversion_action === 1 ? (
                        <Card title={<Translate text={`"Does the customer want a certain call time back for Introduction?"`} />} type="inner" className="wizardBox center-align">
                            <DatePicker
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeSelect
                                timeIntervals={15}
                                timeFormat="hh:mm aa"
                                selected={
                                    (wizard.financial_conversion_callback_date && wizard.financial_conversion_callback_date !== "")
                                    ? new Date(wizard.financial_conversion_callback_date)
                                    : null
                                }
                                shouldCloseOnSelect={false}
                                onChange={(val) => {
                                    const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                    updateField('financial_conversion_callback_date', date)
                                }}
                            />
                        </Card>
                    ) : null}
                    {wizard.financial_conversion_action === 2 ? (
                        <Card title={
                            (wizard.financial_conversion_specialist !== user.id)
                            ? <Translate text={`"When do you want to meet with {financial_name}?"`} data={{financial_name: financial_name}} />
                            : <Translate text={`"When are you meeting with {customer_name}?"`} data={{customer_name: bfile.first_name+' '+bfile.last_name}} />
                        } type="inner" className="wizardBox center-align">
                            <DatePicker
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeSelect
                                timeIntervals={15}
                                timeFormat="hh:mm aa"
                                selected={
                                    (wizard.financial_conversion_callback_date && wizard.financial_conversion_callback_date !== "")
                                    ? new Date(wizard.financial_conversion_callback_date)
                                    : null
                                }
                                shouldCloseOnSelect={false}
                                onChange={(val) => {
                                    const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                    updateField('financial_conversion_callback_date', date)
                                }}
                            />
                        </Card>
                    ) : null}
                    {wizard.financial_conversion_action === 3 ? (
                        <Card title={<Translate text={`"When does {customer_name} want a call back?"`} data={{customer_name: bfile.first_name+' '+bfile.last_name}}/>} type="inner" className="wizardBox center-align">
                            <DatePicker
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeSelect
                                timeIntervals={15}
                                timeFormat="hh:mm aa"
                                selected={
                                    (wizard.financial_conversion_callback_date && wizard.financial_conversion_callback_date !== "")
                                    ? new Date(wizard.financial_conversion_callback_date)
                                    : null
                                }
                                shouldCloseOnSelect={false}
                                onChange={(val) => {
                                    const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                    updateField('financial_conversion_callback_date', date)
                                }}
                            />
                        </Card>
                    ) : null}

                    <Card className="wizardBox center-align" type="inner">
                        <RadioGroup value={wizard.financial_conversion_action} onChange={(e) => updateField('financial_conversion_action', e.target.value)}>
                            <Radio className="btnOption btnBlock" value={3}><Translate text={`Schedule a better time to Discuss Agency Life/Retirement Process with me`} /></Radio>
                            <Radio className="btnOption btnBlock" value={0}><Translate text={`Not Interested`} /></Radio>
                        </RadioGroup>
                    </Card>
                </Card>

                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
