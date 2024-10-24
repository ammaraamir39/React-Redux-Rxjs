import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Input,
    Checkbox,
    message,
    Select,
    Switch,
    Collapse
} from 'antd';
import { Translate } from 'react-translated';
import AddressField from '../../components/address-field';

const Option = Select.Option;
const { TextArea } = Input;
const { Panel } = Collapse;

class Profile extends Component {
    state = {
        pass_loading: false,
        minimum_liability_limits_ext: [],
        minimum_liability_limits_checkboxes_checked: [],
        auto_values: [
            "$25,000/$50,000",
            "$50,000/$100,000",
            "$100,000/$300,000",
            "$250,000/$500,000",
            "$500,000/$500,000",
            "$500,000/$1,000,000"
        ],
        home_values: [
            "$100,000",
            "$300,000",
            "$500,000",
            "$1,000,000"
        ],
        is_home: [
            "Home",
            "Secondary Home",
            "MFG Home",
            "Renter",
            "Condominium",
            "Landlord",
            "Vacant Property"
        ]
    }
    copyToClipboard = (e) => {
        window.document.getElementById("linkTextarea").select();
        window.document.execCommand('copy');
        window.document.getElementById("linkTextarea").focus();
        message.success('Copied!');
    }
    generateArrayOfYears = () => {
        var min = new Date().getFullYear()
        var max = min + 15;
        var years = []
      
        for (var i = min; i < max; i++) {
            years.push(i)
        }
        return years
    }
    componentDidMount = () => {
        const {
            user
        } = this.props;

        const minimum_liability_limits_items = [
            "Home",
            "Secondary Home",
            "MFG Home",
            "Renter",
            "Condominium",
            "Landlord",
            "Auto",
            "Classic Car",
            "RV",
            "Boat",
            "Motorcycle",
            "Golf Cart",
            "Off Road"
        ];

        let minimum_liability_limits_ext = [];
        for (let i = 0; i < minimum_liability_limits_items.length; i++) {
            minimum_liability_limits_ext.push({
                label: minimum_liability_limits_items[i],
                value: minimum_liability_limits_items[i],
                total: null
            });
        }

        var minimum_liability_limits_checkboxes_checked = [];
        if (user.minimum_liability_limits_ext) {
            var user_minimum_liability_limits_ext = JSON.parse(user.minimum_liability_limits_ext);
            for (var x in user_minimum_liability_limits_ext) {
                for (let i = 0; i < minimum_liability_limits_ext.length; i++) {
                    if (minimum_liability_limits_ext[i].label === x) {
                        minimum_liability_limits_ext[i].total = user_minimum_liability_limits_ext[x];
                        break;
                    }
                }
                minimum_liability_limits_checkboxes_checked.push(x)
            }
        }

        this.setState({
            minimum_liability_limits_checkboxes_checked,
            minimum_liability_limits_ext
        })        
    }
    updateMinimumLiability = (name, value) => {
        let { minimum_liability_limits_ext } = this.state;
        const { updateField } = this.props;

        for (let i = 0; i < minimum_liability_limits_ext.length; i++) {
            if (minimum_liability_limits_ext[i].label === name) {
                minimum_liability_limits_ext[i].total = value;
                break;
            }
        }
        this.setState({ minimum_liability_limits_ext })

        var final_minimum_liability_limits_ext = {};
        for (let i = 0; i < minimum_liability_limits_ext.length; i++) {
            if (minimum_liability_limits_ext[i].total) {
                final_minimum_liability_limits_ext[minimum_liability_limits_ext[i].label] = minimum_liability_limits_ext[i].total;
            }
        }

        updateField('minimum_liability_limits_ext', JSON.stringify(final_minimum_liability_limits_ext));
    }
    render() {
        const {
            loading,
            user,
            card,
            agency,
            updateField,
            updateCCField,
            updateAgencyField,
            change_payment_method,
            update
        } = this.props;

        let link = "";
        if (user.user_agency_assoc.length > 0) {
            link = "https://bfilesystem.com/app/create-bfile/" + user.user_agency_assoc[0].agency_id + "/" + user.id;
        }

        let calendly_connect = "https://auth.calendly.com/oauth/authorize?client_id=TOmzViVrU2VxnA9XAxFyLwRBJB3wFqZso2Y45b3BlEA&response_type=code&redirect_uri=https://bfilesystem.com/api/auth/calendly";

        if (window.location.host === 'beta.bfilesystem.com') {
            calendly_connect = "https://auth.calendly.com/oauth/authorize?client_id=hUALsvqvT91JNB8crNJiAhQZGwRB09jriZsLfXfhG_E&response_type=code&redirect_uri=https://beta.bfilesystem.com/api/auth/calendly";
        }
        
        return (
            <div>
                <Card type="inner" title={<Translate text={`Personal Information`} />} loading={loading} style={{marginBottom: 20}}>
                    <div>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`First Name`} />:</label>
                                    <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Last Name`} />:</label>
                                    <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            {/* <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Email`} />:</label>
                                    <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} />
                                </div>
                            </Col> */}
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Company Name`} />:</label>
                                    <Input value={user.company_name} onChange={(e) => updateField('company_name', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Phone`} />:</label>
                                    <Input value={user.phone} onChange={(e) => updateField('phone', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Mobile`} />:</label>
                                    <Input value={user.mobile_number} onChange={(e) => updateField('mobile_number', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Address`} />:</label>
                                    <AddressField value={user.address}
                                        onChange={(val) => updateField('address', val)}
                                        setCity={(val) => updateField('city', val)}
                                        setState={(val) => updateField('state', val)}
                                        setZipCode={(val) => updateField('zipcode', val)}
                                    />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`City`} />:</label>
                                    <Input value={user.city} onChange={(e) => updateField('city', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`State`} />:</label>
                                    <Input value={user.state} onChange={(e) => updateField('state', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Zipcode`} />:</label>
                                    <Input value={user.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Timezone`} />:</label>
                                    <Select defaultValue={user.timezone} style={{ width: '100%' }} onChange={(value) => updateField('timezone', value)}>
                                        <Option value={''}><Translate text={`Select Timezone`} />...</Option>
                                        <Option value="US/Samoa"><Translate text={`Samoa Time Zone`} /> (-11:00)</Option>
                                        <Option value="US/Hawaii"><Translate text={`Hawaii-Aleutian Time Zone`} /> (-10:00)</Option>
                                        <Option value="US/Alaska"><Translate text={`Alaska Time Zone`} /> (-09:00)</Option>
                                        <Option value="US/Pacific"><Translate text={`Pacific Time Zone`} /> (-08:00)</Option>
                                        <Option value="US/Mountain"><Translate text={`Mountain Time Zone`} /> (-07:00)</Option>
                                        <Option value="US/Central"><Translate text={`Central Time Zone`} /> (-06:00)</Option>
                                        <Option value="US/Eastern"><Translate text={`Eastern Time Zone`} /> (-05:00)</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Welcome/Thank You Calls Default Date`} />:</label>
                                    <Select defaultValue={user.default_date} style={{ width: '100%' }} onChange={(value) => updateField('default_date', value)}>
                                        <Option value={null}><Translate text={`Select Default Date`} />...</Option>
                                        <Option value={0}><Translate text={`Immediately`} /></Option>
                                        <Option value={5}>5 <Translate text={`days`} /></Option>
                                        <Option value={10}>10 <Translate text={`days`} /></Option>
                                        <Option value={15}>15 <Translate text={`days`} /></Option>
                                        <Option value={20}>20 <Translate text={`days`} /></Option>
                                        <Option value={25}>25 <Translate text={`days`} /></Option>
                                        <Option value={30}>30 <Translate text={`days`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Language`} />:</label>
                                    <Select defaultValue={user.language} style={{ width: '100%' }} onChange={(value) => updateField('language', value)}>
                                        <Option value={''}><Translate text={`Select Language`} />...</Option>
                                        <Option value="en"><Translate text={`English`} /></Option>
                                        <Option value="es"><Translate text={`Spanish`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Virtual Meeting Link (Zoom, WebEx etc.)`} />:</label>
                                    <Input value={user.virtual_link} onChange={(e) => updateField('virtual_link', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                                    
                        {!this.props.has_calendly ? (
                            <div>
                                <h2><Translate text={`Connect Calendly`} /></h2>
                                <a href={calendly_connect}>
                                    <Button>
                                        Connect Calendly
                                    </Button>
                                </a>
                                <br/>
                                <br/>
                            </div>
                        ) : (
                            <div>
                                <h2><Translate text={`Connect Calendly`} /></h2>
                                <Button onClick={() => this.props.logoutCalendly()}>
                                    Logout
                                </Button>
                                <br/>
                                <br/>
                            </div>
                        )}

                        {this.props.has_calendly ? (
                            <div>
                                <h2><Translate text={`Calendly Settings`} /></h2>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`RS Setup Appointment Event Type`} />:</label>
                                            <Select defaultValue={user.calendly_rs_setup_appointment} style={{ width: '100%' }} onChange={(value) => updateField('calendly_rs_setup_appointment', value)}>
                                                <Option value={''}><Translate text={`Select Event Type`} />...</Option>
                                                {this.props.calendly_event_types.map((event_type, i) => (
                                                    <Option key={i} value={"https://api.calendly.com/event_types/"+event_type.id}>{event_type.attributes.name}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}

                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Appointment Hours`} />:</label>
                                    <Collapse>
                                        {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((day, i) => (
                                            <Panel header={day} key={i}>
                                                <div className="checkboxes">
                                                    {this.props.appointment_hours[day].map((hour, h) => (
                                                        <span key={day + '_' + hour.value}>
                                                            <Checkbox checked={hour.checked} onChange={(e) => this.props.update_appointment_hours(day, h, e.target.checked)}>
                                                                <span style={{display: 'inline-block', minWidth: 75}}>
                                                                    {hour.value}
                                                                </span>
                                                            </Checkbox>
                                                        </span>
                                                    ))}
                                                </div>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </div>
                            </Col>
                        </Row>

                        <h2><Translate text={`Update Password`} /></h2>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Button onClick={() => this.props.requestPassword()}><Translate text={`Request a new Password`} /></Button>
                                </div>
                            </Col>
                        </Row>
                        <h2><Translate text={`Notifications`} /></h2>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Switch checked={user.email_cron_notification ? true : false} onChange={(checked) => updateField('email_cron_notification', (checked) ? 1 : 0 )} />
                                    <span style={{marginLeft:10}}><Translate text={`Reminder Notifications`} /></span>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Switch checked={user.email_game_notification ? true : false} onChange={(checked) => updateField('email_game_notification', (checked) ? 1 : 0 )} />
                                    <span style={{marginLeft:10}}><Translate text={`Gamification Notifications`} /></span>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Switch checked={user.email_sale_notification ? true : false} onChange={(checked) => updateField('email_sale_notification', (checked) ? 1 : 0 )} />
                                    <span style={{marginLeft:10}}><Translate text={`Sale Notifications`} /></span>
                                </div>
                            </Col>
                        </Row>

                        {/* <h2><Translate text={`Agent Minimum Liability Limits`} /></h2>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Minimum liability limits`} />:</label>
                                    <Select defaultValue={user.minimum_liability_limits} style={{ width: '100%' }} onChange={(value) => updateField('minimum_liability_limits', value)}>
                                        <Option value={null}><Translate text={`Select Liability Limits`} />...</Option>
                                        <Option value={"$25,000/$50,000"}>$25,000/$50,000</Option>
                                        <Option value={"$50,000/$100,000"}>$50,000/$100,000</Option>
                                        <Option value={"$100,000/$300,000"}>$100,000/$300,000</Option>
                                        <Option value={"$250,000/$500,000"}>$250,000/$500,000</Option>
                                        <Option value={"$500,000/$1,000,000"}>$500,000/$1,000,000</Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row> */}

                        <h2><Translate text={`Change Minimum Liability Limits`} /></h2>
                        <Checkbox.Group
                            value={this.state.minimum_liability_limits_checkboxes_checked}
                            onChange={(value) => {
                                this.setState({ minimum_liability_limits_checkboxes_checked: value })
                            }}
                        >
                            <Row>
                                {this.state.minimum_liability_limits_ext.length > 0 
                                    && this.state.minimum_liability_limits_ext.map((liability, i) => (
                                        <Col key={i} span={4}>
                                            <Checkbox value={liability.value}>{liability.label}</Checkbox>
                                            <br/>
                                        </Col>
                                    )
                                    )}
                            </Row>
                        </Checkbox.Group>

                        <br/><br/>

                        <Row gutter={16}>
                            {this.state.minimum_liability_limits_ext.length > 0
                                && this.state.minimum_liability_limits_ext.map((liability, i) => {
                                    if (this.state.minimum_liability_limits_checkboxes_checked.indexOf(liability.label) >= 0) {
                                        return (
                                            <Col key={i} md={12} span={24}>
                                                <div className="inputField">
                                                    <label>{liability.label}:</label>
                                                    {this.state.is_home.indexOf(liability.label) >= 0 ? (
                                                        <Select value={liability.total} style={{ width: '100%' }} onChange={(value) => this.updateMinimumLiability(liability.label, value)}>
                                                            <Option value={null}><Translate text={`Select Minimum Liability Limits`} />...</Option>
                                                            {this.state.home_values.map((value, ii) => (
                                                                <Option key={ii} value={value}>{value}</Option>
                                                            ))}
                                                        </Select>
                                                    ) : (
                                                        <Select value={liability.total} style={{ width: '100%' }} onChange={(value) => this.updateMinimumLiability(liability.label, value)}>
                                                            <Option value={null}><Translate text={`Select Minimum Liability Limits`} />...</Option>
                                                            {this.state.auto_values.map((value, ii) => (
                                                                <Option key={ii} value={value}>{value}</Option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                </div>
                                            </Col>
                                        )
                                    } else {
                                        return null;
                                    }
                                }
                            )}
                        </Row>
                        

                        <h2><Translate text={`Change Credit Card`} /></h2>
                        {change_payment_method ? (
                            <Row gutter={16}>
                                <Col md={24} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Card Number`} />:</label>
                                        <Input value={card.card_number} onChange={(e) => updateCCField('card_number', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Exp Month`} />:</label>
                                        <Select defaultValue={card.exp_month} style={{ width: '100%' }} onChange={(value) => updateCCField('exp_month', value)}>
                                            <Option value=""><Translate text={`Month...`} /></Option>
                                            <Option value="01"><Translate text={`January`} /></Option>
                                            <Option value="02"><Translate text={`February`} /></Option>
                                            <Option value="03"><Translate text={`March`} /></Option>
                                            <Option value="04"><Translate text={`April`} /></Option>
                                            <Option value="05"><Translate text={`May`} /></Option>
                                            <Option value="06"><Translate text={`June`} /></Option>
                                            <Option value="07"><Translate text={`July`} /></Option>
                                            <Option value="08"><Translate text={`August`} /></Option>
                                            <Option value="09"><Translate text={`September`} /></Option>
                                            <Option value="10"><Translate text={`October`} /></Option>
                                            <Option value="11"><Translate text={`November`} /></Option>
                                            <Option value="12"><Translate text={`December`} /></Option>
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Exp Year`} />:</label>
                                        <Select defaultValue={card.exp_year} style={{ width: '100%' }} onChange={(value) => updateCCField('exp_year', value)}>
                                            <Option value=""><Translate text={`Year...`} /></Option>
                                            {this.generateArrayOfYears().map((year) => (
                                                <Option key={year} value={year+''}>{year}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Card CVV`} />:</label>
                                        <Input value={card.cvc} onChange={(e) => updateCCField('cvc', e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                        ) : (
                            <Button onClick={() => this.props.show_payment_method()}><Translate text={`Change Payment Method`} /></Button>
                        )}
                    </div>

                    <div className="right-align">
                        <Button type="primary" onClick={update.bind(this)}>
                            <Translate text={`Edit User`} />
                        </Button>
                    </div>
                </Card>
                {link !== "" ? (
                    <Card type="inner" title={<Translate text={`External B-File Creation Link`} />}>
                        <div>
                            <p>This link will allow your customers to fill out the B-File on their own time.</p>
                            <TextArea
                                id="linkTextarea"
                                prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                value={link}
                                style={{marginBottom: 10}}
                            />
                            <div className="right">
                                <Button onClick={() => this.copyToClipboard()}>
                                    Copy Link
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : null}
            </div>
        );

    }
}

export default Profile;
