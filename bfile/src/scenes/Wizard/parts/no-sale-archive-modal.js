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
    DatePicker,
    Input,
    Tooltip
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import F from '../../../Functions';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        notes: '',
        nosalearchive_expiration_date: null
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
        const { notes, nosalearchive_expiration_date } = this.state;

        this.setState({ loading: true });

        updateField("is_lead", 0);
        updateField("is_saved_for_later", 0);
        updateField("is_requote", 1);
        updateField("archive", 1);
        updateField("nosalearchive_expiration_date", nosalearchive_expiration_date);

        updateField("auto_sold_toggle", "0");
        updateField("home_sold_toggle", "0");

        for (let i = 0; i < wizard.policies.length; i++) {
            wizard.policies[i].sold = "0";
            
        }
        
        updateField("policies", wizard.policies);


        save((bfile) => {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": "No Sale/Archive.",
                "user_id": user.id
            });

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
                    title={<Translate text={`No Sale/Archive`} />}
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
                                <label><Translate text={`Expiration Date`} /></label>
                                <DatePicker
                                    format="MM/DD/YYYY"
                                    onChange={(val) => this.setState({ expiration_date: val })}
                                />
                            </p>
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default DashModal;
