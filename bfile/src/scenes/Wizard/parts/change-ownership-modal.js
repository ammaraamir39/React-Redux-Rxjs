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
import { Translate } from 'react-translated';

class DashModal extends Component {
    state = {
    }
    render() {

        const { loading } = this.state;
        const { wizard } = this.props;

        return (
            <div style={{marginBottom: 20}}>
                <Modal
                    title={<Translate text={`Confirmation`} />}
                    visible={this.props.showModal}
                    onOk={this.props.change}
                    onCancel={this.props.hideModal}
                    okText={<Translate text={`Change ownership`} />}
                >
                    <p>{wizard.user.first_name + ' ' + wizard.user.last_name} created this B-File originally, do you want to change ownership for the renewal?</p>
                </Modal>
            </div>
        )
    }
}

export default DashModal;
