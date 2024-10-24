import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Card,
    Modal,
    Select,
    Radio,
    Button,
    Spin,
    Input,
    Tooltip
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import F from '../../../Functions';
import DatePicker from 'react-datepicker';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        callback_toggle: '',
        callback_time: null,
        notes: '',
        invitee_email: '',
        invite_attendee_notes: ''
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    disabledDate = (current) => {
        return current && current < moment().add(-1, 'days');
    }
    disabledDateTime = () => {
        return {
            disabledHours: () => this.range(0, 6),
            //disabledMinutes: () => this.range(30, 60)
        };
    }
    send = () => {
        const { wizard, updateField, save, user } = this.props;
        const { notes, callback_toggle, callback_time, invitee_email, invite_attendee_notes } = this.state;

        this.setState({ loading: true });

        updateField("is_saved_for_later", 1);

        save((bfile) => {
            if (callback_toggle === '1' && callback_time) {
                axios.post("/api/send_invite", {
                    bfile_id: bfile.id,
                    date_time: new Date(callback_time).toUTCString(),
                    location: "",
                    type: "save-for-later-call-back",
                    user_id: user.id
                });
                if (invitee_email !== "") {
                    axios.post("/api/send_invite", {
                        bfile_id: bfile.id,
                        date_time: new Date(callback_time).toUTCString(),
                        location: "",
                        type: "invite-attendee",
                        email: invitee_email,
                        notes: invite_attendee_notes,
                        user_id: user.id
                    });
                }
            }
            if (notes !== null && notes !== '') {
                axios.post("/api/bfile_notes", {
                    "bfile_id": bfile.id,
                    "note": notes,
                    "user_id": user.id
                });
            }
        })
    }
    render() {

        const { loading } = this.state;
        const { wizard, updateField } = this.props;

        return (
            <div style={{marginBottom: 20}}>
                <Modal
                    title={<Translate text={`Save for Later`} />}
                    visible={this.props.showModal}
                    onOk={this.send.bind(this)}
                    onCancel={this.props.hideModal}
                    okText={<Translate text={`Save`} />}
                >
                    <Spin indicator={antIcon} spinning={loading}>
                        <div id="save_for_later_modal">
                            <p>
                                <label><Translate text={`First Name`} />:</label><br/>
                                <Input value={wizard.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                            </p>
                            <p>
                                <label><Translate text={`Last Name`} />:</label><br/>
                                <Input value={wizard.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                            </p>
                            <p>
                                <label><Translate text={`Phone`} />:</label><br/>
                                <Input value={F.phone_format(wizard.phone)} onChange={(e) => updateField('phone', e.target.value)} />
                            </p>
                            <p>
                                <label><Translate text={`Notes`} />:</label><br/>
                                <TextArea placeholder="Notes..." rows={4} onChange={(e) => this.setState({ notes: e.target.value })} />
                            </p>
                            <p>
                                <label><Translate text={`Call-back`} />:</label><br/>
                                <RadioGroup defaultValue={''} onChange={(e) => this.setState({ callback_toggle:  e.target.value })}>
                                    <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                    <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                </RadioGroup>
                            </p>
                            {this.state.callback_toggle === '1' ? (
                                <p>
                                    <label><Translate text={`Call-back Time`} />:</label><br/>
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        showTimeSelect
                                        timeIntervals={15}
                                        timeFormat="hh:mm aa"
                                        selected={
                                            (this.state.callback_time && this.state.callback_time !== "")
                                            ? new Date(this.state.callback_time)
                                            : null
                                        }
                                        shouldCloseOnSelect={false}
                                        onChange={(val) => {
                                            const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                            this.setState({ callback_time: date })
                                        }}
                                    />
                                </p>
                            ) : null}
                            <p>
                                <label><Translate text={`Invite an Attendee`} />:</label><br/>
                                <Input onChange={(e) => this.setState({ invitee_email: e.target.value })} />
                            </p>
                            <p>
                                <label><Translate text={`Invite an Attendee Notes`} />:</label><br/>
                                <TextArea placeholder="" rows={4} onChange={(e) => this.setState({ invite_attendee_notes: e.target.value })} />
                            </p>
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default DashModal;
