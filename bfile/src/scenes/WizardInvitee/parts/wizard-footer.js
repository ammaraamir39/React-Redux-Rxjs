import React, { Component } from 'react';
import {
    Icon,
    Button
} from 'antd';
import SendBFileModal from './send-bfile-modal';
import SaveForLaterModal from './save-for-later-modal';
import NoAnswerModal from './no-answer-modal';
import { Translate } from 'react-translated';

class WizardFooter extends Component {
    state = {
        show_send_bfile_modal: false,
        show_save_for_later_modal: false
    }
    toggleRAC() {
        window.document.querySelector('body').classList.toggle("show_rac");
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
                {wizard.stepIndex === 14 ? (
                    <div>
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
                            ) : (
                                <Button size="large" type="primary" onClick={() => save()}>
                                    <Translate text={`Create B-File`} />
                                </Button>
                            )}
                        </Button.Group>
                    </div>
                ) : (
                    <div>
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
                <NoAnswerModal
                    showModal={this.state.show_no_answer_modal}
                    hideModal={() => this.setState({ show_no_answer_modal: false })}
                    wizard={wizard}
                    updateField={updateField}
                    save={save}
                    user={user}
                    history={this.props.history}
                />
            </div>
        );

    }
}

export default WizardFooter;
