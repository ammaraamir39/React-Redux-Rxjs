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
        if (wizard.stepIndex === 5) current = 4;
        if (wizard.stepIndex === 6) current = 5;

        return (
            <div id="steps">
                <Steps current={current}>
                    <Step title={<Translate text={`Call Action`} />} onClick={() => updateField('gotoStepIndex', 1)} />
                    <Step title={<Translate text={`Policy Questions`} />} onClick={() => updateField('gotoStepIndex', 2)} />
                    <Step title={<Translate text={`LSP Rating`} />} onClick={() => updateField('gotoStepIndex', 3)} />
                    <Step title={<Translate text={`Referral / Social Media`} />} onClick={() => updateField('gotoStepIndex', 4)} />
                    <Step title={<Translate text={`Financial Conversation`} />} onClick={() => updateField('gotoStepIndex', 5)} />
                    <Step title={<Translate text={`Complete`} />} onClick={() => updateField('gotoStepIndex', 6)} />
                </Steps>
            </div>
        );

    }
}

export default WizardSteps;
