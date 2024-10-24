import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Modal,
    Select,
    Spin,
    Input,
    Button,
    Popconfirm
} from 'antd';
import axios from 'axios';
import { Translate } from 'react-translated';
import F from '../../../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        notes: ''
    }
    send = () => {
        const { updateField, save, user } = this.props;
        const { notes } = this.state;

        this.setState({ loading: true });

        updateField("is_saved_for_later", 0);
        updateField("onboarding_id", user.id);
        updateField("onboarder_id", user.id);
        updateField("is_onboarded", 1);

        save((bfile) => {
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

        const dob_years = [];
        const dob_months = [];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (let i=1; i<13; i++) {
            if (i < 10) {
                dob_months.push({
                    name: monthNames[i-1],
                    value: '0'+i
                });
            } else {
                dob_months.push({
                    name: monthNames[i-1],
                    value: i + ''
                });
            }
        }
        for (let i=2017; i>=1900; i--) {
            if (i < 10) {
                dob_years.push('0' + i);
            } else {
                dob_years.push(i + '');
            }
        }

        return (
            <div style={{marginBottom: 20}}>
                <Modal
                    title={<Translate text={`Send for Follow-Up`} />}
                    visible={this.props.showModal}
                    onOk={this.send.bind(this)}
                    onCancel={this.props.hideModal}
                    okText={<Translate text={`Complete`} />}
                    closable={false}
                    footer={<div>
                        <Button type="primary" onClick={() => this.send()}><Translate text={`Complete`} /></Button>
                        <Popconfirm placement="topLeft" title={"If you close this popup all data will be lost."} onConfirm={this.props.hideModal} okText="Confirm" cancelText="Cancel">
                            <Button><Translate text={`Cancel`} /></Button>
                        </Popconfirm>
                    </div>}
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
                                <label><Translate text={`Email`} />:</label><br/>
                                <Input value={wizard.email} onChange={(e) => updateField('email', e.target.value)} />
                            </p>
                            <p>
                                <label><Translate text={`Phone`} />:</label><br/>
                                <Input value={F.phone_format(wizard.phone)} onChange={(e) => updateField('phone', e.target.value)} />
                            </p>
                            <p>
                                <label><Translate text={`DOB`} /> *</label>
                                <Row gutter={5}>
                                    <Col md={12} span={24}>
                                        <Select value={wizard.dob_mm} style={{ width: '100%' }} onChange={(value) => updateField('dob_mm', value)}>
                                            <Option value={''}>{"MM"}</Option>
                                            {dob_months.map((item, i) => (
                                                <Option value={item.value} key={i}><Translate text={item.name} /></Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <Select value={wizard.dob_yyyy} style={{ width: '100%' }} onChange={(value) => updateField('dob_yyyy', value)}>
                                            <Option value={''}>{"YYYY"}</Option>
                                            {dob_years.map((value, i) => (
                                                <Option value={value} key={i}>{value}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
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
