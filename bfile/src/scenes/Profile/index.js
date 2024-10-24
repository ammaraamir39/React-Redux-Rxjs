import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Input,
    Checkbox,
    message,
    Select,
    Switch
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import EAProfile from './ea';
import LSPProfile from './lsp';
import AgencyManagerProfile from './agency_manager';
import DefaultProfile from './default';
import Cookies from 'js-cookie';
import { Translate } from 'react-translated';

const Option = Select.Option;

let available_hours = [];
for (let i = 7; i < 12; i++) {
    available_hours.push({
        value: i+':00 am',
        checked: false
    });
    available_hours.push({
        value: i+':30 am',
        checked: false
    });
}
available_hours.push({
    value: '12:00 pm',
    checked: false
});
for (let i = 1; i < 8; i++) {
    available_hours.push({
        value: i+':00 pm',
        checked: false
    });
    available_hours.push({
        value: i+':30 pm',
        checked: false
    });
}

class Profile extends Component {
    state = {
        loading: true,
        loggedin: this.props.auth.user,
        user: {},
        agency: {},
        card: {
            card_number: '',
            exp_month: '',
            exp_year: '',
            cvc: ''
        },
        change_payment_method: false,
        appointment_hours: {
            'Sunday': JSON.parse(JSON.stringify(available_hours)),
            'Monday': JSON.parse(JSON.stringify(available_hours)),
            'Tuesday': JSON.parse(JSON.stringify(available_hours)),
            'Wednesday': JSON.parse(JSON.stringify(available_hours)),
            'Thursday': JSON.parse(JSON.stringify(available_hours)),
            'Friday': JSON.parse(JSON.stringify(available_hours)),
            'Saturday': JSON.parse(JSON.stringify(available_hours)),
        },
        has_calendly: false,
        calendly_event_types: []
    }
    componentDidMount = () => {
        const { loggedin } = this.state;

        this.setState({ loading: true });

        let user_id = loggedin.id;
        axios.get("/api/users/" + user_id).then((res) => {

            if (res.data.user_type === 'EA') {
                let agency_id = null;
                for (let i=0; i < res.data.user_agency_assoc.length; i++) {
                    agency_id = res.data.user_agency_assoc[i].agency_id;
                    break;
                }

                if (agency_id) {
                    axios.get("/api/agencies/" + agency_id).then((res) => {
                        this.setState({ agency: res.data })
                    });
                }
            }

            if (res.data.appointment_hours) {
                let appointment_hours = this.state.appointment_hours;
                const appointment_hours_arr = JSON.parse(res.data.appointment_hours);
                for (var day in appointment_hours) {
                    for (let i = 0; i < appointment_hours[day].length; i++) {
                        if (appointment_hours_arr[day].indexOf(appointment_hours[day][i].value) >= 0) {
                            appointment_hours[day][i].checked = true;
                        }
                    }
                }
                this.setState({
                    appointment_hours
                })
            }

            res.data.password = '';

            if (res.data.calendly_access_token) {
                this.setState({
                    has_calendly: true
                })

                axios.get("/api/calendly/get_event_types").then((res) => {
                    if (res.data.success) {
                        this.setState({
                            calendly_event_types: res.data.data
                        })
                    }
                });
            }
            
            this.setState({
                loading: false,
                user: res.data
            });
        });
    }
    update_appointment_hours = (day, hour_index, value) => {
        let { appointment_hours } = this.state;
        appointment_hours[day][hour_index].checked = value;
        this.setState({ appointment_hours })
    }
    updateField = (name, val) => {
        const { user }  = this.state;
        user[name] = val;
        this.setState({ user });
    }
    updateAgencyField = (name, val) => {
        const { agency }  = this.state;
        agency[name] = val;
        this.setState({ agency });
    }
    updateCCField = (name, val) => {
        const { card }  = this.state;
        card[name] = val;
        this.setState({ card });
    }
    update = () => {
        const { user, card, agency, loggedin } = this.state;

        this.setState({ loading: true });

        if (card.card_number !== "" && card.cvc !== "" && card.exp_month !== "" && card.exp_year !== "") {
            window.Stripe.setPublishableKey(window.stripe);
            window.Stripe.createToken({
                number: card.card_number,
                cvc: card.cvc,
                exp_month: card.exp_month,
                exp_year: card.exp_year
            }, (status, response) => {
                const stripe_token = response.id;
                if (response.error) {
                    message.error(response.error.message);
                    this.setState({ loading: false });
                } else {
                    axios.post("/api/stripe/add_card", { stripe_token }).then((res) => {
                        message.success(F.translate(`Payment method has been updated.`));
                        this.updateUserInfo();
                    }).catch(() => {
                        message.error(F.translate(`Can\'t update payment method.`));
                        this.setState({ loading: false });
                    })
                }
            });
        } else {
            this.updateUserInfo();
        }
    }
    updateUserInfo = () => {
        const { user, card, agency, loggedin } = this.state;

        this.setState({ loading: true });

        let appointment_hours = {
            'Sunday': [],
            'Monday': [],
            'Tuesday': [],
            'Wednesday': [],
            'Thursday': [],
            'Friday': [],
            'Saturday': [],
        }

        var appointment_hours_found = false;
        for(var day in this.state.appointment_hours) {
            for (let i = 0; i < this.state.appointment_hours[day].length; i++) {
                const hour = this.state.appointment_hours[day][i];
                if (hour.checked) {
                    appointment_hours[day].push(hour.value);
                    appointment_hours_found = true;

                }
            }
        }

        if (!appointment_hours_found) {
            appointment_hours = null;
        } else {
            appointment_hours = JSON.stringify(appointment_hours);
        }

        axios.put('/api/users/' + user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            mobile_number: user.mobile_number,
            company_name: user.company_name,
            address: user.address,
            city: user.city,
            state: user.state,
            zipcode: user.zipcode,
            jobs: user.jobs,
            timezone: user.timezone,
            default_date: user.default_date,
            language: user.language,
            email_cron_notification: user.email_cron_notification,
            email_game_notification: user.email_game_notification,
            email_sale_notification: user.email_sale_notification,
            minimum_liability_limits: user.minimum_liability_limits,
            virtual_link: user.virtual_link,
            appointment_hours: appointment_hours,
            calendly_rs_setup_appointment: user.calendly_rs_setup_appointment,
            minimum_liability_limits_ext: user.minimum_liability_limits_ext
        }).then((res) => {
            message.success(F.translate(`Profile has been updated successfully.`));
            this.setState({ loading: false });

            Cookies.set("user_info", JSON.stringify({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                id: user.id,
                user_type: user.user_type,
                jobs: user.jobs,
                default_date: user.default_date,
                last_login: user.last_login,
                language: user.language
            }));
            this.props.auth.refresh();

            if (user.password !== "") {
                axios.post("/api/update_password", {
                    password: user.password
                }).then((res) => {
                    message.success(F.translate(`Password has been updated successfully.`));
                });
            }

            if (loggedin.language !== user.language) {
                this.props.history.push('/dashboard');
            }
        })
    }
    requestPassword = () => {
        const { user } = this.state;
        this.setState({ loading: true });
        axios.post("/api/request_reset_password", { email: user.email }).then((res) => {
            this.setState({ loading: false });
            if (typeof res.data.error !== "undefined") {
                message.error(F.translate(`Can't send password request.`));
            } else {
                message.success(F.translate(`Password request sent.`));
            }
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't send password request.`));
        });
    }
    logoutCalendly = () => {
        const { user } = this.state;
        this.setState({ loading: true });
        axios.put('/api/users/' + user.id, {
            calendly_access_token: null,
            calendly_refresh_token: null,
            calendly_expires_in: null,
            calendly_rs_setup_appointment: null
        }).then(() => {
            message.success(F.translate(`You have successfully logged out.`));
            this.setState({ loading: false, has_calendly: false });
        });
    }
    render() {

        const { loading, user, card, agency } = this.state;
        const updateField = this.updateField;
        const updateCCField = this.updateCCField;
        const updateAgencyField = this.updateAgencyField;
        const update_appointment_hours = this.update_appointment_hours;
        const logoutCalendly = this.logoutCalendly;

        return (
            <div>
                {user.user_type === 'EA' ? (
                    <EAProfile
                        loading={loading}
                        user={user}
                        card={card}
                        agency={agency}
                        requestPassword={this.requestPassword}
                        updateField={updateField}
                        updateCCField={updateCCField}
                        updateAgencyField={updateAgencyField}
                        update={this.update.bind(this)}
                        change_payment_method={this.state.change_payment_method}
                        show_payment_method={() => this.setState({ change_payment_method: true })}
                        appointment_hours={this.state.appointment_hours}
                        update_appointment_hours={update_appointment_hours}
                        calendly_event_types={this.state.calendly_event_types}
                        has_calendly={this.state.has_calendly}
                        logoutCalendly={logoutCalendly}
                    />
                ) : null}
                {user.user_type === 'LSP' ? (
                    <LSPProfile
                        loading={loading}
                        user={user}
                        updateField={updateField}
                        update={this.update.bind(this)}
                        requestPassword={this.requestPassword}
                        appointment_hours={this.state.appointment_hours}
                        update_appointment_hours={update_appointment_hours}
                        calendly_event_types={this.state.calendly_event_types}
                        has_calendly={this.state.has_calendly}
                        logoutCalendly={logoutCalendly}
                    />
                ) : null}
                {user.user_type === 'AGENCY_MANAGER' ? (
                    <AgencyManagerProfile
                    loading={loading}
                    user={user}
                    updateField={updateField}
                    update={this.update.bind(this)}
                    requestPassword={this.requestPassword}  
                    />
                ):null
                }
                {user.user_type !== 'EA' && user.user_type !== 'LSP' && user.user_type !== 'AGENCY_MANAGER' ? (
                    <DefaultProfile
                        loading={loading}
                        user={user}
                        updateField={updateField}
                        update={this.update.bind(this)}
                        requestPassword={this.requestPassword}
                    />
                ) : null}
                
            </div>
        );

    }
}

export default Profile;
