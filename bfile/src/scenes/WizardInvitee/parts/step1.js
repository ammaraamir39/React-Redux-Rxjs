import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Tag,
    Input,
    Radio,
    message
} from 'antd';
import WizardFooter from './wizard-footer';
import F from '../../../Functions';
import { Translate, Translator } from 'react-translated';

const RadioGroup = Radio.Group;

class Step extends Component {
    render() {

        const { wizard, updateField } = this.props;

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Intro Script`} />
                    </div>
                }>  
                    <Card className="wizardBox center-align" type="inner" style={{padding: 10}}>
                        <RadioGroup value={wizard.status} onChange={(e) => updateField('status', e.target.value)}>
                            <Radio className="btnYes" value="Renewal"><Icon type="sync" style={{marginRight:10}} /> <Translate text={`Existing Customer`} /></Radio>
                            <Radio className="btnYes" value="New Bfile"><Icon type="user-add" style={{marginRight:10}} /> <Translate text={`New Customer`} /></Radio>
                        </RadioGroup>
                    </Card>
                    <Card className="wizardBox center-align liabilityBox" type="inner">
                        <h2><Translate text={`Use the Risk Assessment Calculator to determine your proper limits of liability.`} /></h2>
                        {wizard.status === 'Renewal' ? (
                            <div>
                                <p>{'"'}<Translate text={`Here at our Agency we do things differently for your policy renewal. We are going to review your existing policy to make sure you qualify for all of our discounts and that your coverage satisfies your protection needs. We always start this conversation by reviewing your LIABILITY LIMITS.`} /></p>

                                <p><Translate text={`The correct liability limits protect your household against accidents, lawsuits, and catastrophes. I'll ask you a few questions using our agency's RISK ASSESSMENT CALCULATOR to identify any coverage gaps and make sure I don't miss any discounts.`} />{'"'}</p>
                            </div>
                        ) : (
                            <div>
                                <p><Translate text={`Liability limits on your policy are crucial to making sure your household is properly protected against accidents, lawsuits, and catastrophes. We do things differently at our agency & use a calculator that will suggest liability limits YOU NEED on your policy(ies). These next set of questions will help us determine whether any coverage gaps exist.`} /></p>
                            </div>
                        )}
                    </Card>
                    <Card title={<Translate text={`Personal Info`} />} className="wizardBox formBox" type="inner">
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <label><Translate text={`First Name`} />:</label>
                                <Input value={wizard.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                            </Col>
                            <Col md={8} span={24}>
                                <label><Translate text={`Last Name`} />:</label>
                                <Input value={wizard.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                            </Col>
                            <Col md={8} span={24}>
                                <label><Translate text={`Phone`} />:</label>
                                <Input value={F.phone_format(wizard.phone)} onChange={(e) => updateField('phone', e.target.value)} />
                            </Col>
                        </Row>
                    </Card>
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`Liability limits are usually never discussed and most of your customers are not properly covered.`} /></p>
                    </Card>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
