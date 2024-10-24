import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Modal,
    Select,
    Radio,
    Button,
    Spin,
    DatePicker,
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
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: true,
        fileList: [],
        agent: '',
        agency_id: null,
        users: [],
        user_id: null,
        agencies: [],
        selected: null,
        type_of_call: null,
        notes: '',
        action: "upload_file",
        cols: [],
        form: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            phone2: '',
            address: '',
            address_cont: '',
            city: '',
            state: '',
            zipcode: '',
            expiration_date: null,
            rs_policy_type: '',
            rs_effective_date: null,
            notes: ''
        },
        ordered_cols: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            phone2: '',
            expiration_date: '',
            address: '',
            address_cont: '',
            city: '',
            state: '',
            zipcode: '',
            rs_policy_type: '',
            rs_effective_date: '',
            notes: ''
        }
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
            if (u.user_type === 'REVIEWSCHEDULER' || u.user_type === 'RSO') {
                axios.get("/api/rs_agencies").then((res) => {
                    this.setState({
                        loading: false,
                        agencies: res.data
                    });
                });
            }
        });
    }
    loadUsers = () => {
        this.setState({
            loading: true,
            users: []
        })
        axios.get("/api/agency_associations/" + this.state.agency_id).then((res) => {
            let users = [];

            for (var i = 0; i < res.data.length; i++) {
                let u = res.data[i];
                users.push({
                    name: u.first_name+" "+u.last_name,
                    id: u.id,
                    user_type: u.user_type,
                    hidden : u.hidden
                });
            }
            
            this.setState({
                loading: false,
                users
            });
        });
    }
    updateField = (name, value) => {
        const { form } = this.state;
        form[name] = value;
        this.setState({ form });
    }
    save = () => {
        const { fileList } = this.state;

        if (this.state.user_id && this.state.agency_id) {
            if (this.state.action === "upload_file") {
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('file', file);
                });
                formData.append('agency_id', this.state.agency_id);
                formData.append('user_id', this.state.user_id);
                formData.append('type_of_call', this.state.type_of_call);
                formData.append('ordered_cols', JSON.stringify(this.state.ordered_cols));
                formData.append('notes', this.state.notes);
                this.setState({
                    loading: true,
                });
                
                reqwest({
                    url: '/api/upload_bfile3',
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
                            this.props.hideModal();
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
            } else {
                var data = this.state.form;
                data.agency_id = this.state.agency_id;
                data.user_id = this.state.user_id;
                data.type_of_call = this.state.type_of_call;

                this.setState({
                    loading: true,
                });
                axios.post("/api/rs_add_customer", data).then((res) => {
                    var form = this.state.form;
                    form.first_name = '';
                    form.last_name = '';
                    form.email = '';
                    form.phone = '';
                    form.address = '';
                    form.address_cont = '';
                    form.city = '';
                    form.state = '';
                    form.zipcode = '';
                    form.expiration_date = null;
                    form.rs_policy_type = '';
                    form.rs_effective_date = null;
                    form.notes = '';
                    this.setState({
                        fileList: [],
                        loading: false,
                        form
                    });
                    message.success(F.translate(`Customers has been added successfully.`));
                    this.props.hideModal();
                });
            }
        } else {
            message.error(F.translate(`Please select an LSP.`))
        }
    }
    proceed = (csv) => {
        let data = csv.split("\n");
        let header = false;
        let newData = [];
        let delimiter = ",";
        for (let i = 0; i < data.length; i++) {
            if (data[i] !== '') {
                if (!header) {
                    header = true;
                    let cols = data[i].split(delimiter);
                    this.setState({
                        cols,
                        ordered_cols: {
                            first_name: (cols.length > 0) ? cols[0].trim() : null,
                            last_name: (cols.length > 1) ? cols[1].trim() : null,
                            email: (cols.length > 2) ? cols[2].trim() : null,
                            address: (cols.length > 3) ? cols[3].trim() : null,
                            address_cont: (cols.length > 4) ? cols[4].trim() : null,
                            city: (cols.length > 5) ? cols[5].trim() : null,
                            state: (cols.length > 6) ? cols[6].trim() : null,
                            zipcode: (cols.length > 7) ? cols[7].trim() : null,
                            phone: (cols.length > 8) ? cols[8].trim() : null,
                            phone2: (cols.length > 9) ? cols[9].trim() : null,
                            expiration_date: (cols.length > 10) ? cols[10].trim() : null,
                            rs_policy_type: (cols.length > 11) ? cols[11].trim() : null,
                            rs_effective_date: (cols.length > 12) ? cols[12].trim() : null,
                            notes: (cols.length > 13) ? cols[13].trim() : null
                        }
                    });
                    break;
                } else {
                    newData.push(data[i].split(delimiter));
                }
            }
        }
    }
    fileUpdate = (file) => {
        const that = this;
        if (file.type === "text/csv") {
            const reader = new FileReader();
            reader.onload = function fileReadCompleted() {
                that.proceed(reader.result);
            };
            reader.readAsText(file);
        } else {
            message.error(file.name + ' is not a valid csv file.');
            this.setState({
                fileList: []
            })
        }
        return false;
    }
    updateCol = (name, val) => {
        let { ordered_cols } = this.state;
        ordered_cols[name] = val;
        this.setState({ ordered_cols })
    }
    render() {
        const { agencies, loading, users, form } = this.state;
        const props = {
            action: '/api/upload_bfile3',
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
                this.fileUpdate(file)
                return false;
            },
            fileList: this.state.fileList,
        };

        return (
            <Modal
                title={<Translate text={`Upload Customers`} />}
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
                            <label><Translate text={`Agency`} /></label>
                            <Select
                                defaultValue={''}
                                style={{ width: '100%' }}
                                val={this.state.selected}
                                onChange={(val) => {
                                    const item = agencies[val];
                                    this.setState({
                                        select: val,
                                        agency_id: item.id,
                                        user_id: item.primary_ea_id
                                    }, () => this.loadUsers())
                                }}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {agencies.map((user, i) => (
                                    <Option key={i} value={i}>{user.name}</Option>
                                ))}
                            </Select>
                        </div>
                        {users.length > 0 ? (
                            <div style={{marginBottom:10}}>
                                <label><Translate text={`LSP`} /></label>
                                <Select defaultValue={''} style={{ width: '100%' }} onChange={(val) => this.setState({ user_id: val })}>
                                    <Option value={''}><Translate text={`Select`} />...</Option>
                                    {users.map((user, i) => user.hidden === false ? (<Option key={i} value={user.id}>{user.name}</Option>):"")}
                                </Select>
                            </div>
                        ) : null}
                        <div style={{marginBottom:10}}>
                            <label><Translate text={`Type of Call`} /></label>
                            <Select
                                defaultValue={''}
                                style={{ width: '100%' }}
                                val={this.state.type_of_call}
                                onChange={(type_of_call) => this.setState({ type_of_call })}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                <Option value={'Review'}><Translate text={`Review`} /></Option>
                                <Option value={'Follow-Up'}><Translate text={`Follow-Up`} /></Option>
                                <Option value={'Cross Sell-Auto'}><Translate text={`Cross Sell-Auto`} /></Option>
                                <Option value={'Cross Sell-Home'}><Translate text={`Cross Sell-Home`} /></Option>
                                <Option value={'Life'}><Translate text={`Life`} /></Option>
                            </Select>
                        </div>
                        <div style={{marginBottom:10}}>
                            <Radio.Group value={this.state.action} onChange={(e) => this.setState({ action: e.target.value })} style={{width: '100%', display: 'flex', margin: '20px 0'}}>
                                <Radio.Button value="upload_file"><Translate text={`Upload File`} /></Radio.Button>
                                <Radio.Button value="add_manually"><Translate text={`Add a Customer Manually`} /></Radio.Button>
                            </Radio.Group>
                        </div>
                        {this.state.action === "upload_file" ? (
                            <div>
                                <label><Translate text={`File`} /></label>
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload" /> <Translate text={`Upload`} />
                                    </Button>
                                </Upload>

                                {this.state.fileList.length > 0 ? (
                                    <div style={{marginTop: 30}}>
                                        <p>First Name</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.first_name}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('first_name', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Last Name</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.last_name}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('last_name', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Email</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.email}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('email', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Phone</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.phone}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('phone', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Alternate Phone</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.phone2}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('phone2', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Expiration Date</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.expiration_date}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('expiration_date', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Address</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.address}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('address', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Address 2</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.address_cont}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('address_cont', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>City</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.city}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('city', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>State</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.state}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('state', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Zipcode</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.zipcode}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('zipcode', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Policy Type</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.rs_policy_type}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('rs_policy_type', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Effective Date</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.rs_effective_date}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('rs_effective_date', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <p>Notes</p>
                                        <div style={{marginBottom:10}}>
                                            <Select
                                                value={this.state.ordered_cols.notes}
                                                style={{ width: '100%', textAlign: 'center' }}
                                                onChange={(val) => this.updateCol('notes', val)}
                                            >
                                                <Option value={null}>Select column...</Option>
                                                {this.state.cols.map((col, i) => (
                                                    <Option key={i} value={col.replace(/"/g, '').replace(/'/g, '')}>{col.replace(/"/g, '').replace(/'/g, '')}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                        {this.state.action === "add_manually" ? (
                            <div>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`First Name`} /> *</label>
                                            <Input value={form.first_name} onChange={(e) => this.updateField('first_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Last Name`} /> *</label>
                                            <Input value={form.last_name} onChange={(e) => this.updateField('last_name', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Email`} /> *</label>
                                            <Input value={form.email} onChange={(e) => this.updateField('email', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Phone`} /> *</label>
                                            <Input value={form.phone} onChange={(e) => this.updateField('phone', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Alternate Phone`} /> *</label>
                                            <Input value={form.phone2} onChange={(e) => this.updateField('phone2', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Mailing Street1`} /> *</label>
                                            <Input value={form.address} onChange={(e) => this.updateField('address', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Mailing Street2`} /> *</label>
                                            <Input value={form.address_cont} onChange={(e) => this.updateField('address_cont', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Mailing City`} /> *</label>
                                            <Input value={form.city} onChange={(e) => this.updateField('city', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Mailing State`} /> *</label>
                                            <Input value={form.state} onChange={(e) => this.updateField('state', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Mailing Zip`} /> *</label>
                                            <Input value={form.zipcode} onChange={(e) => this.updateField('zipcode', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Policy Type`} /> *</label>
                                            <Input value={form.rs_policy_type} onChange={(e) => this.updateField('rs_policy_type', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Expiration Date`} /> *</label>
                                            <DatePicker
                                                value={form.expiration_date}
                                                format="MM/DD/YYYY"
                                                onChange={(val) => this.updateField('expiration_date', val)}
                                                style={{width: '100%'}}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Effective Date`} /> *</label>
                                            <DatePicker
                                                value={form.rs_effective_date}
                                                format="MM/DD/YYYY"
                                                onChange={(val) => this.updateField('rs_effective_date', val)}
                                                style={{width: '100%'}}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={24} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Notes`} /> *</label>
                                            <TextArea rows={4} value={form.notes} onChange={(e) => this.updateField('notes', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;