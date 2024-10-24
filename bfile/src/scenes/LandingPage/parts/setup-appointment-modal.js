import React, { Component } from 'react';
import {
    Icon,
    Modal,
    Select,
    Radio,
    Row,
    Col,
    Spin,
    Input,
    message,
    Button
} from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import { Translate } from 'react-translated';
import DatePicker from 'react-datepicker';

const { TextArea } = Input;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        loading: true,
        bfile: this.props.bfile,
        user: this.props.user,
        timezone: null,
        users: [],
        lsp: '',
        customer_info: null,
        action: '1',
        type: '',
        appointment_date: moment(new Date()).add(15, 'days'),
        appointment_date_date: moment(new Date()).add(15, 'days'),
        appointment_date_time: '',
        appointment_day: null,
        invitee_email: (this.props.bfile.email && this.props.bfile.email !== '') ? this.props.bfile.email :  '',
        note: '',
        appointment_hours: null,
        calendar_invites: [],
        virtual_link: null,
        has_calendly: false,
        calendly_loading: false,
        calendly_link: null,
        customer_email: ''
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
    componentDidMount = () => {
        let bfile = this.state.bfile;
        if (!bfile.email || bfile.email && bfile.email === "") {
            bfile.email = "noemail@bfilesystem.com";
        }
        this.getAssociations();
        this.setState({
            lsp: this.state.bfile.user.id,
            customer_info: bfile,
            appointment_hours: (this.state.bfile.user.appointment_hours) ? JSON.parse(this.state.bfile.user.appointment_hours) : null,
            timezone: this.state.bfile.timezone,
            virtual_link: this.state.bfile.user.virtual_link,
            has_calendly: (this.state.bfile.user.calendly_access_token) ? true : false,
            note: (this.state.bfile.user.virtual_link) ? this.state.bfile.user.virtual_link : '',
        })
    }
    getAssociations = () => {
        const { bfile } = this.state;

        axios.get("/api/agency_associations_appointments/" + bfile.agency_id).then((res) => {
            let users = [];
            let calendar_invites = [];
            for(var i=0; i<res.data.length; i++) {
                let user = res.data[i];

                if (user.id === this.state.lsp) {
                    calendar_invites = user.calendar_invites;
                }

                if (user.user_type == "EA") {
                    users.push({
                        name: user.first_name+" "+user.last_name,
                        id: user.id,
                        user_type: user.user_type,
                        appointment_hours: user.appointment_hours,
                        calendar_invites: user.calendar_invites,
                        virtual_link: user.virtual_link,
                        has_calendly: user.has_calendly,
                        note: (user.virtual_link) ? user.virtual_link : ''
                    });
                }
                if (user.user_type == "LSP") {
                    users.push({
                        name: user.first_name+" "+user.last_name,
                        id: user.id,
                        user_type: user.user_type,
                        appointment_hours: user.appointment_hours,
                        calendar_invites: user.calendar_invites,
                        virtual_link: user.virtual_link,
                        has_calendly: user.has_calendly,
                        note: (user.virtual_link) ? user.virtual_link : ''
                    });
                }
            }

            this.setState({
                loading: false,
                users,
                calendar_invites
            })
        });
    }
    componentDidUpdate = () => {
        if (this.props.bfile.id !== this.state.bfile.id) {
            let bfile = this.props.bfile;
            if (!bfile.email || bfile.email && bfile.email === "") {
                bfile.email = "noemail@bfilesystem.com";
            }
            this.setState({
                bfile: this.props.bfile,
                note: '',
                action: '1',
                appointment_date: moment(new Date()).add(15, 'days'),
                lsp: this.props.bfile.user.id,
                customer_info: bfile,
                timezone: this.props.bfile.timezone
            }, () => {
                this.getAssociations();
            })
        }
    }
    createLink = async () => {
        const {
            bfile,
            user
        } = this.state;
        var w = window.open("about:blank", "_blank");
        this.setState({
            calendly_loading: true
        })
        const r = await axios.get("/api/calendly/create_event_link/" + this.state.lsp + "?event_type=rs_setup_appointment");
        if (r.data.success) {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": "Appointment scheduled through Calendly.",
                "user_id": user.id
            });
            if (this.state.type === 'Phone') {
                w.location = r.data.link + "?name=" + encodeURIComponent(this.state.customer_info.first_name + ' ' + this.state.customer_info.last_name) + "&email=" + encodeURIComponent(this.state.customer_info.email || this.state.customer_email) + '&location=' + encodeURIComponent('+1' + this.state.customer_info.phone);
            } else {
                w.location = r.data.link + "?name=" + encodeURIComponent(this.state.customer_info.first_name + ' ' + this.state.customer_info.last_name) + "&email=" + encodeURIComponent(this.state.customer_info.email || this.state.customer_email) + '&location=' + this.state.type;
            }
            this.setState({
                calendly_loading: false
            })
            //this.props.history.push("/dashboard");
        } else {
            this.setState({
                calendly_loading: false
            })
            message.error(r.data.error);
        }
    }

    addnote = () => {
        const {
            note,
            bfile,
            action,
            lsp,
            user,
            customer_info
        } = this.state;

        // var email = bfile.email;
        // if (this.state.customer_email && this.state.customer_email !== '') {
        //     email = this.state.customer_email;
        // }
        
        if (customer_info.email !== "" && customer_info.first_name !== "" && customer_info.first_name !== "") {
            this.setState({ loading: true });

            var data =  {
                "first_name": customer_info.first_name,
                "last_name": customer_info.last_name,
                "phone": customer_info.phone,
                "email": customer_info.email
            };
            
            if (lsp !== '' && lsp !== bfile.user_id) {
                data.user_id = lsp;
                bfile.user_id = lsp;
            }
            
            axios.put("/api/b_file/" + customer_info.id, data).then(() => {
                axios.get("/api/calendly/get_event_date/" + lsp + "?email=" + encodeURIComponent(customer_info.email)).then((r) => {
                    if (r.data.success) {
                        this.setState({ loading: true });
                        
                        if (note !== '') {
                            axios.post("/api/bfile_notes", {
                                "bfile_id": bfile.id,
                                "note": note,
                                "user_id": user.id
                            });
                        }

                        let attempts = bfile.rs_attempts;
                        if (!attempts) attempts = 0;
                        attempts++;

                        this.setState({ loading: true });
                        var appointment_date_arr = moment(r.data.date).utc().format('YYYY-MM-DDTHH:mm:ss');
                        var rs_scheduled_date = moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss');

                        var data = {
                            archive: 0,
                            reviewer_id: user.id,
                            rs_call_made: 1,
                            rs_action: action,
                            rs_attempts: attempts,
                            rs_appointment_date: appointment_date_arr,
                            rs_scheduled_date,
                            calendly_eventdate: appointment_date_arr,
                            calendly_eventuri: r.data.uri,
                            calendly_location: JSON.stringify(r.data.location),
                            rs_date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')
                        };
                        axios.put("/api/b_file/" + bfile.id, data).then(() => {
                            this.setState({ loading: false });
                            this.props.hideModal();
                            this.props.history.push("/dashboard");
                        });
                    } else {
                        this.setState({ loading: false });
                        message.error(r.data.error);
                    }
                });
            })
        } else {
            message.error("Name and email are required.");
        }
    }

    updateField = (name, value) => {
        let { customer_info } = this.state;

        customer_info[name] = value;

        this.setState({
            customer_info
        })
    }

    saveEmail = () => {
        const {
            bfile,
            customer_email
        } = this.state;

        if (customer_email !== '') {
            this.setState({ loading: true });
            axios.put("/api/b_file/" + bfile.id, {
                "email": customer_email
            }).then((r) => {
                this.setState({
                    loading: false
                })
            });
        }
    }

    save = () => {
        const {
            lsp,
            action,
            invitee_email,
            note,
            bfile,
            user
        } = this.state;

        let appointment_date = this.state.appointment_date;

        if (note !== '') {
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": note,
                "user_id": user.id
            });
        }

        let attempts = bfile.rs_attempts;
        if (!attempts) attempts = 0;
        attempts++;

        let data = null;
        let appointment_date_arr = null;

        if (action === '0') {
            data = {
                archive: 0,
                rs_call_made: null,
                rs_action: action,
                rs_attempts: attempts,
                reviewer_id: user.id,
                rs_notreached_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": "Not Reached.",
                "user_id": user.id
            });
        }
        if (action === '1') {
            for (let i = 0; i < this.state.users.length; i++) {
                if (lsp === this.state.users[i].id) {
                    const agent_name = this.state.users[i].name;
                    var note_text = 'Review Scheduler Appointment: ' + moment(appointment_date).format('MM/DD/YYYY hh:mmA') + ' - Agent: ' + agent_name;
                    if (this.state.type !== "") {
                        note_text = 'Review Scheduler Appointment: ' + moment(appointment_date).format('MM/DD/YYYY hh:mmA') + ' - Agent: ' + agent_name + " - Type: " + this.state.type;
                    }
                    axios.post("/api/bfile_notes", {
                        "bfile_id": bfile.id,
                        "note": note_text,
                        "user_id": user.id
                    });
                    break;
                }   
            }
            appointment_date_arr = moment(appointment_date).utc().format('YYYY-MM-DDTHH:mm:ss');
            var rs_scheduled_date = moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss');
            data = {
                //user_id: lsp,
                archive: 0,
                reviewer_id: user.id,
                rs_call_made: 1,
                rs_action: action,
                rs_attempts: attempts,
                rs_appointment_date: appointment_date_arr,
                rs_scheduled_date,
                rs_date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')
            }
        }
        if (action === '2') {
            data = {
                archive: 1,
                rs_call_made: null,
                rs_action: action,
                rs_attempts: attempts,
                reviewer_id: user.id,
                rs_date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')
            }
            axios.post("/api/bfile_notes", {
                "bfile_id": bfile.id,
                "note": "Not interested.",
                "user_id": user.id
            });
        }

        if (lsp !== '' && lsp !== bfile.user_id) {
            data.user_id = lsp;
            bfile.user_id = lsp;
        }

        if (data) {
            this.setState({ loading: true });
            axios.put("/api/b_file/" + bfile.id, data).then(() => {

                this.setState({ loading: false });

                if (action === '1') {
                    const appointment_date_tz = moment.tz(appointment_date, this.state.timezone);
                    const send_invite_date = appointment_date_tz.toDate().toUTCString();
                    this.setState({ loading: true });
                    var invite_note = "";
                    if (this.state.type !== "") {
                        invite_note = "Type: " + this.state.type;
                    }
                    axios.post("/api/send_invite", {
                        "bfile_id": bfile.id,
                        "date_time": send_invite_date,
                        "location": "",
                        "type": "review-scheduler-appointment",
                        "appointment_type": this.state.type,
                        "user_id": bfile.user_id,
                        "timezone": this.state.timezone,
                        "notes": invite_note
                    }).then((res) => {
                        if (invitee_email !== "") {
                            axios.post("/api/send_invite", {
                                "bfile_id": bfile.id,
                                "date_time": send_invite_date,
                                "location": "",
                                "type": "invite-attendee",
                                "email": invitee_email,
                                "notes": invite_note,
                                "user_id": user.id
                            }).then(() => {
                                this.setState({ loading: false });
                                this.props.hideModal();
                                this.props.history.push("/dashboard");
                            }).catch(() => {
                                this.setState({ loading: false });
                                message.error("Can't make invitee appointment.");
                            });
                        } else {
                            this.setState({ loading: false });
                            this.props.hideModal();
                            this.props.history.push("/dashboard");
                        }
                    }).catch(() => {
                        this.setState({ loading: false });
                        message.error("Can't make appointment.");
                    });
                }  else {
                    this.props.hideModal();
                    this.props.history.push("/bfiles/upcoming-calls");
                }
            });
        }
    }
    render() {

        const { users, loading, action } = this.state;

        /*
        if (this.state.has_calendly) {
            if (this.state.customer_info && !this.state.email_updated && (!this.state.customer_info.email || this.state.customer_info.email === "")) {
                return (
                    <Modal
                        title={<Translate text={`Update B-File`} />}
                        visible={this.props.showModal}
                        onOk={this.saveEmail.bind(this)}
                        onCancel={this.props.hideModal}
                        okText={<Translate text={`Save B-File`} />}
                    >
                        <Spin indicator={antIcon} spinning={loading}>
                            <div>
                                <p>Please update customer email first.</p>

                                <div style={{marginBottom:10}}>
                                    <label><Translate text={`Email`} />:</label>
                                    <Input type="text" value={this.state.customer_email} onChange={(e) => this.setState({ customer_email: e.target.value })} />
                                </div>
                            </div>
                        </Spin>
                    </Modal>
                )
            }
        }
        */

        return (
            <Modal
                title={<Translate text={`Setup Appointment`} />}
                visible={this.props.showModal}
                onOk={this.save.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Save`} />}
                footer={
                    (action === '1' && this.state.has_calendly) ? [
                        <Button key="cancel" onClick={this.props.hideModal}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.addnote.bind(this)}>
                            Save
                        </Button>
                    ] : [
                        <Button key="cancel" onClick={this.props.hideModal}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.save.bind(this)}>
                            Save
                        </Button>
                    ]
                }
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div style={{marginBottom:10}}>
                            <Select value={this.state.lsp} style={{ width: 220 }} onChange={(val) => {
                                var appointment_hours = null;
                                var calendar_invites = [];
                                var virtual_link = null;
                                var has_calendly = false;
                                for (let i = 0; i < users.length; i++) {
                                    if (users[i].id === val) {
                                        appointment_hours = users[i].appointment_hours;
                                        calendar_invites = users[i].calendar_invites;
                                        virtual_link = users[i].virtual_link;
                                        has_calendly = users[i].has_calendly;
                                        break;
                                    }
                                }
                                this.setState({
                                    lsp: val,
                                    appointment_hours: (appointment_hours) ? JSON.parse(appointment_hours) : null,
                                    calendar_invites: (calendar_invites) ? calendar_invites : [],
                                    virtual_link,
                                    has_calendly,
                                    note: virtual_link ? virtual_link : ''
                                })
                            }}>
                                {users.map((user, i) => (
                                    <Option key={i} value={user.id}>{user.name} ({user.user_type})</Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{marginBottom:10}}>
                            <Radio.Group value={this.state.action} onChange={(e) => this.setState({ action: e.target.value })}>
                                <Radio value="1"><Translate text={`Schedule Appointment`} /></Radio>
                                <Radio value="0"><Translate text={`Not Reached`} /></Radio>
                                <Radio value="2"><Translate text={`Not Interested`} /></Radio>
                            </Radio.Group>
                        </div>
                        {action === '1' ? (
                            <div>
                                <div style={{marginBottom:10}}>
                                    <label><Translate text={`Appointment Date`} />:</label>
                                    {this.state.has_calendly ? (
                                        <div>
                                            {this.state.calendly_loading ? (
                                                <p className="calendly_loding">
                                                    <Spin indicator={antIcon} />
                                                </p>
                                            ) : (
                                                <div>
                                                    <p><a onClick={() => {
                                                        this.createLink()
                                                    }} target="_blank">Click here to schedule an appointment</a></p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {!this.state.appointment_hours ? (
                                                <DatePicker
                                                    dateFormat="MM/dd/yyyy h:mm aa"
                                                    showTimeSelect
                                                    timeIntervals={15}
                                                    timeFormat="hh:mm aa"
                                                    shouldCloseOnSelect={false}
                                                    selected={
                                                        (this.state.appointment_date && this.state.appointment_date !== "")
                                                        ? new Date(this.state.appointment_date)
                                                        : null
                                                    }
                                                    onChange={(val) => {
                                                        const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                                        this.setState({ appointment_date: date })
                                                    }}
                                                />
                                            ) : (
                                                <div>
                                                    <div style={{marginBottom:10}}>
                                                        <DatePicker
                                                            dateFormat="MM/dd/yyyy h:mm aa"
                                                            showTimeSelect
                                                            timeIntervals={15}
                                                            timeFormat="hh:mm aa"
                                                            shouldCloseOnSelect={false}
                                                            selected={
                                                                (this.state.appointment_date && this.state.appointment_date !== "")
                                                                ? new Date(this.state.appointment_date)
                                                                : null
                                                            }
                                                            filterDate={(date) => {
                                                                const day = moment(date).format("dddd");
                                                                return (this.state.appointment_hours[day].length > 0)
                                                            }}
                                                            filterTime={(date) => {
                                                                const day = moment(date).format("dddd");
                                                                const hour = moment(date).format("h:mm a");
                                                                
                                                                for (let i = 0; i < this.state.calendar_invites.length; i++) {
                                                                    const d = new Date(this.state.calendar_invites[i]);
                                                                    if (moment(d).format("YYYY-MM-DD HH:mm") === moment(date).format("YYYY-MM-DD HH:mm")) {
                                                                        return false;
                                                                    }
                                                                }

                                                                return (this.state.appointment_hours[day].length > 0 && this.state.appointment_hours[day].indexOf(hour) >= 0)
                                                            }}
                                                            onChange={(val) => {
                                                                const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                                                this.setState({ appointment_date: date })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div style={{marginBottom:10}}>
                                        <label><Translate text={`Type`} />:</label>
                                        <Select value={this.state.type} style={{ width: '100%' }} onChange={(value) => {
                                            this.setState({ type: value })
                                            if (value === "Video conference") {
                                                if (this.state.virtual_link) {
                                                    this.setState({
                                                        note: "We have scheduled a virtual meeting for you on " + moment(this.state.appointment_date).format("MM/DD/YYYY hh:mmA") + ". Please click the link below at your scheduled time:\n" + this.state.virtual_link
                                                    })
                                                }
                                            }
                                        }}>
                                            <Option value={''}><Translate text={`Select`} />...</Option>
                                            <Option value="Phone"><Translate text={`Phone`} /></Option>
                                            <Option value="In person"><Translate text={`In person`} /></Option>
                                            <Option value="Video conference"><Translate text={`Video conference`} /></Option>
                                        </Select>
                                    </div>
                                </div>
                                {!this.state.has_calendly ? (
                                    <div>
                                        <div style={{marginBottom:10}}>
                                            <label><Translate text={`Timezone`} />:</label>
                                            <Select value={this.state.timezone} style={{ width: '100%' }} onChange={(value) => this.setState({ timezone: value })}>
                                                <Option value={''}><Translate text={`Select Timezone`} />...</Option>
                                                <Option value="US/Samoa"><Translate text={`Samoa Time Zone`} /> (-11:00)</Option>
                                                <Option value="US/Hawaii"><Translate text={`Hawaii-Aleutian Time Zone`} /> (-10:00)</Option>
                                                <Option value="US/Alaska"><Translate text={`Alaska Time Zone`} /> (-09:00)</Option>
                                                <Option value="US/Pacific"><Translate text={`Pacific Time Zone`} /> (-08:00)</Option>
                                                <Option value="US/Mountain"><Translate text={`Mountain Time Zone`} /> (-07:00)</Option>
                                                <Option value="US/Central"><Translate text={`Central Time Zone`} /> (-06:00)</Option>
                                                <Option value="US/Eastern"><Translate text={`Eastern Time Zone`} /> (-05:00)</Option>
                                            </Select>
                                        </div>
                                        <div style={{marginBottom:10}}>
                                            <label><Translate text={`Invitee Email`} />:</label>
                                            <Input type="text" value={this.state.invitee_email} onChange={(e) => this.setState({ invitee_email: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Please add the customer email in Calendly event guest list.</p>
                                        <div style={{marginBottom:10}}>
                                            <label><Translate text={`Name`} />:</label>
                                            <Row gutter={16}>
                                                <Col md={12} span={24}>
                                                    <Input type="text"
                                                        defaultValue={this.state.customer_info.first_name}
                                                        onChange={(e) => this.updateField("first_name", e.target.value)}
                                                    />
                                                </Col>
                                                <Col md={12} span={24}>
                                                    <Input type="text"
                                                        defaultValue={this.state.customer_info.last_name} 
                                                        onChange={(e) => this.updateField("last_name", e.target.value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div style={{marginBottom:10}}>
                                            <label><Translate text={`Phone`} />:</label>
                                            <Input type="text"
                                                defaultValue={this.state.customer_info.phone}
                                                onChange={(e) => this.updateField("phone", e.target.value)}
                                            />
                                        </div>
                                        <div style={{marginBottom:10}}>
                                            <label><Translate text={`Email`} />:</label>
                                            <Input type="text"
                                                defaultValue={this.state.customer_info.email}
                                                onChange={(e) => this.updateField("email", e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                        <div>
                            <label><Translate text={`Note`} />:</label>
                            <TextArea rows={4} value={this.state.note} onChange={(e) => this.setState({ note: e.target.value })} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
