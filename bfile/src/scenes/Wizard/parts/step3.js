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
import { AutoComplete } from 'antd';

const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Step extends Component {
    state = {
        zillow_loading: false,
        dataSource: [],
        addresses: {},
        zpid: null
    }
    componentDidMount = () => {
        if (this.props.wizard.zillow_address && this.props.wizard.zillow_address !== "") {
            this.handleSearch(this.props.wizard.zillow_address);
        }
    }
    handleSearch = (query) => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            axios.post("/api/zestimate-suggestions", {
                address: query
            }).then((res) => {
                const dataSource = [];
                const addresses = {};
                let zpid = null;
                for (var j = 0; j < res.data.results.length; j++) {
                    const address = res.data.results[j];
                    if (address.resultType === "Address") {
                        dataSource.push(address.display);
                        if (!zpid) {
                            zpid = address.metaData.zpid;
                        }

                        var addr = [];
                        if (typeof address.metaData.streetNumber !== "undefined") {
                            addr.push(address.metaData.streetNumber);
                        }
                        if (typeof address.metaData.streetName !== "undefined") {
                            addr.push(address.metaData.streetName);
                        }
                        if (address.length > 0) {
                            addr = addr.join(" ");
                        } else {
                            addr = address.display.split(",")[0];
                        }

                        addresses[address.display] = {
                            address: addr,
                            zillow_address: address.display,
                            city: address.metaData.city,
                            state: address.metaData.state,
                            postal_code: address.metaData.zipCode,
                            country: address.metaData.country,
                            zpid: address.metaData.zpid,
                        }
                    }
                }
                this.setState({ dataSource, addresses, zpid });
            });
        }, 1000);
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
        if (this.state.zpid) {
            const { updateField } = this.props;
            let rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];
            let v1, v2;
            for (let i = 1; i < 21; i++) {
                v2 = 1000000 + 100000 * i;
                v1 = v2 - 100000 + 1;
                rangeValues.push(F.dollar_format(v1) + '-' + F.dollar_format(v2));
            }
            rangeValues.push("$3,000,001-$4,000,000");
            rangeValues.push("$4,000,001-$5,000,000");
            this.setState({ zillow_loading: true });
            axios.get("/api/zestimate-checker/" + this.state.zpid).then((res) => {
                const zillow_estimated_value = res.data;
                let range = null;
                let home_market_value = '';
                for (let i = 0, len = rangeValues.length; i < len; i++) {
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
    }
    selectAddress(val) {
        const { addresses } = this.state;
        const { updateField } = this.props;

        if (val in addresses) {
            const address = addresses[val];

            updateField('address', address.address);
            updateField('city', address.city);
            updateField('state', address.state);
            updateField('zipcode', address.postal_code);
            updateField('zillow_address', address.zillow_address);
            updateField('zillow_address_cont', address.city + ' ' + address.state + ' ' + address.postal_code);

            if ("setAddress" in this.props) {
                updateField('address', address.address);
            }
            if ("setCity" in this.props) {
                updateField('city', address.city);
            }
            if ("setState" in this.props) {
                updateField('state', address.state);
            }
            if ("setZipCode" in this.props) {
                updateField('zipcode', address.postal_code);
            }
            if ("setCityStateZip" in this.props) {
                updateField('zillow_address_cont', address.city + ' ' + address.state + ' ' + address.postal_code);
            }

            this.setState({ zpid: address.zpid })
        }
    }
    render() {

        const { wizard, updateField } = this.props;
        const { zillow_loading } = this.state;
        let rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];
        let v1, v2;
        for (let i = 1; i < 21; i++) {
            v2 = 1000000 + 100000 * i;
            v1 = v2 - 100000 + 1;
            rangeValues.push(F.dollar_format(v1) + '-' + F.dollar_format(v2));
        }
        rangeValues.push("$3,000,001-$4,000,000");
        rangeValues.push("$4,000,001-$5,000,000");

        let marks = {};
        for (let i = 0, rangeLen = rangeValues.length; i < rangeLen; i++) {
            marks[parseInt((i / (rangeLen - 1)) * 100, 10)] = {
                label: (i === rangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let home_market_value = 0;
        if (wizard.home_market_value !== '') {
            for (let x in marks) {
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
                    <Card title={<Translate text={`"Do you own your primary home?"`} />} className="wizardBox" type="inner" style={{ textAlign: "center" }}>
                        <RadioGroup value={wizard.home_toggle} onChange={(e) => updateField('home_toggle', e.target.value)}>
                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{ marginRight: 10, color: "#388E3C" }} /> <Translate text={`Yes`} /></Radio>
                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{ marginRight: 10, color: "#FF3D00" }} /> <Translate text={`No`} /></Radio>
                            <Radio value="2" className="btnOption"><Icon type="home" style={{ marginRight: 10, color: "#424242" }} /> <Translate text={`Rent`} /></Radio>
                        </RadioGroup>
                    </Card>
                    {wizard.home_toggle === '1' ? (
                        <Card title={<Translate text={`"What's the approximate value of your home?"`} />} className="wizardBox" type="inner" style={{ textAlign: "center" }}>
                            <Slider
                                className="rangeSlider"
                                marks={marks}
                                step={null}
                                value={home_market_value}
                                included={false}
                                tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                onChange={(val) => updateField('home_market_value', this.sliderValue(val, marks))}
                            />
                            <div className="sliderValue center-align">{wizard.home_market_value || '$0'}</div>
                            <Divider />
                            <Spin indicator={antIcon} spinning={zillow_loading}>
                                <Card bordered={false} className="zillowCard center-align">
                                    <div>
                                        <img src={Zillow} alt="Zillow" /><br />
                                        <div className="zillowEstimatedValue"><Translate text={`Estimated Value`} />: <span>{F.dollar_format(wizard.zillow_estimated_value || 0)}</span></div>
                                    </div>

                                    <Translate text={`Address`} /> {'* '}
                                    <AutoComplete
                                        value={wizard.zillow_address}
                                        dataSource={this.state.dataSource}
                                        style={{ width: '100%' }}
                                        //onChange={(val) => { updateField('zillow_address', val); updateField('address', val); }}
                                        onSelect={this.selectAddress.bind(this)}
                                        onSearch={this.handleSearch.bind(this)}
                                        placeholder={""}
                                    />

                                    {this.state.zpid ? (
                                        <Button onClick={this.zillowChecker.bind(this)} style={{ marginTop: 10 }}>
                                            <Translate text={`Get Value`} />
                                        </Button>
                                    ) : (
                                        <Button disabled style={{ marginTop: 10 }}>
                                            <Translate text={`Get Value`} />
                                        </Button>
                                    )}
                                </Card>
                            </Spin>
                        </Card>
                    ) : null}
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`The equity in your home may be at risk in the event of a liability lawsuit.`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 4) ? 'active' : ''} onClick={() => updateField('gotoStepIndex', 4)}>1</a>
                        <a className={(wizard.stepIndex === 5) ? 'active' : ''} onClick={() => updateField('gotoStepIndex', 5)}>2</a>
                        <a className={(wizard.stepIndex === 6) ? 'active' : ''} onClick={() => updateField('gotoStepIndex', 6)}>3</a>
                        <a className={(wizard.stepIndex === 7) ? 'active' : ''} onClick={() => updateField('gotoStepIndex', 7)}>4</a>
                        <a className={(wizard.stepIndex === 8) ? 'active' : ''} onClick={() => updateField('gotoStepIndex', 8)}>5</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
