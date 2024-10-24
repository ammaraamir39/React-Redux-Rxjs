import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    Select,
    Radio,
    DatePicker,
    Icon
} from 'antd';
import { Translate } from 'react-translated';
import AddressField from '../../components/address-field';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class AddEZCustomer extends Component {
    state = {
        wizard: {
            first_name: null,
            last_name: null,
            email: null,
            phone: null,
            address: null,
            city: null,
            state: null,
            zipcode: null,
            how_long_address: null,
            previous_address: null,
            education: null,
            degree: null,
            employment: null,
            verified_customer_reports: null,
            date_info_received: null,
            current_insurance_co: null,
            number_of_years: null,
            liability_limit: null,
            deductible: null,
            year_built: null,
            sq_ft: null,
            style: null,
            foundation: null,
            finished_perc: null,
            outside_covering: null,
            garage: null,
            number_of_cars: null,
            sheds: null,
            kitchen: null,
            full_bathrooms: null,
            half_bathrooms: null,
            deck: null,
            hot_tub: null,
            furnace_heat: null,
            fireplace: null,
            wood_stove: null,
            where: null,
            central_air: null,
            alarm_systems: null,
            pool: null,
            in_above_ground: null,
            dogs: null,
            breed: null,
            age_of_roof: null,
            trampoline: null,
            are_pools_trampolines_locked: null,
            deck2: null,
            sq_ft2: null,
            upgrade_to_home: null,
            auto_current_insurance_co: null,
            auto_number_of_years: null,
            auto_liability_limit: null,
            auto_current_collision: null,
            auto_deductible_amount: null,
            auto_comp: null,
            auto_current_deductible: null,
            auto_vin_number: null,
            auto_year: null,
            auto_make: null,
            auto_model: null,
            auto_plpd: null,
            auto2_vin_number: null,
            auto2_year: null,
            auto2_make: null,
            auto2_model: null,
            auto2_plpd: null,
            towing: null,
            roadside: null,
            car_rental: null,
            health_insurance: null,
            every_driver_in_household_listed: null,
            tickets_accidents: null
        }   
    }
    updateField(name, value) {
        const { wizard } = this.state;
        wizard[name] = value;
        this.setState({ wizard });
    }
    submit() {

    }
    render() {
        const { loading, wizard } = this.state;

        let less_than_2years = false;
        if (wizard.how_long_address === 'Less Than 1 Year' ) less_than_2years = true;
        if (wizard.how_long_address === '1 Year' ) less_than_2years = true;
        const top_companies = ["AAA","Allstate Insurance Group","American Family Insurance Group","Amica Mutual Group","Auto-Owners Insurance Group","Country Financial PC Group","Erie Insurance Group","Farmers Insurance Group","GEICO","Hartford Insurance Group","Infinity P&C Group","Liberty Mutual Insurance Cos.","MAPFRE North America Group","Mercury General Group","MetLife Personal Lines Group","National General Group","Nationwide Group","New Jersey Manufacturers Insurance Group","Progressive Insurance Group","State Farm Group","Hanover Insurance Group","Travelers Group","USAA Group","Other"];

        return (
            <div>
                <Card type="inner" title={<Translate text={`New EZ Lynx Customer`} />} loading={loading} style={{marginBottom: 20}}>
                    <div>
                        <h1>Customer Information</h1>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`First Name`} /> *</label>
                                    <Input value={wizard.first_name} onChange={(e) => this.updateField('first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Last Name`} /> *</label>
                                    <Input value={wizard.last_name} onChange={(e) => this.updateField('last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Date of Birth`} /> *</label>
                                    <DatePicker
                                        format="MM/DD/YYYY"
                                        style={{width: '100%'}}
                                        value={wizard.birthday}
                                        onChange={(val) => this.updateField('birthday', val)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Spouse First Name`} /></label>
                                    <Input value={wizard.first_name} onChange={(e) => this.updateField('first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Spouse Last Name`} /></label>
                                    <Input value={wizard.last_name} onChange={(e) => this.updateField('last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Spouse Date of Birth`} /></label>
                                    <DatePicker
                                        format="MM/DD/YYYY"
                                        style={{width: '100%'}}
                                        value={wizard.birthday}
                                        onChange={(val) => this.updateField('birthday', val)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={(less_than_2years) ? 8 : 12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Address`} /></label>
                                    <AddressField value={wizard.address}
                                        onChange={(val) => this.updateField('address', val)}
                                        setCity={(val) => this.updateField('city', val)}
                                        setState={(val) => this.updateField('state', val)}
                                        setZipCode={(val) => this.updateField('zipcode', val)}
                                    />
                                </div>
                            </Col>
                            <Col md={(less_than_2years) ? 8 : 12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`How Long at This Address?`} /> *</label>
                                    <Select value={wizard.how_long_address} style={{ width: '100%' }} onChange={(value) => this.updateField('how_long_address', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        <Option value={'Less Than 1 Year'}><Translate text={`Less Than 1 Year`} /></Option>
                                        <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                        {[...Array(69).keys()].map((i) => (
                                            <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                            {less_than_2years ? (
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Previous Address`} /></label>
                                        <AddressField value={wizard.previous_address}
                                            onChange={(val) => this.updateField('previous_address', val)}
                                        />
                                    </div>
                                </Col>
                            ) : null}
                        </Row>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Education`} /></label>
                                    <Input value={wizard.education} onChange={(e) => this.updateField('education', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField inputFieldRadio">
                                    <label><Translate text={`Degree`} /> *</label>
                                    <RadioGroup value={wizard.degree} onChange={(e) => this.updateField('degree', e.target.value)}>
                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                    </RadioGroup>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Employment`} /> *</label>
                                    <Input value={wizard.employment} onChange={(e) => this.updateField('employment', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Phone`} /> *</label>
                                    <Input value={wizard.phone} onChange={(e) => this.updateField('phone', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Email`} /></label>
                                    <Input value={wizard.email} onChange={(e) => this.updateField('email', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField inputFieldRadio">
                                    <label><Translate text={`Verified Consumer Reports`} /></label>
                                    <RadioGroup value={wizard.verified_customer_reports} onChange={(e) => this.updateField('verified_customer_reports', e.target.value)}>
                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                    </RadioGroup>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Date Info Received`} /></label>
                                    <DatePicker
                                        format="MM/DD/YYYY"
                                        style={{width: '100%'}}
                                        value={wizard.date_info_received}
                                        onChange={(val) => this.updateField('date_info_received', val)}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <h1>Home</h1>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Current Insurance Co.`} /> *</label>
                                    <Select value={wizard.current_insurance_co} style={{ width: '100%' }} onChange={(value) => this.updateField('current_insurance_co', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        {top_companies.map((val, i) => (
                                            <Option key={i} value={val}><Translate text={val} /></Option>
                                        ))}
                                        <Option value={'None'}><Translate text={`None`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`# of Years`} /> *</label>
                                    <Select value={wizard.number_of_years} style={{ width: '100%' }} onChange={(value) => this.updateField('number_of_years', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                        {[...Array(24).keys()].map((i) => (
                                            <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Liability Limit`} /></label>
                                    <Input value={wizard.liability_limit} onChange={(e) => this.updateField('liability_limit', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Deductible`} /></label>
                                    <Input value={wizard.deductible} onChange={(e) => this.updateField('deductible', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Year Built`} /> *</label>
                                    <Select value={wizard.year_built} style={{ width: '100%' }} onChange={(value) => this.updateField('year_built', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        {[...Array(161).keys()].map((i) => (
                                            <Option key={i} value={i + 1860}>{i + 1860}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={'Sq. Ft.'} /> *</label>
                                    <Input value={wizard.sq_ft} onChange={(e) => this.updateField('sq_ft', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Style`} /> *</label>
                                    <Select value={wizard.style} style={{ width: '100%' }} onChange={(value) => this.updateField('style', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        <Option value={'Apartment'}><Translate text={`Apartment`} /></Option>
                                        <Option value={'Bi-Level'}><Translate text={`Bi-Level`} /></Option>
                                        <Option value={'Condo'}><Translate text={`Condo`} /></Option>
                                        <Option value={'Colonial'}><Translate text={`Colonial`} /></Option>
                                        <Option value={'Duplex'}><Translate text={`Duplex`} /></Option>
                                        <Option value={'Ranch'}><Translate text={`Ranch`} /></Option>
                                        <Option value={'Tri-Level'}><Translate text={`Tri-Level`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={'Foundation'} /> *</label>
                                    <Input value={wizard.foundation} onChange={(e) => this.updateField('Foundation', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Finished %`} /> *</label>
                                    <Select value={wizard.finished_perc} style={{ width: '100%' }} onChange={(value) => this.updateField('finished_perc', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        {[...Array(100      ).keys()].map((i) => (
                                            <Option key={i} value={(i + 1)  + '%'}>{(i + 1) + '%'}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={'Outside Covering'} /> *</label>
                                    <Input value={wizard.outside_covering} onChange={(e) => this.updateField('outside_covering', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Garage`} /> *</label>
                                    <Select value={wizard.garage} style={{ width: '100%' }} onChange={(value) => this.updateField('garage', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        <Option value={'Attached'}><Translate text={`Attached`} /></Option>
                                        <Option value={'Detatched'}><Translate text={`Detatched`} /></Option>
                                        <Option value={'None'}><Translate text={`None`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`# of Cars`} /> *</label>
                                    <Select value={wizard.number_of_cars} style={{ width: '100%' }} onChange={(value) => this.updateField('number_of_cars', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        {[...Array(8).keys()].map((i) => (
                                            <Option key={i} value={(i + 1)}>{(i + 1)}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Sheds`} /> *</label>
                                    <Select value={wizard.sheds} style={{ width: '100%' }} onChange={(value) => this.updateField('sheds', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        <Option value={'Attached'}><Translate text={`Attached`} /></Option>
                                        <Option value={'Detatched'}><Translate text={`Detatched`} /></Option>
                                        <Option value={'None'}><Translate text={`None`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={'Kitchen'} /> *</label>
                                    <Input value={wizard.kitchen} onChange={(e) => this.updateField('kitchen', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Full Bathrooms`} /> *</label>
                                    <Select value={wizard.full_bathrooms} style={{ width: '100%' }} onChange={(value) => this.updateField('full_bathrooms', value)}>
                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                        {[...Array(10).keys()].map((i) => (
                                            <Option key={i} value={(i + 1)}>{(i + 1)}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField inputFieldRadio">
                                    <label><Translate text={`Are the Pools And/Or Trampolines Locked, Gated and Fenced?`} /></label>
                                    <RadioGroup value={wizard.are_pools_trampolines_locked} onChange={(e) => this.updateField('are_pools_trampolines_locked', e.target.value)}>
                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                    </RadioGroup>
                                </div>
                            </Col>
                        </Row>

                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.submit.bind(this)}>
                            <Translate text={`Submit`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default AddEZCustomer;
