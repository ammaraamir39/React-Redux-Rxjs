import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Card,
    Modal,
    Select,
    Radio,
    Button,
    Spin,
    DatePicker,
    Checkbox,
    Input,
    message
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import F from '../../../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        user: this.props.user,
        card_number: '',
        exp_month: '',
        exp_year: '',
        cvc: '',
        address: '',
        city: '',
        state: '',
        zipcode: ''
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
    save = () => {
        const {
            user,
            card_number,
            exp_month,
            exp_year,
            cvc,
            address,
            city,
            state,
            zipcode
        } = this.state;

        if (card_number === '' || exp_month === '' || exp_year === '' || cvc === '' || address === '' || city === '' || state === '' || zipcode === '') {
            message.error(F.translate(`All fields are required.`));

        } else {
            this.setState({ loading: true });
            axios.post("/api/tango/add_card", {
                "email": user.email,
                "card_number": card_number,
                "expiration": exp_year+"-"+exp_month,
                "cvv": cvc,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "address": address,
                "city": city,
                "state": state,
                "zip": zipcode,
                "country": 'US'
            }).then((res) => {
                if (typeof res.data.errors !== "undefined" && res.data.errors.length > 0) {
                    this.setState({ loading: false });
                    for (let i = 0; i < res.data.errors.length; i++) {
                        message.error(res.data.errors[i].message);
                    }
                } else {
                    const card_token = res.data.token;
                    axios.put("/api/users/" + user.id, {
                        "tango_card_token_v2": card_token
                    }).then((res) => {
                        this.setState({ loading: false });
                        message.success(F.translate(`We are validating your credit card information. This may take a few minutes.`));
                        this.props.hideModal();
                    }).catch(() => {
                        this.setState({ loading: false });
                    });
                }
            }).catch(() => {
                this.setState({ loading: false });
                message.error(F.translate(`Please try again later.`));
            });
        }
    }
    render() {

        const { loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Update Billing`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Update`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <h3>Billing Information</h3>
                    <Row gutter={16}>
                        <Col md={24} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Card Number`} />:</label>
                                <Input onChange={(e) => this.setState({ card_number: e.target.value })} />
                            </div>
                        </Col>
                        <Col md={8} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Exp Month`} />:</label>
                                <Select defaultValue={''} style={{ width: '100%' }} onChange={(value) => this.setState({ exp_month: value })}>
                                    <Option value=""><Translate text={`Month`} />...</Option>
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
                                <Select defaultValue={''} style={{ width: '100%' }} onChange={(value) => this.setState({ exp_year: value })}>
                                    <Option value=""><Translate text={`Year`} />...</Option>
                                    {this.generateArrayOfYears().map((year) => (
                                        <Option key={year} value={year+''}>{year}</Option>
                                    ))}
                                </Select>
                            </div>
                        </Col>
                        <Col md={8} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Card CVV`} />:</label>
                                <Input onChange={(e) => this.setState({ cvc: e.target.value })} />
                            </div>
                        </Col>
                    </Row>
                    <h3><Translate text={`Billing Address`} /></h3>
                    <Row gutter={16}>
                        <Col md={24} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Address`} />:</label>
                                <Input onChange={(e) => this.setState({ address: e.target.value })} />
                            </div>
                        </Col>
                        <Col md={8} span={24}>
                            <div className="inputField">
                                <label><Translate text={`City`} />:</label>
                                <Input onChange={(e) => this.setState({ city: e.target.value })} />
                            </div>
                        </Col>
                        <Col md={8} span={24}>
                            <div className="inputField">
                                <label><Translate text={`State`} />:</label>
                                <Input onChange={(e) => this.setState({ state: e.target.value })} />
                            </div>
                        </Col>
                        <Col md={8} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Zipcode`} />:</label>
                                <Input onChange={(e) => this.setState({ zipcode: e.target.value })} />
                            </div>
                        </Col>
                    </Row>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
