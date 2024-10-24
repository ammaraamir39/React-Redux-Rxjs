import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Input,
    Checkbox,
    DatePicker,
    Select,
    Switch,
    message,
    Divider
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';


const Option = Select.Option;
const { TextArea } = Input;

class NotificationAdmin extends Component {
    state = {
        loading: false,
        agency_id: null,
        loggedin: this.props.auth.user,
        agencies:[],
        agencyName:'',
        userTypeWithBMG : [],
        userTypesWithBMG : [
            'AGENCY_MANAGER',
            'REVIEWADMIN',
            'REVIEWSCHEDULER',
            'SUPER_ADMIN',
            'RSO'
        ],
        userTypes : [
            'EA',
            'EFS',
            'LSP',
            'MORTGAGE_BROKER',
            'VONBOARDER'
        ],
        userType:[],
        users:[],
        user:[],
        bmg_staff:false,
        description: '',
        update : false
        
       
    }
    componentDidMount = () => {
        let agency_id = null;
        this.setState({
            loading:true
        })
        
        axios.get('/api/all_active_agencies').then((res)=>{
            let agenciesPush = res.data
            agenciesPush.unshift({
                name : 'BMG Staff'
            })
            console.log("Agecniesfa",agenciesPush)
            this.setState({
                agencies:agenciesPush,
                loading:false
            })
        })
        
    }

    // loadAgencies=()=>{
    //     axios.get('/api/all_active_agencies').then((res)=>{
    //         console.log("agencies = > ",res.data)
    //     })
    // }

 
    save = () => {
        const { description, user } = this.state;
        console.log("Description ",description)
        console.log("User = > ",user)
        if(user.length && description !== ''){
            let data = {
                notification_message : description,
                user_ids : user,
                severity:"low",
                dispatch_time : Math.floor(Date.now() / 1000)
            }
            axios.post('/api/create_notification',data).then((res)=>{
                console.log("Notification Sent",res.data)
                message.success(F.translate(`Notification Sent Successfully`))
                this.setState({
                    description:'',
                    users:[],
                    user:[],
                    userType:[],
                    userTypeWithBMG:[],
                    userTypes:[],
                    agencyName : ''
                })
            })
          
        }else{
            message.error(F.translate(`Please Fill Required Fields`))
        }

       
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    updateUsers=()=>{
        const {bmg_staff,userType,agencies, toggleUserType ,agencyName,userTypeWithBMG} = this.state

        let agency_id = agencies.filter(agency => agency.name === agencyName)[0].id

        let data = {
            bmg_staff,
            user_type : bmg_staff ? userTypeWithBMG : userType ,
            agency_id,
            agencyName:"Select Agnecy"
        }
        console.log("Data = > ",data)
        axios.post('/api/get_notification_user',data).then((res)=>{
            console.log("Response = > ",res.data)
            this.setState({
                users:res.data.message,
                update : false
            })
        })
    }

    render() {
        const { loading,agencyName,agencies ,update,description, userType , userTypes , users, user,userTypesWithBMG,userTypeWithBMG} = this.state;
        console.log("Agency name : ",agencyName)
        console.log("UsertType with bmg => ",userTypeWithBMG)
        console.log("UsertType  => ",userType)
        console.log("Description : ",description)
        console.log("User = > ",user)
        console.log("Users = > ",users)
        console.log("Description = >",description)
        console.log("User types BMG = >",userTypesWithBMG)

        userType != '' && agencies.length && agencyName != '' && update && this.updateUsers()

        userTypeWithBMG != '' && agencies.length && agencyName != '' && update && this.updateUsers()

        return (
            <div>
                <Card type="inner" title={<Translate text={`Send Notification`} />} loading={loading}
                
                type="inner"
                    title={
                        
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <Translate text={`Notification`}  />
                                </div> 
                            </Col>
                            <Col md={6} span={3} >
                                <div className="inputField bor-bott">
                                    <Select style={{width:'100%'}} value={agencyName}  onChange={(val) => this.setState({agencyName:val, userType : [], userTypeWithBMG:[],user:[] })}>
                                        
                                        {agencies && agencies.map((agency, i) => (
                                            
                                            (agency.name =="BMG Staff" ?  <Option value={agency.name} key={i}> <b> {agency.name} *</b>  </Option>:
                                            
                                            <Option value={agency.name} key={i}>{agency.name}</Option>)
                                            
                                            
                                        ))}
                                    
                                    </Select>
                                    <p className='custom-agency'>Select Agency / BMG Staff</p>
                                </div> 
                            </Col>
                            {
                                agencyName === 'BMG Staff' ? (
                                    <Col md={6} span={3}>
                                    <div className="inputField">
                                        <Select style={{width:'100%'}} value={userTypeWithBMG} mode="multiple" allowClear  onChange={(val) => this.setState({userTypeWithBMG: val,userType:'',users:[],bmg_staff:true,update : true})}>
                                  
                                            {userTypesWithBMG && userTypesWithBMG.map((user, i) => (
                                                <Option value={user} key={i}>{user}</Option>
                                            ))}
                                        </Select>
                                        
                                        <p className='custom-agency'>Select User Type BMG</p>
                                    </div> 
                                </Col>
                                ) : (
                                    <Col md={6} span={3}>
                                    <div className="inputField">
                                        <Select  style={{width:'100%'}} value={userType} mode="multiple" allowClear   onChange={(val) => this.setState({userType: val,users:[],userTypeWithBMG:'',bmg_staff:false,update : true})}>
                                  
                                            {userTypes && userTypes.map((user, i) => (
                                                <Option value={user} key={i}>{user}</Option>
                                            ))}
                                        </Select>
                                        <p className='custom-agency'>Select User Types</p>
                                    </div> 
                                    </Col>
                                )
                            }
                          
                            <Col md={6} span={3}>
                                <div className="inputField">
                                    <Select style={{width:'100%'}} value={user} mode="multiple" allowClear  onChange={(val) => this.setState({user: val})}>
                              
                                        {  users && users.map((user, i) => (
                                            <Option value={user.user_id} key={i}>{`${user.first_name} ${user.last_name}`}</Option>
                                        ))}
                                    </Select>
                                    <p className='custom-agency'>Select Users</p>
                                </div> 
                            </Col>
                            
                            
                            {/* <Col md={3} span={3}>
                                <div className="inputField">
                                    <Select value={game.trigger_one_value} style={{ width: '100%' }} onChange={(val) => updateField('trigger_one_value', val)}>
                                        <Option value={''}><Translate text={`User Type`} /></Option>
                                        {[...Array(100)].map((x, i) => (
                                            <Option value={i+1} key={i}>${i+1}</Option>
                                        ))}
                                    </Select>
                                </div> 
                            </Col> */}
                        </Row>
                    }>
                    <div>
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Description`} /></label>
                                    <TextArea rows={6} value={description} onChange={(e)=>this.setState({description: e.target.value})} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.save.bind(this)}>
                            <Translate text={`Save`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default NotificationAdmin;
