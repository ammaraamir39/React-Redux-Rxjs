import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Spin
} from 'antd';
import moment from 'moment';
import axios from 'axios';

import WizardSteps from './parts/steps';
import Notes from './parts/notes';
import Step1 from './parts/step1';
import Step2 from './parts/step2';
import Step3 from './parts/step3';
import Step4 from './parts/step4';
import Validation from './parts/validation';
import Sidebar from './parts/sidebar';
import F from '../../Functions';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Financial extends Component {
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
            callback_to_schedule: null,
            interested_in_appointment_toggle: null,
            ok_time_toggle: '',
            good_time_call: '',
            interested_in_appointment: '',
            schedule_time: null,
            appointment_place: '',
            reminder_call_toggle: '',
            appointment_status: '',
            appointment_cancelled_options: '',
            appointment_reschedule_date: '',
            products_sold: '[]',
            note: '',
            sp_500: '',
            vip: '',
            appointment_info: '',
            financial_outcome: false,
            user_id: null,
            financial_script: 0
        },
        bfile: {},
        user: this.props.auth.user,
        financial_outcome: false
    }
    componentDidMount = () => {
        let skip = false;

        if ("financial_wizard" in window.localStorage) {
          const wizard = JSON.parse(window.localStorage.financial_wizard);
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

                    if (data.financial_conversion.length > 0) {
                        wizard = data.financial_conversion[0];
                    }

                    wizard.financial_outcome = false;
                    wizard.financial_script = 0;
                    if (data.questions.length > 0) {
                        wizard.financial_script = data.questions[0].financial_conversion_script;
                        if (wizard.financial_script === null || wizard.financial_script === "") {
                            wizard.financial_script = 0;
                        }
                    }

                    wizard.stepIndex = 1;
                    wizard.ready = true;
                    wizard.schedule_time = null;
                    wizard.callback_to_schedule = null;

                    if (wizard.interested_in_appointment_toggle == 1) {
                        wizard.financial_outcome = true;
                    }

                    if (wizard.call_attempts > 0 && wizard.call_attempts % 3 === 0 && wizard.call_reached_toggle !== '1') {
                        wizard.call_continue = true;
                    } else {
                        wizard.call_continue = false;
                    }

                    if (wizard.call_reached_toggle === '0') {
                        wizard.call_reached_toggle = '';
                    }

                    wizard.sp_500 = data.sp_500;
                    wizard.vip = data.vip;

                    /*if (typeof this.props.match.params.action !== "undefined") {
                        const action = this.props.match.params.action;
                        if (action === 'last') {
                            wizard.stepIndex = 4;
                            wizard.financial_outcome = true;
                        }
                    }*/

                    this.setState({ loading: false, bfile: data, wizard })
                })

                const { user } = this.state;
                let tango_card_amount = null;
                let tango_balance = null;

                if (user.user_type === "VONBOARDER" || user.id === 2) {
                    axios.get("/api/tango/user_data?bfile_id=" + bfile_id).then((res) => {
                        if (res.data.tango_card_amount !== '' && res.data.tango_card_amount !== null) {
                            tango_card_amount = parseInt(res.data.tango_card_amount, 10);
                        }

                        axios.post("/api/tango/info", { bfile_id: bfile_id }).then((res) => {
                            tango_balance = res.data.tango_balance;
                        });

                        this.setState({ tango_card_amount, tango_balance })
                    });
                } else {
                    axios.get("/api/tango/user_data").then((res) => {
                        if (res.data.tango_card_amount !== '' && res.data.tango_card_amount !== null) {
                            tango_card_amount = parseInt(res.data.tango_card_amount, 10);
                        }

                        axios.post("/api/tango/info", {}).then((res) => {
                            tango_balance = res.data.tango_balance;
                        });

                        this.setState({ tango_card_amount, tango_balance })
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
                if (params.step === "last") {
                    params.step = 4;
                }
                const stepIndex = parseInt(params.step);
                if (this.state.last_index != stepIndex) {
                    wizard.stepIndex = stepIndex;
                    if (params.step === 4) {
                        wizard.financial_outcome = true;
                    }
                    this.setState({
                        wizard,
                        last_index: stepIndex
                    })
                }
            }
        }
    }
    updateField = (name, value) => {
        const { wizard } = this.state;
        wizard[name] = value;

        if (name === 'ok_time_toggle' && value === '1') {
            wizard.stepIndex = 2;
            this.smoothscroll();
        }

        if (name === 'interested_in_appointment_toggle' && value === '1') {
            wizard.stepIndex = 3;
            this.smoothscroll();
        }

        if (name === 'interested_in_appointment_toggle' && (value === '3' || value === '0')) {
            wizard.stepIndex = 4;
            this.smoothscroll();
        }

        this.setState(wizard, () => {
            if (name === 'stepIndex') {
                this.props.history.push('/financial/step/' + wizard.stepIndex + '/' + this.state.bfile.id);
            } else {
                if (typeof this.props.match.params !== 'undefined') {
                    const params = this.props.match.params;
                    if ("step" in params) {
                        const stepIndex = parseInt(params.step);
                        if (stepIndex !== wizard.stepIndex) {
                            this.props.history.push('/financial/step/' + wizard.stepIndex + '/' + this.state.bfile.id);
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
        window.localStorage.financial_wizard = JSON.stringify(wizard);
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
        this.updateField('stepIndex', wizard.stepIndex - 1);
        this.smoothscroll();
    }
    submitStep = () => {
        const { wizard } = this.state;
        const validation = Validation(wizard);

        if (validation.success) {
            this.updateField('stepIndex', wizard.stepIndex + 1);
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
            interested_in_appointment_toggle: wizard.interested_in_appointment_toggle,
            appointment_place: wizard.appointment_place,
            reminder_call_toggle: wizard.reminder_call_toggle,
            appointment_status: wizard.appointment_status,
            products_sold: wizard.products_sold,
            appointment_info: wizard.appointment_info
        };

        if (wizard.schedule_time !== null && wizard.schedule_time !== '') {
            data.schedule_time = moment(wizard.schedule_time).format('YYYY-MM-DDTHH:mm:ss');
        }

        if (wizard.good_time_call !== null && wizard.good_time_call !== '') {
            data.good_time_call = moment(wizard.good_time_call).format('YYYY-MM-DDTHH:mm:ss');
        }

        if (wizard.appointment_reschedule_date !== null && wizard.appointment_reschedule_date !== '') {
            data.appointment_reschedule_date = moment(wizard.appointment_reschedule_date).format('YYYY-MM-DDTHH:mm:ss');
        }

        if (wizard.interested_in_appointment_toggle === '2') {
            if (wizard.callback_to_schedule && wizard.callback_to_schedule !== '') {
                axios.post("/api/send_invite", {
                    bfile_id: bfile.id,
                    date_time: new Date(wizard.callback_to_schedule).toUTCString(),
                    location: '',
                    type: "financial-appointment-call-back-time",
                    user_id: user.id
                });
            } else {
                wizard.interested_in_appointment_toggle = null;
                data.interested_in_appointment_toggle = null;
            }
        }

        if (wizard.id === '') {
            data.user_id = user.id;
        }

        if (wizard.appointment_status === 'Appointment Rescheduled') {
            if (wizard.appointment_reschedule_date !== null && wizard.appointment_reschedule_date !== "") {
                axios.post("/api/send_invite", {
                    bfile_id: bfile.id,
                    date_time: new Date(wizard.appointment_reschedule_date).toUTCString(),
                    location: wizard.appointment_place,
                    type: "financial-appointment-reschedule",
                    user_id: user.id
                });
            }
        }

        if (wizard.appointment_status === 'Appointment Cancelled' && wizard.appointment_cancelled_options === 'Call to Reschedule' || wizard.appointment_status === 'Call to Reschedule') {
            if (wizard.appointment_reschedule_date !== null && wizard.appointment_reschedule_date !== "") {
                axios.post("/api/send_invite", {
                    bfile_id: bfile.id,
                    date_time: new Date(wizard.appointment_reschedule_date).toUTCString(),
                    location: wizard.appointment_place,
                    type: "financial-appointment-reschedule",
                    user_id: user.id
                });
            }
        }

        if (wizard.interested_in_appointment === '0') {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": "Not Interested in the Financial Conversation.",
                "user_id": user.id
            });
        }

        var bfile_data = {
            sp_500: wizard.sp_500,
            vip: wizard.vip,
            financial_calls_attempts: wizard.call_attempts,
            financial_id: user.id
        };
        if (wizard.interested_in_appointment === '1') {
            bfile_data.is_appointment_made = 1;
        }
        if (wizard.appointment_status === 'Complete Sold' || wizard.appointment_status === 'Complete Not Sold' || wizard.appointment_status === 'Appointment Rescheduled') {
            bfile_data.is_appointment_kept = 1;
        }
        if (wizard.appointment_status == 'Complete Sold') {
            bfile_data.is_appointment_sold = 1;
        }

        axios.put("/api/b_file/"+bfile.id, bfile_data);

        if (wizard.sp_500 === true) {
            axios.get("/api/snp").then(function(res){
                const data = res.data;
                if (typeof data.LastTradePrice !== "undefined" && data.LastTradePrice !== "") {
                    const sp_today_price = parseFloat(data.LastTradePrice.replace(",", ""));
                    axios.put("/api/b_file/" + bfile.id, {
                        sp_price: sp_today_price,
                        sp_date: new Date()
                    });
                }
            });
        }

        if (wizard.notes !== '') {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": wizard.notes,
                "user_id": user.id
            });
        }

        if (wizard.appointment_status === 'Appointment Cancelled' && wizard.appointment_cancelled_options === "Not Interested") {
            axios.put("/api/b_file/" + wizard.id, { archive: 1 });
        }

        axios.get("/api/user_need_attention").then(function(res){
            const data = res.data;
            for(var i=0; i<data.length; i++) {
                if (data[i].bfile_id == wizard.bfile_id) {
                    axios.delete("/api/need_attention/" + data[i].id);
                }
            }
        });

        let ajax = null;
        if (wizard.id !== '') {
            ajax = axios.put("/api/financial_conversions/"+wizard.id, data);
        } else {
            ajax = axios.post("/api/financial_conversions", data);
        }

        ajax.then((res) => {
            this.setState({ loading: false }, () => {
                this.props.history.push('/dashboard');
            })
        });
    }
    render() {

        const { wizard, bfile, user, loading } = this.state;

        let WizardStep = Step1;
        if (wizard.stepIndex === 1) WizardStep = Step1;
        if (wizard.stepIndex === 2) WizardStep = Step2;
        if (wizard.stepIndex === 3) WizardStep = Step3;
        if (wizard.stepIndex === 4) WizardStep = Step4;

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

export default Financial;
