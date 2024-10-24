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
        email: ''
    }
    send = () => {
        const { email } = this.state;
        const { user } = this.props;

        if (email !== '') {
            this.setState({ loading: true });

            axios.get('/api/b_file?q={"filters":[{"name":"email","op":"==","val":"' + email + '"}]}').then((res) => {
                if (res.data.objects.length > 0) {
                    let tango_card_amount = '';
                    let agency_name = "AllState";
                    const bfile = res.data.objects[0];

                    axios.get("/api/tango/user_data").then((res) => {
                        if (res.data.tango_card_amount !== "" && res.data.tango_card_amount !== null) {
                            tango_card_amount = parseInt(res.data.tango_card_amount, 10);
                        }
                        axios.post("/api/referral", {
                            first_name: bfile.first_name,
                            last_name: bfile.last_name,
                            bfile_id: bfile.id,
                            email: email,
                            agency_name: bfile.agency.name,
                            referral_amount: tango_card_amount,
                            agency_id: bfile.agency_id
                        }).then((res) => {
                            message.success(F.translate(`Referral link has been sent successfully.`));
                            this.setState({ loading: false });
                            this.props.hideModal();
                        }).catch((res) => {
                            message.error(F.translate(`Referral link not sent, please try again later.`));
                            this.setState({ loading: false });
                        });
                    }).catch((res) => {
                        message.error(F.translate(`Referral link not sent, please try again later.`));
                        this.setState({ loading: false });
                    });
                } else {
                    message.error(F.translate(`Customer email not found.`));
                    this.setState({ loading: false });
                }
            }).catch((res) => {
                message.error(F.translate(`Referral link not sent, please try again later.`));
                this.setState({ loading: false });
            });
        } else {
            message.error(F.translate(`Email field is required.`));
        }
    }
    render() {

        const { loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Send Referral Link`} />}
                visible={this.props.showModal}
                onOk={this.send.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Send`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div>
                            <label><Translate text={`Email`} /></label>
                            <Input onChange={(e) => this.setState({ email: e.target.value })} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
