import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Spin,
    message
} from 'antd';
import moment from 'moment';
import axios from 'axios';

import WizardSteps from './parts/steps';
import Notes from './parts/notes';
import Step1 from './parts/step1';
import Step2 from './parts/step2';
import Step3 from './parts/step3';
import Step4 from './parts/step4';
import Step5 from './parts/step5';
import Step6 from './parts/step6';
import Validation from './parts/validation';
import Sidebar from './parts/sidebar';
import F from '../../Functions';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Onboarding extends Component {
    state = {
        loading: false,
        last_index: 1,
        wizard: {
            ready: false,
            stepIndex: 1,
            id: '',
            bfile_id: 0,
            call_attempts: 0,
            call_reached_toggle: '',
            call_not_reached_toggle: '',
            call_continue: false,
            ok_time_toggle: '',
            good_time_call: '',
            policies_received_toggle: '',
            policies_questions_toggle: '',
            lsp_score: '',
            increase_score_details: '',
            appointment_financial_review: '',
            email: '',
            referral: [],
            get_call_next_48h_toggle: '',
            scheduled_callback_toggle: '',
            scheduled_callback_time: new Date(),
            step3_questions: [],
            lsp_rating_experience: null,
            notes: '',
            gift_card_request: 0,
            financial_conversion_script: null,
            financial_conversion_specialist: null,
            financial_conversion_specialist_usertype: '',
            financial_conversion_action: null,
            financial_conversion_appointment_date: '',
            financial_conversion_callback_date: '',
            sp_500: '',
            vip: '',
            tango_balance_lower: 0,
            was_invite_sent: false
        },
        bfile: {},
        user: this.props.auth.user,
        tango_card_amount: null,
        tango_balance: null
    }
    componentDidMount = () => {
        let skip = false;

        if ("ea_wizard" in window.localStorage) {
          const wizard = JSON.parse(window.localStorage.ea_wizard);
          if (typeof this.props.match.params.bfile_id !== "undefined") {
            if (wizard.bfile_id === this.props.match.params.bfile_id) {
              skip = true;
              this.setState({
                wizard
              })
            }
          }
        }

        if (!skip) {
            if (typeof this.props.match.params.bfile_id !== "undefined") {
                const bfile_id = this.props.match.params.bfile_id;
                this.setState({ loading: true });
                axios.get('/api/b_file/' + bfile_id).then((res) => {
                    const data = res.data;
                    let wizard = this.state.wizard;

                    if (data.questions.length > 0) {
                        wizard = data.questions[0];
                    }

                    wizard.stepIndex = 1;

                    wizard.ready = true;
                    wizard.email = data.email;

                    if (wizard.call_attempts > 0 && wizard.call_attempts % 3 === 0 && wizard.call_reached_toggle !== '1') {
                        wizard.call_continue = true;
                    } else {
                        wizard.call_continue = false;
                    }

                    //if (wizard.call_reached_toggle === '0') {
                    wizard.call_reached_toggle = '';
                    //}

                    wizard.ok_time_toggle = '';
                    wizard.good_time_call = '';

                    wizard.sp_500 = data.sp_500;
                    wizard.vip = data.vip;

                    this.setState({ loading: false, bfile: data, wizard })
                })

                const { user } = this.state;
                let tango_card_amount = null;
                let tango_balance = null;

                if (user.user_type === "VONBOARDER" || user.id === 2) {
                    axios.get("/api/tango/user_data?bfile_id=" + bfile_id).then((res) => {
                        if (res.data.tango_card_amount !== "" && res.data.tango_card_amount !== null && res.data.has_tango_card_token) {
                            tango_card_amount = parseInt(res.data.tango_card_amount, 10);

                            axios.post("/api/tango/info", {}).then((res) => {
                                tango_balance = res.data.tango_balance;
                            });
    
                            this.setState({ tango_card_amount, tango_balance })
                        }
                    });
                } else {
                    axios.get("/api/tango/user_data").then((res) => {
                        if (res.data.tango_card_amount !== "" && res.data.tango_card_amount !== null && res.data.has_tango_card_token) {
                            tango_card_amount = parseInt(res.data.tango_card_amount, 10);

                            axios.post("/api/tango/info", {}).then((res) => {
                                tango_balance = res.data.tango_balance;
                            });
    
                            this.setState({ tango_card_amount, tango_balance })
                        }
                    });
                }
            } else {
                const { wizard } = this.state;
                wizard.ready = true;
                this.setState({ wizard })
            }
        }
    }
    componentDidUpdate() {
        const { wizard } = this.state;
        if (typeof this.props.match.params !== 'undefined' && wizard.ready) {
            const params = this.props.match.params;
            if ("step" in params) {
                const stepIndex = parseInt(params.step);
                if (this.state.last_index != stepIndex) {
                    wizard.stepIndex = stepIndex;
                    this.setState({
                        wizard,
                        last_index: stepIndex
                    })
                }
            }
        }
    }
    wizardError(err) {
        message.error(err);
        return false;
    }
    validationCheck = () => {
        const { wizard } = this.state;
        const isEmpty = this.isEmpty;

        if (wizard.stepIndex === 5) {
            if (wizard.financial_conversion_specialist === '' || wizard.financial_conversion_specialist === null) {
                return this.wizardError("Financial specialist is mandatory.");
            }
        }

        return true;
    }
    updateField = (name, value, old_value) => {
        const { wizard } = this.state;

        if (name === 'stepIndex') {
            if (typeof old_value === "undefined") old_value = value;
            if (wizard.stepIndex >= old_value) {
                if (!this.validationCheck()) {
                    return false;
                }
            }
        }

        if (name === 'gotoStepIndex') {
            name = 'stepIndex';
        }

        wizard[name] = value;

        if (name === 'ok_time_toggle' && value === '1') {
            wizard.stepIndex = 2;
            this.smoothscroll();
        }

        if ((name === 'policies_received_toggle' || name === 'policies_questions_toggle') && value !== '' && wizard.policies_received_toggle !== '' && wizard.policies_received_toggle !== null && wizard.policies_questions_toggle !== '' && wizard.policies_questions_toggle !== null) {
            wizard.stepIndex = 3;
            this.smoothscroll();
        }

        if (name === 'financial_conversion_action' && value === 0) {
            wizard.stepIndex = 6;
            this.smoothscroll();
        }

        this.setState(wizard, () => {
            if (name === 'stepIndex') {
                this.props.history.push('/onboarding/step/' + wizard.stepIndex + '/' + this.state.bfile.id);
            } else {
                if (typeof this.props.match.params !== 'undefined') {
                    const params = this.props.match.params;
                    if ("step" in params) {
                        const stepIndex = parseInt(params.step);
                        if (stepIndex !== wizard.stepIndex) {
                            this.props.history.push('/onboarding/step/' + wizard.stepIndex + '/' + this.state.bfile.id);
                        }
                    }
                }
            }
            this.saveWizard();
        });
    }
    componentWillUnmount() {
        this.saveWizard();
    }
    saveWizard() {
        const { wizard } = this.state;
        window.localStorage.ea_wizard = JSON.stringify(wizard);
    }
    smoothscroll(){
        (function scroll(){
            var currentScroll = window.document.documentElement.scrollTop || window.document.body.scrollTop;
            if (currentScroll > 0) {
                 window.requestAnimationFrame(scroll);
                 window.scrollTo (0,currentScroll - (currentScroll/5));
            }
        })();
    }
    prevStep = () => {
        const { wizard } = this.state;
        this.updateField('gotoStepIndex', wizard.stepIndex - 1, wizard.stepIndex);
        this.smoothscroll();
    }
    submitStep = () => {
        const { wizard } = this.state;
        const validation = Validation(wizard);

        if (validation.success) {
            this.updateField('stepIndex', wizard.stepIndex + 1, wizard.stepIndex);
            this.smoothscroll();
        } else {
            console.log("errors", validation.errors);
        }
    }
    complete = () => {
        const { wizard, bfile, user, tango_card_amount, tango_balance } = this.state;

        this.setState({ loading : true });

        var data = {
            bfile_id: bfile.id,
            call_attempts: wizard.call_attempts,
            call_reached_toggle: wizard.call_reached_toggle,
            ok_time_toggle: wizard.ok_time_toggle,
            good_time_call: wizard.good_time_call,
            policies_received_toggle: wizard.policies_received_toggle,
            policies_questions_toggle: wizard.policies_questions_toggle,
            lsp_rating_experience: JSON.stringify(wizard.lsp_rating_experience),
            lsp_score: wizard.lsp_score,
            increase_score_details: wizard.increase_score_details,
            referral: JSON.stringify(wizard.referral),
            gift_card_request: wizard.gift_card_request,
            financial_conversion_specialist: wizard.financial_conversion_specialist,
            financial_conversion_action: wizard.financial_conversion_action,
            was_invite_sent: false
        };
        if (wizard.financial_conversion_appointment_date !== null && wizard.financial_conversion_appointment_date !== '') {
            data.financial_conversion_appointment_date = wizard.financial_conversion_appointment_date;
        }
        let financial_conversion_callback_date = null;
        if (wizard.financial_conversion_callback_date !== null && wizard.financial_conversion_callback_date !== '') {
            data.financial_conversion_callback_date = moment(new Date(wizard.financial_conversion_callback_date)).format('YYYY-MM-DDTHH:mm:ss');
            financial_conversion_callback_date = new Date(wizard.financial_conversion_callback_date).toUTCString();
        }
        if (wizard.id === '') {
            data.user_id = user.id;
        }
        if (wizard.financial_conversion_action !== 0) {
            if (wizard.financial_conversion_specialist !== null && wizard.financial_conversion_specialist !== '' && financial_conversion_callback_date !== null) {

                let user_id = user.id;
                let type = null;

                if (wizard.financial_conversion_action === 1 || wizard.financial_conversion_action === 2) {
                    user_id = wizard.financial_conversion_specialist;
                }
                if (wizard.financial_conversion_action === 1) {
                    type = "financial-appointment-call-back-time";
                }
                if (wizard.financial_conversion_action === 2) {
                    type = "financial-appointment-by-on-boarder";
                }
                if (wizard.financial_conversion_action === 3) {
                    type = "incomplete-onboard-call-back-time";
                }

                axios.post("/api/send_invite", {
                    "bfile_id": bfile.id,
                    "date_time": financial_conversion_callback_date,
                    "location": "",
                    "type": type,
                    "user_id": user_id
                });
                data.was_invite_sent = true;
            }
        }
        if (wizard.increase_score_details !== null && wizard.increase_score_details !== '') {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": 'Customer Feedback: '+wizard.increase_score_details,
                "user_id": user.id
            });
        }
        var bfile_data = {
            sp_500: wizard.sp_500,
            vip: wizard.vip,
            attempts: wizard.call_attempts,
            is_onboarded: 1,
            onboarder_id: user.id
        };
        if (bfile.onboarding_id === null || bfile.onboarding_id === "") {
            bfile_data.onboarding_id = user.id;
        }
        if (wizard.email !== null && wizard.email !== "") {
            bfile_data.email = wizard.email;
        }
        bfile_data.expiration_date = bfile.expiration_date;
        if (wizard.financial_conversion_action !== 3) {
            if (wizard.financial_conversion_action !== 0) {
                if (wizard.financial_conversion_specialist !== null && wizard.financial_conversion_specialist !== "") {
                    bfile_data.financial_id = wizard.financial_conversion_specialist;
                }
                bfile_data.is_sent_to_financial = 1;
            } else {
                bfile_data.archive = 1;
                if (user.user_type === "VONBOARDER") {
                    bfile_data.archive = 0;
                    bfile_data.vob_archived = 1;
                }
                axios.post("/api/bfile_notes", {
                    "bfile_id": bfile.id,
                    "note": "Not Interested in the Financial Conversation.",
                    "user_id": user.id
                });
            }
        }

        if (user.user_type == "VONBOARDER") {
            if (wizard.financial_conversion_action) {
                bfile_data.vob_completed = 1;
            }
        }

        axios.put("/api/b_file/" + bfile.id, bfile_data);

        if (wizard.sp_500 === true) {
            axios.get("/api/snp").then((res) => {
                if (typeof res.data.LastTradePrice !== "undefined" && res.data.LastTradePrice !== "") {
                    axios.put("/api/b_file/" + bfile.id, {
                        sp_price: parseFloat(res.data.LastTradePrice.replace(",", "")),
                        sp_date: new Date()
                    });
                }
            });
        }

        //if (wizard.financial_conversion_specialist !== null && wizard.financial_conversion_specialist !== "") {
        axios.get("/api/user_need_attention").then(function(res){
            const data = res.data;
            for(var i=0; i<data.length; i++) {
                if (data[i].bfile_id == wizard.bfile_id) {
                    axios.delete("/api/need_attention/" + data[i].id);
                }
            }
        });
        //}

        if (wizard.notes !== null && wizard.notes !== '') {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": wizard.notes,
                "user_id": user.id
            });
        }

        if (user.reward_program_enabled === 1 || user.user_type === "VONBOARDER" || user.id === 2) {
            if (wizard.gift_card_request === 1 && wizard.email !== '') {
                if (tango_card_amount !== null && tango_balance !== null && tango_balance > 0 && tango_balance >= tango_card_amount) {
                    axios.post("/api/referral", {
                        first_name: bfile.first_name,
                        last_name: bfile.last_name,
                        bfile_id: bfile.id,
                        email: wizard.email,
                        agency_name: bfile.agency.name,
                        referral_amount: tango_card_amount,
                        agency_id: bfile.agency_id
                    });
                }
            }
        }

        let ajax = null
        if (wizard.id !== '') {
            ajax = axios.put("/api/ea_questions/" + wizard.id, data);
        } else {
            ajax = axios.post("/api/ea_questions", data);
        }
        ajax.then((res) => {
            this.setState({ loading: false }, () => {
                this.props.history.push('/dashboard');
            })
        })
    }
    render() {

        const { wizard, bfile, user, loading } = this.state;

        let WizardStep = Step1;
        if (wizard.stepIndex === 1) WizardStep = Step1;
        if (wizard.stepIndex === 2) WizardStep = Step2;
        if (wizard.stepIndex === 3) WizardStep = Step3;
        if (wizard.stepIndex === 4) WizardStep = Step4;
        if (wizard.stepIndex === 5) WizardStep = Step5;
        if (wizard.stepIndex === 6) WizardStep = Step6;

        return (
            <div>
                <WizardSteps wizard={wizard} updateField={this.updateField} />
                <Row type="flex" gutter={16}>
                    <Col lg={{ span: 6, order: 0 }} span={24} xs={{ order: 1 }}>
                        <Sidebar wizard={wizard} bfile={bfile} />
                    </Col>
                    <Col lg={{ span: 18, order: 0 }} span={24} xs={{ order: 0 }}>
                        <Spin indicator={antIcon} spinning={loading}>
                            <WizardStep
                                wizard={wizard}
                                bfile={bfile}
                                updateField={this.updateField}
                                submitStep={this.submitStep}
                                complete={this.complete}
                                prevStep={this.prevStep}
                                {...this.props}
                            />
                        </Spin>

                        <Notes {...this.props} />
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Onboarding;
