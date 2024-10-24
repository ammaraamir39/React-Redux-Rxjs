import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message,
    Select,
    Input
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate, Translator } from 'react-translated';

const Option = Select.Option;
const InputGroup = Input.Group;

class Filters extends Component {
    updateField = (name, val) => {
        const { filter } = this.props;
        filter[name] = val;
        if (name === 'filter1') {
            filter['filter2'] = '';
            filter['filter3'] = '';
            filter['value'] = '';
        }
        if (name === 'filter2') {
            filter['filter3'] = '';
            filter['value'] = '';
        }
        if (name === 'filter3') {
            filter['value'] = '';
        }
        this.props.update(filter);
    }
    dropdown_sold_notsold = (value) => {
        const arr = ["Classic Car", "RV", "Boat", "Motorcycle", "Golf Cart", "Watercraft", "Snowmobile", "Off Road", "Secondary Home", "MFG Home", "Condominium", "Landlord", "Vacant Property", "Umbrella"];
        return (arr.indexOf(value) >= 0);
    }
    dropdown_wizards = (value) => {
        const arr = ["onboarding", "financial"];
        return (arr.indexOf(value) >= 0);
    }
    dropdown_equal = (value) => {
        const arr = ["Household Income", "# of Children", "Retirement Dollars", "401k"];
        return (arr.indexOf(value) >= 0);
    }
    dropdown_less_greater = (value) => {
        const arr = ["Household Income", "# of Children", "Retirement Dollars", "401k"];
        return (arr.indexOf(value) >= 0);
    }
    value_true_false = (value) => {
        const arr = ["Business Owner", "saved for later", "sent for vonboard", "no sale archive"];
        return (arr.indexOf(value) >= 0);
    }
    value_needed_ornot = (value) => {
        const arr = ["Life Insurance"];
        return (arr.indexOf(value) >= 0);
    }
    value_available_ornot = (value) => {
        const arr = ["Cross Sell Opportunity"];
        return (arr.indexOf(value) >= 0);
    }
    render() {

        const updateField = this.updateField;
        const { filter, users } = this.props;

        return (
            <div className="filter">
                <Row gutter={16}>
                    <Col md={6} span={24}>
                        <Select value={filter.filter1} style={{ width: '100%' }} onChange={(val) => updateField('filter1', val)}>
                            <Option value={''}><Translate text={`All Agency Personnel`} /></Option>
                            {users.map((u, i) => (
                                <Option key={i} value={u.id}>{u.name}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col md={6} span={24}>
                        {filter.filter1 === '' ? (
                            <Select value={filter.filter2} style={{ width: '100%' }} onChange={(val) => updateField('filter2', val)}>
                                <Option value={''}><Translate text={`where`} />...</Option>
                                <Option value="Cross Sell Opportunity"><Translate text={`Cross Sell Opportunity`} /></Option>
                                <Option value="Classic Car"><Translate text={`Classic Car`} /></Option>
                                <Option value="RV"><Translate text={`RV`} /></Option>
                                <Option value="Boat"><Translate text={`Boat`} /></Option>
                                <Option value="Motorcycle"><Translate text={`Motorcycle`} /></Option>
                                <Option value="Golf Cart"><Translate text={`Golf Cart`} /></Option>
                                <Option value="Watercraft"><Translate text={`Watercraft`} /></Option>
                                <Option value="Snowmobile"><Translate text={`Snowmobile`} /></Option>
                                <Option value="Off Road"><Translate text={`Off Road`} /></Option>
                                <Option value="Secondary Home"><Translate text={`Secondary Home`} /></Option>
                                <Option value="MFG Home"><Translate text={`MFG Home`} /></Option>
                                <Option value="Condominium"><Translate text={`Condominium`} /></Option>
                                <Option value="Landlord"><Translate text={`Landlord`} /></Option>
                                <Option value="Vacant Property"><Translate text={`Vacant Property`} /></Option>
                                <Option value="Retirement Dollars"><Translate text={`Retirement Dollars`} /></Option>
                                <Option value="401k"><Translate text={`401k`} /></Option>
                                <Option value="Umbrella"><Translate text={`Umbrella`} /></Option>
                                <Option value="# of Children"><Translate text={`# of Children`} /></Option>
                                <Option value="Life Insurance"><Translate text={`Life Insurance`} /></Option>
                                <Option value="Business Owner"><Translate text={`Business Owner`} /></Option>
                                <Option value="Employed"><Translate text={`Employed`} /></Option>
                                <Option value="Disabled"><Translate text={`Disabled`} /></Option>
                                <Option value="Include Renters"><Translate text={`Include Renters`} /></Option>
                                <Option value="Include Mortgage"><Translate text={`Include Mortgage`} /></Option>
                            </Select>
                        ) : (
                            <Select value={filter.filter2} style={{ width: '100%' }} onChange={(val) => updateField('filter2', val)}>
                                <Option value={''}><Translate text={`where`} />...</Option>
                                <Option value="onboarding"><Translate text={`Welcome/Thank You Calls`} /></Option>
                                <Option value="financial"><Translate text={`Life & Retirement Conversation`} /></Option>
                                <Option value="saved for later"><Translate text={`Saved for laters`} /></Option>
                                <Option value="sent for vonboard"><Translate text={`Sent for Virtual On-Boarding`} /></Option>
                                <Option value="no sale archive"><Translate text={`No sale archive`} /></Option>
                                <Option value="Classic Car"><Translate text={`Classic Car`} /></Option>
                                <Option value="RV"><Translate text={`RV`} /></Option>
                                <Option value="Boat"><Translate text={`Boat`} /></Option>
                                <Option value="Motorcycle"><Translate text={`Motorcycle`} /></Option>
                                <Option value="Golf Cart"><Translate text={`Golf Cart`} /></Option>
                                <Option value="Watercraft"><Translate text={`Watercraft`} /></Option>
                                <Option value="Snowmobile"><Translate text={`Snowmobile`} /></Option>
                                <Option value="Off Road"><Translate text={`Off Road`} /></Option>
                                <Option value="Secondary Home"><Translate text={`Secondary Home`} /></Option>
                                <Option value="MFG Home"><Translate text={`MFG Home`} /></Option>
                                <Option value="Condominium"><Translate text={`Condominium`} /></Option>
                                <Option value="Landlord"><Translate text={`Landlord`} /></Option>
                                <Option value="Vacant Property"><Translate text={`Vacant Property`} /></Option>
                                <Option value="Retirement Dollars"><Translate text={`Retirement Dollars`} /></Option>
                                <Option value="Include Renters"><Translate text={`Include Renters`} /></Option>
                                <Option value="Include Mortgage"><Translate text={`Include Mortgage`} /></Option>
                            </Select>
                        )}
                    </Col>
                    <Col md={5} span={24}>
                        <Select value={filter.filter3} style={{ width: '100%' }} onChange={(val) => updateField('filter3', val)}>
                            <Option value={''}><Translate text={`is`} />...</Option>
                            {this.dropdown_equal(filter.filter2) ? (
                                <Option value="Equal To"><Translate text={`Equal To`} /></Option>
                            ) : null}
                            {this.dropdown_less_greater(filter.filter2) ? (
                                <Option value="Greater Than"><Translate text={`Greater Than`} /></Option>
                            ) : null}
                            {this.dropdown_less_greater(filter.filter2) ? (
                                <Option value="Less Than"><Translate text={`Less Than`} /></Option>
                            ) : null}
                            {this.dropdown_sold_notsold(filter.filter2) ? (
                                <Option value="Sold" ng-show=""><Translate text={`Sold`} /></Option>
                            ) : null}
                            {this.dropdown_sold_notsold(filter.filter2) ? (
                                <Option value="Not Sold"><Translate text={`Not Sold`} /></Option>
                            ) : null}
                            {this.value_true_false(filter.filter2) ? (
                                <Option value="True" ng-show=""><Translate text={`True`} /></Option>
                            ) : null}
                            {this.value_true_false(filter.filter2) ? (
                                <Option value="False" ng-show=""><Translate text={`False`} /></Option>
                            ) : null}
                            {this.value_needed_ornot(filter.filter2) ? (
                                <Option value="Needed"><Translate text={`Needed`} /></Option>
                            ) : null}
                            {this.value_needed_ornot(filter.filter2) ? (
                                <Option value="Not Needed"><Translate text={`Not Needed`} /></Option>
                            ) : null}
                            {this.value_available_ornot(filter.filter2) ? (
                                <Option value="Available"><Translate text={`Available`} /></Option>
                            ) : null}
                            {this.value_available_ornot(filter.filter2) ? (
                                <Option value="Not Available"><Translate text={`Not Available`} /></Option>
                            ) : null}
                            {this.dropdown_wizards(filter.filter2) ? (
                                <Option value="All"><Translate text={`All`} /></Option>
                            ) : null}
                            {this.dropdown_wizards(filter.filter2) ? (
                                <Option value="Sent"><Translate text={`Sent`} /></Option>
                            ) : null}
                            {this.dropdown_wizards(filter.filter2) ? (
                                <Option value="Complete"><Translate text={`Complete`} /></Option>
                            ) : null}
                            {this.dropdown_wizards(filter.filter2) ? (
                                <Option value="Not Complete"><Translate text={`Not Complete`} /></Option>
                            ) : null}
                        </Select>
                    </Col>
                    <Col md={5} span={24}>
                        {filter.filter3 === 'Equal To' || filter.filter3 === 'Greater Than' || filter.filter3 === 'Less Than' ? (
                            <Translator>
                                {({ translate }) => (
                                    <Input value={filter.value} addonBefore="=" placeholder={translate({text: `Value`})+'...'} onChange={(e) => updateField('value', e.target.value)} />
                                )}
                            </Translator>
                        ) : (
                            <Translator>
                                {({ translate }) => (
                                    <Input value={filter.value} addonBefore="=" placeholder={translate({text: `Value`})+'...'} disabled={true} />
                                )}
                            </Translator>
                        )}
                    </Col>
                    <Col md={2} span={24}>
                        {!this.props.is_last ? (
                            <Button onClick={() => this.props.delete()}>
                                <Icon type="close" />
                            </Button>
                        ) : (
                            <Button onClick={() => this.props.add()}>
                                <Icon type="plus" />
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Filters;
