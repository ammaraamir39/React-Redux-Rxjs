import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Select,
    Input,
    Checkbox,
    message,
    Modal,
    Spin
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';
import AgencyLifeRetirementActivity from '../Dashboard/parts/ea/agency-life-retirement-activity';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class InviteAgencyManager extends Component {
    state = {
        loading: false,
        agency_id: null,
        loggedin: this.props.auth.user,
        agencies_modal:false,
        agencies_modal_loading : false, 
        user: {
            first_name: '',
            last_name: '',
            email: '',
            user_type: 'AGENCY_MANAGER',
            jobs: '{"onboarding":false,"life_licensed":false}',
        },
        checkedAgencies:[],
        user_agencies:[],
        agencies:[],
    }
    componentDidMount = () => {
        axios.get("/api/user").then((res) => {
            const u = res.data;
            let agency_id = null;
            for (let i=0; i < u.user_agency_assoc.length; i++) {
                agency_id = u.user_agency_assoc[i].agency_id;
                break;
            }
            this.setState({ agency_id })
        });

        axios.get("/api/rs_all_agencies").then((res) => {
            this.setState({
                agencies: res.data
            });
        })
    }

    
    updateField = (name, val) => {
        const { user }  = this.state;
        if (name === 'jobs') {
            const data = {onboarding: false, life_licensed: false};
            if (val.indexOf('onboarding') >= 0) data.onboarding = true;
            if (val.indexOf('life_licensed') >= 0) data.life_licensed = true;
            val = JSON.stringify(data);
        }
        user[name] = val;
        this.setState({ user });
    }
    invite = () => {
        const { user, loggedin, agency_id ,checkedAgencies} = this.state;
        if (user.email !== '' && user.first_name !== '' && user.last_name !== '' && checkedAgencies.length>=0)  {
            console.log("THis.state = > ",this.state)
            this.setState({ loading: true });
            console.log("User = > ",user)
            axios.post("/api/is_user_exist", {
                email: user.email
            }).then((res) => {
                console.log("User Exis = >",res.data)
                const user_id = res.data;
                if (user_id) {
                    // axios.post("/api/user_agency_assoc", {
                    //     agency_id: agency_id,
                    //     user_id: user_id
                    // }).then((res) => {
                        axios.post("/api/associations", {
                            parent_id: loggedin.id,
                            child_id: user_id,
                            status: 1
                        }).then((res) => {
                            message.success(F.translate(`Invite sent successfully`));
                            this.setState({ loading: false }, () => {
                                this.props.history.push('/manage-users');
                            });
                        }).catch(() => {
                            message.error(F.translate(`Invitation not sent`));
                            this.setState({ loading: false });
                        });
                    // }).catch((res) => {
                    //     message.error(F.translate(`Invitation not sent, please try again later.`));
                    //     this.setState({ loading: false });
                    // });
                } else {
                    axios.post("/api/token", {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        user_type: user.user_type,
                        invited_by: loggedin.id
                    }).then((res) => {
                        console.log("response user = > ",res.data)
                        const user = res.data
                            let agency_ids = this.uniqueItems(checkedAgencies)
                            console.log("Agency ids = > ",agency_ids)
                            axios.post(`/api/update_am_agency_assoc_multi/${user.id}`,{
                                agency_ids
                            }).then((res)=>{
                                console.log("added agencies =>   ",res.data)
                                console.log("inside then")
                                message.success(F.translate(`Invite sent successfully`));
                                this.setState({ loading: false }, () => {
                                    this.props.history.push('/manage-users');
                          
                            })
                            })
                               
                        
                    })
                    .catch(() => {
                        message.error(F.translate(`Invitation not sent, please try again later.`));
                    });
                }
            }).catch(() => {
                message.error(F.translate(`Please try again later.`));
                this.setState({ loading: false });
            });
        } else {
            message.error(F.translate(`Please fill all required fields.`));
            this.setState({ loading: false });
        }
    }

    uniqueItems(agencies){
        // const uniqueNames = [];
        const agencyArray = Array.from(new Set(agencies));
        return agencyArray
    }
    updateAgencyAssoc(user_id) {
       
            return this.state.checkedAgencies.map(async(agent)=>{
              try {
                  console.log("Agent = > ",agent)
                  console.log("User id = > ",user_id)
                let associations = await axios.post("/api/update_am_agency_assoc/" + user_id + "/" + agent + "/" + 1)
                console.log("Associations = > ",associations)
               
            } catch (error) {
                console.log("Error in assigning agencies=> ",error)
              }
            })
        } 
        // axios.post("/api/update_am_agency_assoc/" + user_id + "/" + agency_id + "/" + 1).then((res) => {
        //     console.log("agenc associated => ",res.data)
        //     // this.loadUserAgencies(this.state.user.id);
        // }).catch(e){

        // }
    
    // loadUserAgencies(user_id) {
    //     // this.setState({
    //     //     agencies_modal_loading: true
    //     // });
    //     // axios.get("/api/am_agencies_assoc/" + user_id).then((res) => {
    //     //     var agencies = [];
    //     //     for (let i = 0; i < res.data.length; i++) {
    //     //         const agency = res.data[i];
    //     //         agencies.push(agency.agency_id);
    //     //     }
    //     //     console.log("Agencies = > ",agencies)
    //     //     this.setState({
    //     //         agencies_modal_loading: false,
    //     //         user_agencies: agencies
    //     //     });
    //     // });
    // }
    render() {
        // console.log("Agencies = > ",this.state.agencies)
        const { loading, user } = this.state;
        const updateField = this.updateField;
        const jobs = [];
        console.log("checked agencies",this.state.checkedAgencies)
        if (user.user_type === 'AGENCY_MANAGER' && user.jobs !== '' && user.jobs !== null) {
            const jobs_json = JSON.parse(user.jobs);
            if (jobs_json.onboarding) {
                jobs.push('onboarding');
            }
            if (jobs_json.life_licensed) {
                jobs.push('life_licensed');
            }
        }

        return (
            <div>
                <Card type="inner" title={<Translate text={`Invite Agency Manager`} />} loading={loading}>
                    <div>
                        <Row gutter={16}>
                            <Col md={6} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`First Name`} /> *</label>
                                    <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={6} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Last Name`} /> *</label>
                                    <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={6} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Email`} /> *</label>
                                    <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={6} span={24}>
                            <div className="inputField">
                                    <label><Translate text={`Enter Agencies`} /> *</label>
                                    {/* <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} /> */}
                                     <Button onClick={() => {
                                        this.setState({
                                            agencies_modal: true,
                                            // user
                                            }
                                            // , () => {
                                            //     this.loadUserAgencies(user.id)
                                            // }
                                            )
                                        }}><Icon type="edit" /> Agencies
                                    </Button>
                           
                                </div>
                        </Col>
                        </Row>
                        {/* <h3><Translate text={`Select Jobs`} /></h3>
                        <Checkbox.Group value={jobs}
                            style={{ width: '100%' }}
                            onChange={(checkedList) => updateField('jobs', checkedList)}
                        >
                            <Checkbox value="onboarding"><Translate text={`Onboarding`} /></Checkbox>
                            <Checkbox value="life_licensed"><Translate text={`Life Licensed`} /></Checkbox>
                        </Checkbox.Group> */}
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.invite.bind(this)}>
                            <Translate text={`Invite User`} />
                        </Button>
                    </div>
                
                    {this.state.agencies_modal ? (
                    <Modal
                        title={<Translate text={`Agencies`} />}
                        visible={this.state.agencies_modal}
                        onCancel={() => this.setState({ agencies_modal: false })}
                        footer={<div>
                            <Button onClick={() => this.setState({ agencies_modal: false })}><Translate text={`Cancel`} /></Button>
                        </div>}
                    > 
                          
                            <div className="formBox">
                                {this.state.agencies.map((agency, i) => (
                                    <div key={i}>
                                        <Checkbox checked={(this.state.checkedAgencies.indexOf(agency.id) >= 0)} onChange={(e) => {
                                            if(e.target.checked){
                                                this.setState({
                                                    
                                                    checkedAgencies: [...this.state.checkedAgencies,...[agency.id]]
                                                });

                                            }  else if(!e.target.checked){
                                                console.log("Unchecked")
                                                let index = this.state.checkedAgencies.indexOf(agency.id)
                                                this.setState({
                                                    checkedAgencies:this.state.checkedAgencies.filter((agent)=>{
                                                        return agent.id === agency.id
                                                    })
                                                })
                                            }
                                        //     this.state.checkedAgencies = [...this.state.checkedAgencies,...[agency.id]]
                                        //  this.updateAgencyAssoc(agency.id, e.target.checked);
                                        }}>
                                            {agency.name}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        
                    </Modal>
                ) : null}
                </Card>
            </div>
        );

    }
}

export default InviteAgencyManager;
