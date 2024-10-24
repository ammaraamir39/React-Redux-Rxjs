import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    message,
    Spin
} from 'antd';
import axios from 'axios';
import moment from 'moment';

import WizardSteps from './parts/steps';
import StepCall from './parts/step-call';
import Step1 from './parts/step1';
import Step2 from './parts/step2';
import Step2_1 from './parts/step2_1';
import Step3 from './parts/step3';
import Step3_1 from './parts/step3_1';
import Step3_2 from './parts/step3_2';
import Step3_3 from './parts/step3_3';
import Step3_4 from './parts/step3_4';
import Step4 from './parts/step4';
import Step4_1 from './parts/step4_1';
import Step5 from './parts/step5';
import Step5_1 from './parts/step5_1';
import Step6 from './parts/step6';
import Step7 from './parts/step7';
import Step7_1 from './parts/step7_1';
import Validation from './parts/validation';
import Sidebar from './parts/sidebar';
import F from '../../Functions';
import ChangeOwnershipModal from './parts/change-ownership-modal';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Wizard extends Component {
    state = {
        loading: false,
        user: this.props.auth.user,
        last_index: 1,
        change_ownership_modal: false,
        is_calculator_only: false,
        wizard: {
            ready: false,
            stepIndex: 1,
            id: '',
            notes: '',
            status: 'New Bfile',
            acknowledge_by: null,
            acknowledge: null,
            action: '',
            address: '',
            address_cont: '',
            agency_id: null,
            archive: 0,
            asset_401k_accounts_toggle: null,
            asset_401k_accounts: '[]',
            asset_401k_value: 0,
            asset_accounts: '[]',
            asset_preservation_toggle: '',
            asset_preservation_value: '',
            asset_total_value: '',
            attempts: '0',
            auto_carrier: null,
            auto_expiration_date: null,
            auto_liability: null,
            auto_policy_not_sold_current_carrier: '',
            auto_policy_not_sold_current_liability_limit: '',
            auto_policy_not_sold_expiration_date: null,
            auto_policy_sold_bfile_limit: '',
            auto_policy_sold_current_liability_limit: '',
            auto_policy_sold_effective_date: null,
            auto_policy_sold_items_sold: '',
            auto_policy_sold_liability_limit_sold: '',
            auto_policy_sold_policy_premium: '',
            auto_policy_sold_term: '',
            auto_sold_toggle: '',
            birthday: '',
            business_loan_toggle: null,
            business_name: '',
            business_owner_toggle: '',
            business_retirement_value: null,
            business_type: '',
            business_type_other: '',
            call_type: '',
            children: null,
            children_living_home_toggle: null,
            city: '',
            coverage_detail_toggle: null,
            cross_sell_opportunities_quoted: 0,
            cross_sell_opportunities_sold: 0,
            cross_sell_policies_uncovered: 0,
            deleted: 0,
            mortgage_review: null,
            mortgage_review_last: null,
            mortgage_purchase_home: null,
            had_mortgage_review: null,
            email: '',
            employed_anual_income: '',
            employed_length: null,
            employed_retired_disabled: '',
            employed_toggle: '',
            employees_count: null,
            employer_name: '',
            employer_retire_from: '',
            employer_years: '',
            expiration_date: null,
            facebook: '',
            financial_calls_attempts: 0,
            first_name: '',
            home_bfile_liability: null,
            home_liability: null,
            home_liability_sold: null,
            home_market_value: '',
            home_mortgage: '',
            home_mortgage_protection_benefit: '',
            home_mortgage_protection_policy: '[]',
            home_mortgage_protection_toggle: '',
            home_mortgage_toggle: '0',
            home_policy_not_sold_current_carrier: '',
            home_policy_not_sold_current_liability_limit: '',
            home_policy_not_sold_expiration_date: null,
            home_policy_premium: null,
            home_policy_sold_bfile_limit: '',
            home_policy_sold_effective_date: null,
            home_policy_sold_items_sold: '',
            home_policy_sold_liability_limit: '',
            home_policy_sold_liability_limit_sold: '',
            home_policy_sold_policy_premium: '',
            home_policy_sold_term: '',
            home_sold_toggle: '',
            home_toggle: '',
            insurance_score: '',
            internet_leads: 0,
            is_appointment_kept: 0,
            is_appointment_made: 0,
            is_appointment_sold: 0,
            is_lead: 0,
            is_onboarded: 0,
            is_renewal: 0,
            is_requote: 0,
            is_saved_for_later: 0,
            is_sent_to_financial: 0,
            language: null,
            last_name: '',
            liability_calculator_value: '0',
            life_opportunities: 0,
            life_opportunities_received: 0,
            life_opportunities_sold: 0,
            linkedin: '',
            need_attention: 0,
            no_policies_sold: 0,
            nosalearchive_expiration_date: null,
            not_interested: 0,
            parent_id: null,
            personal_property_toggle: null,
            personal_property_type: '[]',
            personal_property_value: '',
            phone: '',
            phone2: '',
            policy_umbrella_total: 0,
            primary_vehicles_num: null,
            primary_vehicles_toggle: '',
            profile_photo: '',
            quote_auto_toggle: '',
            quote_home_toggle: '',
            renewals: 0,
            retirement_dollars: 0,
            retirement_plan: '',
            retirement_plan_value: '',
            review: 0,
            rollover_dollars_created: 0.0,
            rollover_opportunities: 0,
            secondary_home_market_value: '',
            secondary_home_mortgage: '',
            secondary_home_mortgage_toggle: '',
            secondary_home_toggle: '',
            secondary_home_type: '[]',
            secondary_mortgage_protection_benefit: '',
            secondary_mortgage_protection_policy: '',
            secondary_mortgage_protection_toggle: '',
            secondary_vehicles: '[]',
            secondary_vehicles_toggle: '',
            secondary_vehicles_value: '',
            sp_500: 0,
            spouse_birthday: '',
            spouse_first_name: '',
            spouse_last_name: '',
            spouse_toggle: null,
            state: '',
            twitter: '',
            umbrella_limit: '',
            umbrella_policy_quoted: 0,
            umbrella_policy_sold: 0,
            umbrella_policy_uncovered: 0,
            user_id: '',
            vip: 0,
            vonboard: 0,
            zipcode: '',
            dob_mm: '',
            dob_yyyy: '',
            dob_age: '',
            dob2_mm: '',
            dob2_yyyy: '',
            dob2_age: '',
            policies: [],
            financial_id: null,
            onboarding_id: null,
            onboarder_id: null,
            vo_sent_date: null,
            step_insurance_question: null,

            modal_customer_bfile_id: null,
            show_modal_customer_exist: false,
            modal_customer_ignore: false,
            
            no_follow_up: null
        },
    }
    componentDidMount = () => {
        let skip = false;

        axios.get("/api/user").then((res) => {
            const user = res.data;
            if (user.user_agency_assoc.length > 0) {
                var agency_id = user.user_agency_assoc[0].agency_id;
                axios.get("/api/agencies/" + agency_id).then((res) => {
                    if (res.data.calculator_only == 1) {
                        this.setState({
                            is_calculator_only: true
                        })
                    }
                });
            }
        })

        if ("wizard" in window.localStorage) {
          let wizard = JSON.parse(window.localStorage.wizard);
          const initWizard = (data) => {
              const rac = F.bfile_rac(data);
              data.ready = true;
              data.rac_calculator = rac.rac;
              data.rac_auto = rac.auto;
              data.rac_home = rac.home;
              data.rac_financial = rac.financial;
              if (data.children === '') data.children = null;
              if (data.primary_vehicles_num === '') data.primary_vehicles_num = null;
              if (data.birthday !== '' && data.birthday !== null) {
                  const birthday = data.birthday.split("/");
                  if (parseInt(birthday[0], 10) < 10) {
                      data.dob_mm = '0' + parseInt(birthday[0], 10);
                  } else {
                      data.dob_mm = birthday[0] + '';
                  }
                  data.dob_yyyy = birthday[2] + '';
                  data.dob_age = F.getAge(new Date(data.birthday));
              }
              if (data.spouse_birthday !== '' && data.spouse_birthday !== null) {
                  const spouse_birthday = data.spouse_birthday.split("/");
                  if (parseInt(spouse_birthday[0], 10) < 10) {
                      data.dob2_mm = '0' + parseInt(spouse_birthday[0], 10);
                  } else {
                      data.dob2_mm = spouse_birthday[0] + '';
                  }
                  data.dob2_yyyy = spouse_birthday[2] + '';
                  data.dob2_age = F.getAge(new Date(data.spouse_birthday));
              }
              if (data.auto_policy_sold_effective_date !== '' && data.auto_policy_sold_effective_date !== null) {
                  data.auto_policy_sold_effective_date = moment(data.auto_policy_sold_effective_date);
              }
              if (data.auto_policy_not_sold_expiration_date !== '' && data.auto_policy_not_sold_expiration_date !== null) {
                  data.auto_policy_not_sold_expiration_date = moment(data.auto_policy_not_sold_expiration_date);
              }
              if (data.home_policy_sold_effective_date !== '' && data.home_policy_sold_effective_date !== null) {
                  data.home_policy_sold_effective_date = moment(data.home_policy_sold_effective_date);
              }
              if (data.home_policy_not_sold_expiration_date !== '' && data.home_policy_not_sold_expiration_date !== null) {
                  data.home_policy_not_sold_expiration_date = moment(data.home_policy_not_sold_expiration_date);
              }
              return data;
          };
          if (typeof this.props.match.params.bfile_id !== "undefined") {
            if (wizard.id === this.props.match.params.bfile_id) {
              skip = true;
              wizard = initWizard(wizard);
              this.setState({
                wizard
              })
            }
          } else {
            if (this.props.location.search.indexOf("new") < 0) {
              skip = true;
              wizard = initWizard(wizard);
              this.setState({
                wizard
              })
            }
          }
        }

        if (this.props.location.search.indexOf("new") >= 0) {
          this.props.history.push('/wizard');
        }

        if (!skip) {
          if (typeof this.props.match.params.bfile_id !== "undefined") {
              const bfile_id = this.props.match.params.bfile_id;
              const { user } = this.state;
              this.setState({ loading: true });
              axios.get('/api/b_file/' + bfile_id).then((res) => {
                  const data = res.data;
                  const rac = F.bfile_rac(data);
                  data.stepIndex = 1;
                  data.rac_calculator = rac.rac;
                  data.rac_auto = rac.auto;
                  data.rac_home = rac.home;
                  data.rac_financial = rac.financial;
                  data.rac_customary_items = rac.customary_items;
                  data.ready = true;
                  data.mortgage_review_last = data.mortgage_review;
                  if (!data.status) {
                      data.status = 'New Bfile';
                  }
                  if (data.children === '') data.children = null;
                  if (data.primary_vehicles_num === '') data.primary_vehicles_num = null;
                  data.dob_mm = '';
                  data.dob_yyyy = '';
                  data.dob_age = '';
                  data.dob2_mm = '';
                  data.dob2_yyyy = '';
                  data.dob2_age = '';
                  data.acknowledge = null;
                  if (data.birthday !== '' && data.birthday !== null) {
                      const birthday = data.birthday.split("/");
                      if (parseInt(birthday[0], 10) < 10) {
                          data.dob_mm = '0' + parseInt(birthday[0], 10);
                      } else {
                          data.dob_mm = birthday[0] + '';
                      }
                      data.dob_yyyy = birthday[2] + '';
                      data.dob_age = F.getAge(new Date(data.birthday));
                  }

                  if (data.spouse_birthday !== '' && data.spouse_birthday !== null) {
                      const spouse_birthday = data.spouse_birthday.split("/");
                      if (parseInt(spouse_birthday[0], 10) < 10) {
                          data.dob2_mm = '0' + parseInt(spouse_birthday[0], 10);
                      } else {
                          data.dob2_mm = spouse_birthday[0] + '';
                      }
                      data.dob2_yyyy = spouse_birthday[2] + '';
                      data.dob2_age = F.getAge(new Date(data.spouse_birthday));
                  }
                  if (data.auto_policy_sold_effective_date !== '' && data.auto_policy_sold_effective_date !== null) {
                      data.auto_policy_sold_effective_date = moment(data.auto_policy_sold_effective_date);
                  }
                  if (data.auto_policy_not_sold_expiration_date !== '' && data.auto_policy_not_sold_expiration_date !== null) {
                      data.auto_policy_not_sold_expiration_date = moment(data.auto_policy_not_sold_expiration_date);
                  }
                  if (data.home_policy_sold_effective_date !== '' && data.home_policy_sold_effective_date !== null) {
                      data.home_policy_sold_effective_date = moment(data.home_policy_sold_effective_date);
                  }
                  if (data.home_policy_not_sold_expiration_date !== '' && data.home_policy_not_sold_expiration_date !== null) {
                      data.home_policy_not_sold_expiration_date = moment(data.home_policy_not_sold_expiration_date);
                  }
                  const policies = [];
                  if (data.policies.length > 0) {
                      for (var i = 0; i < data.policies.length; i++) {
                          if (data.policies[i].policy_sold === null) {
                              data.policies[i].policy_sold = '';
                          }
                          policies.push({
                              type: data.policies[i].policy_type,
                              sold: data.policies[i].policy_sold+'',
                              policy: ''
                          })
                      }
                  }
                  data.policies = policies;

                  if (data.asset_401k_accounts === '["None"]') {
                      data.asset_401k_accounts_toggle = 0;
                  } else if (data.asset_401k_accounts !== '' && data.asset_401k_accounts !== '[]' && data.asset_401k_accounts !== null) {
                      data.asset_401k_accounts_toggle = 1;
                  }

                  let change_ownership_modal = false
                  if (typeof this.props.match.params.action !== "undefined") {
                      const action = this.props.match.params.action;
                      if (action === 'renewal') {
                          data.stepIndex = 0;
                          data.status = "Renewal";
                          if (data.parent_id === null || data.parent_id === "") {
                              data.parent_id = data.id;
                          }
                          data.id = '';
                          data.archive = 0;
                          if (data.user_id !== user.id) {
                              change_ownership_modal = true;
                          }
                      }
                  }
                  data.step_insurance_question = null;
                  this.setState({
                      loading: false,
                      wizard: data,
                      change_ownership_modal
                  }, () => {
                      this.updatePolicies();
                  })
              })
          } else {
              const { user, wizard } = this.state;
              const rac = F.bfile_rac(wizard);
              wizard.rac_calculator = rac.rac;
              wizard.rac_auto = rac.auto;
              wizard.rac_home = rac.home;
              wizard.rac_financial = rac.financial;
              wizard.ready = true;
              if (wizard.children === '') wizard.children = null;
              if (wizard.primary_vehicles_num === '') wizard.primary_vehicles_num = null;
              this.setState({ loading: true, wizard });
              axios.get("/api/user").then((res) => {
                  const u = res.data;
                  for (let i=0; i < u.user_agency_assoc.length; i++) {
                      wizard.agency_id = u.user_agency_assoc[i].agency_id;
                  }
                  wizard.user_id = u.id;
                  this.setState({ loading: false, wizard }, () => {
                      this.saveWizard();
                  })
              }).catch(() => {
                  message.error(F.translate("User not logged in."));
                  this.props.history.push('/login');
              });

          }
        }
    }
    saveWizard() {
      const { wizard } = this.state;
      window.localStorage.wizard = JSON.stringify(wizard);
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
    componentWillUnmount() {
      this.saveWizard();
    }
    isEmpty(str) {
        return (str === '' || str === null);
    }
    wizardError(err) {
      message.error(err);
      return false;
    }
    validationCheck = () => {
        const { wizard } = this.state;
        const isEmpty = this.isEmpty;

        if (wizard.stepIndex === 2) {
            if (isEmpty(wizard.primary_vehicles_num) || isEmpty(wizard.secondary_vehicles_toggle)) {
              return this.wizardError("Please fill all required fields.");
            } else {
              if (wizard.secondary_vehicles_toggle === "1") {
                let secondary_vehicles = [];
                if (wizard.secondary_vehicles !== null && wizard.secondary_vehicles !== '') {
                    secondary_vehicles = JSON.parse(wizard.secondary_vehicles);
                }
                if (secondary_vehicles.length === 0) {
                  return this.wizardError("Please select secondary vehicles.");
                }
                if (wizard.secondary_vehicles_value === '') {
                  return this.wizardError("Secondary vehicles value is required.");
                }
              }
            }
        }
        if (wizard.stepIndex === 3) {
            if (wizard.children === '' || wizard.children === null) {
              return this.wizardError("Please fill all required fields.");
            }
        }
        if (wizard.stepIndex === 4) {
            if (wizard.home_toggle === '') {
              return this.wizardError("Please fill all required fields.");
            }
            if (wizard.home_toggle === '1') {
              if (wizard.home_market_value === '') {
                return this.wizardError("Market value of the home is required.");
              }
            }
        }
        /*if (wizard.stepIndex === 5) {
            if (wizard.home_mortgage_protection_toggle === '') {
              return this.wizardError("Life insurance value is required.");
            }
        }*/
        if (wizard.stepIndex === 6) {
            if (wizard.secondary_home_toggle === '') {
              return this.wizardError("Please fill all required fields.");
            }
            if (wizard.secondary_home_toggle === '1' && wizard.secondary_home_market_value === '') {
              return this.wizardError("Market value of other homes is required.");
            }
        }
        /*if (wizard.stepIndex === 7) {
            if (wizard.secondary_home_mortgage === '') {
              return this.wizardError("Please fill all required fields.");
            }
        }*/
        if (wizard.stepIndex === 9) {
            if (wizard.business_owner_toggle === '') {
              return this.wizardError("Please fill all required fields.");
            }
            if (wizard.business_owner_toggle === '1') {
              if (wizard.business_owner_toggle === '1') {
                let asset_401k_accounts = [];
                if (wizard.asset_401k_accounts !== null && wizard.asset_401k_accounts !== '') {
                    asset_401k_accounts = JSON.parse(wizard.asset_401k_accounts);
                }
                if (asset_401k_accounts.length === 0) {
                  return this.wizardError("Retirement plan is required.");
                } else {
                  if (asset_401k_accounts.indexOf("None") < 0 && wizard.asset_preservation_value === '') {
                    return this.wizardError("Retirement plan value is required.");
                  }
                }
              }
            }
        }

        if (wizard.stepIndex === 10) {
            let asset_401k_accounts = [];
            if (wizard.asset_401k_accounts !== null && wizard.asset_401k_accounts !== '') {
                asset_401k_accounts = JSON.parse(wizard.asset_401k_accounts);
            }
            if (asset_401k_accounts.length === 0) {
                return this.wizardError("Retirement plan is required.");
            } else {
                if (asset_401k_accounts.indexOf("None") < 0 && wizard.asset_preservation_value === '') {
                    return this.wizardError("Retirement plan value is required.");
                }
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

        if (name === 'primary_vehicles_num') {
            if (value && value > 0) {
                wizard.primary_vehicles_toggle = '1';
            } else {
                wizard.primary_vehicles_toggle = '0';
            }
        }

        if ((name === 'dob_mm' || name === 'dob_yyyy') && wizard.dob_mm !== "" && wizard.dob_yyyy !== "") {
            wizard.birthday = wizard.dob_mm + '/01/' + wizard.dob_yyyy;
            wizard.dob_age = F.getAge(new Date(wizard.birthday));
        }

        if ((name === 'dob2_mm' || name === 'dob2_yyyy') && wizard.dob2_mm !== "" && wizard.dob2_yyyy !== "") {
            wizard.spouse_birthday = wizard.dob2_mm + '/01/' + wizard.dob2_yyyy;
            wizard.dob2_age = F.getAge(new Date(wizard.spouse_birthday));
        }

        if (name === 'secondary_vehicles' || name === 'secondary_home_type') {
            this.updatePolicies();
        }

        if (name === 'policies') {
            let uncovered = 0;
            let sold = 0;
            let quoted = 0;
            let umbrella_sold = 0;
            let umbrella_uncovered = 0;
            let umbrella_quoted = 0;
            for(let i = 0; i<wizard.policies.length; i++) {
                if (wizard.policies[i].sold !== "1") {
                    uncovered++;
                }
                if (wizard.policies[i].sold === "1") {
                    sold++;
                }
                if (wizard.policies[i].quoted === "1") {
                    quoted++;
                }
                if (wizard.policies[i].type === "Umbrella") {
                    wizard.policy_umbrella_total = 1;
                    if (wizard.policies[i].sold === '1') {
                        umbrella_sold++;
                    }
                    if (wizard.policies[i].sold === '0') {
                        umbrella_uncovered++;
                    }
                    if (wizard.policies[i].sold === '2') {
                        umbrella_quoted++;
                    }
                }
            }

            wizard.cross_sell_policies_uncovered = uncovered;
            wizard.cross_sell_opportunities_quoted = quoted;
            wizard.cross_sell_opportunities_sold = sold;

            wizard.umbrella_policy_sold = umbrella_sold;
            wizard.umbrella_policy_uncovered = umbrella_uncovered;
            wizard.umbrella_policy_quoted = umbrella_quoted;
        }

        if (name === 'home_mortgage') {
            if (value === "") {
                wizard.home_mortgage_toggle = "0";
                wizard.home_mortgage_protection_benefit = "";
            } else {
                wizard.home_mortgage_toggle = "1";
            }
        }

        if (name === 'home_toggle') {
            wizard.had_mortgage_review = null;
            wizard.mortgage_purchase_home = null;
            wizard.mortgage_review = null;

            if (value === '3') {
                wizard.home_mortgage = '';
            }
        }

        if (name === 'secondary_home_mortgage') {
            if (value === "") {
                wizard.secondary_home_mortgage_toggle = "0";
            } else {
                wizard.secondary_home_mortgage_toggle = "1";
            }
        }

        if (name === 'business_owner_toggle') {
            wizard.asset_401k_accounts = '[]';
            wizard.asset_401k_accounts_toggle = null;
            wizard.asset_preservation_value = '';
        }
        if (name === 'business_owner_toggle' && value === '0') {
            wizard.business_name = '';
            wizard.business_type = '';
            wizard.employees_count = null;
            wizard.business_type_other = '';
        }
        if (name === 'business_owner_toggle' && value === '1') {
            wizard.employer_name = '';
            wizard.employer_retire_from = '';
            wizard.employer_years = '';
            wizard.employed_toggle = '';
        }
        if (name === 'employed_toggle' && value === '1') {
            wizard.employer_retire_from = '';
        }
        if (name === 'employed_toggle' && value === '0') {
            wizard.employer_name = '';
            wizard.employer_years = '';

            if (wizard.employed_retired_disabled !== 'Retired') {
                wizard.employer_retire_from = '';
            }
        }

        if (name === 'secondary_home_toggle' && value === '0') {
            wizard.secondary_home_type = '[]';
            wizard.secondary_home_market_value = '';
            wizard.secondary_home_mortgage = '';
        }

        if (name === 'personal_property_toggle' && value === 0) {
            wizard.personal_property_type = '[]';
            wizard.personal_property_value = '';
        }

        if (name === "home_toggle" && (value === "0" || value === "2")) {
            wizard.home_market_value = '';
            wizard.home_mortgage = '';
        }

        if (name === "home_toggle" && value === "0") {
            wizard.stepIndex++;
            wizard.mortgage_purchase_home = null;
            wizard.mortgage_review = null;
            wizard.had_mortgage_review = null;
        }

        if (name === "home_toggle" && value === "2") {
            wizard.stepIndex++;
        }

        if (name === "secondary_home_toggle" && value === "0") {
            wizard.stepIndex += 2;
        }

        if (name === "business_owner_toggle" && value === "0") {
            wizard.stepIndex++;
        }

        if (name === "secondary_vehicles_toggle" && value === "0") {
            wizard.stepIndex++;
            wizard.secondary_vehicles = '[]';
            wizard.secondary_vehicles_value = '';
        }

        if (name === "children" && value !== "" && value !== null) {
            wizard.stepIndex++;
        }

        if (name === "personal_property_toggle" && value === 0) {
            wizard.stepIndex++;
        }

        if (name === "auto_sold_toggle" && (value === "1" || value === "2")) {
            wizard.auto_policy_not_sold_current_carrier = '';
            wizard.auto_policy_not_sold_expiration_date = null;
        }
        if (name === "home_sold_toggle" && (value === "1" || value === "2")) {
            wizard.home_policy_not_sold_current_carrier = '';
            wizard.home_policy_not_sold_expiration_date = null;
        }

        if (name === "auto_sold_toggle" && (value === "0" || value === "2")) {
            wizard.auto_policy_sold_term = '';
            wizard.auto_policy_sold_effective_date = null;
        }
        if (name === "home_sold_toggle" && (value === "0" || value === "2")) {
            wizard.home_policy_sold_term = '';
            wizard.home_policy_sold_effective_date = null;
        }

        if (name === "asset_401k_accounts_toggle" && value === 0) {
            wizard.asset_401k_accounts = '["None"]';
            wizard.asset_preservation_value = '';
            wizard.stepIndex += 2;
            wizard.stepIndex = Math.min(11, wizard.stepIndex);
        }

        if (name === 'stepIndex') {
            if (typeof old_value === "undefined") old_value = value;
            if (value === 10 && wizard.business_owner_toggle === "1") {
                if (wizard.stepIndex >= old_value) {
                    wizard.stepIndex++;
                } else {
                    wizard.stepIndex--;
                }
            }
            if (value === 7 && wizard.secondary_home_toggle === "0") {
                if (wizard.stepIndex >= old_value) {
                    wizard.stepIndex++;
                } else {
                    wizard.stepIndex--;
                }
            }
            /*if (value === 5 && wizard.home_toggle === "0") {
                if (wizard.stepIndex >= old_value) {
                    wizard.stepIndex++;
                } else {
                    wizard.stepIndex--;
                }
            }*/
        }

        const rac = F.bfile_rac(wizard);
        wizard.rac_calculator = rac.rac;
        wizard.rac_auto = rac.auto;
        wizard.rac_home = rac.home;
        wizard.rac_financial = rac.financial;
        wizard.rac_customary_items = rac.customary_items;

        this.setState(wizard, () => {
            this.saveWizard();
            if (name === 'stepIndex') {
                this.props.history.push('/wizard/step/' + wizard.stepIndex);
            } else {
                if (typeof this.props.match.params !== 'undefined') {
                    const params = this.props.match.params;
                    if ("step" in params) {
                        const stepIndex = parseInt(params.step);
                        if (stepIndex !== wizard.stepIndex) {
                            this.props.history.push('/wizard/step/' + wizard.stepIndex);
                        }
                    }
                }
            }

            this.updatePolicies();
        });
    }
    updatePolicies = () => {
        const { wizard } = this.state;

        let secondary_vehicles = [];
        if (wizard.secondary_vehicles !== null && wizard.secondary_vehicles !== '') {
            secondary_vehicles = JSON.parse(wizard.secondary_vehicles);
        }

        let secondary_home_type = [];
        if (wizard.secondary_home_type !== null && wizard.secondary_home_type !== '') {
            secondary_home_type = JSON.parse(wizard.secondary_home_type);
        }

        const policies = [];
        for (let i = 0; i < wizard.policies.length; i++) {
            if (secondary_vehicles.indexOf(wizard.policies[i].type) >= 0) {
                policies.push(wizard.policies[i]);
            }
            if (secondary_home_type.indexOf(wizard.policies[i].type) >= 0) {
                policies.push(wizard.policies[i]);
            }
            if (wizard.policies[i].type === 'Umbrella' || wizard.policies[i].type === 'Rent') {
                policies.push(wizard.policies[i]);
            }
        }

        for (let i = 0; i < secondary_vehicles.length; i++) {
            let index = wizard.policies.findIndex(item => item.type === secondary_vehicles[i]);
            if (index < 0) {
                policies.push({
                    type: secondary_vehicles[i],
                    sold: '',
                    policy: 'auto'
                })
            }
        }

        for (let i = 0; i < secondary_home_type.length; i++) {
            let index = wizard.policies.findIndex(item => item.type === secondary_home_type[i]);
            if (index < 0) {
                policies.push({
                    type: secondary_home_type[i],
                    sold: '',
                    policy: 'home'
                })
            }
        }

        if (wizard.home_toggle === "2") {
            let index = policies.findIndex(item => item.type === "Rent");
            if (index < 0) {
                policies.push({
                    type: 'Rent',
                    sold: '',
                    policy: 'home'
                })
            }
        }

        if (wizard.rac_calculator >= 250000) {
            let index = policies.findIndex(item => item.type === "Umbrella");
            if (index < 0) {
                policies.push({
                    type: "Umbrella",
                    sold: '',
                    policy: ''
                })
            }
        } else {
            let index = policies.findIndex(item => item.type === "Umbrella");
            if (index >= 0) {
                policies.splice(index, 1);
            }
        }

        wizard.policies = policies;

        let uncovered = 0;
        let sold = 0;
        let quoted = 0;
        let umbrella_sold = 0;
        let umbrella_uncovered = 0;
        let umbrella_quoted = 0;
        for(let i = 0; i<wizard.policies.length; i++) {
            if (wizard.policies[i].sold !== "1") {
                uncovered++;
            }
            if (wizard.policies[i].sold === "1") {
                sold++;
            }
            if (wizard.policies[i].quoted === "1") {
                quoted++;
            }
            if (wizard.policies[i].type === "Umbrella") {
                wizard.policy_umbrella_total = 1;
                if (wizard.policies[i].sold === '1') {
                    umbrella_sold++;
                }
                if (wizard.policies[i].sold === '0') {
                    umbrella_uncovered++;
                }
                if (wizard.policies[i].sold === '2') {
                    umbrella_quoted++;
                }
            }
        }

        wizard.cross_sell_policies_uncovered = uncovered;
        wizard.cross_sell_opportunities_quoted = quoted;
        wizard.cross_sell_opportunities_sold = sold;

        wizard.umbrella_policy_sold = umbrella_sold;
        wizard.umbrella_policy_uncovered = umbrella_uncovered;
        wizard.umbrella_policy_quoted = umbrella_quoted;

        this.setState({ wizard }, () => {
          this.saveWizard();
        });
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
            alert("error!");
            console.log("errors", validation.errors);
        }
    }
    save = (callback) => {
        const { wizard, user } = this.state;

        if (wizard.email && wizard.email !== '') {
          if (!F.validateEmail(wizard.email)) {
            message.error("Email address is invalid.");
            return;
          }
        }

        if (wizard.children === '') wizard.children = null;

        wizard.life_opportunities = 0;
        if (wizard.home_mortgage_value !== '' && wizard.life_insurance_toggle !== '1') {
            wizard.life_opportunities++;
        }
        if (wizard.children && wizard.children > 0 && wizard.life_insurance_toggle !== '1') {
            wizard.life_opportunities++;
        }
        if (F.get_second_value(wizard.home_mortgage_death_benefit) < F.get_second_value(wizard.home_mortgage_value)) {
            wizard.life_opportunities++;
        }

        wizard.rollover_opportunities = 0;

        if (wizard.acknowledge && wizard.acknowledge_by !== null && wizard.acknowledge_by !== '') {
            wizard.acknowledge_by = user.id;
        }

        if (wizard.birthday !== '' && wizard.birthday !== null) {
            const customer_age = F.getAge(new Date(wizard.birthday));
            if ((wizard.home_mortgage_policy_type === "Term" || wizard.home_mortgage_policy_type === "Universal/Whole-Life") && customer_age >= 20 && customer_age <= 75) {
                wizard.life_opportunities++;
            }

            if (wizard.asset_401k_accounts !== null && wizard.asset_401k_accounts !== '') {
                const asset_401k_accounts = JSON.parse(wizard.asset_401k_accounts);
                const asset_401k = asset_401k_accounts.indexOf('401k');
                const asset_403b = asset_401k_accounts.indexOf('403b');
                const asset_457  = asset_401k_accounts.indexOf('457');

                if (asset_401k >= 0 && asset_403b >= 0 && asset_457 >= 0 && customer_age >= 20 && customer_age <= 75) {
                    wizard.rollover_opportunities++;
                }
            }
        }

        // calculate rollover dollars created
        wizard.rollover_dollars_created = "";

        if (wizard.acknowledge !== null && wizard.acknowledge_by !== '') {
            wizard.acknowledge_by = user.id;
        }

        const policies = [];
        for (var i = 0; i < wizard.policies.length; i++) {
            if (wizard.policies[i].sold === '') {
                wizard.policies[i].sold = null;
            }
            policies.push({
                policy_sold: wizard.policies[i].sold,
                policy_type: wizard.policies[i].type
            });
        }
        const data = {
            agency_id: wizard.agency_id,
            acknowledge_by: wizard.acknowledge_by,
            first_name: wizard.first_name,
            address: wizard.address,
            address_cont: wizard.address_cont,
            business_name: wizard.business_name,
            business_owner_toggle: wizard.business_owner_toggle,
            business_type: wizard.business_type,
            business_type_other: wizard.business_type_other,
            employed_toggle: wizard.employed_toggle,
            employer_name: wizard.employer_name,
            employer_years: wizard.employer_years,
            employed_anual_income: wizard.employed_anual_income,
            city: wizard.city,
            email: wizard.email,
            employed_retired_disabled: wizard.employed_retired_disabled,
            employer_retire_from: wizard.employer_retire_from,
            home_market_value: wizard.home_market_value,
            home_mortgage: wizard.home_mortgage,
            home_mortgage_protection_toggle: wizard.home_mortgage_protection_toggle,
            home_mortgage_protection_benefit: wizard.home_mortgage_protection_benefit,
            home_mortgage_toggle: wizard.home_mortgage_toggle,
            home_mortgage_protection_policy: wizard.home_mortgage_protection_policy,
            home_toggle: wizard.home_toggle,
            insurance_score: wizard.insurance_score,
            last_name: wizard.last_name,
            phone: wizard.phone,
            retirement_plan: wizard.retirement_plan,
            retirement_plan_value: wizard.retirement_plan_value,
            secondary_home_market_value: wizard.secondary_home_market_value,
            secondary_home_mortgage: wizard.secondary_home_mortgage,
            secondary_mortgage_protection_benefit: wizard.secondary_mortgage_protection_benefit,
            secondary_mortgage_protection_policy: wizard.secondary_mortgage_protection_policy,
            secondary_mortgage_protection_toggle: wizard.secondary_mortgage_protection_toggle,
            secondary_home_mortgage_toggle: wizard.secondary_home_mortgage_toggle,
            secondary_home_toggle: wizard.secondary_home_toggle,
            secondary_home_type: wizard.secondary_home_type,
            personal_property_toggle: wizard.personal_property_toggle,
            personal_property_value: wizard.personal_property_value,
            primary_vehicles_toggle: wizard.primary_vehicles_toggle,
            primary_vehicles_num: wizard.primary_vehicles_num,
            secondary_vehicles_toggle: wizard.secondary_vehicles_toggle,
            secondary_vehicles_value: wizard.secondary_vehicles_value,
            secondary_vehicles: wizard.secondary_vehicles,
            spouse_first_name: wizard.spouse_first_name,
            spouse_last_name: wizard.spouse_last_name,
            spouse_toggle: wizard.spouse_toggle,
            asset_total_value: wizard.asset_total_value,
            zipcode: wizard.zipcode,
            state: wizard.state,
            asset_preservation_toggle: wizard.asset_preservation_toggle,
            asset_preservation_value: wizard.asset_preservation_value,
            life_opportunities: wizard.life_opportunities,
            no_policies_sold: wizard.no_policies_sold,
            policy_umbrella_total: wizard.policy_umbrella_total,
            //rollover_dollars_created: wizard.rollover_dollars_created,
            rollover_opportunities: wizard.rollover_opportunities,
            status: wizard.status,
            quote_auto_toggle: wizard.quote_auto_toggle,
            auto_sold_toggle: wizard.auto_sold_toggle,
            quote_home_toggle: wizard.quote_home_toggle,
            employees_count: wizard.employees_count,
            home_sold_toggle: wizard.home_sold_toggle,
            cross_sell_policies_uncovered: wizard.cross_sell_policies_uncovered,
            cross_sell_opportunities_quoted: wizard.cross_sell_opportunities_quoted,
            cross_sell_opportunities_sold: wizard.cross_sell_opportunities_sold,
            umbrella_policy_quoted: wizard.umbrella_policy_quoted,
            umbrella_policy_sold: wizard.umbrella_policy_sold,
            umbrella_policy_uncovered: wizard.umbrella_policy_uncovered,
            umbrella_limit: wizard.umbrella_limit,
            attempts: wizard.attempts,
            action: wizard.action,
            call_type: wizard.call_type,
            callback_time: wizard.callback_time,
            vip: wizard.vip,
            children: wizard.children,
            need_attention: wizard.need_attention,
            birthday: wizard.birthday,
            spouse_birthday: wizard.spouse_birthday,
            phone2: wizard.phone2,
            auto_policy_sold_current_liability_limit: wizard.auto_policy_sold_current_liability_limit,
            auto_policy_sold_bfile_limit: wizard.auto_policy_sold_bfile_limit,
            auto_policy_sold_liability_limit_sold: wizard.auto_policy_sold_liability_limit_sold,
            auto_policy_sold_items_sold: wizard.auto_policy_sold_items_sold,
            auto_policy_sold_policy_premium: wizard.auto_policy_sold_policy_premium,
            auto_policy_sold_term: wizard.auto_policy_sold_term,
            auto_policy_not_sold_current_carrier: wizard.auto_policy_not_sold_current_carrier,
            auto_policy_not_sold_current_liability_limit: wizard.auto_policy_not_sold_current_liability_limit,
            auto_policy_not_sold_expiration_date: wizard.auto_policy_not_sold_expiration_date,
            home_policy_sold_liability_limit: wizard.home_policy_sold_liability_limit,
            home_policy_sold_bfile_limit: wizard.home_policy_sold_bfile_limit,
            home_policy_sold_liability_limit_sold: wizard.home_policy_sold_liability_limit_sold,
            home_policy_sold_items_sold: wizard.home_policy_sold_items_sold,
            home_policy_sold_policy_premium: wizard.home_policy_sold_policy_premium,
            home_policy_sold_term: wizard.home_policy_sold_term,
            home_policy_not_sold_current_carrier: wizard.home_policy_not_sold_current_carrier,
            home_policy_not_sold_current_liability_limit: wizard.home_policy_not_sold_current_liability_limit,
            home_policy_not_sold_expiration_date: wizard.home_policy_not_sold_expiration_date,
            auto_policy_sold_effective_date: wizard.auto_policy_sold_effective_date,
            home_policy_sold_effective_date: wizard.home_policy_sold_effective_date,
            is_lead: wizard.is_lead,
            is_saved_for_later: wizard.is_saved_for_later,
            is_requote: wizard.is_requote,
            is_renewal: wizard.is_renewal,
            is_onboarded: wizard.is_onboarded,
            nosalearchive_expiration_date: wizard.nosalearchive_expiration_date,
            facebook: wizard.facebook,
            twitter: wizard.twitter,
            linkedin: wizard.linkedin,
            profile_photo: wizard.profile_photo,
            archive: wizard.archive,
            user_id: wizard.user_id,
            expiration_date: wizard.expiration_date,
            parent_id: wizard.parent_id,
            vonboard: wizard.vonboard,
            financial_id: wizard.financial_id,
            onboarding_id: wizard.onboarding_id,
            asset_401k_accounts: wizard.asset_401k_accounts,
            asset_accounts: wizard.asset_accounts,
            personal_property_type: wizard.personal_property_type,
            policies: policies,
            liability_calculator_value: wizard.rac_calculator,
            onboarder_id: wizard.onboarder_id,
            vo_sent_date: wizard.vo_sent_date,
            mortgage_review: wizard.mortgage_review,
            mortgage_purchase_home: wizard.mortgage_purchase_home,
            had_mortgage_review: wizard.had_mortgage_review,
            no_follow_up: wizard.no_follow_up
        }

        let ajax = null;
        if (wizard.id !== "") {
            ajax = axios.put("/api/b_file/"+wizard.id, data);
        } else {
            ajax = axios.post("/api/b_file", data);
        }
        ajax.then((res) => {

            const bfile = res.data;

            if (wizard.id === '') {
                this.updateField("id", bfile.id);
            }

            if (wizard.acknowledge === '1') {
                axios.post("/api/bfile_notes", {
                    "bfile_id": bfile.id,
                    "note": 'Confirmed liability conversation acknowledged by customer: '+wizard.first_name+" "+wizard.last_name,
                    "is_acknowledgement": 1,
                    "user_id": user.id
                });
            }

            if (wizard.acknowledge === '0') {
                axios.post("/api/bfile_notes", {
                    "bfile_id": bfile.id,
                    "note": 'Confirmed liability conversation not acknowledged by customer: '+wizard.first_name+" "+wizard.last_name,
                    "is_acknowledgement": 0,
                    "user_id": user.id
                });
            }

            if (wizard.mortgage_review_last !== wizard.mortgage_review) {
                let note = "";
                if (wizard.mortgage_review === 1) {
                    note = moment(new Date()).format('MM/DD/YYYY') + ' - Customer interested in a mortgage review.';
                    axios.post("/api/send_mortgage_email", {
                        bfile_id: bfile.id
                    }).then((res) => {});
                }
                if (wizard.mortgage_review === 0) {
                    note = moment(new Date()).format('MM/DD/YYYY') + ' - Customer denied a mortgage review.';
                }
                if (note !== "") {
                    axios.post("/api/bfile_notes", {
                        "bfile_id": bfile.id,
                        "note": note,
                        "user_id": user.id
                    });
                }
            }

            if (wizard.notes !== null && wizard.notes !== "") {
                axios.post("/api/bfile_notes", {
                    "bfile_id": bfile.id,
                    "note": wizard.notes,
                    "user_id": user.id
                });
            }

            if (typeof callback !== 'undefined') {
                callback(bfile);
            }

            this.props.history.push('/dashboard');
        })
    }
    render() {

        const { loading, wizard, user } = this.state;

        let WizardStep = Step1;

        if (!loading && wizard.stepIndex === 0) {
             WizardStep = StepCall;
         }

        if (wizard.stepIndex === 1) WizardStep = Step1;
        if (wizard.stepIndex === 2) WizardStep = Step2;
        if (wizard.stepIndex === 3) WizardStep = Step2_1;
        if (wizard.stepIndex === 4) WizardStep = Step3;
        if (wizard.stepIndex === 5) WizardStep = Step3_1;
        if (wizard.stepIndex === 6) WizardStep = Step3_2;
        if (wizard.stepIndex === 7) WizardStep = Step3_3;
        if (wizard.stepIndex === 8) WizardStep = Step3_4;
        if (wizard.stepIndex === 9) WizardStep = Step4;
        if (wizard.stepIndex === 10) WizardStep = Step4_1;
        if (wizard.stepIndex === 11) WizardStep = Step5;
        if (wizard.stepIndex === 12) WizardStep = Step5_1;
        if (wizard.stepIndex === 13) WizardStep = Step6;
        if (wizard.stepIndex === 14) WizardStep = Step7;
        if (wizard.stepIndex === 15) WizardStep = Step7_1;

        return (
            <div>
                <WizardSteps wizard={wizard} updateField={this.updateField} />
                {wizard.stepIndex < 13 ? (
                    <Row type="flex" gutter={16}>
                        <Col lg={{ span: 6, order: 0 }} span={24} xs={{ order: 1 }}>
                            <Sidebar wizard={wizard} />
                        </Col>
                        <Col lg={{ span: 18, order: 0 }} span={24} xs={{ order: 0 }}>
                            <Spin indicator={antIcon} spinning={loading}>
                                <WizardStep
                                    wizard={wizard}
                                    updateField={this.updateField}
                                    submitStep={this.submitStep}
                                    prevStep={this.prevStep}
                                    save={this.save}
                                    user={this.state.user}
                                    history={this.props.history}
                                    is_calculator_only={this.state.is_calculator_only}
                                />
                            </Spin>
                        </Col>
                    </Row>
                ) : (
                    <Row type="flex" gutter={16}>
                        <Col lg={{ span: 24, order: 0 }} span={24} xs={{ order: 0 }}>
                            <Spin indicator={antIcon} spinning={loading}>
                                <WizardStep
                                    wizard={wizard}
                                    updateField={this.updateField}
                                    submitStep={this.submitStep}
                                    prevStep={this.prevStep}
                                    save={this.save}
                                    user={this.state.user}
                                    history={this.props.history}
                                    is_calculator_only={this.state.is_calculator_only}
                                />
                            </Spin>
                        </Col>
                    </Row>
                )}
                {this.state.change_ownership_modal ? (
                    <ChangeOwnershipModal
                        showModal={this.state.change_ownership_modal}
                        hideModal={() => this.setState({ change_ownership_modal: false })}
                        wizard={wizard}
                        change={() => {
                            this.updateField("user_id", user.id);
                            this.setState({ change_ownership_modal: false })
                        }}
                    />
                ) : null}
            </div>
        );

    }
}

export default Wizard;
