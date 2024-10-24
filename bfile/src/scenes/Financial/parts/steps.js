import React, { Component } from 'react';
import {
    Steps
} from 'antd';
import { Translate } from 'react-translated';

const Step = Steps.Step;

class WizardSteps extends Component {
    render() {

        const { wizard, updateField } = this.props;

        let current = 0;
        if (wizard.stepIndex === 1) current = 0;
        if (wizard.stepIndex === 2) current = 1;
        if (wizard.stepIndex === 3) current = 2;
        if (wizard.stepIndex === 4) current = 3;

        return (
            <div id="steps">
                <Steps current={current}>
                    <Step title={<Translate text={`Call Action`} />} onClick={() => updateField('stepIndex', 1)} />
                    <Step title={<Translate text={`Financial Conversation`} />} onClick={() => updateField('stepIndex', 2)} />
                    <Step title={<Translate text={`Scheduling Appointment`} />} onClick={() => updateField('stepIndex', 3)} />
                    {wizard.financial_outcome === true || wizard.interested_in_appointment_toggle === '3' || wizard.stepIndex === 4 ? (
                        <Step title={<Translate text={`Appointment Outcome`} />} onClick={() => updateField('stepIndex', 4)} />
                    ) : null}
                </Steps>
            </div>
        );

    }
}

export default WizardSteps;
