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
    message,
    Upload
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import reqwest from 'reqwest';
import { Translate } from 'react-translated';
import F from '../Functions';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

let filePath = "";

class DashModal extends Component {
    state = {
        loading: true,
        users: [],
        fileList: [],
        agent: '',
        agency_id: null
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        axios.get("/api/user").then((res) => {
            const u = res.data;
            let agency_id = null;
            for (let i=0; i < u.user_agency_assoc.length; i++) {
                agency_id = u.user_agency_assoc[i].agency_id;
                break;
            }
            this.setState({ agency_id })
        });
        axios.get("/api/my_associations").then((res) => {
            let users = [];
            for (let x in res.data) {
                const agency = res.data[x];
                for (let i=0; i < agency.length; i++) {
                    const u = agency[i];
                    if (u.user_type === 'LSP') {
                        users.push({
                            name: u.first_name+" "+u.last_name,
                            id: u.id,
                            user_type: u.user_type
                        });
                    }
                }
            }
            this.setState({
                loading: false,
                users
            });
        });
    }
    save = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file);
        });
        formData.append('agency_id', this.state.agency_id);
        formData.append('user_id', this.state.agent);

        this.setState({
            loading: true,
        });

        reqwest({
            url: '/api/upload_bfile_ea',
            method: 'post',
            processData: false,
            data: formData,
            success: (resp) => {
                resp = JSON.parse(resp);
                if (resp.success === true) {
                    this.setState({
                        fileList: [],
                        loading: false,
                    });
                    message.success(F.translate(`Customers has been uploaded successfully.`));
                } else {
                    this.setState({ loading: false });
                    message.error(F.translate(`Can't upload customers.`));
                }
            },
            error: () => {
                this.setState({ loading: false });
                message.error(F.translate(`Can't upload customers.`));
            },
        });
    }
    render() {
        const { users, loading } = this.state;
        const props = {
            action: '/api/upload_bfile_ea',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };

        return (
            <Modal
                title={<Translate text={`Transfer B-Files`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={<div>
                    <Button type="primary" onClick={() => this.save()}><Translate text={`Upload`} /></Button>
                    <Button onClick={() => this.props.hideModal()}><Translate text={`Cancel`} /></Button>
                </div>}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <p><a href="/files/upload_customers_template.csv"><Translate text={`Step 1. Click here to download the formatted template.`} /></a></p>
                        <p><Translate text={`Step 2. Select the staff member you would like to assign these customers to.`} /></p>
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`LSP`} /></label>
                            <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ agent: val})}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {users.map((user, i) => (
                                    <Option key={i} value={user.id}>{user.name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label><Translate text={`File`} /></label>
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> <Translate text={`Upload`} />
                                </Button>
                            </Upload>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
