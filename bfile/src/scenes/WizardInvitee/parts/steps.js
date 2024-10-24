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
        if (wizard.stepIndex >= 2 && wizard.stepIndex < 4) current = 1;
        if (wizard.stepIndex >= 4 && wizard.stepIndex < 9) current = 2;
        if (wizard.stepIndex >= 9 && wizard.stepIndex < 11) current = 3;
        if (wizard.stepIndex >= 11 && wizard.stepIndex < 13) current = 4;
        if (wizard.stepIndex === 13) current = 5;
        if (wizard.stepIndex === 14) current = 6;

        return (
            <div id="steps">
                <Steps current={current}>
                    <Step title={<Translate text={`Personal`} />} onClick={() => updateField('stepIndex', 1)} />
                    <Step title={<Translate text={`Auto`} />} onClick={() => updateField('stepIndex', 2)} />
                    <Step title={<Translate text={`Home`} />} onClick={() => updateField('stepIndex', 4)} />
                    <Step title={<Translate text={`Employment`} />} onClick={() => updateField('stepIndex', 9)} />
                    <Step title={<Translate text={`Financial`} />} onClick={() => updateField('stepIndex', 11)} />
                    <Step title={<Translate text={`Liability`} />} onClick={() => updateField('stepIndex', 13)} />
                    <Step title={<Translate text={`Complete`} />} onClick={() => updateField('stepIndex', 14)} />
                </Steps>
            </div>
        );

    }
}

export default WizardSteps;
