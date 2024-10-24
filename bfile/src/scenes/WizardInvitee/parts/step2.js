import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Tag,
    Select,
    Radio,
    Checkbox,
    Divider,
    Slider
} from 'antd';
import WizardFooter from './wizard-footer';
import ClassicCar from './images/bfile-classic_car.svg';
import RV from './images/bfile-rv.svg';
import Boat from './images/bfile-boat.svg';
import Motorcycle from './images/bfile-motorcycle.svg';
import Drone from './images/icon-drone.svg';
import GolfCart from './images/bfile-golf_cart.svg';
import Watercraft from './images/bfile-watercraft.svg';
import Snowmobile from './images/bfile-snowmobile.svg';
import OffRoad from './images/bfile-offroad.svg';
import { Translate } from 'react-translated';

const Option = Select.Option;
const RadioGroup = Radio.Group;

class Step extends Component {
    rangeSliderFormatter = (val, marks) => {
        return (marks[val].val !== '') ? marks[val].val : '$0';
    }
    sliderValue = (val, marks) => {
        return marks[val].val;
    }
    render() {

        const { wizard, updateField } = this.props;


        let secondary_vehicles = [];
        if (wizard.secondary_vehicles !== null && wizard.secondary_vehicles !== '') {
            secondary_vehicles = JSON.parse(wizard.secondary_vehicles);
        }

        const secondary_vehicles_list = [
            { name: "Classic Car", icon: ClassicCar },
            { name: "RV", icon: RV },
            { name: "Boat", icon: Boat },
            { name: "Motorcycle", icon: Motorcycle },
            { name: "Golf Cart", icon: GolfCart },
            { name: "Watercraft", icon: Watercraft },
            { name: "Snowmobile", icon: Snowmobile },
            { name: "Off Road", icon: OffRoad },
            { name: "Drone", icon: Drone },
        ];

        const rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];

        let marks = {};
        for (let i=0, rangeLen=rangeValues.length; i<rangeLen; i++) {
            marks[parseInt((i/(rangeLen-1)) * 100, 10)] = {
                label: (i === rangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let secondary_vehicles_value = 0;
        if (wizard.secondary_vehicles_value !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.secondary_vehicles_value) {
                    secondary_vehicles_value = parseInt(x, 10);
                }
            }
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Vehicles`} />
                    </div>
                }>
                    <Card title={<Translate text={`"How many cars or trucks do you own (not lease)?"`} />} className="wizardBox formBox" type="inner" style={{textAlign:"center"}}>
                        <Select value={wizard.primary_vehicles_num} style={{ width: 120 }} onChange={(value) => updateField('primary_vehicles_num', value)}>
                            <Option value={''}>{<Translate text={`How many?`} />}</Option>
                            {[...Array(11)].map((x, i) => (
                                <Option value={i} key={i}>{i}</Option>
                            ))}
                        </Select>
                    </Card>
                    <Card title={<Translate text={`"Do you own any secondary vehicles? (e.g. ATV's, RV's, Motorcycles, Boats, etc.)?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                        <RadioGroup value={wizard.secondary_vehicles_toggle} onChange={(e) => updateField('secondary_vehicles_toggle', e.target.value)}>
                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                        </RadioGroup>

                        {wizard.secondary_vehicles_toggle === '1' ? (
                            <div style={{marginTop: 20}}>
                                <Card type="inner">
                                    <Checkbox.Group
                                        className="radioIcons"
                                        value={secondary_vehicles}
                                        style={{ width: '100%' }}
                                        onChange={(checkedList) => updateField('secondary_vehicles', JSON.stringify(checkedList))}
                                    >
                                        <Row gutter={16}>
                                            {secondary_vehicles_list.map((item, i) => {
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
                                <Divider />
                                <Card title={<Translate text={`"Total value of the secondary vehicles?"`} />} type="inner">
                                    <Slider
                                        className="rangeSlider"
                                        marks={marks}
                                        step={null}
                                        defaultValue={secondary_vehicles_value}
                                        included={false}
                                        tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                        onChange={(val) => updateField('secondary_vehicles_value', this.sliderValue(val, marks))}
                                    />
                                    <div className="sliderValue center-align">{wizard.secondary_vehicles_value || '$0'}</div>
                                </Card>
                            </div>
                        ) : null}
                    </Card>
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`Primary & secondary vehicles have value and can be exposed as assets in a judgment.`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 2) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 2)}>1</a>
                        <a className={(wizard.stepIndex === 3) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 3)}>2</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
