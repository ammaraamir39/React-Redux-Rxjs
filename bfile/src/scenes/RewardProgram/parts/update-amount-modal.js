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
        amount: ''
    }
    save = () => {
        const { amount, user } = this.state;

        if (amount === '') {
            message.error(F.translate(`Amount is required.`));

        } else {
            this.setState({ loading: true });
            axios.put("/api/users/"+ user.id, {
                "tango_card_amount": amount
            }).then((res) => {
                this.setState({ loading: false });
                message.success(F.translate(`Gift card amount successfully updated.`));
                this.props.hideModal();
            }).catch(() => {
                this.setState({ loading: false });
                message.error(F.translate(`Can\'t update the gift card amount.`));
            });
        }
    }
    render() {

        const { loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Update Amount to Give on the gift card`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Update`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Amount to give on the gift card?`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ amount: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                <Option value="5">5</Option>
                                <Option value="10">10</Option>
                                <Option value="15">15</Option>
                                <Option value="20">20</Option>
                                <Option value="25">25</Option>
                                <Option value="30">30</Option>
                            </Select>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
