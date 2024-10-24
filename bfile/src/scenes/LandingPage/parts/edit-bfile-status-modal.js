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
    message
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import F from '../../../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: false,
        bfile: this.props.bfile,
        user: this.props.user,
        status: '',
    }
    save = () => {
        const { bfile, user, status } = this.state;

        if (status === '') {
            message.error(F.translate(`Status is required.`));

        } else {
            this.setState({ loading: true });
            let is_renewal = (status === 'Renewal');
            let data = { status, is_renewal };
            axios.put("/api/b_file/" + bfile.id, data).then((res) => {
                this.setState({ loading: false }, () => {
                    if (typeof this.props.refresh !== 'undefined') {
                        this.props.refresh();
                    } else {
                        this.props.history.push('/dashboard');
                    }
                });
            });
        }
    }
    render() {

        const { bfile, users, loading } = this.state;

        return (
            <Modal
                title={<Translate text={`Edit B-File Status`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Edit Status`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Status`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ status: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                <Option value={'New Bfile'}><Translate text={`New Bfile`} /></Option>
                                <Option value={'Renewal'}><Translate text={`Renewal`} /></Option>
                            </Select>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
