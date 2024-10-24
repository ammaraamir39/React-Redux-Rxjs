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
    Switch,
    message
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import F from '../../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        user: this.props.user
    }
    componentDidUpdate = () => {
        if (this.props.user.id !== this.state.user.id) {
            this.setState({ user: this.props.user })
        }
    }
    updateField = (name, value) => {
        const { user } = this.state;
        user[name] = value;
        this.setState({ user })
    }
    save = () => {
        const { user } = this.state;

        this.setState({ loading: true })
        axios.put("/api/users/" + user.id, {
            active: user.active,
            stripe_customer_id: user.stripe_customer_id,
            stripe_card_id: user.stripe_card_id,
            stripe_subscription_id: user.stripe_subscription_id
        }).then((res) => {
            this.setState({ loading: false })
            this.props.updateUser(user);
            this.props.hideModal();
            message.success(F.translate(`User has been updated successfully.`));
        });
    }
    render() {

        const { loading, user } = this.state;
        const updateField = this.updateField;

        return (
            <Modal
                title="Edit EA"
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={'Save'}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="inputField">
                        <Switch checked={user.active ? true : false} onChange={(checked) => updateField('active', (checked) ? 1 : 0 )} />
                        <span style={{marginLeft:10}}>Active</span>
                    </div>
                    <div className="inputField">
                        <label>Stripe Customer ID</label>
                        <Input value={user.stripe_customer_id} onChange={(e) => updateField('stripe_customer_id', e.target.value)} />
                    </div>
                    <div className="inputField">
                        <label>Stripe Card ID</label>
                        <Input value={user.stripe_card_id} onChange={(e) => updateField('stripe_card_id', e.target.value)} />
                    </div>
                    <div className="inputField">
                        <label>Stripe Subscription ID</label>
                        <Input value={user.stripe_subscription_id} onChange={(e) => updateField('stripe_subscription_id', e.target.value)} />
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
