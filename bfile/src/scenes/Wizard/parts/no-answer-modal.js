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
import DatePicker from 'react-datepicker';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        callback_time: null,
        notes: ''
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
        const { notes, callback_time } = this.state;

        this.setState({ loading: true });

        save((bfile) => {
            if (callback_time) {
                axios.post("/api/send_invite", {
                    bfile_id: bfile.id,
                    date_time: new Date(callback_time).toUTCString(),
                    location: "",
                    type: "save-for-later-call-back",
                    user_id: user.id
                });
                axios.get("/api/remove_event_reminder/" + bfile.id);
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
                    title={<Translate text={`No Answer / Save for Later`} />}
                    visible={this.props.showModal}
                    onOk={this.send.bind(this)}
                    onCancel={this.props.hideModal}
                    okText={<Translate text={`Save`} />}
                >
                    <Spin indicator={antIcon} spinning={loading}>
                        <div id="save_for_later_modal">
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
                            <p>
                                <label><Translate text={`Notes`} />:</label><br/>
                                <TextArea placeholder="Notes..." rows={4} onChange={(e) => this.setState({ notes: e.target.value })} />
                            </p>
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default DashModal;
