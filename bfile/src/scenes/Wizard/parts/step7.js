import React, { Component } from 'react';
import {
    Card,
    Icon,
    Tag,
    Radio,
    Slider,
    Checkbox,
    Row,
    Col,
    Input
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Step extends Component {
    render() {

        const { wizard, updateField } = this.props;

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Customer Information`} />
                    </div>
                }>

                    <div className="center-align">
                        <h2><Translate text={`TELL US A STORY ABOUT THIS CUSTOMER`} /></h2>
                        <p>
                            <Translate text={`What did you learn about this customer?`} /><br/>
                            <Translate text={`(hobbies, children, vacation plans, what's going on in their world)`} />
                        </p>
                    </div>

                    <Card title={<Translate text={`Notes`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                        <TextArea rows={4} onChange={(e) => updateField('notes', e.target.value)} />
                    </Card>

                    <div className="pagination">
                        <a className={(wizard.stepIndex === 14) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 14)}>1</a>
                        <a className={(wizard.stepIndex === 15) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 15)}>2</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
