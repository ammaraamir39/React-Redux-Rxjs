import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Icon,
    Button,
    Dropdown,
    Menu,
    List,
    Divider,
    Modal
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import NotesModal from './parts/notes-modal';
import TransferBFile from './parts/transfer-bfile-modal';
import ChangeCreatorModal from './parts/change-creator-modal';
import EditBFileStatusModal from './parts/edit-bfile-status-modal';
import SetupAppointment from './parts/setup-appointment-modal';
import InvitationLinkModal from './parts/invitation-link-modal';
import ResendMortgageApprovalModal from './parts/resend-mortgage-approval';
import Print from './parts/print';
import { Translate } from 'react-translated';

const confirm = Modal.confirm;

class ActionMenu extends Component {
    state = {
        loading: true,
        user: this.props.user,
        setup_appointment_modal: false,
        edit_bfile_status_modal: false,
        show_notes_modal: false,
        transfer_bfile_modal: false,
        change_creator_modal: false,
        invitation_link_modal: false
    }
    edit = () => {
        this.props.history.push('/wizard/step/1/' + this.state.bfile.id);
    }
    goTo = (path) => {
        this.props.history.push(path);
    }
    print = () => {
        if (typeof this.props.is_callpage !== 'undefined') {
            const { bfile } = this.props;
            this.props.history.push('/customer/' + bfile.id + '/print');
        } else {
            Print();
        }
    }
    archive = () => {
        const { bfile, user } = this.props;
        this.setState({ loading: true });
        axios.put("/api/b_file/" + bfile.id, { archive: 1 }).then((res) => {

            axios.post("/api/bfile_notes", {
                bfile_id: bfile.id,
                note: "B-File archived - " + moment().format("MM/DD/YYYY hh:mmA"),
                user_id: user.id
            });

            this.setState({ loading: false }, () => {
                if (typeof this.props.refresh !== 'undefined') {
                    this.props.refresh();
                } else {
                    this.props.history.push('/dashboard');
                }
            });
        });
    }
    delete = () => {
        const that = this;
        const { bfile, user } = this.props;

        confirm({
            title: 'Delete B-File',
            content: 'Do you really want to delete this B-File?',
            onOk() {
                that.setState({ loading: true });
                if (user.user_type !== 'EFS') {
                    axios.put("/api/b_file/" + bfile.id, { deleted: 1 }).then((res) => {
                        axios.post("/api/bfile_notes", {
                            bfile_id: bfile.id,
                            note: "B-File deleted - " + moment().format("MM/DD/YYYY hh:mmA"),
                            user_id: user.id
                        });
                        that.setState({ loading: false }, () => {
                            if (typeof that.props.refresh !== 'undefined') {
                                that.props.refresh();
                            } else {
                                that.props.history.push('/dashboard');
                            }
                        });
                    });
                } else {
                    axios.get("/api/user_need_attention").then(function(res){
                        const data = res.data;
                        for(var i=0; i<data.length; i++) {
                            if (data[i].bfile_id == bfile.id) {
                                axios.delete("/api/need_attention/" + data[i].id);
                            }
                        }
                        axios.get('/api/calendar_invite?q={"filters":[{"name":"bfile_id","op":"==","val":'+bfile.id+'}]}').then(function(res){
                            const data = res.data;
                            for(var i=0; i<data.length; i++) {
                                if (data[i].bfile_id == bfile.id) {
                                    axios.delete("/api/need_attention/" + data[i].id);
                                }
                            } 
                            that.setState({ loading: false }, () => {
                                if (typeof that.props.refresh !== 'undefined') {
                                    that.props.refresh();
                                } else {
                                    that.props.history.push('/dashboard');
                                }
                            });
                        });    
                    });
                }
            }
        });
    }
    toggleVIP = () => {
        const { bfile } = this.props;

        if (bfile.vip === 0) bfile.vip = 1;
        else bfile.vip = 0;

        this.setState({ loading: true });
        axios.put("/api/b_file/" + bfile.id, { vip: bfile.vip }).then((res) => {
            this.setState({ loading: false });
            this.props.update(bfile);
        });
    }
    toggleSP500 = () => {
        const { bfile } = this.props;

        if (bfile.sp_500 === 0) bfile.sp_500 = 1;
        else bfile.sp_500 = 0;

        this.setState({ loading: true });
        axios.put("/api/b_file/" + bfile.id, { sp_500: bfile.sp_500 }).then((res) => {
            this.setState({ loading: false });
            this.props.update(bfile);
        });
    }
    removeFinancialSpecialist = () => {
        const { bfile } = this.props;

        this.setState({ loading: true });
        axios.put("/api/b_file/" + bfile.id, { financial_id: null }).then((res) => {
            this.setState({ loading: false });
            this.props.history.push('/dashboard');
        });
    }
    cancelAppointment = (bfile_id) => {
        this.setState({ loading: true });
        axios.put("/api/b_file/" + bfile_id, { rs_action: 0 }).then((res) => {
            this.setState({ loading: false });
            this.props.history.push('/dashboard');
        });
    }
    render() {

        const {
            bfile,
            loading,
            user,
        } = this.props;

        let can_onboard = false;
        let can_do_financial = false;
        if (user.user_type === 'LSP' && typeof user.jobs !== "undefined" && user.jobs !== null && user.jobs !== '') {
            const jobs = JSON.parse(user.jobs);
            if (jobs.onboarding) {
                can_onboard = true;
            }
            if (jobs.life_licensed) {
                can_do_financial = true;
            }
        }
        if (user.user_type === 'EA') {
            can_onboard = true;
            can_do_financial = true;
        }
        if (user.user_type === 'EFS') {
            can_do_financial = true;
        }

        let menu = (<Menu />);
        if (user.id !== 2 && (user.user_type === 'EA' || user.user_type === 'LSP' || user.user_type === 'EFS')) {
            menu = (
                <Menu>
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Item key="profile" onClick={() => this.goTo("/customer/" + bfile.id)}>
                            <Icon type="user" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`View Profile`} />
                        </Menu.Item>
                    ) : null}
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Divider />
                    ) : null}
                    {can_onboard && bfile.is_saved_for_later === 0 ? (
                        <Menu.Item key="onboarding" onClick={() => this.goTo("/onboarding/step/1/" + bfile.id)}>
                            <Icon type="phone" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Welcome/Thank You Call to Customer (Step 1)`} />
                        </Menu.Item>
                    ) : null}
                    {can_do_financial && bfile.is_saved_for_later === 0 ? (
                        <Menu.Item key="financial" onClick={() => this.goTo("/financial/step/1/" + bfile.id)}>
                            <Icon type="calendar" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Re-Confirm Desire for Life and Retirement Appointment (Step 2)`} />
                        </Menu.Item>
                    ) : null}
                    {can_do_financial && bfile.is_saved_for_later === 0 ? (
                        <Menu.Item key="outcome" onClick={() => this.goTo("/financial/step/last/" + bfile.id)}>
                            <Icon type="calculator" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Outcome of Life and Retirement Appointment (Step 3)`} />
                        </Menu.Item>
                    ) : null}
                    {/* {user.user_type !== 'EFS' && bfile.is_saved_for_later === 0 ? (
                        <Menu.Item key="renewal" onClick={() => this.goTo("/wizard/step/1/" + bfile.id + '/renewal')}>
                            <Icon type="sync" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`P&C Renewal Conversation`} />
                        </Menu.Item>
                    ) : null} */}
                    <Menu.Item key="transfer" onClick={() => this.setState({ transfer_bfile_modal: true })}>
                        <Icon type="export" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Transfer B-File`} />
                    </Menu.Item>
                    <Menu.Item key="print" onClick={() => this.print()}>
                        <Icon type="printer" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Send B-File to EAgent/Print`} />
                    </Menu.Item>
                    {user.user_type !== 'EFS' ? (
                        <Menu.Item key="archive" onClick={() => this.archive()}>
                            <Icon type="folder" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Archive B-File`} />
                        </Menu.Item>
                    ) : null}
                    <Menu.Item key="delete" onClick={() => this.delete()}>
                        <Icon type="delete" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Delete B-File`} />
                    </Menu.Item>
                    {user.user_type !== 'EFS' ? (
                        <Menu.Item key="change-creator" onClick={() => this.setState({ change_creator_modal: true })}>
                            <Icon type="user" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Change B-File Creator`} />
                        </Menu.Item>
                    ) : null}
                    <Menu.Divider />
                    {bfile.vip === 0 ? (
                        <Menu.Item key="vip" onClick={() => this.toggleVIP()}>
                            <Icon type="plus" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Designate Customer as VIP`} />
                        </Menu.Item>
                    ) : (
                        <Menu.Item key="vip" onClick={() => this.toggleVIP()}>
                            <Icon type="minus" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Remove VIP Designation for this Customer`} />
                        </Menu.Item>
                    )}
                    {/* {bfile.sp_500 === 0 ? (
                        <Menu.Item key="sp-500" onClick={() => this.toggleSP500()}>
                            <Icon type="plus" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Enable S&P Index for this Customer`} />
                        </Menu.Item>
                    ) : (
                        <Menu.Item key="sp-500" onClick={() => this.toggleSP500()}>
                            <Icon type="minus" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Disable S&P Index for this Customer`} />
                        </Menu.Item>
                    )} */}
                    {user.user_type !== 'EFS' ? (
                        <Menu.Divider />
                    ) : null}
                    {user.user_type !== 'EFS' ? (
                        <Menu.Item key="invitation-link" onClick={() => this.setState({ invitation_link_modal: true })}>
                            <Icon type="link" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Invitation Link`} />
                        </Menu.Item>
                    ) : null}
                    {user.user_type !== 'EFS' && bfile.mortgage_review === 1 ? (
                        <Menu.Item key="resend-mortgage-approval" onClick={() => this.setState({ resend_mortgage_approval_modal: true })}>
                            <Icon type="mail" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Resend Mortgage Approval`} />
                        </Menu.Item>
                    ) : null}
                </Menu>
            )
        }
        if (user.user_type === 'MORTGAGE_BROKER') {
            menu = (
                <Menu>
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Item key="profile" onClick={() => this.goTo("/customer/" + bfile.id)}>
                            <Icon type="user" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`View Profile`} />
                        </Menu.Item>
                    ) : null}
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Divider />
                    ) : null}
                    <Menu.Item key="print" onClick={() => this.print()}>
                        <Icon type="printer" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Send B-File to EAgent/Print`} />
                    </Menu.Item>
                    <Menu.Item key="invitation-link" onClick={() => this.setState({ invitation_link_modal: true })}>
                        <Icon type="link" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Invitation Link`} />
                    </Menu.Item>
                </Menu>
            )
        }
        if (user.user_type === 'VONBOARDER' || user.id === 2) {
            menu = (
                <Menu>
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Item key="profile" onClick={() => this.goTo("/customer/" + bfile.id)}>
                            <Icon type="user" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`View Profile`} />
                        </Menu.Item>
                    ) : null}
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Divider />
                    ) : null}
                    <Menu.Item key="onboarding" onClick={() => this.goTo("/onboarding/step/1/" + bfile.id)}>
                        <Icon type="phone" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Welcome/Thank You Call to Customer (Step 1)`} />
                    </Menu.Item>
                    <Menu.Item key="delete-financial" onClick={() => this.removeFinancialSpecialist()}>
                        <Icon type="delete" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Remove Financial Specialist`} />
                    </Menu.Item>
                </Menu>
            )
        }
        
        if (user.user_type === 'REVIEWSCHEDULER') {
            menu = (
                <Menu>
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Item key="profile" onClick={() => this.goTo("/customer/" + bfile.id)}>
                            <Icon type="user" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`View Profile`} />
                        </Menu.Item>
                    ) : null}
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Divider />
                    ) : null}
                    <Menu.Item key="setup-appointment" onClick={() => this.setState({ setup_appointment_modal: true })}>
                        <Icon type="phone" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Setup Appointment`} />
                    </Menu.Item>
                    <Menu.Item key="edit-bfile-status" onClick={() => this.setState({ edit_bfile_status_modal: true })}>
                        <Icon type="edit" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Edit B-File Status`} />
                    </Menu.Item>
                    <Menu.Item key="delete" onClick={() => this.delete()}>
                        <Icon type="delete" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Delete B-File`} />
                    </Menu.Item>
                    {bfile.rs_action == 1 ? (
                        <Menu.Item key="cancel-the-appointment" onClick={() => this.cancelAppointment(bfile.id)}>
                            <Icon type="close" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`Cancel the Appointment`} />
                        </Menu.Item>
                    ) : null}
                </Menu>
            )
        }
        if (user.user_type === 'RSO') {
            menu = (
                <Menu>
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Item key="profile" onClick={() => this.goTo("/customer/" + bfile.id)}>
                            <Icon type="user" style={{marginRight:10,color:"#1890ff"}} />
                            <Translate text={`View Profile`} />
                        </Menu.Item>
                    ) : null}
                    {typeof this.props.is_callpage !== 'undefined' ? (
                        <Menu.Divider />
                    ) : null}
                    <Menu.Item key="onboarding" onClick={() => this.goTo("/onboarding/step/1/" + bfile.id)}>
                        <Icon type="phone" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Welcome/Thank You Call to Customer (Step 1)`} />
                    </Menu.Item>
                    <Menu.Item key="delete-financial" onClick={() => this.removeFinancialSpecialist()}>
                        <Icon type="delete" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Remove Financial Specialist`} />
                    </Menu.Item>
                    <Menu.Item key="setup-appointment" onClick={() => this.setState({ setup_appointment_modal: true })}>
                        <Icon type="phone" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Setup Appointment`} />
                    </Menu.Item>
                    <Menu.Item key="setup-appointment" onClick={() => this.setState({ edit_bfile_status_modal: true })}>
                        <Icon type="edit" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Edit B-File Status`} />
                    </Menu.Item>
                    <Menu.Item key="delete" onClick={() => this.delete()}>
                        <Icon type="delete" style={{marginRight:10,color:"#1890ff"}} />
                        <Translate text={`Delete B-File`} />
                    </Menu.Item>
                </Menu>
            )
        }

        return (
            <div style={{display:'inline-block'}}>
                {typeof this.props.is_callpage !== 'undefined' ? (
                    <Dropdown overlay={menu}>
                        <div>
                            <Icon type="user" style={{marginRight:10}} />
                            <Link to={"/customer/" + bfile.id}>
                                <span>{bfile.first_name + " " + bfile.last_name}</span> <Icon type="down" />
                            </Link>
                        </div>
                    </Dropdown>
                ) : (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="primary" style={{ marginLeft: 8 }}>
                            <Translate text={`B-File Actions`} /> <Icon type="down" />
                        </Button>
                    </Dropdown>
                )}

                <ChangeCreatorModal
                    history={this.props.history}
                    showModal={this.state.change_creator_modal}
                    hideModal={() => this.setState({ change_creator_modal: false })}
                    bfile={bfile}
                    user={user}
                    {...this.props}
                />
                <SetupAppointment
                    history={this.props.history}
                    showModal={this.state.setup_appointment_modal}
                    hideModal={() => this.setState({ setup_appointment_modal: false })}
                    bfile={bfile}
                    user={user}
                    {...this.props}
                />
                <EditBFileStatusModal
                    history={this.props.history}
                    showModal={this.state.edit_bfile_status_modal}
                    hideModal={() => this.setState({ edit_bfile_status_modal: false })}
                    bfile={bfile}
                    user={user}
                    {...this.props}
                />
                <TransferBFile
                    history={this.props.history}
                    showModal={this.state.transfer_bfile_modal}
                    hideModal={() => this.setState({ transfer_bfile_modal: false })}
                    bfile={bfile}
                    user={user}
                    {...this.props}
                />
                <InvitationLinkModal
                    history={this.props.history}
                    showModal={this.state.invitation_link_modal}
                    hideModal={() => this.setState({ invitation_link_modal: false })}
                    bfile={bfile}
                    user={user}
                    {...this.props}
                />
                <ResendMortgageApprovalModal
                    history={this.props.history}
                    showModal={this.state.resend_mortgage_approval_modal}
                    hideModal={() => this.setState({ resend_mortgage_approval_modal: false })}
                    bfile={bfile}
                    user={user}
                    {...this.props}
                />
            </div>
        );

    }
}

export default ActionMenu;
