import React, { Component } from 'react';
import {
    Card,
    Icon,
    Tag,
    Radio,
    Slider,
    Checkbox,
    Row,
    Col
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import Jewelry from "./images/icon-jewelry.svg";
import Furs from "./images/icon-furs-01.svg";
import Cameras from "./images/icon-camera.svg";
import MusicalInstruments from "./images/icon-music-instruments.svg";
import Silverware from "./images/icon-silverware.svg";
import FineArts from "./images/icon-finearts.svg";
import GolferEquipment from "./images/icon-golfbag.svg";
import SportsEquipment from "./images/icon-sportsequip.svg";
import Firearms from "./images/icon-firearm.svg";
import StampCollections from "./images/icon-stamps.svg";
import CoinCollections from "./images/icon-coins.svg";
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;

class Step extends Component {
    rangeSliderFormatter = (val, marks) => {
        return (marks[val].val !== '') ? marks[val].val : '$0';
    }
    sliderValue = (val, marks) => {
        return marks[val].val;
    }
    rangeToArray = (range) => {
        if (range !== "") {
            range = range.split('-');
            range[0] = parseInt(range[0].replace(/\$/g, '').replace(/,/g, ''), 10);
            range[1] = parseInt(range[1].replace(/\$/g, '').replace(/,/g, ''), 10);
            return range;
        } else {
            return [0, 0];
        }
    }
    render() {

        const { wizard, updateField } = this.props;

        let rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];
        let v1, v2;
        for (let i = 1; i < 21; i++) {
            v2 = 1000000 + 100000 * i;
            v1 = v2 - 100000 + 1;
            rangeValues.push(F.dollar_format(v1)+'-'+F.dollar_format(v2));
        }
        rangeValues.push("$3,000,001-$4,000,000");
        rangeValues.push("$4,000,001-$5,000,000");

        let marks = {};
        for (let i=0, rangeLen=rangeValues.length; i<rangeLen; i++) {
            marks[parseInt((i/(rangeLen-1)) * 100, 10)] = {
                label: (i === rangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let personal_property_value = 0;
        if (wizard.personal_property_value !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.personal_property_value) {
                    personal_property_value = parseInt(x, 10);
                }
            }
        }

        let personal_property_type = [];
        if (wizard.personal_property_type !== '') {
            personal_property_type = JSON.parse(wizard.personal_property_type);
        }

        const personal_property_types = [
            { name: "Jewelry", icon: Jewelry },
            { name: "Furs", icon: Furs },
            { name: "Cameras", icon: Cameras },
            { name: "Musical instruments", icon: MusicalInstruments },
            { name: "Silverware", icon: Silverware },
            { name: "Fine arts", icon: FineArts },
            { name: "Golfer's equipment", icon: GolferEquipment },
            { name: "Sports equipment", icon: SportsEquipment },
            { name: "Firearms", icon: Firearms },
            { name: "Stamp collections", icon: StampCollections },
            { name: "Coin collections", icon: CoinCollections }
        ];

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Personal Property`} />
                    </div>
                }>
                    <Card title={<Translate text={`"Other than customary items found in a home, do you have any special personal property of significant value of which we should be made aware?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                        <RadioGroup value={wizard.personal_property_toggle} onChange={(e) => updateField('personal_property_toggle', e.target.value)}>
                            <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                        </RadioGroup>
                    </Card>
                    {wizard.personal_property_toggle === 1 ? (
                        <div style={{marginBottom: 20}}>
                            <Card title={<Translate text={`"What Type(s)?"`} />} type="inner" className="wizardBox" style={{textAlign:"center"}}>
                                <Checkbox.Group
                                    className="radioIcons"
                                    value={personal_property_type}
                                    style={{ width: '100%' }}
                                    onChange={(checkedList) => updateField('personal_property_type', JSON.stringify(checkedList))}
                                >
                                    <Row gutter={16}>
                                        {personal_property_types.map((item, i) => {
                                            return (
                                                <Col key={i} md={8} span={24}>
                                                    <Checkbox value={item.name}>
                                                        <div className="radioIconOption">
                                                            <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                            <div className="title"><Translate text={item.name} /></div>
                                                        </div>
                                                    </Checkbox>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Checkbox.Group>
                            </Card>
                            <Card title={<Translate text={`"What is the approximate value of this Personal Property?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                <Slider
                                    className="rangeSlider"
                                    marks={marks}
                                    step={null}
                                    value={personal_property_value}
                                    included={false}
                                    tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                    onChange={(val) => updateField('personal_property_value', this.sliderValue(val, marks))}
                                />
                                <div className="sliderValue center-align">{wizard.personal_property_value || '$0'}</div>
                            </Card>
                        </div>
                    ) : null}
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`Scheduled personal property protects valuable items that are out of the ordinary and need to carry separate coverage to ensure that their full value is covered in the event of a claim.`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 4) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 4)}>1</a>
                        <a className={(wizard.stepIndex === 5) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 5)}>2</a>
                        <a className={(wizard.stepIndex === 6) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 6)}>3</a>
                        <a className={(wizard.stepIndex === 7) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 7)}>4</a>
                        <a className={(wizard.stepIndex === 8) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 8)}>5</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
