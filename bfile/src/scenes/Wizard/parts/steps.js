import React, { Component } from 'react';
import {
    Steps,
    Button,
    Icon
} from 'antd';
import { Link } from "react-router-dom";
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
        if (wizard.stepIndex >= 14 && wizard.stepIndex < 16) current = 6;

        return (
            <div>
                {wizard.id && wizard.id !== '' ? (
                    <div style={{marginBottom:30}}>
                        <Link to={'/customer/' + wizard.id}>
                            <Button size="large" type="primary">
                                <Icon type="left" />
                                {' '}<Translate text={`Back to Profile`} />
                            </Button>
                        </Link>
                    </div>
                ) : null}
                <div id="steps">
                    <Steps current={current}>
                        <Step title={<Translate text={`Personal`} />} onClick={() => updateField('gotoStepIndex', 1)} />
                        <Step title={<Translate text={`Auto`} />} onClick={() => updateField('gotoStepIndex', 2)} />
                        <Step title={<Translate text={`Home`} />} onClick={() => updateField('gotoStepIndex', 4)} />
                        <Step title={<Translate text={`Employment`} />} onClick={() => updateField('gotoStepIndex', 9)} />
                        <Step title={<Translate text={`Financial`} />} onClick={() => updateField('gotoStepIndex', 11)} />
                        <Step title={<Translate text={`Liability`} />} className="yellow" onClick={() => updateField('gotoStepIndex', 13)} />
                        <Step title={<Translate text={`Complete`} />} onClick={() => updateField('gotoStepIndex', 14)} />
                    </Steps>
                </div>
            </div>
        );

    }
}

export default WizardSteps;
