import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Tag,
    Input,
    Radio,
    Divider,
    DatePicker,
    Checkbox,
    Rate,
    Alert
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import ShowRespect from '../../Wizard/parts/images/bfile-handshake.svg';
import ExplainLimits from '../../Wizard/parts/images/bfile-calc.svg';
import Offer30DayReview from '../../Wizard/parts/images/bfile-review.svg';
import RatesDoNotApplyToSurvey from '../../Wizard/parts/images/bfile-up.svg';
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Step extends Component {
    state = {
        loading: false,
        giftcard_amount: 0,
        tango_disabled: false,
        tango_balance_lower: false
    }
    componentDidMount = () => {
        const { bfile } = this.props;

        let giftcard_amount = 0;
        let tango_balance = 0;
        let tango_balance_lower = false;

        if ("id" in bfile) {
            this.setState({ loading: true })

            axios.get("/api/tango/user_data?bfile_id=" + bfile.id).then((res) => {
                giftcard_amount = res.data.tango_card_amount;
                if (res.data.has_tango_identifier && res.data.has_tango_customer && res.data.has_tango_card_token) {
                    axios.post("/api/tango/info", { bfile_id: bfile.id }).then((res) => {
                        if (typeof res.data.account !== "undefined") {
                            tango_balance = parseFloat(res.data.tango_balance);
                        }
                        if (tango_balance < giftcard_amount || tango_balance === 0) {
                            tango_balance_lower = true;
                        }
                        this.setState({ tango_balance_lower })
                    }).catch(() => {
                        this.setState({ tango_disabled: true }) 
                    });
                } else {
                    this.setState({ tango_disabled: true }) 
                }

                this.setState({ giftcard_amount, tango_balance_lower, loading: false })
            });
        }
    }
    render() {

        const { loading, giftcard_amount, tango_balance_lower, tango_disabled } = this.state;
        const { wizard, bfile, updateField } = this.props;

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Referral / Social Media`} />
                    </div>
                }
                loading={loading}
                >
                    {tango_balance_lower ? (
                        <div style={{marginBottom: 20}}>
                            <Alert message={
                                <div>
                                    {this.props.user.user_type === "EA" ? (
                                        <div>
                                            <Translate text={`Your Tango account balance is lower than the referral amount you are attempting to send. Please deposit adequate funds in your account by`} />
                                            {' '}
                                            <Link to="/reward-program"><Translate text={`clicking here`} /></Link>
                                        </div>
                                    ) : (
                                        <div>
                                            <Translate text={`Your Tango account balance is lower than the referral amount you are attempting to send.`} />
                                        </div>
                                    )}
                                </div>
                            } type="error" />
                        </div>
                    ) : null}

                    <div>
                        <Card title={<Translate text={`Verify email address`} />} className="wizardBox center-align" type="inner">
                            <Input onChange={(e) => updateField('email', e.target.value)} value={wizard.email} style={{maxWidth: 250}} disabled={(tango_balance_lower || tango_disabled)} />
                        </Card>

                        <Card className="wizardBox center-align" type="inner">
                            <p><Translate text={`My agency offers a referral gift card program. Do I have your permission to send you an email that allows you to redeem a {giftcard_amount} gift card for making friends and family referrals to our agency?`} data={{giftcard_amount: giftcard_amount}} /></p>

                            <p><Translate text={`Please open our agency referral email when you receive it and follow the instructions to get started.`} /></p>

                            <RadioGroup defaultValue={wizard.gift_card_request} onChange={(e) => updateField('gift_card_request', e.target.value)}>
                                <Radio className="btnYes" value={1} disabled={(tango_balance_lower || tango_disabled)}><Translate text={`Send Gift Card Request`} /></Radio>
                                <Radio className="btnNo" value={0} disabled={(tango_balance_lower || tango_disabled)}><Translate text={`Customer Declined Email Request`} /></Radio>
                            </RadioGroup>
                        </Card>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
