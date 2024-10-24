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
    Alert,
    Checkbox
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';

import SP500 from '../../Wizard/parts/images/sandp.png';
import VIP from '../../Wizard/parts/images/vip.png';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Step extends Component {
    render() {

        const { wizard, bfile, updateField } = this.props;

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Notes`} />
                    </div>
                }>
                    <Card title={<Translate text={`Tell Us a Story About This Customer`} />} className="wizardBox center-align" type="inner">
                        <TextArea rows={4} onChange={(e) => updateField('notes', e.target.value)} />
                    </Card>
                    <Card className="wizardBox center-align" bordered={false} type="inner" style={{padding:0}}>
                        <div className="radioIcons">
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <Checkbox checked={(wizard.sp_500) ? true : false} onChange={(e) => updateField('sp_500', (e.target.checked) ? 1 : 0)}>
                                        <div className="radioIconOption">
                                            <div className="icon"><img src={SP500} alt="S&P 500" /></div>
                                            <div className="title"><Translate text={`S&P 500`} /></div>
                                        </div>
                                    </Checkbox>
                                </Col>
                                <Col md={12} span={24}>
                                    <Checkbox checked={(wizard.vip) ? true : false} onChange={(e) => updateField('vip', (e.target.checked) ? 1 : 0)}>
                                        <div className="radioIconOption">
                                            <div className="icon"><img src={VIP} alt="VIP" /></div>
                                            <div className="title"><Translate text={`VIP`} /></div>
                                        </div>
                                    </Checkbox>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
