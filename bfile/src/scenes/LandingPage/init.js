import React, { Component } from 'react';
import {
    Icon,
    Avatar,
    Divider
} from 'antd';
import F from '../../Functions';
import ClassicCar from '../Wizard/parts/images/bfile-classic_car.svg';
import RV from '../Wizard/parts/images/bfile-rv.svg';
import Boat from '../Wizard/parts/images/bfile-boat.svg';
import Motorcycle from '../Wizard/parts/images/bfile-motorcycle.svg';
import Drone from '../Wizard/parts/images/icon-drone.svg';
import GolfCart from '../Wizard/parts/images/bfile-golf_cart.svg';
import Watercraft from '../Wizard/parts/images/bfile-watercraft.svg';
import Snowmobile from '../Wizard/parts/images/bfile-snowmobile.svg';
import OffRoad from '../Wizard/parts/images/bfile-offroad.svg';
import SecondaryHome from '../Wizard/parts/images/bfile-homeowners.svg';
import MFGHome from '../Wizard/parts/images/bfile-mfg.svg';
import Condominium from '../Wizard/parts/images/bfile-condominium.svg';
import Landlord from '../Wizard/parts/images/bfile-landlord.svg';
import Renter from '../Wizard/parts/images/bfile-renter.svg';
import VacantProperty from '../Wizard/parts/images/bfile-vacant-land.svg';
import Umbrella from '../Wizard/parts/images/bfile-umbrella.svg';
import Auto from '../Wizard/parts/images/bfile-classic_car.svg';
import Home from '../Wizard/parts/images/bfile-homeowners.svg';
import Insurance from '../Wizard/parts/images/bfile-insurance.svg';
import Annuity from '../Wizard/parts/images/bfile-annuties.svg';
import MutualFunds from '../Wizard/parts/images/bfile-currency.svg';
import IRAs from '../Wizard/parts/images/bfile-ira.svg';
import Annuities from '../Wizard/parts/images/bfile-annuties.svg';
import SavingsAccounts from '../Wizard/parts/images/bfile-savings-account.svg';
import CDs from '../Wizard/parts/images/bfile-cd.svg';
import BrokerageAccounts from '../Wizard/parts/images/bfile-brokerage-account.svg';
import Cryptocurrency from '../Wizard/parts/images/icon-crypto.svg';
import None from '../Wizard/parts/images/bfile-no.svg';
import Icon401K from '../Wizard/parts/images/bfile-condominium.svg';
import Icon403b from '../Wizard/parts/images/bfile-403b.svg';
import Icon457 from '../Wizard/parts/images/bfile-457.svg';
import IconPensionFund from '../Wizard/parts/images/icon-pensionfund.svg';
import IconNo from '../Wizard/parts/images/bfile-no.svg';
import { Translate } from 'react-translated';
import moment from 'moment';

const init = (bfile) => {

    let status_data = [];
    let life_stage_data = [];
    let financial_recommendations_data = [];
    let assets_account_data = [];
    let employment_data = [];
    let household_total_assets_data = [];
    let pc_cross_sell_opp_data = [];
    let items_sold_data = [];
    let renewal_policies_data = [];

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

    bfile.life_insurance_types = [];
    if (bfile.home_mortgage_protection_policy !== null && bfile.home_mortgage_protection_policy !== '') {
        bfile.life_insurance_types = JSON.parse(bfile.home_mortgage_protection_policy);
    }

    bfile.asset_accounts_obj = [];
    if (bfile.asset_accounts !== null && bfile.asset_accounts !== '') {
        bfile.asset_accounts_obj = JSON.parse(bfile.asset_accounts);
    }

    bfile.life_stage = F.bfile_life_stage(bfile);

    if (bfile.agency.name !== '') {
        status_data.push({
            name: <Translate text={`Agency`} />,
            value: bfile.agency.name
        })
    }
    if (bfile.agency.address !== '') {
        status_data.push({
            name: <Translate text={`Agency Address`} />,
            value: bfile.agency.address
        })
    }
    status_data.push({
        name: <Translate text={`Thank You/Life & Retirement Call Attempts (Not Reached)`} />,
        value: bfile.onboarding_attempts || '0'
    });
    if (bfile.onboarding_reached !== '') {
        status_data.push({
            name: <Translate text={`Thank You/Life & Retirement Call Reached`} />,
            value: <Translate text={(bfile.onboarding_reached) ? bfile.onboarding_reached : ''} />
        });
    }
    if (bfile.financial_attempts !== '') {
        status_data.push({
            name: <Translate text={`Life & Retirement Call Attempts (Not Reached)`} />,
            value: bfile.financial_attempts + ''
        });
    }
    if (bfile.financial_reached !== '') {
        status_data.push({
            name: <Translate text={`Life & Retirement Call Reached`} />,
            value: <Translate text={(bfile.financial_reached) ? bfile.financial_reached : ''} />
        });
    }
    /*status_data.push({
        name: <Translate text={`Thank You/Life & Retirement Call`} />,
        value: (bfile.is_onboarded === 1 && bfile.questions.length > 0 && bfile.questions[0].financial_conversion_action !== null) ? 'Yes' : 'No'
    });*/
    status_data.push({
        name: <Translate text={`Type`} />,
        value: <Translate text={(bfile.status) ? bfile.status : ''} />
    });
    const bfile_status = F.bfile_status(bfile);
    status_data.push({
        name: <Translate text={`BFile Status`} />,
        value: <Translate text={(bfile_status) ? bfile_status : ''} />
    });
    if (bfile.user) {
        status_data.push({
            name: <Translate text={`BFile Creator`} />,
            value: bfile.user.first_name + ' ' + bfile.user.last_name
        });
    }
    if (bfile.onboarding_id) {
        status_data.push({
            name: <Translate text={`On-Boarder`} />,
            value: bfile.onboarding_user.first_name + ' ' + bfile.onboarding_user.last_name
        });
    }
    if (bfile.financial_id) {
        status_data.push({
            name: <Translate text={`Financial Specialist`} />,
            value: bfile.financial_user.first_name + ' ' + bfile.financial_user.last_name
        });
    }
    if (bfile.rs_appointment_date !== null && bfile.rs_appointment_date !== '') {
        status_data.push({
            name: <Translate text={`Appointment Date`} />,
            value: moment(new Date(bfile.rs_appointment_date)).format('MM/DD/YYYY hh:mmA')
        });
    }
    if (bfile.rs_policy_type !== null && bfile.rs_policy_type !== '') {
        status_data.push({
            name: <Translate text={`Policy Type`} />,
            value: bfile.rs_policy_type
        });
    }
    if (bfile.expiration_date !== null && bfile.expiration_date !== '') {
        status_data.push({
            name: <Translate text={`Expiration Date`} />,
            value: moment(new Date(bfile.expiration_date)).format('MM/DD/YYYY')
        });
    }
    if (bfile.rs_effective_date !== null && bfile.rs_effective_date !== '') {
        status_data.push({
            name: <Translate text={`Effective Date`} />,
            value: moment(new Date(bfile.rs_effective_date)).format('MM/DD/YYYY')
        });
    }
    if (bfile.type_of_call !== null && bfile.type_of_call !== '') {
        status_data.push({
            name: <Translate text={`Type of Call`} />,
            value: bfile.type_of_call
        });
    }
    if (bfile.birthday !== null && bfile.birthday !== '') {
        life_stage_data.push({
            name: <Translate text={`Ages`} />,
            value: F.bfile_get_ages(bfile).join('/')
        })
    }
    if (bfile.children !== null && bfile.children !== '' && bfile.children > 0) {
        life_stage_data.push({
            name: <Translate text={`Number of Children`} />,
            value: bfile.children + ''
        });
    }
    if (bfile.home_mortgage_toggle === '1') {
        life_stage_data.push({
            name: <Translate text={`Primary Mortgage Balance`} />,
            value: bfile.home_mortgage
        });
    }
    if (bfile.secondary_home_mortgage_toggle === '1') {
        life_stage_data.push({
            name: <Translate text={`Total Additional Mortgage Balances`} />,
            value: bfile.secondary_home_mortgage
        });
    }
    if (bfile.home_mortgage_protection_toggle === '0') {
        life_stage_data.push({
            name: <Translate text={`Life Insurance`} />,
            value: <Translate text={`No Life Insurance`} />
        });
    }
    if (bfile.home_mortgage_protection_toggle === '1') {
        life_stage_data.push({
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
                            <span className="blackText"><Translate text={`Amount`} />:</span>{' '}
                            {bfile.home_mortgage_protection_benefit}
                        </p>
                    ) : null}
                </div>
            )
        });
    }
    if (typeof bfile.life_stage.title !== 'undefined' && bfile.life_stage.title !== '') {
        life_stage_data.push({
            name: '',
            value: (
                <div>
                    <h3>
                        <Avatar src={bfile.life_stage.thumb} style={{ marginRight: 10 }} />
                        <Translate text={(bfile.life_stage.title) ? bfile.life_stage.title : ''} />
                    </h3>
                    <p><Translate text={(bfile.life_stage.desc) ? bfile.life_stage.desc : ''} /></p>
                </div>
            )
        });
    }

    if (bfile.asset_401k_accounts !== "" && bfile.asset_preservation_value !== null && bfile.asset_preservation_value !== '') {
        const asset_401k_accounts = JSON.parse(bfile.asset_401k_accounts);
        if (asset_401k_accounts.length > 0) {
            assets_account_data.push({
                name: <Translate text={asset_401k_accounts.join(' & ') + ` - Value`} />,
                value: bfile.asset_preservation_value
            });
        }
    }
    if (bfile.employed_anual_income !== null && bfile.employed_anual_income !== '') {
        assets_account_data.push({
            name: <Translate text={`Household Income`} />,
            value: bfile.employed_anual_income
        });
    }
    assets_account_data.push({
        name: <Translate text={`Asset Accounts`} />,
        value: (
            <div>
                {bfile.asset_accounts_obj.length === 0 ? <span><Translate text={`No`} /></span> : (
                    <div><Translate text={`Yes`} /> <Divider /></div>
                )}
                {bfile.asset_accounts_obj.length > 0 ? (
                    <div>
                        {bfile.asset_accounts_obj.map((item, i) => {
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
                            return (
                                <div key={i}>
                                    <img src={Icon} alt={item} style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                                    <Translate text={(item) ? item : ''} />
                                </div>
                            )
                        })}
                        <Divider />
                    </div>
                ) : null}
                {bfile.asset_total_value !== null && bfile.asset_total_value !== '' ? (
                    <div>
                        <span className="blackText"><Translate text={`Total Value of Asset Acc'ts.:`} /></span>{' '}
                        {bfile.asset_total_value}
                    </div>
                ) : null}
            </div>
        )
    });
    if (bfile.asset_401k_accounts !== "" && bfile.asset_preservation_value !== null && bfile.asset_preservation_value !== '') {
        let asset_401k_accounts = JSON.parse(bfile.asset_401k_accounts);
        if (asset_401k_accounts.indexOf("Pension Fund") >= 0) {
            asset_401k_accounts.splice(asset_401k_accounts.indexOf("Pension Fund"), 1);
        }
        if (asset_401k_accounts.length > 0) {
            financial_recommendations_data.push({
                name: (
                    <div>
                        <img src={Icon401K} alt={`401K`} style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                        {asset_401k_accounts.join(' & ')}
                    </div>
                ),
                value: <Translate text={`Re-balance / Diversification Conversation`} />
            });
        }
    }
    if (bfile.asset_401k_accounts !== "" && bfile.asset_preservation_value !== null && bfile.asset_preservation_value !== '') {
        const asset_401k_accounts1 = JSON.parse(bfile.asset_401k_accounts);
        if (asset_401k_accounts1.indexOf("Pension Fund") >= 0) {
            financial_recommendations_data.push({
                name: (
                    <div>
                        <img src={IconPensionFund} alt={`401K`} style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                        Pension Fund
                    </div>
                ),
                value: <Translate text={`Retirement Conversation`} />
            });
        }
    }
    if (bfile.asset_accounts_obj.indexOf('IRA\'s') >= 0) {
        financial_recommendations_data.push({
            name: (
                <div>
                    <img src={IRAs} alt={`IRA`} style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                    <Translate text={`IRA`} />
                </div>
            ),
            value: <Translate text={`Re-balance / Diversification Conversation`} />
        });
    }
    if (bfile.asset_accounts_obj.indexOf('CD\'s') >= 0) {
        financial_recommendations_data.push({
            name: (
                <div>
                    <img src={Icon401K} alt={`401K`} style={{ width: 16, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                    <Translate text={`CD's`} />
                </div>
            ),
            value: <Translate text={`Rate Conversation`} />
        });
    }
    if (bfile.business_owner_toggle === '1') {
        employment_data.push({
            name: <Translate text={`Ownership interest in a business`} />,
            value: <Translate text={`Yes`} />
        });
        if (bfile.business_name !== '') {
            employment_data.push({
                name: <Translate text={`Business Name`} />,
                value: bfile.business_name
            });
        }
        if (bfile.business_type !== '') {
            employment_data.push({
                name: <Translate text={`Business Type`} />,
                value: bfile.business_type
            });
        }
    }
    if (bfile.business_owner_toggle === '0') {
        let is_employed = `No (${bfile.employed_retired_disabled})`;
        if (bfile.employed_retired_disabled !== null && bfile.employed_retired_disabled !== '' && bfile.employed_retired_disabled === 'Unemployed') {
            is_employed = 'Unemployed';
        }
        if (bfile.employed_toggle === '0' && (bfile.employed_retired_disabled === null || bfile.employed_retired_disabled === '')) {
            is_employed = 'Homemaker';
        }
        employment_data.push({
            name: <Translate text={`Employed`} />,
            value: (
                <div>
                    {bfile.employed_toggle === '1' ? <Translate text={`Yes`} /> : <Translate text={is_employed} />}
                </div>
            )
        });
        if (bfile.employed_toggle === '1' && bfile.employer_name !== '') {
            employment_data.push({
                name: <Translate text={`Employer Name`} />,
                value: bfile.employer_name
            });
        }
        if (bfile.employed_toggle === '1' && bfile.employer_years !== '') {

            const employer_years_options = {
                "Under 1 Year": "Under 1 Year",
                "1 to 5": "1 to 5 years",
                "5 to 10": "5 to 10 years",
                "10 +": "10+ years"
            };

            if (bfile.employer_years in employer_years_options) {
                bfile.employer_years = employer_years_options[bfile.employer_years];
            }

            employment_data.push({
                name: <Translate text={`Worked there`} />,
                value: bfile.employer_years
            });
        }
    }
    if (bfile.employed_anual_income !== null && bfile.employed_anual_income !== '') {
        household_total_assets_data.push({
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
        items_sold.push({ name: "Auto", icon: Auto });
    } else if (bfile.auto_sold_toggle === "0" || bfile.auto_sold_toggle === "2") {
        cross_sell_opportunities.push({ name: "Auto", icon: Auto });
    }
    if (bfile.home_sold_toggle === "1") {
        items_sold.push({ name: "Home", icon: Home });
    } else if (bfile.home_sold_toggle === "0" || bfile.home_sold_toggle === "2") {
        cross_sell_opportunities.push({ name: "Home", icon: Home });
    }

    let icon = null;
    bfile.products_sold = [];
    if (bfile.financial_conversion.length > 0) {
        if (bfile.financial_conversion[0].appointment_status === "Complete Sold") {
            var products_sold = bfile.financial_conversion[0].products_sold;
            var json = [];
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
        if (item === "Rent") icon = SecondaryHome;
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
        pc_cross_sell_opp_data.push({
            name: (
                <div>
                    <img src={item.icon} alt={item.name} style={{ width: 20, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                    <Translate text={(item.name) ? item.name : ''} />
                </div>
            ),
            value: ''
        })
    }

    for (let i = 0, len = items_sold.length; i < len; i++) {
        item = items_sold[i];
        items_sold_data.push({
            name: (
                <div>
                    <img src={item.icon} alt={item.name} style={{ width: 20, opacity: 0.6, marginRight: 10, verticalAlign: "middle" }} />
                    <Translate text={(item.name) ? item.name : ''} />
                </div>
            ),
            value: ''
        })
    }

    if (bfile.auto_sold_toggle === '1') {
        renewal_policies_data.push({
            name: <Translate text={`Auto`} />,
            value: F.bfile_renewal_date(bfile.auto_policy_sold_effective_date, bfile.auto_policy_sold_term)
        });
    }

    if (bfile.home_sold_toggle === '1') {
        renewal_policies_data.push({
            name: <Translate text={`Home`} />,
            value: F.bfile_renewal_date(bfile.home_policy_sold_effective_date, bfile.home_policy_sold_term)
        });
    }

    return [
        { id: 'card_status', title: (<Translate text={`Status`} />), data: status_data },
        { id: 'card_life_stage', title: (<Translate text={`Life Stage`} />), data: life_stage_data },
        { id: 'card_asset_accounts', title: (<Translate text={`Asset Accounts / Retirement Opportunities`} />), data: assets_account_data },
        { id: 'card_financial_rec', title: (<Translate text={`B-File Financial Recommendations`} />), data: financial_recommendations_data },
        { id: 'card_employment', title: (<Translate text={`Employment`} />), data: employment_data },
        { id: 'card_household', title: (<Translate text={`Household Total Assets`} />), data: household_total_assets_data },
        { id: 'card_cross_sell_opp', title: (<Translate text={`P&C Cross Sell Opportunities`} />), data: pc_cross_sell_opp_data },
        { id: 'card_items_sold', title: (<Translate text={`Items Sold`} />), data: items_sold_data },
        { id: 'card_renewal_policies', title: (<Translate text={`Renewal Policies`} />), data: renewal_policies_data }
    ];
}

export default init;
