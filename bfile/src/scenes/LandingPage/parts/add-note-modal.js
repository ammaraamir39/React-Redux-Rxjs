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
        notes: ''
    }
    componentDidMount = () => {

    }
    save = () => {
        const { notes } = this.state;
        const { bfile, user } = this.props;

        if (notes === '') {
            message.error(F.translate(`Note is required.`));

        } else {
            this.setState({ loading: true });
            axios.post("/api/bfile_notes", {
                bfile_id: bfile.id,
                note: notes,
                user_id: user.id
            }).then((res) => {
                message.success(F.translate(`Note has been added successfully.`));
                this.setState({ loading: false, notes: '' }, () => {
                    this.props.hideModal();
                });
            });
        }
    }
    render() {

        const { loading } = this.state;
        const { bfile, user } = this.props;

        return (
            <Modal
                title={<Translate text={`Add a Note`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Submit`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Note`} /></label>
                            <TextArea rows={4} onChange={(e) => this.setState({ notes: e.target.value })} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
