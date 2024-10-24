import React, { Component } from 'react';
import {
    Icon,
    Button
} from 'antd';
import { Translate } from 'react-translated';

class WizardFooter extends Component {
    render() {
        const { wizard, submitStep, prevStep, complete } = this.props;
        return (
            <div className="wizardFooter right-align">
                <Button.Group size="large" className="directions">
                    {wizard.stepIndex > 1 ? (
                        <Button size="large" type="primary" onClick={prevStep.bind(this)} className="prev">
                            <Icon type="left" />{' '}
                            <Translate text={`Previous`} />
                        </Button>
                    ) : null}
                    {wizard.stepIndex < 6 ? (
                        <Button size="large" type="primary" onClick={submitStep.bind(this)} className="next">
                            <Translate text={`Next`} />{' '}
                            <Icon type="right" />
                        </Button>
                    ) : (
                        <Button size="large" type="primary" onClick={complete.bind(this)}>
                            <Translate text={`Complete`} />
                        </Button>
                    )}
                </Button.Group>
            </div>
        );

    }
}

export default WizardFooter;
