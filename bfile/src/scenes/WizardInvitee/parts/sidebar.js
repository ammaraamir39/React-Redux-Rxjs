import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    List
} from 'antd';
import F from '../../../Functions';
import Print from './print-rac';
import { Translate } from 'react-translated';

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
import Children from './images/bfile-kids.svg';
import Rent from './images/bfile-rent.svg';
import IRAs from './images/bfile-ira.svg';
import Annuities from './images/bfile-annuties.svg';
import SavingsAccounts from './images/bfile-savings-account.svg';
import CDs from './images/bfile-cd.svg';
import BrokerageAccounts from './images/bfile-brokerage-account.svg';
import Cryptocurrency from './images/icon-crypto.svg';
import None from './images/bfile-no.svg';
import Icon401K from './images/bfile-condominium.svg';
import Icon403b from './images/bfile-403b.svg';
import Icon457 from './images/bfile-457.svg';
import IconPensionFund from './images/icon-pensionfund.svg';
import IconNo from './images/bfile-no.svg';
import UniversalWholeLife from "./images/icon-universal.svg";
import Term from "./images/icon-term.svg";
import Employer from "./images/icon-employer.svg";
import Other from "./images/icon-other.svg";
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
import DeathBenefit from "./images/bfile-death-benefit.svg";

class Sidebar extends Component {
    componentDidMount = () => {

    }
    print = () => {

    }
    render() {

        const { wizard } = this.props;

        let auto_list = [];
        let home_list = [];
        let rac_list1 = [];
        let rac_list2 = [];
        let rac_list3 = [];

        if (wizard.primary_vehicles_toggle === '1' && wizard.primary_vehicles_num > 0) {
            auto_list.push({
                title: 'Auto',
                icon: Auto
            })
        }
        let name = null;
        let icon = null;
        if (wizard.secondary_vehicles) {
            const secondary_vehicles = JSON.parse(wizard.secondary_vehicles);
            if (secondary_vehicles) {
                for(let i = 0, len = secondary_vehicles.length; i < len; i++) {
                    name = secondary_vehicles[i];
                    icon = null;
                    if (name === 'Classic Car') icon = ClassicCar;
                    if (name === 'RV')          icon = RV;
                    if (name === 'Boat')        icon = Boat;
                    if (name === 'Motorcycle')  icon = Motorcycle;
                    if (name === 'Drone')  icon = Drone;
                    if (name === 'Golf Cart')   icon = GolfCart;
                    if (name === 'Watercraft')  icon = Watercraft;
                    if (name === 'Snowmobile')  icon = Snowmobile;
                    if (name === 'Off Road')    icon = OffRoad;
                    auto_list.push({ title: name, icon: icon })
                }
            }
        }

        if (wizard.home_toggle === '1') {
            home_list.push({ title: 'Primary Home', icon: Home })
        }
        if (wizard.home_toggle === '2') {
            home_list.push({ title: 'Rent', icon: Home })
        }
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
                    home_list.push({ title: name, icon: icon })
                }
            }
        }
        if (wizard.personal_property_toggle === '1') {
            home_list.push({ title: 'Personal Property', icon: Home })
        }
        if (wizard.home_toggle === '2' || wizard.secondary_home_toggle === '2') {
            home_list.push({ title: 'Rent', icon: Home })
        }

        if (wizard.children && wizard.children > 0) {
            rac_list1.push({ title: 'Children', icon: Children })
        }

        wizard.asset_accounts_obj = [];
        if (wizard.asset_accounts !== null && wizard.asset_accounts !== '') {
            wizard.asset_accounts_obj = JSON.parse(wizard.asset_accounts);
        }

        for (let i = 0; i < wizard.asset_accounts_obj.length; i++) {
            let item = wizard.asset_accounts_obj[i];
            let Icon;
            if (item === 'IRA\'s') Icon = IRAs;
            if (item === 'Annuities') Icon = Annuities;
            if (item === 'Savings Accounts') Icon = SavingsAccounts;
            if (item === 'CD\'s') Icon = CDs;
            if (item === 'Brokerage Accounts') Icon = BrokerageAccounts;
            if (item === 'Cryptocurrency') Icon = Cryptocurrency;
            if (item === 'None') Icon = None;
            if (item === '401k') Icon = Icon401K;
            if (item === '403b') Icon = Icon403b;
            if (item === '457') Icon = Icon457;
            if (item === 'Pension Fund') Icon = IconPensionFund;
            if (item === 'No') Icon = IconNo;
            rac_list2.push({ title: item, icon: Icon })
        }

        wizard.life_insurance_types = [];
        if (wizard.home_mortgage_protection_policy !== null && wizard.home_mortgage_protection_policy !== '') {
            wizard.life_insurance_types = JSON.parse(wizard.home_mortgage_protection_policy);
        }
        for (let i = 0; i < wizard.life_insurance_types.length; i++) {
            let item = wizard.life_insurance_types[i];
            let Icon;
            if (item === 'Universal/Whole-Life') Icon = UniversalWholeLife;
            if (item === 'Term') Icon = Term;
            if (item === 'Employer') Icon = Employer;
            if (item === 'Other') Icon = Other;
            rac_list2.push({ title: item, icon: Icon })
        }

        let asset_401k_accounts = [];
        if (wizard.asset_401k_accounts !== null && wizard.asset_401k_accounts !== '') {
            asset_401k_accounts = JSON.parse(wizard.asset_401k_accounts);
        }
        for (var i = 0; i < asset_401k_accounts.length; i++) {
            let Icon = null;
            if (asset_401k_accounts[i] === '401k') Icon = Icon401K;
            if (asset_401k_accounts[i] === '403b') Icon = Icon403b;
            if (asset_401k_accounts[i] === '457') Icon = Icon457;
            if (asset_401k_accounts[i] === 'Pension Fund') Icon = IconPensionFund;
            if (Icon) {
                rac_list2.push({ title: asset_401k_accounts[i], icon: Icon })
            }
        }
        if (wizard.home_mortgage_protection_benefit !== null && wizard.home_mortgage_protection_benefit !== "") {
          rac_list2.push({ title: "Death benefit", icon: DeathBenefit })
        }

        wizard.personal_property_types = [];
        if (wizard.personal_property_type !== null && wizard.personal_property_type !== '') {
            wizard.personal_property_types = JSON.parse(wizard.personal_property_type);
        }
        for (let i = 0; i < wizard.personal_property_types.length; i++) {
            let item = wizard.personal_property_types[i];
            let Icon;
            if (item === 'Jewelry') Icon = Jewelry;
            if (item === 'Furs') Icon = Furs;
            if (item === 'Cameras') Icon = Cameras;
            if (item === 'Musical instruments') Icon = MusicalInstruments;
            if (item === 'Silverware') Icon = Silverware;
            if (item === 'Fine arts') Icon = FineArts;
            if (item === 'Golfer\'s equipment') Icon = GolferEquipment;
            if (item === 'Sports equipment') Icon = SportsEquipment;
            if (item === 'Firearms') Icon = Firearms;
            if (item === 'Stamp collections') Icon = StampCollections;
            if (item === 'Coin collections') Icon = CoinCollections;

            rac_list3.push({ title: item, icon: Icon })
        }

        return (
            <Card className="wizardCard wizardCardRac" bordered={false} title={
                <div>
                    <Icon type="calculator" style={{marginRight:10}} />
                    <Translate text={`RAC Calculator`} />
                    <a className="close" onClick={() => window.document.querySelector('body').classList.toggle("show_rac")}>
                        <Icon type="close" theme="outlined" />
                    </a>
                </div>
            }>
                <Card bordered={false} className="racTotal">
                    <span className="title">Total: </span>
                    {F.dollar_format(wizard.rac_calculator)}
                </Card>
                <Card type="inner" title={<Translate text={`Auto`} />} style={{marginBottom:-1}}>
                    {auto_list.length ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={auto_list}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div className="list-avatar">
                                                <img src={item.icon} alt={item.title} style={{width:20,marginRight:10}} />
                                                <Translate text={item.title} />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : null}
                    <div className="cardFooter">
                        <Translate text={`Total`} />: <span>{F.dollar_format(wizard.rac_auto)}</span>
                    </div>
                </Card>
                {rac_list1.length ? (
                    <Card type="inner" style={{marginBottom:-1}}>
                        <List
                            itemLayout="horizontal"
                            dataSource={rac_list1}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div className="list-avatar">
                                                <img src={item.icon} alt={item.title} style={{width:20,marginRight:10}} />
                                                <Translate text={item.title} />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                <Card type="inner" title={<Translate text={`Home`} />} style={{marginBottom:-1}}>
                    {home_list.length ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={home_list}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div className="list-avatar">
                                                <img src={item.icon} alt={item.title} style={{width:20,marginRight:10}} />
                                                <Translate text={item.title} />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : null}
                    <div className="cardFooter">
                        <Translate text={`Total`} />: <span>{F.dollar_format(wizard.rac_home)}</span>
                    </div>
                </Card>

                <Card type="inner" title={<Translate text={`Financial/Life`} />} style={{marginBottom:-1}}>
                    {rac_list2.length ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={rac_list2}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div className="list-avatar">
                                                <img src={item.icon} alt={item.title} style={{width:20,marginRight:10}} />
                                                <Translate text={item.title} />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : null}
                    <div className="cardFooter">
                        <Translate text={`Total`} />: <span>{F.dollar_format(wizard.rac_financial)}</span>
                    </div>
                </Card>

                <Card type="inner" title={<Translate text={`Special Personal Property`} />} style={{marginBottom:-1}}>
                    {rac_list3.length ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={rac_list3}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div className="list-avatar">
                                                <img src={item.icon} alt={item.title} style={{width:20,marginRight:10}} />
                                                <Translate text={item.title} />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : null}
                    <div className="cardFooter">
                        <Translate text={`Total`} />: <span>{F.dollar_format(wizard.rac_customary_items)}</span>
                    </div>
                </Card>

                <Card bordered={false} className="center-align">
                    <Button onClick={() => Print()}><Icon type="printer" /> <Translate text={`Print RAC`} /></Button>
                </Card>
            </Card>
        );

    }
}

export default Sidebar;
