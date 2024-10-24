import React, { Component } from 'react';
import {
    Icon,
    Button,
    message
} from 'antd';
import SendBFileModal from './send-bfile-modal';
import SaveForLaterModal from './save-for-later-modal';
import SendFollowUpModal from './send-follow-up-modal';
import NoAnswerModal from './no-answer-modal';
import NoSaleArchiveModal from './no-sale-archive-modal';
import CustomerExist from './customer-exist';
import { Translate } from 'react-translated';
import F from '../../../Functions';

class WizardFooter extends Component {
    state = {
        show_send_bfile_modal: false,
        show_save_for_later_modal: false,
        show_no_sale_archive: false,
        show_send_follow_up_modal: false
    }
    toggleRAC() {
        window.document.querySelector('body').classList.toggle("show_rac");
    }
    checkWizard() {
        const { wizard } = this.props;
        const errors = [];

        if (wizard.first_name === '') {
            errors.push("First Name is Mandatory.");
        }
        if (wizard.last_name === '') {
            errors.push("Last Name is Mandatory.");
        }
        if (wizard.phone === '') {
            errors.push("Phone is Mandatory.");
        }
        if (wizard.dob_mm === '' || wizard.dob_yyyy === '') {
            errors.push("DOB is Mandatory.");
        }

        if (wizard.email && wizard.email !== '') {
            if (!F.validateEmail(wizard.email)) {
                errors.push("Email address is invalid.");
            }
        }

        if (wizard.auto_sold_toggle === '') {
            errors.push("Auto Policy Sold is Mandatory.");
        }
        if (wizard.home_sold_toggle === '') {
            errors.push("Home Policy Sold is Mandatory.");
        }
        if (wizard.auto_sold_toggle === '0' && (wizard.auto_policy_not_sold_expiration_date === '' || wizard.auto_policy_not_sold_expiration_date === null)) {
            errors.push("Expiration Date is mandatory.");
        }
        if (wizard.home_sold_toggle === '0' && (wizard.home_policy_not_sold_expiration_date === '' || wizard.home_policy_not_sold_expiration_date === null)) {
            errors.push("Expiration Date is mandatory.");
        }
        if (wizard.auto_sold_toggle === '1') {
            if (wizard.auto_policy_sold_effective_date === '' || wizard.auto_policy_sold_effective_date === null) {
                errors.push("Expiration Date is mandatory.");
            }
            if (wizard.auto_policy_sold_term === '' || wizard.auto_policy_sold_term === null) {
                errors.push("Term is mandatory.");
            }
        }
        if (wizard.home_sold_toggle === '1') {
            if (wizard.home_policy_sold_effective_date === '' || wizard.home_policy_sold_effective_date === null) {
                errors.push("Expiration Date is mandatory.");
            }
            if (wizard.home_policy_sold_term === '' || wizard.home_policy_sold_term === null) {
                errors.push("Term is mandatory.");
            }
        }
        if (wizard.auto_sold_toggle === "1" || wizard.home_sold_toggle === "1") {
            if (wizard.address === '' || wizard.city === '' || wizard.state === '' || wizard.zipcode === '') {
                errors.push("Address, City, State & Zip Code are mandatory.");
            }
        }
        if (wizard.cross_sell_policies_uncovered > 0) {
            for (var i = 0; i < wizard.policies.length; i++) {
                if (wizard.policies[i].sold === '' || wizard.policies[i].sold === null) {
                    errors.push("Cross-Sell are Mandatory.");
                    break;
                }
            }
        }
        for (var i = 0; i < errors.length; i++) {
            message.error(errors[i]);
            break;
        }
        if (errors.length === 0) {
            this.setState({ show_send_bfile_modal: true })
        }
    }
    render() {
        const {
            wizard,
            updateField,
            submitStep,
            save,
            prevStep,
            complete,
            user
        } = this.props;

        return (
            <div className="wizardFooter right-align">
                {wizard.stepIndex === 15 ? (
                    <div>
                        {/* <Button.Group size="large">
                            <Button ghost onClick={() => this.setState({ show_no_sale_archive: true })}>
                                <Translate text={`No Sale/Archive`} />
                            </Button>
                        </Button.Group> */}
                        <Button.Group size="large">
                            <Button ghost onClick={() => this.setState({ show_save_for_later_modal: true })}>
                                <Translate text={`Save for Later`} />
                            </Button>
                        </Button.Group>
                        {wizard.review === 1 ? (
                            <Button.Group size="large">
                                <Button ghost onClick={() => this.setState({ show_no_answer_modal: true })}>
                                    <Translate text={`No Answer`} />
                                </Button>
                            </Button.Group>
                        ) : null}
                        <Button.Group size="large" className="directions">
                            {wizard.stepIndex > 1 ? (
                                <Button size="large" type="primary" onClick={prevStep.bind(this)}>
                                    <Icon type="left" />
                                    <Translate text={`Previous`} />
                                </Button>
                            ) : null}
                            {wizard.id !== '' ? (
                                <Button size="large" type="primary" onClick={() => save()}>
                                    <Translate text={`Update B-File`} />
                                </Button>
                            ) : null}
                            <Button size="large" type="primary" onClick={() => this.checkWizard()}>
                                <Translate text={`Send B-File`} />
                            </Button>
                        </Button.Group>
                    </div>
                ) : (
                    <div>
                        {/* <Button.Group size="large">
                            <Button ghost onClick={() => this.setState({ show_no_sale_archive: true })}>
                                <Translate text={`No Sale/Archive`} />
                            </Button>
                        </Button.Group> */}
                        <Button.Group size="large">
                            <Button ghost onClick={() => this.setState({ show_save_for_later_modal: true })}>
                                <Translate text={`Save for Later`} />
                            </Button>
                        </Button.Group>
                        {wizard.review === 1 ? (
                            <Button.Group size="large">
                                <Button ghost onClick={() => this.setState({ show_no_answer_modal: true })}>
                                    <Translate text={`No Answer`} />
                                </Button>
                            </Button.Group>
                        ) : null}
                        <Button.Group size="large" className="directions">
                            {wizard.stepIndex > 1 ? (
                                <Button size="large" type="primary" onClick={prevStep.bind(this)}>
                                    <Icon type="left" />{' '}
                                    <Translate text={`Previous`} />
                                </Button>
                            ) : null}
                            {wizard.stepIndex > 0 && wizard.id !== '' ? (
                                <Button size="large" type="primary" onClick={() => save()}>
                                    <Translate text={`Update B-File`} />
                                </Button>
                            ) : null}
                            <Button size="large" type="primary" onClick={submitStep.bind(this)} className="next">
                                <Translate text={`Next`} />{' '}
                                <Icon type="right" />
                            </Button>
                        </Button.Group>
                        {wizard.stepIndex === 13 && this.props.is_calculator_only ? (
                            <Button.Group size="large">
                                <Button type="primary" onClick={() => this.setState({ show_send_follow_up_modal: true })}>
                                    <Translate text={`Done`} />
                                </Button>
                            </Button.Group>
                        ) : null}
                    </div>
                )}
                <div id="mobilefooter">
                    {wizard.stepIndex === 15 ? (
                        <Button.Group size="large" className="directions">
                            <Button size="large" type="primary" onClick={() => this.toggleRAC()}>
                                <Icon type="calculator" />{' '}
                                <Translate text={`RAC`} />
                            </Button>
                            {wizard.stepIndex > 1 ? (
                                <Button size="large" type="primary" onClick={prevStep.bind(this)}>
                                    <Icon type="left" />{' '}
                                    <span className="lbl"><Translate text={`Previous`} /></span>
                                </Button>
                            ) : null}
                            {wizard.id !== '' ? (
                                <Button size="large" type="primary" onClick={() => save()}>
                                    <Icon type="save" />{' '}
                                    <Translate text={`Update`} />
                                </Button>
                            ) : null}
                        </Button.Group>
                    ) : (
                        <Button.Group size="large" className="directions">
                            <Button size="large" type="primary" onClick={() => this.toggleRAC()}>
                                <Icon type="calculator" />{' '}
                                <Translate text={`RAC`} />
                            </Button>
                            {wizard.stepIndex > 1 ? (
                                <Button size="large" type="primary" onClick={prevStep.bind(this)}>
                                    <Icon type="left" />{' '}
                                    <span className="lbl"><Translate text={`Previous`} /></span>
                                </Button>
                            ) : null}
                            <Button size="large" type="primary" onClick={submitStep.bind(this)} className="next">
                                <span className="lbl"><Translate text={`Next`} />{' '}</span>
                                <Icon type="right" />
                            </Button>
                        </Button.Group>
                    )}
                </div>
                {wizard.ready ? (
                    <div>
                        <SendBFileModal
                            showModal={this.state.show_send_bfile_modal}
                            hideModal={() => this.setState({ show_send_bfile_modal: false })}
                            wizard={wizard}
                            updateField={updateField}
                            save={save}
                            user={user}
                            history={this.props.history}
                        />
                        <SaveForLaterModal
                            showModal={this.state.show_save_for_later_modal}
                            hideModal={() => this.setState({ show_save_for_later_modal: false })}
                            wizard={wizard}
                            updateField={updateField}
                            save={save}
                            user={user}
                            history={this.props.history}
                        />
                        <SendFollowUpModal
                            showModal={this.state.show_send_follow_up_modal}
                            hideModal={() => this.setState({ show_send_follow_up_modal: false })}
                            wizard={wizard}
                            updateField={updateField}
                            save={save}
                            user={user}
                            history={this.props.history}
                        />
                        <NoAnswerModal
                            showModal={this.state.show_no_answer_modal}
                            hideModal={() => this.setState({ show_no_answer_modal: false })}
                            wizard={wizard}
                            updateField={updateField}
                            save={save}
                            user={user}
                            history={this.props.history}
                        />
                        <NoSaleArchiveModal
                            showModal={this.state.show_no_sale_archive}
                            hideModal={() => this.setState({ show_no_sale_archive: false })}
                            wizard={wizard}
                            updateField={updateField}
                            save={save}
                            user={user}
                            history={this.props.history}
                        />
                        <CustomerExist
                            showModal={wizard.show_modal_customer_exist}
                            ok={(id) => {
                                updateField("show_modal_customer_exist", false);
                                updateField("modal_customer_ignore", true);
                                updateField("parent_id", wizard.modal_customer_bfile_id);
                            }}
                            cancel={() => {
                                updateField("show_modal_customer_exist", false);
                                updateField("email", "");
                            }}
                        />
                    </div>
                ) : null}
            </div>
        );

    }
}

export default WizardFooter;
