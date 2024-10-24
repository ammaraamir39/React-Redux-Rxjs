import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Modal,
    Button,
    Spin,
    Switch,
} from 'antd';
import './reward-program.css';
import axios from 'axios';
import F from '../../Functions';
import UpdateAmountModal from './parts/update-amount-modal';
import ReloadAccountModal from './parts/reload-account';
import UpdateBillingModal from './parts/update-billing';
import { Translate } from 'react-translated';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class RewardProgram extends Component {
    state = {
        tango_enabled: true,
        tango_balance: 0,
        update_amount_modal: false,
        reload_account_modal: false,
        update_billing_modal: false,
        user: this.props.auth.user,
        loading: false
    }
    componentDidMount = () => {
        this.init();
    }
    init = () => {
        const { tango_balance } = this.state;
        this.setState({ loading: true });
        axios.get('/api/user').then((res) => {
            const user = res.data;
            if (user.reward_program_enabled === 1) {
                this.setState({ tango_enabled: true });
                axios.get("/api/tango/user_data").then((res) => {
                    const tango_data = res.data;
                    const tango_card_amount = res.data.tango_card_amount;
                    if (tango_data.has_tango_card_token === true) {
                        if (tango_data.has_tango_identifier && tango_data.has_tango_customer) {
                            axios.post("/api/tango/info", {}).then((res) => {
                                if (typeof res.data.account !== "undefined") {
                                    this.setState({
                                        tango_balance: res.data.tango_balance,
                                        loading: false
                                    })
                                    if (res.data.tango_balance === 0) {
                                        this.setState({
                                            reload_account_modal: true
                                        })
                                    }
                                } else {
                                    this.setState({
                                        tango_balance: 0,
                                        loading: false
                                    })
                                }
                            }).catch(() => {
                                this.setState({
                                    loading: false
                                })
                            });
                        } else {
                            this.setState({
                                loading: false
                            })
                        }
                    } else {
                        axios.post("/api/tango/info", {}).then((res) => {
                            if (typeof res.data.account !== "undefined" && res.data.tango_balance > 0) {
                                this.setState({
                                    tango_balance: res.data.tango_balance,
                                    loading: false
                                })
                            } else {
                                this.setState({
                                    tango_balance: 0,
                                    loading: false,
                                    update_billing_modal: true
                                })
                            }
                        }).catch(() => {
                            this.setState({
                                loading: false
                            })
                        });
                    }
                });
            } else {
                this.setState({ tango_enabled: false });
            }
        });
    }
    enableTango = () => {
        const { user } = this.state;
        this.setState({ tango_enabled: true });
        axios.put("/api/users/" + user.id, {
            reward_program_enabled: 1
        }).then(() => {
            this.init();
        })
    }
    toggleTango = (checked) => {
        const { user } = this.state;
        this.setState({ tango_enabled: checked });
        axios.put("/api/users/" + user.id, {
            reward_program_enabled: (checked) ? 1 : 0
        }).then(() => {
            if (checked) {
                this.init();
            }
        })
    }
    render() {

        const { loading, tango_enabled, tango_balance } = this.state;

        return (
            <div>
                <Card title={<Translate text={`Reward Program`} />} className="have_extra2" extra={
                    <div>
                        <Switch checked={tango_enabled} onChange={(checked) => this.toggleTango(checked)} />
                        <span style={{marginLeft:10}}><Translate text={`Enable Reward Program`} /></span>
                    </div>
                }>
                    {tango_enabled ? (
                        <div>
                            <Spin indicator={antIcon} spinning={loading}>
                                <Card className="tango_balance" bordered={false}>
                                     <Translate text={`Tango Balance`} />
                                     <div className="amount">{F.dollar_format(tango_balance)}</div>
                                </Card>
                            </Spin>
                            <div className="center-align buttons">
                                <Button onClick={() => this.setState({ update_amount_modal: true })}>
                                    <Translate text={`Update Gift Card Amount`} />
                                </Button>
                                <Button onClick={() => this.setState({ reload_account_modal: true })}>
                                    <Translate text={`Reload Your Account`} />
                                </Button>
                                <Button onClick={() => this.setState({ update_billing_modal: true })}>
                                    <Translate text={`Change Credit Card/Billing`} />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="center-align">
                             <p><Translate text={`Rewards Program is not enabled`} /></p>
                             <Button onClick={() => this.enableTango()}><Translate text={`Enable Rewards Program`} /></Button>
                        </div>
                    )}
                </Card>
                <UpdateAmountModal
                    history={this.props.history}
                    showModal={this.state.update_amount_modal}
                    hideModal={() => this.setState({ update_amount_modal: false })}
                    user={this.state.user}
                />
                <ReloadAccountModal
                    history={this.props.history}
                    showModal={this.state.reload_account_modal}
                    hideModal={() => this.setState({ reload_account_modal: false })}
                    user={this.state.user}
                />
                <UpdateBillingModal
                    history={this.props.history}
                    showModal={this.state.update_billing_modal}
                    hideModal={() => this.setState({ update_billing_modal: false })}
                    user={this.state.user}
                />
            </div>
        );

    }
}

export default RewardProgram;
