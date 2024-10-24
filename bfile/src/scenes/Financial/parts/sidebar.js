import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    List,
    Divider,
    Avatar
} from 'antd';
import { Link } from "react-router-dom";
import F from '../../../Functions';
import { Translate } from 'react-translated';

import Icon401K from '../../Wizard/parts/images/bfile-condominium.svg';
import Icon403b from '../../Wizard/parts/images/bfile-403b.svg';
import Icon457 from '../../Wizard/parts/images/bfile-457.svg';
import IRAs from '../../Wizard/parts/images/bfile-ira.svg';
import Annuities from '../../Wizard/parts/images/bfile-annuties.svg';
import SavingsAccounts from '../../Wizard/parts/images/bfile-savings-account.svg';
import CDs from '../../Wizard/parts/images/bfile-cd.svg';
import BrokerageAccounts from '../../Wizard/parts/images/bfile-brokerage-account.svg';
import Cryptocurrency from '../../Wizard/parts/images/icon-crypto.svg';
import ClassicCar from '../../Wizard/parts/images/bfile-classic_car.svg';
import RV from '../../Wizard/parts/images/bfile-rv.svg';
import Boat from '../../Wizard/parts/images/bfile-boat.svg';
import Motorcycle from '../../Wizard/parts/images/bfile-motorcycle.svg';
import Drone from '../../Wizard/parts/images/icon-drone.svg';
import GolfCart from '../../Wizard/parts/images/bfile-golf_cart.svg';
import Watercraft from '../../Wizard/parts/images/bfile-watercraft.svg';
import Snowmobile from '../../Wizard/parts/images/bfile-snowmobile.svg';
import OffRoad from '../../Wizard/parts/images/bfile-offroad.svg';
import SecondaryHome from '../../Wizard/parts/images/bfile-homeowners.svg';
import MFGHome from '../../Wizard/parts/images/bfile-mfg.svg';
import Condominium from '../../Wizard/parts/images/bfile-condominium.svg';
import Landlord from '../../Wizard/parts/images/bfile-landlord.svg';
import Renter from '../../Wizard/parts/images/bfile-renter.svg';
import VacantProperty from '../../Wizard/parts/images/bfile-vacant-land.svg';
import Umbrella from '../../Wizard/parts/images/bfile-umbrella.svg';
import Auto from '../../Wizard/parts/images/bfile-classic_car.svg';
import Home from '../../Wizard/parts/images/bfile-homeowners.svg';
import Insurance from '../../Wizard/parts/images/bfile-insurance.svg';
import Annuity from '../../Wizard/parts/images/bfile-annuties.svg';
import MutualFunds from '../../Wizard/parts/images/bfile-currency.svg';

class Sidebar extends Component {
    render() {

        const { bfile, wizard } = this.props;
        const dashboardList = [];
        const agencyInfoList = [];
        const lifeStageList = [];
        const personalPropertyList = [];
        const itemsSoldInHouseholdList = [];
        const financialAssetsList = [];
        const employmentList = [];
        const totalHouseholdAssetsList = [];
        const crossSellOppList = [];

        if (wizard.ready) {
            bfile.onboarding_attempts = 0;
            bfile.onboarding_reached = '';
            bfile.financial_attempts = 0;
            bfile.financial_reached = '';

            if (bfile.questions.length > 0) {
                const ea_wizard = bfile.questions[0];
                if (ea_wizard.call_attempts !== '' && ea_wizard.call_attempts !== null) {
                    bfile.onboarding_attempts = ea_wizard.call_attempts;
                }
                if (ea_wizard.call_reached_toggle === "1") {
                    bfile.onboarding_reached = "Yes";
                } else {
                    bfile.onboarding_reached = "No";
                }
            }

            if (bfile.financial_conversion.length > 0) {
                const financial_wizard = bfile.financial_conversion[0];
                if (financial_wizard.call_attempts !== "" && financial_wizard.call_attempts !== null) {
                    bfile.financial_attempts = financial_wizard.call_attempts;
                }
                if (financial_wizard.call_reached_toggle === "1") {
                    bfile.financial_reached = "Yes";
                    bfile.financial_attempts++;
                } else {
                    bfile.financial_reached = "No";
                }
            }

            if (bfile.home_mortgage_protection_policy !== null && bfile.home_mortgage_protection_policy !== '') {
                bfile.life_insurance_types = JSON.parse(bfile.home_mortgage_protection_policy);
            }

            bfile.asset_accounts_obj = [];
            if (bfile.asset_accounts !== null && bfile.asset_accounts !== '') {
                bfile.asset_accounts_obj = JSON.parse(bfile.asset_accounts);
            }

            dashboardList.push({
                name: <Translate text={`Customer Name`} />,
                value: <Link to={"/customer/" + bfile.id}>{bfile.first_name + ' ' + bfile.last_name}</Link>
            });
            if (bfile.spouse_first_name !== null && bfile.spouse_first_name !== '') {
                dashboardList.push({
                    name: <Translate text={`Customer Spouse Name`} />,
                    value: bfile.spouse_first_name + ' ' + bfile.spouse_last_name
                });
            }
            if (bfile.phone !== null && bfile.phone !== '') {
                dashboardList.push({
                    name: <Translate text={`Customer Phone`} />,
                    value: F.phone_format(bfile.phone)
                });
            }
            if (bfile.email !== null && bfile.email !== '') {
                dashboardList.push({
                    name: <Translate text={`Customer Email`} />,
                    value: bfile.email
                });
            }
            agencyInfoList.push({
                name: <Translate text={`Name`} />,
                value: bfile.agency.name
            });
            agencyInfoList.push({
                name: <Translate text={`Address`} />,
                value: bfile.agency.address
            });
            if (bfile.birthday !== null && bfile.birthday !== '') {
                lifeStageList.push({
                    name: <Translate text={`Ages`} />,
                    value: F.bfile_get_ages(bfile)
                })
            }
            if (bfile.children !== null && bfile.children !== '' && bfile.children > 0) {
                lifeStageList.push({
                    name: <Translate text={`Number of Children`} />,
                    value: bfile.children + ''
                });
            }
            if (bfile.home_mortgage_toggle === '1') {
                lifeStageList.push({
                    name: <Translate text={`Primary Mortgage Balance`} />,
                    value: bfile.home_mortgage
                });
            }
            if (bfile.secondary_home_mortgage_toggle === '1') {
                lifeStageList.push({
                    name: <Translate text={`Total Additional Mortgage Balances`} />,
                    value: bfile.secondary_home_mortgage
                });
            }
            if (bfile.home_mortgage_protection_toggle === '0') {
                lifeStageList.push({
                    name: <Translate text={`Life Insurance`} />,
                    value: <Translate text={`No Life Insurance`} />
                });
            }
            if (bfile.home_mortgage_protection_toggle === '1') {
                lifeStageList.push({
                    name: <Translate text={`Life Insurance Owned`} />,
                    value: (
                        <div>
                            {typeof bfile.life_insurance_types !== "undefined" ? (
                                <p>
                                    <span className="blackText">Types:</span>{' '}
                                    {bfile.life_insurance_types.join(', ')}
                                </p>
                            ) : null}
                            {bfile.home_mortgage_protection_benefit !== '' ? (
                                <p>
                                    <span className="blackText">Amount:</span>{' '}
                                    {bfile.home_mortgage_protection_benefit}
                                </p>
                            ) : null}
                        </div>
                    )
                });
            }
            bfile.life_stage = F.bfile_life_stage(bfile);
            if (typeof bfile.life_stage.title !== 'undefined' && bfile.life_stage.title !== '') {
                lifeStageList.push({
                    name: <Translate text={``} />,
                    value: (
                        <div>
                            <Avatar src={bfile.life_stage.thumb} style={{ marginRight: 10 }} />
                            <h3><Translate text={bfile.life_stage.title} /></h3>
                        </div>
                    )
                });
            }
            if (bfile.personal_property_toggle === 1) {
                if (bfile.personal_property_type !== null && bfile.personal_property_type !== '') {
                    personalPropertyList.push({
                        name: <Translate text={`Types`} />,
                        value: (JSON.parse(bfile.personal_property_type)).join(", ")
                    });
                }
                personalPropertyList.push({
                    name: <Translate text={`Value`} />,
                    value: bfile.personal_property_value
                });
            }
            if (bfile.asset_preservation_value !== null && bfile.asset_preservation_value !== '') {
                const asset_401k_accounts_obj = [];
                if (bfile.asset_401k_accounts !== null && bfile.asset_401k_accounts !== '') {
                    bfile.asset_401k_accounts_obj = JSON.parse(bfile.asset_401k_accounts);
                    if (bfile.asset_401k_accounts_obj.length > 0 && bfile.asset_401k_accounts_obj[0] !== 'None') {
                        for (let i = 0, len = bfile.asset_401k_accounts_obj.length; i < len; i++) {
                            if (bfile.asset_401k_accounts_obj[i] === '401k') {
                                asset_401k_accounts_obj.push({
                                    icon: Icon401K,
                                    name: '401k'
                                })
                            }
                            if (bfile.asset_401k_accounts_obj[i] === '403b') {
                                asset_401k_accounts_obj.push({
                                    icon: Icon403b,
                                    name: '403b'
                                })
                            }
                            if (bfile.asset_401k_accounts_obj[i] === '457') {
                                asset_401k_accounts_obj.push({
                                    icon: Icon457,
                                    name: '457'
                                })
                            }
                        }
                    }
                }
                financialAssetsList.push({
                    name: <Translate text={`401K - Value`} />,
                    value: (
                        <div>
                            {bfile.asset_preservation_value}
                            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                            {asset_401k_accounts_obj.map((item, i) => (
                                <div key={i}>
                                    <img src={item.icon} alt="401k" style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    )
                });
            }
            if (bfile.asset_total_value !== null && bfile.asset_total_value !== '') {
                const asset_accounts_obj = [];
                if (bfile.asset_accounts !== null && bfile.asset_accounts !== '') {
                    bfile.asset_accounts_obj = JSON.parse(bfile.asset_accounts);

                    for (let i = 0, len = bfile.asset_accounts_obj.length; i < len; i++) {
                        let icon = null;
                        if (bfile.asset_accounts_obj[i] === 'IRA\'s') icon = IRAs;
                        if (bfile.asset_accounts_obj[i] === 'Annuities') icon = Annuities;
                        if (bfile.asset_accounts_obj[i] === 'Savings Accounts') icon = SavingsAccounts;
                        if (bfile.asset_accounts_obj[i] === 'CD\'s') icon = CDs;
                        if (bfile.asset_accounts_obj[i] === 'Brokerage Accounts') icon = BrokerageAccounts;
                        if (bfile.asset_accounts_obj[i] === 'Cryptocurrency') icon = Cryptocurrency;

                        asset_accounts_obj.push({
                            icon: icon,
                            name: <Translate text={bfile.asset_accounts_obj[i]} />
                        });
                    }

                    financialAssetsList.push({
                        name: <Translate text={`Asset Accounts`} />,
                        value: (
                            <div>
                                {bfile.asset_total_value}
                                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                                {asset_accounts_obj.map((item, i) => (
                                    <div key={i}>
                                        <img src={item.icon} alt="401k" style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )
                    });
                }
            }
            if (bfile.employed_anual_income !== null && bfile.employed_anual_income !== '') {
                financialAssetsList.push({
                    name: <Translate text={`Household Income`} />,
                    value: bfile.employed_anual_income
                });
            }
            if (bfile.business_owner_toggle === '1') {
                employmentList.push({
                    name: <Translate text={`Ownership interest in a business`} />,
                    value: <Translate text={`Yes`} />
                });

                if (bfile.business_name !== null && bfile.business_name !== '') {
                    employmentList.push({
                        name: <Translate text={`Business Name`} />,
                        value: bfile.business_name
                    });
                }
                if (bfile.business_type !== null && bfile.business_type !== '') {
                    employmentList.push({
                        name: <Translate text={`Business Type`} />,
                        value: bfile.business_type
                    });
                }
            }
            if (bfile.business_owner_toggle === '0') {
                let employed = null;
                if (bfile.employed_toggle === '1') {
                    employed = 'Yes';
                } else {
                    if (bfile.employed_retired_disabled !== null && bfile.employed_retired_disabled !== '') {
                        if (bfile.employed_retired_disabled !== 'Unemployed') {
                            employed = 'No (' + bfile.employed_retired_disabled + ')';
                        } else {
                            employed = 'Unemployed';
                        }
                    } else {
                        employed = 'Homemaker';
                    }
                }
                employmentList.push({
                    name: <Translate text={`Employed`} />,
                    value: <Translate text={employed} />
                });

                if (bfile.employed_toggle === '1') {
                    if (bfile.employer_name !== null && bfile.employer_name !== '') {
                        employmentList.push({
                            name: <Translate text={`Employer Name`} />,
                            value: bfile.employer_name
                        });
                    }
                    if (bfile.employer_years !== null && bfile.employer_years !== '') {
                        employmentList.push({
                            name: <Translate text={`Worked there`} />,
                            value: bfile.employer_years
                        });
                    }
                }
            }
            if (bfile.liability_calculator_value !== null && bfile.liability_calculator_value !== '') {
                totalHouseholdAssetsList.push({
                    name: (
                        <div>
                            <Icon type="calculator" style={{ marginRight: 10, color: "#3baa9e" }} />
                            <Translate text={`Household Total Assets`} />
                        </div>
                    ),
                    value: F.dollar_format(bfile.liability_calculator_value)
                })
            }

            let items_sold = [];
            let cross_sell_opportunities = [];
            if (bfile.auto_sold_toggle === "1") {
                items_sold.push({ name: `Auto`, icon: Auto });
            } else if (bfile.auto_sold_toggle === "0" || bfile.auto_sold_toggle === "2") {
                cross_sell_opportunities.push({ name: `Auto`, icon: Auto });
            }
            if (bfile.home_sold_toggle === "1") {
                items_sold.push({ name: `Home`, icon: Home });
            } else if (bfile.home_sold_toggle === "0" || bfile.home_sold_toggle === "2") {
                cross_sell_opportunities.push({ name: `Home`, icon: Home });
            }

            let icon = null;
            bfile.products_sold = [];
            if (bfile.financial_conversion.length > 0) {
                if (bfile.financial_conversion[0].appointment_status === "Complete Sold") {
                    const products_sold = bfile.financial_conversion[0].products_sold;
                    let json = [];
                    if (products_sold !== "" && products_sold !== 0 && products_sold !== null) {
                        json = JSON.parse(products_sold);
                    }
                    bfile.products_sold = json;
                    for (let i = 0, len = json.length; i < len; i++) {
                        if (json[i].product_sold !== "") {
                            var product_sold = json[i].product_sold;
                            icon = Insurance;
                            if (product_sold === "Annuity") {
                                icon = Annuity;
                            }
                            if (product_sold === "Mutual Funds") {
                                icon = MutualFunds;
                            }
                            items_sold.push({
                                name: product_sold,
                                icon: icon
                            });
                        }
                    }
                }
            }
            let item = null;
            for (let i = 0, len = bfile.policies.length; i < len; i++) {
                item = bfile.policies[i].policy_type;
                if (item === "Classic Car") icon = ClassicCar;
                if (item === "RV") icon = RV;
                if (item === "Boat") icon = Boat;
                if (item === "Motorcycle") icon = Motorcycle;
                if (item === "Drone") icon = Drone;
                if (item === "Golf Cart") icon = GolfCart;
                if (item === "Watercraft") icon = Watercraft;
                if (item === "Snowmobile") icon = Snowmobile;
                if (item === "Off Road") icon = OffRoad;
                if (item === "Secondary Home") icon = SecondaryHome;
                if (item === "MFG Home") icon = MFGHome;
                if (item === "Condominium") icon = Condominium;
                if (item === "Landlord") icon = Landlord;
                if (item === "Renter") icon = Renter;
                if (item === "Vacant Property") icon = VacantProperty;
                if (item === "Umbrella") icon = Umbrella;
                if (bfile.policies[i].policy_sold !== 1) {
                    cross_sell_opportunities.push({ name: item, icon: icon });
                }
                if (bfile.policies[i].policy_sold === 1) {
                    items_sold.push({ name: item, icon: icon });
                }
            }

            for (let i = 0, len = cross_sell_opportunities.length; i < len; i++) {
                item = cross_sell_opportunities[i];
                crossSellOppList.push({
                    name: (
                        <div>
                            <img src={item.icon} alt={item.name} style={{ width: 20, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                            <Translate text={item.name} />
                        </div>
                    ),
                    value: ''
                })
            }

            for (let i = 0, len = items_sold.length; i < len; i++) {
                item = items_sold[i];
                itemsSoldInHouseholdList.push({
                    name: (
                        <div>
                            <img src={item.icon} alt={item.name} style={{ width: 20, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                            <Translate text={item.name} />
                        </div>
                    ),
                    value: ''
                })
            }
        }

        return (
            <div>
                <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Dashboard`} />}>
                    <List
                        loading={!wizard.ready}
                        itemLayout="horizontal"
                        dataSource={dashboardList}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta title={item.name} description={item.value} />
                            </List.Item>
                        )}
                    />
                </Card>
                {agencyInfoList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Agency Info`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={agencyInfoList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {lifeStageList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Life Stage`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={lifeStageList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {personalPropertyList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Personal Property`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={personalPropertyList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {financialAssetsList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Financial Assets`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={financialAssetsList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {employmentList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Employment`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={employmentList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {totalHouseholdAssetsList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard" bordered={false} title={<Translate text={`Total Household Assets`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={totalHouseholdAssetsList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {itemsSoldInHouseholdList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard listCardOneColumn" bordered={false} title={<Translate text={`Items Sold In Household`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={itemsSoldInHouseholdList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
                {crossSellOppList.length > 0 ? (
                    <Card className="wizardCard sidebarCard listCard listCardOneColumn" bordered={false} title={<Translate text={`Cross Sell Opportunities`} />}>
                        <List
                            loading={!wizard.ready}
                            itemLayout="horizontal"
                            dataSource={crossSellOppList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : null}
            </div>
        );

    }
}

export default Sidebar;
