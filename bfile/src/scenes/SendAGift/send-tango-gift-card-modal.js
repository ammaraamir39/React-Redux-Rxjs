import React, { Component } from 'react';
import {
    Icon,
    Card,
    Modal,
    Button,
    Spin,
    Input,
    message
} from 'antd';
import axios from 'axios';
import { Translate } from 'react-translated';
import F from '../../Functions';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        first_name: '',
        last_name: '',
        email: '',
        amount: ''
    }
    send = () => {
        const { first_name, last_name, email, amount } = this.state;
        const { user } = this.props;

        if (first_name !== '' && last_name !== '' && email !== '' && amount !== '') {
            this.setState({ loading: false });
            axios.post("/api/tango/send_gift_card", {
                first_name,
                last_name,
                email,
                amount
            }).then((res) => {
                if (typeof res.data.errors !== "undefined" && res.data.errors.length > 0) {
                    this.setState({ loading: false });
                    for (var i = 0; i < res.data.errors.length; i++) {
                        message.error(res.data.errors[i].message);
                    }
                } else {
                    axios.post("/api/tango_gift_cards", {
                        email: email,
                        amount: amount,
                        name: first_name + " " + last_name,
                        user_id: user.id
                    }).then(() => {
                        this.setState({ loading: false });
                        message.success(F.translate(`Tango gift card has been sent.`));
                        this.props.hideModal();
                        this.props.refresh();
                    }).catch(() => {
                        this.setState({ loading: false });
                        message.error(F.translate(`Please try again later.`));
                    });
                }
            });
        } else {
            message.error(F.translate(`Please fill all fields.`));
        }
    }
    render() {

        const { loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Send a Gift Card`} />}
                visible={this.props.showModal}
                onOk={this.send.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Send`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="inputField">
                        <div>
                            <label><Translate text={`First Name`} /></label>
                            <Input onChange={(e) => this.setState({ first_name: e.target.value })} />
                        </div>
                    </div>
                    <div className="inputField">
                        <div>
                            <label><Translate text={`Last Name`} /></label>
                            <Input onChange={(e) => this.setState({ last_name: e.target.value })} />
                        </div>
                    </div>
                    <div className="inputField">
                        <div>
                            <label><Translate text={`Email`} /></label>
                            <Input onChange={(e) => this.setState({ email: e.target.value })} />
                        </div>
                    </div>
                    <div className="inputField">
                        <div>
                            <label><Translate text={`Amount`} /></label>
                            <Input onChange={(e) => this.setState({ amount: e.target.value })} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
