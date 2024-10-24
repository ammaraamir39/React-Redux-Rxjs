import React, { Component } from 'react';
import {
    Card,
    Icon,
    Tag,
    Row,
    Col,
    Avatar,
    List,
    Radio,
    Button
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import Print from './print-liability';
import { Translate } from 'react-translated';
import axios from 'axios';
import Home from './images/bfile-homeowners.svg';
import SecondaryHome from './images/bfile-homeowners.svg';
import MFGHome from './images/bfile-mfg.svg';
import Renter from './images/bfile-renter.svg';
import Condominium from './images/bfile-condominium.svg';
import Landlord from './images/bfile-landlord.svg';
import VacantProperty from './images/bfile-homeowners.svg';
import Umbrella from './images/bfile-umbrella.svg';
import Auto from './images/bfile-classic_car.svg';
import ClassicCar from './images/bfile-classic_car.svg';
import RV from './images/bfile-rv.svg';
import Boat from './images/bfile-boat.svg';
import Motorcycle from './images/bfile-motorcycle.svg';
import Drone from './images/icon-drone.svg';
import GolfCart from './images/bfile-golf_cart.svg';
import Watercraft from './images/bfile-watercraft.svg';
import Snowmobile from './images/bfile-snowmobile.svg';
import OffRoad from './images/bfile-offroad.svg';

const RadioGroup = Radio.Group;

class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minimum_liability_limits: null,
            minimum_liability_limits_ext: {}
        }
    }
    componentDidMount() {
        axios.get("/api/user").then((res) => {
            const u = res.data;
            let minimum_liability_limits_ext = {};
            if (u.minimum_liability_limits_ext) {
                minimum_liability_limits_ext = JSON.parse(u.minimum_liability_limits_ext);
            }
            this.setState({
                minimum_liability_limits: u.minimum_liability_limits,
                minimum_liability_limits_ext
            })
        })
    }
    strToNumber = (str) => {
        str = str.replace(/\$/g, "");
        str = str.replace(/,/g, "");
        return parseInt(str);
    }
    getMinLiability = (liability, value) => {
        const { minimum_liability_limits_ext } = this.state;
        if (liability in minimum_liability_limits_ext) {
            var minimum_recommended = minimum_liability_limits_ext[liability];

            var is_home = [
                "Home",
                "Secondary Home",
                "MFG Home",
                "Renter",
                "Condominium",
                "Landlord",
                "Vacant Property"
            ];
            if (is_home.indexOf(liability) >= 0) {
                if (this.strToNumber(minimum_recommended) > this.strToNumber(value)) {
                    return minimum_recommended;
                } else {
                    return value;
                }
            } else {
                const recommended_limit_f = F.get_first_value(value.replace("/", "-"));
                const minimum_recommended_f = F.get_first_value(minimum_recommended.replace("/", "-"));
                if (minimum_recommended_f > recommended_limit_f) {
                    return minimum_recommended;
                } else {
                    return value;
                }
            }
        } else {
            return value;
        }
    }
    render() {

        const { wizard, updateField } = this.props;
        const { minimum_liability_limits, minimum_liability_limits_ext } = this.state;

        let recommended_limit   = "";
        let recommended_limit_2 = "";
        let umbrella_message = "";

        if (wizard.rac_calculator >= 0 && wizard.rac_calculator <= 24999 ) {
            recommended_limit   = "$25,000/$50,000";
            recommended_limit_2 = "$100,000";
            wizard.umbrella_limit = "";
        }
        if (wizard.rac_calculator >= 25000 && wizard.rac_calculator <= 49999) {
            recommended_limit   = "$50,000/$100,000";
            recommended_limit_2 = "$100,000";
            wizard.umbrella_limit = "";
        }
        if (wizard.rac_calculator >= 50000 && wizard.rac_calculator <= 99999) {
            recommended_limit   = "$100,000/$300,000";
            recommended_limit_2 = "$100,000";
            wizard.umbrella_limit = "";
        }
        if (wizard.rac_calculator >= 100000 && wizard.rac_calculator <= 249999) {
            recommended_limit   = "$250,000/$500,000";
            recommended_limit_2 = "$300,000";
            wizard.umbrella_limit = "";
        }
        if (wizard.rac_calculator >= 250000 && wizard.rac_calculator <= 499999) {
            recommended_limit   = "$500,000/$1,000,000";
            recommended_limit_2 = "$500,000";
            wizard.umbrella_limit = 1000000;
            umbrella_message = "Your recommended limit is $500,000/$1,000,000 on your auto and $500,000 on your home. However, we recommend a 1-million-dollar umbrella with our minimum required underlying limits of $250,000/$500,000 for the auto and $300,000 on your home. That will protect your assets and also give you broader coverage.";
        }
        if (wizard.rac_calculator >= 500000 && wizard.rac_calculator <= 1249999) {
            recommended_limit   = "$250,000/$500,000";
            recommended_limit_2 = "$300,000";
            wizard.umbrella_limit = 1000000;
        }
        if (wizard.rac_calculator >= 1250000) {
            recommended_limit   = "$250,000/$500,000";
            recommended_limit_2 = "$300,000";
            wizard.umbrella_limit = 2000000;
        }
        
        if (minimum_liability_limits) {
            const recommended_limit_f = F.get_first_value(recommended_limit.replace("/", "-")); // 250,000

            if (minimum_liability_limits === "$25,000/$50,000") {
                recommended_limit   = "$25,000/$50,000";
                recommended_limit_2 = "$100,000";
            }

            if (minimum_liability_limits === "$50,000/$100,000") {
                recommended_limit   = "$50,000/$100,000";
                recommended_limit_2 = "$100,000";
            }

            if (minimum_liability_limits === "$100,000/$300,000") {
                if (recommended_limit_f <= 100000) {
                    recommended_limit   = "$100,000/$300,000";
                    recommended_limit_2 = "$100,000";
                }
            }

            if (minimum_liability_limits === "$250,000/$500,000") {
                if (recommended_limit_f <= 250000) {
                    recommended_limit   = "$250,000/$500,000";
                    recommended_limit_2 = "$300,000";
                }
            }

            if (minimum_liability_limits === "$500,000/$1,000,000") {
                recommended_limit   = "$500,000/$1,000,000";
                recommended_limit_2 = "$500,000";
            }   
        }


        if (wizard.rac_calculator >= 1250000 && wizard.rac_calculator <= 2249999) {
            wizard.umbrella_limit = 2000000;
        }
        if (wizard.rac_calculator >= 2250000 && wizard.rac_calculator <= 3249999) {
            wizard.umbrella_limit = 3000000;
        }
        if (wizard.rac_calculator >= 3250000 && wizard.rac_calculator <= 4249999) {
            wizard.umbrella_limit = 4000000;
        }
        if (wizard.rac_calculator >= 4250000 && wizard.rac_calculator <= 5249999) {
            wizard.umbrella_limit = 5000000;
        }
        if (wizard.rac_calculator >= 5250000 && wizard.rac_calculator <= 6249999) {
            wizard.umbrella_limit = 6000000;
        }
        if (wizard.rac_calculator >= 6250000 && wizard.rac_calculator <= 7249999) {
            wizard.umbrella_limit = 7000000;
        }
        if (wizard.rac_calculator >= 7250000 && wizard.rac_calculator <= 8249999) {
            wizard.umbrella_limit = 8000000;
        }
        if (wizard.rac_calculator >= 8250000 && wizard.rac_calculator <= 9249999) {
            wizard.umbrella_limit = 9000000;
        }
        if (wizard.rac_calculator >= 9250000) {
            wizard.umbrella_limit = 10000000;
        }

        wizard.auto_policy_recommended_limit = recommended_limit;
        wizard.home_policy_recommended_limit = recommended_limit_2;

        let home_list = [];
        let auto_list = [];
        let umbrella_list = [];
        
        if (wizard.home_toggle === "1") {
            home_list.push({ title: 'Home', icon: Home, value: this.getMinLiability("Home", recommended_limit_2) })
        }

        let name = null;
        let icon = null;
        let value = null;
        if (wizard.secondary_home_type) {
            const secondary_home_type = JSON.parse(wizard.secondary_home_type);
            if (secondary_home_type) {
                for(let i=0, len = secondary_home_type.length; i < len; i++) {
                    name = secondary_home_type[i];
                    icon = null;
                    if (name === 'Secondary Home')  icon = SecondaryHome;
                    if (name === 'MFG Home')        icon = MFGHome;
                    if (name === 'Renter')          icon = Renter;
                    if (name === 'Condominium')     icon = Condominium;
                    if (name === 'Landlord')        icon = Landlord;
                    if (name === 'Vacant Property') icon = VacantProperty;
                    home_list.push({ title: name, icon: icon, value: this.getMinLiability(name, recommended_limit_2) })
                }
            }
        }

        auto_list.push({ title: 'Auto', icon: Auto, value: this.getMinLiability("Auto", recommended_limit) })

        if (wizard.umbrella_limit !== "") {
            umbrella_list.push({
                title: 'Umbrella',
                icon: Umbrella,
                value: wizard.umbrella_limit,
                message: umbrella_message
            })
        }

        if (wizard.secondary_vehicles) {
            const secondary_vehicles = JSON.parse(wizard.secondary_vehicles);
            if (secondary_vehicles) {
                for(let i = 0, len = secondary_vehicles.length; i < len; i++) {
                    name = secondary_vehicles[i];
                    icon = null;
                    if (name === 'Classic Car') {icon = ClassicCar; value = recommended_limit}
                    if (name === 'RV')          {icon = RV; value = recommended_limit}
                    if (name === 'Boat')        {icon = Boat; value = recommended_limit_2}
                    if (name === 'Motorcycle')  {icon = Motorcycle; value = recommended_limit}
                    if (name === 'Drone')  {icon = Drone; value = recommended_limit}
                    if (name === 'Golf Cart')   {icon = GolfCart; value = recommended_limit}
                    if (name === 'Watercraft')  {icon = Watercraft; value = recommended_limit_2}
                    if (name === 'Snowmobile')  {icon = Snowmobile; value = recommended_limit}
                    if (name === 'Off Road')    {icon = OffRoad; value = recommended_limit}
                    auto_list.push({ title: name, icon: icon, value: this.getMinLiability(name, value) })
                }
            }
        }

        return (
            <div id="liabilityCard">
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Recommended Liability Limits`} />
                    </div>
                }>
                    <Card style={{textAlign:"center"}}>

                        <div className="right-align">
                            <Button onClick={() => Print()}>
                                <Icon type="printer" />{' '}
                                <Translate text={`Print`} />
                            </Button>
                        </div>

                        <h2><Translate text={`Risk Assessment Calculator`} /></h2>

                        <p><Translate text={`Based on the information we just discussed, our Risk Assessment Calculator has determined that you need to protect assets in the amount of:`} /></p>

                        <div className="racAmount" style={{textAlign:"center",fontSize:40,marginBottom:30}}>{F.dollar_format(wizard.rac_calculator)}</div>

                        <h3><Translate text={`Liability Acknowledgement`} /></h3>
                        <p><Translate text={`(Acknowledges that you understand the results of the Risk Assessment Calculator)`} /></p>
                        <p><Translate text={`Acknowledge?`} /></p>

                        <RadioGroup value={wizard.acknowledge} onChange={(e) => updateField('acknowledge', e.target.value)}>
                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                        </RadioGroup>
                    </Card>
                    <Row gutter={40}>
                        <Col md={12} span={24}>
                            <List
                                itemLayout="horizontal"
                                dataSource={home_list}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div className="list-avatar">
                                                    <Avatar src={item.icon} style={{marginRight:10}} />
                                                    <Translate text={item.title} />
                                                </div>
                                            }
                                        />
                                        <div className="racAmount">{item.value}</div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col md={12} span={24}>
                            <List
                                itemLayout="horizontal"
                                dataSource={auto_list}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div className="list-avatar">
                                                    <Avatar src={item.icon} style={{marginRight:10}} />
                                                    <Translate text={item.title} />
                                                </div>
                                            }
                                        />
                                        <div className="racAmount">{item.value}</div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        {wizard.umbrella_limit !== "" ? (
                            <Col md={24} span={24}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={umbrella_list}
                                    renderItem={item => (
                                        <div>
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={
                                                        <div className="list-avatar">
                                                            <Avatar src={item.icon} style={{marginRight:10}} />
                                                            <Translate text={item.title} />
                                                        </div>
                                                    }
                                                />
                                                <div className="racAmount">{F.dollar_format(item.value)}</div>
                                            </List.Item>
                                            <div className="message" style={{marginTop:10}}>{item.message}</div>
                                        </div>
                                    )}
                                />
                            </Col>
                        ) : null}
                    </Row>

                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
