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
        amount: '',
        cvv: ''
    }
    save = () => {
        const { amount, cvv, user } = this.state;

        if (amount === '' || cvv === '') {
            message.error(F.translate(`Amount & CVV are required.`));

        } else {
            this.setState({ loading: true });
            axios.post("/api/tango/fund", {
                security_code: cvv,
                amount
            }).then((res) => {
                if (typeof res.data.errors !== "undefined" && res.data.errors.length > 0) {
                    this.setState({ loading: false });
                    for (let i = 0; i < res.data.errors.length; i++) {
                        message.error(res.data.errors[i].message);
                    }
                } else {
                    axios.post("/api/tango/info", {}).then((res) => {
                        this.setState({ loading: false });
                        if (typeof res.data.account != "undefined") {
                            this.props.hideModal();
                            message.success(F.translate(`Congratulations, you now have $"+(res.data.tango_balance)+" in your account.`));
                        } else {
                            message.error(F.translate(`Tango account not found.`));
                        }
                    }).catch(() => {
                        this.setState({ loading: false });
                        message.error(F.translate(`Please try again later.`));
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
                title={<Translate text={`Reload your account`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Deposit`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <p><strong>* <Translate text={`We accept all major credit cards. Currently debit cards are not accepted at this time.`} /></strong></p>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`How much do you want to put into your account?`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ amount: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                <Option value="20">$20</Option>
                                <Option value="25">$25</Option>
                                <Option value="50">$50</Option>
                                <Option value="75">$75</Option>
                                <Option value="100">$100</Option>
                                <Option value="200">$200</Option>
                                <Option value="300">$300</Option>
                                <Option value="400">$400</Option>
                                <Option value="500">$500</Option>
                                <Option value="750">$750</Option>
                                <Option value="1000">$1000</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Security Code (CVV2, CVC2, or CID)`} /></label>
                            <Input onChange={(val) => this.setState({ cvv: val})} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
