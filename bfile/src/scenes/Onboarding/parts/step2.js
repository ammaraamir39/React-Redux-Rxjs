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
    DatePicker,
    Alert
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;

class Step extends Component {
    render() {

        const { wizard, bfile, updateField } = this.props;

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Continuing the Relationship as the Trusted Advisor`} />
                    </div>
                }>
                    <Card className="wizardBox center-align" bordered={false}>
                        <div className="script_text">
                            <Translate text={`"The reason for my call is to thank you for being our customer and follow up with you regarding your policies."`} />
                        </div>
                    </Card>
                    <Card title={<Translate text={`"Have you received your policies in the mail or in your email?"`} />} className="wizardBox center-align" type="inner">
                        <RadioGroup defaultValue={wizard.policies_received_toggle} onChange={(e) => updateField('policies_received_toggle', e.target.value)}>
                            <Radio className="btnYes" value="1"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio className="btnNo" value="0"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                        </RadioGroup>
                    </Card>
                    <Card title={<Translate text={`"Do you have any questions regarding your policies that I may be able to help you with?"`} />} className="wizardBox center-align" type="inner">
                        <RadioGroup defaultValue={wizard.policies_questions_toggle} onChange={(e) => updateField('policies_questions_toggle', e.target.value)}>
                            <Radio className="btnYes" value="1"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio className="btnNo" value="0"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                        </RadioGroup>
                    </Card>

                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`Remind the customer his/her proof of insurance is in the policy packet.`} /></p>
                    </Card>

                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
