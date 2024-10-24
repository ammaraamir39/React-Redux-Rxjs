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
    Checkbox,
    Rate,
    Tooltip
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import ShowRespect from '../../Wizard/parts/images/bfile-handshake.svg';
import ExplainLimits from '../../Wizard/parts/images/bfile-calc.svg';
import Offer30DayReview from '../../Wizard/parts/images/bfile-review.svg';
import RatesDoNotApplyToSurvey from '../../Wizard/parts/images/bfile-up.svg';
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Step extends Component {
    render() {

        const { wizard, bfile, updateField } = this.props;

        let lsp_rating_experience = [];
        if (wizard.lsp_rating_experience !== null && wizard.lsp_rating_experience !== '') {
            lsp_rating_experience = JSON.parse(wizard.lsp_rating_experience);
        }

        const lsp_rating_experience_items = [
            {
                name: "Show Respect",
                icon: ShowRespect,
                tip: '"Were you treated with respect and feel my agency acted professionally?"\n"Did my agency handle your needs timely and accurately?"'
            },
            {
                name: "Explain Limits",
                icon: ExplainLimits,
                tip: '"Did “user_type” explain to you in detail your liability limits and accurately determine your asset protection needs when creating your policy?"'
            },
            {
                name: "Offer 30-day Review",
                icon: Offer30DayReview,
                tip: '"Did “user_type” commit to offering a personal insurance review 30 days before renewal?"'
            },
            {
                name: "Rates Do Not Apply to Survey",
                icon: RatesDoNotApplyToSurvey,
                tip: '"I wanted to make sure you understand that if a premium rate increase occurs, my agency is committed to always making sure you have the proper coverages at the best rate. Rates on your policy are not a reflection of our agency."'
            }
        ];

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`LSP Rating and ACES Reminder`} />
                    </div>
                }>
                    <Card className="wizardBox center-align" bordered={false}>
                        <div className="script_text">
                            <Translate text={`"In the near future, you will be asked to complete a survey from the insurance company. We want you to be able to report that you are completely satisfied with our agency and your experience."`} />
                        </div>
                    </Card>
                    <Card title={<Translate text={`"I want to make sure my agency is doing a great job with valued customers like you. Did {lsp_name} do the following?\" Select all that apply:`} data={{lsp_name: bfile.user.first_name+' '+bfile.user.last_name}} />} className="wizardBox center-align" type="inner">
                        <Checkbox.Group
                            className="radioIcons"
                            value={lsp_rating_experience}
                            style={{ width: '100%' }}
                            onChange={(checkedList) => updateField('lsp_rating_experience', JSON.stringify(checkedList))}
                        >
                            <Row gutter={16}>
                                {lsp_rating_experience_items.map((item, i) => {
                                    item.tip = item.tip.replace("user_name", bfile.user.first_name + " " + bfile.user.last_name);
                                    item.tip = item.tip.replace("user_type", bfile.user.user_type);
                                    return (
                                        <Col key={i} md={6} span={24}>
                                            <Tooltip placement="bottom" title={item.tip}>
                                                <Checkbox value={item.name}>
                                                    <div className="radioIconOption">
                                                        <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                        <div className="title"><Translate text={item.name} /></div>
                                                    </div>
                                                </Checkbox>
                                            </Tooltip>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Checkbox.Group>
                    </Card>

                    <Card title={<Translate text={`How would you rate \"{lsp_name}\" and your agency experience on a scale from 1-10?`} data={{lsp_name: bfile.user.first_name+' '+bfile.user.last_name}} />} className="wizardBox center-align" type="inner">
                        <Rate onChange={(val) => updateField('lsp_score', val)} value={wizard.lsp_score} count={10} />
                        {wizard.lsp_score && <span className="ant-rate-text">{wizard.lsp_score}/10</span>}
                    </Card>

                    {wizard.lsp_score && wizard.lsp_score !== '' ? (
                        <div>
                            {wizard.lsp_score < 10 ? (
                                <Card title={<Translate text={`"What can we do to increase that score to a 10?"`} />} className="wizardBox center-align" type="inner">
                                    <TextArea rows={4} onChange={(e) => updateField('increase_score_details', e.target.value)} />
                                </Card>
                            ) : (
                                <Card title={<Translate text={`Notes`} />} className="wizardBox center-align" type="inner">
                                    <TextArea rows={4} onChange={(e) => updateField('increase_score_details', e.target.value)} />
                                </Card>
                            )}
                        </div>
                    ) : null}

                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`"Your survey scores will increase if you follow these scripts."`} /><br/>
                        <Translate text={`Remind the customer their proof of insurance is in policy packet.`} /></p>
                    </Card>

                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
