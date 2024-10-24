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

const { TextArea } = Input;

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

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Scheduling the Appointment`} />
                    </div>
                }>
                    <Card title={<Translate text={`When would you like to schedule your appointment?`} />} type="inner" className="wizardBox center-align">
                        <DatePicker
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeSelect
                            timeIntervals={15}
                            timeFormat="hh:mm aa"
                            selected={
                                (wizard.schedule_time && wizard.schedule_time !== "")
                                ? new Date(wizard.schedule_time)
                                : null
                            }
                            shouldCloseOnSelect={false}
                            onChange={(val) => {
                                const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                updateField('schedule_time', date)
                            }}
                        />
                    </Card>

                    <Card title={<Translate text={`What did you learn about this customer?`} />} className="wizardBox center-align" type="inner">
                        <TextArea placeholder="" rows={4} onChange={(e) => updateField('appointment_info', e.target.value)} />
                    </Card>

                    <Card title={<Translate text={`Where will the appointment take place?`} />} type="inner" className="wizardBox center-align">
                        <RadioGroup value={wizard.appointment_place} onChange={(e) => updateField('appointment_place', e.target.value)}>
                            <Radio value="Customer Home" className="btnYes"><Translate text={`Customer Home`} /></Radio>
                            <Radio value="Office" className="btnYes"><Translate text={`Office`} /></Radio>
                        </RadioGroup>
                    </Card>

                </Card>

                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
