import React, { Component } from 'react';
import {
    Card,
    Icon,
    Tag,
    Input,
    Button,
    Radio,
    Divider,
    Slider,
    Spin,
    Row,
    Col
} from 'antd';
import axios from 'axios';
import F from '../../../Functions';
import AddressField from '../../../components/address-field';
import WizardFooter from './wizard-footer';
import Zillow from './images/bfile-zillow-zestimates.png';
import { Translate, Translator } from 'react-translated';

const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Step extends Component {
    state = {
        zillow_loading: false
    }
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
    zillowChecker = () => {
        const { wizard, updateField } = this.props;
        const rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];
        this.setState({ zillow_loading: true });
        axios.post("/api/zillow", {
            "address": wizard.zillow_address,
            "citystatezip": wizard.zillow_address_cont
        }).then((res) => {
            const zillow_estimated_value = res.data;
            let range = null;
            let home_market_value = '';
            for(let i=0, len=rangeValues.length; i < len; i++) {
                range = this.rangeToArray(rangeValues[i]);
                if (zillow_estimated_value >= range[0] && zillow_estimated_value <= range[1]) {
                    home_market_value = rangeValues[i];
                }
            }
            if (zillow_estimated_value > 1000000) {
                home_market_value = '$900,001-$1,000,000';
            }

            updateField('zillow_estimated_value', zillow_estimated_value);
            updateField('home_market_value', home_market_value);
            this.setState({ zillow_loading: false });
        });
    }
    render() {

        const { wizard, updateField } = this.props;
        const { zillow_loading } = this.state;

        const rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];

        let marks = {};
        for (let i=0, rangeLen=rangeValues.length; i<rangeLen; i++) {
            marks[parseInt((i/(rangeLen-1)) * 100, 10)] = {
                label: (i === rangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let home_market_value = 0;
        if (wizard.home_market_value !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.home_market_value) {
                    home_market_value = parseInt(x, 10);
                }
            }
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Primary Home`} />
                    </div>
                }>
                    <Card title={<Translate text={`"Do you own your primary home?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                        <RadioGroup defaultValue={wizard.home_toggle} onChange={(e) => updateField('home_toggle', e.target.value)}>
                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                            <Radio value="2" className="btnOption"><Icon type="home" style={{marginRight:10,color:"#424242"}} /> <Translate text={`Rent`} /></Radio>
                        </RadioGroup>
                    </Card>
                    {wizard.home_toggle === '1' ? (
                        <Card title={<Translate text={`"What's the approximate value of your home?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                            <Slider
                                className="rangeSlider"
                                marks={marks}
                                step={null}
                                defaultValue={home_market_value}
                                included={false}
                                tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                onChange={(val) => updateField('home_market_value', this.sliderValue(val, marks))}
                            />
                            <div className="sliderValue center-align">{wizard.home_market_value || '$0'}</div>
                            <Divider />
                            <Spin indicator={antIcon} spinning={zillow_loading}>
                                <Card bordered={false} className="zillowCard center-align">
                                    <div>
                                        <img src={Zillow} alt="Zillow" /><br/>
                                        <div className="zillowEstimatedValue"><Translate text={`Estimated Value`} />: <span>{F.dollar_format(wizard.zillow_estimated_value || 0)}</span></div>
                                    </div>

                                    <Row gutter={16}>
                                        <Col xs={12} span={24}>
                                            <label>
                                                <Translate text={`Address`} /> {'* '}
                                                <AddressField
                                                    value={wizard.zillow_address}
                                                    style={{width:200}}
                                                    placeholder={''}
                                                    onChange={(val) => { updateField('zillow_address', val); updateField('address', val); }}
                                                    setCity={(val) => updateField('city', val)}
                                                    setState={(val) => updateField('state', val)}
                                                    setZipCode={(val) => updateField('zipcode', val)}                                                  
                                                    setAddress={(val) => {
                                                        setTimeout(() => {
                                                            updateField('zillow_address', val)
                                                        }, 100)
                                                    }}
                                                    setCityStateZip={(val) => updateField('zillow_address_cont', val)}
                                                />
                                            </label>
                                        </Col>
                                        <Col xs={12} span={24}>
                                            <label>
                                                <Translate text={`City/State/Zip`} /> {'* '}
                                                <Input placeholder={''} value={wizard.zillow_address_cont} onChange={(e) => updateField('zillow_address_cont', e.target.value)} style={{width:200}} />
                                            </label>
                                        </Col>
                                    </Row>

                                    <Button onClick={this.zillowChecker.bind(this)} style={{marginTop:10}}>
                                        <Translate text={`Get Value`} />
                                    </Button>
                                </Card>
                            </Spin>
                        </Card>
                    ) : null}
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`Primary & secondary vehicles have value and can be exposed as assets in a judgment.`} /></p>
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
