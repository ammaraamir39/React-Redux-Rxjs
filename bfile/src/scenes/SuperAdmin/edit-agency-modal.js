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
    Checkbox,
    Input,
    Switch,
    message
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import F from '../../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
    }
    updateAgency = (name, value) => {
        const { agency } = this.props;

        this.setState({ loading: true });
        axios.put("/api/agencies/" + agency.id, {[name]: value}).then(() => {
            this.setState({ loading: false });
            this.props.updateAgency(name, value);
            message.success(F.translate(`Agency has been updated successfully.`));
        })
    }
    render() {

        const { loading } = this.state;
        const { agency } = this.props;
        const updateAgency = this.updateAgency;

        return (
            <Modal
                title="Edit Agency"
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={null}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="inputField">
                        <Switch checked={agency.active ? true : false} onChange={(checked) => updateAgency('active', (checked) ? 1 : 0 )} />
                        <span style={{marginLeft:10}}>Active</span>
                    </div>
                    <div className="inputField">
                        <Switch checked={agency.vonboard ? true : false} onChange={(checked) => updateAgency('vonboard', (checked) ? 1 : 0 )} />
                        <span style={{marginLeft:10}}>Virtual Onboarding</span>
                    </div>
                    <div className="inputField">
                        <Switch checked={agency.review ? true : false} onChange={(checked) => updateAgency('review', (checked) ? 1 : 0 )} />
                        <span style={{marginLeft:10}}>Review Scheduler</span>
                    </div>
                    <div className="inputField">
                        <Switch checked={agency.calculator_only ? true : false} onChange={(checked) => updateAgency('calculator_only', (checked) ? 1 : 0 )} />
                        <span style={{marginLeft:10}}>Calculator Only</span>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
