import React,{Component} from 'react';
import {
    Row,
    Col,
    DatePicker,
    Card,
    Radio,
    Icon,
    Button,
    Tag,
    Select
} from 'antd';
import './dashboard.css';
// import OnboardingCircle from './parts/onboarding-circle';
// import FinancialCircle from './parts/financial-circle';
// import NeedAttention from './parts/need-attention';
// import CalendarInvites from './parts/calendar-invites';
// import Games from './parts/games';
// import PendingOpportunities from './parts/ea/pending-opportunities';
// import StrategicOpportunities from './parts/ea/strategic-opportunities';
import MortgageReview from './parts/ea/mortgage-review';
import RewardSystem from './parts/ea/reward-system';
import ReviewScheduledCalls from './parts/ea/review-scheduled-calls';
import VirtualOnboardStats from './parts/ea/virtual-onboard-stats';
import TotalOpportunitiesUncovered from './parts/ea/total-opportunities-uncovered';
import AgencyLifeRetirementActivity from './parts/ea/agency-life-retirement-activity';
import RSCalendarInvites from './parts/ea/rs-calendar-invites';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';

const { RangePicker } = DatePicker;
const today = new Date();
const Option = Select.Option;

class AM extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            dashboard: {},
            period: 'mtd',
            start_date: null,
            end_date: null,
            associations: [],
            user: this.props.auth.user,
            agency_id: null,
            vonboard: 0,
            review: 0,
            user_t :"agency_manager"
        }
    }
    componentDidMount = () => {
        
        axios.get(`/api/am_agencies_assoc/${this.state.user.id}`).then((res) => {
            console.log("Associations = > ",res.data)
            this.setState({
                associations: res.data
            })
        })
     

        if ("user_period" in window.localStorage) {
            console.log("Inside")
            if (window.localStorage.user_period === 'from_to') {
                console.log("inside2")
                this.setState({
                    start_date: window.localStorage.user_start_date,
                    end_date: window.localStorage.user_end_date,
                    period: window.localStorage.user_period
                }, () => {
                    this.loadStats();
                })
            } else if (window.localStorage.user_period === 'all_bfiles') {
                this.setState({
                    period: window.localStorage.user_period
                }, () => {
                    console.log("inside3")
                    this.loadStats();
                })
            } else {
                console.log("inside4")
                this.loadStats();
            }
        } else {
            console.log("inside5")
            this.loadStats();
        }

        let user_id = this.state.user.id;
        console.log("User id = > ",user_id)
        axios.get("/api/am_agencies_assoc/" + user_id).then((res) => {
            let agency_id = null;
            console.log("Agencies => ",res.data)
            for (let i=0; i < res.data.length; i++) {
                agency_id = res.data[i].agency_id;
                break;
            }
            axios.get("/api/agencies/" + agency_id).then((res) => {
                this.setState({ 
                    vonboard: res.data.vonboard,
                    review: res.data.review,
                });
            });
        });
    }
    changePeriod = (e) => {
        const value = e.target.value;
        if (value === "mtd") {
            window.localStorage.user_start_date = null;
            window.localStorage.user_end_date = null;
            window.localStorage.user_period = value;

            this.setState({
                start_date: null,
                end_date: null,
                period: value
            }, () => {
                this.loadStats();
            })
        } else {
            //window.localStorage.user_start_date = new Date('2010-01-01');
            //window.localStorage.user_end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
            window.localStorage.user_period = value;

            this.setState({
                //start_date: new Date('2010-01-01'),
                //end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
                period: value
            }, () => {
                this.loadStats();
            })
        }
    }
    onChangeDateRange = (date, dateString) => {
        window.localStorage.user_start_date = date[0];
        window.localStorage.user_end_date = date[1];
        window.localStorage.user_period = "from_to";

        this.setState({
            start_date: date[0],
            end_date: date[1],
            period: "from_to"
        }, () => {
            this.loadStats();
        })
    }
    refresh = () => {
        this.setState({ loading: true });
        axios.get('/api/delete_user_cache').then((res) => {
            this.setState({ loading: false });
            this.loadStats();
        });
    }

    getData=()=>{
        const {period , start_date , end_date}=  this.state
        let data = {

        }
        if(period === 'all_bfiles'){
            data.window = period,
           data.all_agency = true 
            data.agency_id = null
        }else if (period === 'mtd'){
            data.window = period,
          data.all_agency = true 
           data.agency_id = null 
        }else{
            data.from = moment(start_date).format('YYYY-MM-DD');
            data.to = moment(end_date).format('YYYY-MM-DD');
            data.window = period 
       data.all_agency = true 
           data.agency_id = null 
        }
        return data
    }
    loadStats = () => {
        let data =  this.getData()
        // const {period , start_date , end_date}=  this.state
        // let data = {

        // }
        // if(period === 'all_bfiles'){
        //     data.window = period,
        //     data.all_agency = true 
        //      data.agency_id = null 
        // }else if (period === 'mtd'){
        //     data.window = period,
        //     data.all_agency = true 
        //     data.agency_id = null
        // }else{
        //     data.from = moment(start_date).format('YYYY-MM-DD');
        //     data.to = moment(end_date).format('YYYY-MM-DD');
        //     data.window = period 
        //    data.all_agency = true 
        //     data.agency_id = null
        // }
        // let data = { window: period,
        //     from : start_date,
        //     to:end_date,
        //     all_agency : true
        // };
        this.setState({ loading: true });
        axios.post('/api/dash_stats_am', data).then((res) => {
            const dashboard = res.data;
            console.log("Dashboard Data = > ",dashboard)
            
            dashboard.lsp = [{
                user: this.props.auth.user,
                stats: dashboard.agency_stats
            }].concat(dashboard.lsp);
          
            dashboard.efs = [{
                user: this.props.auth.user,
                stats: dashboard.stats
            }].concat(dashboard.efs);

            dashboard.lsp.forEach((element,index,object) => {
                   if(!element){
                       console.log("Inside undefeined")
                       object.splice(index,1)
                   } 
            });
            dashboard.efs.forEach((element,index,object) => {
                if(!element){
                    console.log("Inside undefeined")
                    object.splice(index,1)
                } 
         });
            console.log("Dashboard lsp = > ",dashboard.lsp)
            console.log("Dashboard efs = > ",dashboard.efs)
            this.setState({
                loading: false,
                dashboard
            })
        })
    }

    
    filterAgency=(val)=>{
        console.log("value = > ",val)
        
        this.setState({
            agency_id : val
        })
        const {period , start_date , end_date}=  this.state
        let data = {

        }
        if(val !== ''){
            if(period === 'all_bfiles' ){
                data.window = period,
                data.all_agency = false 
                data.agency_id = val
            }else if (period === 'mtd' ){
                data.window = period,
                data.all_agency = false 
                data.agency_id = val
            }else{
                data.from = moment(start_date).format('YYYY-MM-DD');
                data.to = moment(end_date).format('YYYY-MM-DD');
                data.window = period 
               data.all_agency = false 
                data.agency_id = val
            }
        }else{
            this.setState({
                agency_id : null 
            })
            data = this.getData()
        }
        
            console.log("Data inside filter agency = > ",data)
            axios.post('/api/dash_stats_am', data).then((res) => {
                const dashboard = res.data;
                console.log("Dashboard Data = > ",dashboard)
                
                dashboard.lsp = [{
                    user: this.props.auth.user,
                    stats: dashboard.agency_stats
                }].concat(dashboard.lsp);
              
                dashboard.efs = [{
                    user: this.props.auth.user,
                    stats: dashboard.stats
                }].concat(dashboard.efs);
    
                dashboard.lsp.forEach((element,index,object) => {
                       if(!element){
                           console.log("Inside undefeined")
                           object.splice(index,1)
                       } 
                });
                dashboard.efs.forEach((element,index,object) => {
                    if(!element){
                        console.log("Inside undefeined")
                        object.splice(index,1)
                    } 
             });
                console.log("Dashboard lsp = > ",dashboard.lsp)
                console.log("Dashboard efs = > ",dashboard.efs)
                this.setState({
                    loading: false,
                    dashboard
                })
            })
    }

    
    render() { 
        const {
            dashboard,
            associations,
            loading,
            start_date,
            end_date,
            period,
            agency_id
        } = this.state;

        console.log("state=> ",this.state)
        const dateFormat = 'MM/DD/YYYY';
        const user = this.props.auth.user;

        let defaultFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        if (start_date) defaultFromDate = start_date;

        let defaultToDate = new Date(today.getFullYear(), today.getMonth()+1, 1);
        if (end_date) defaultToDate = end_date;
        return (
            <div id="ea-dashboard">
                <div className="topbar">
                    <Card bordered={false}>
                        <Row gutter={16} type="flex" justify="space-around" align="middle">
                            <Col md={8} span={24}>
                                <div className="username">
                                    <Icon type="user" />
                                    
                                    {user.first_name+" "+user.last_name}
                                    {" "}
                                    <Tag color="blue">{user.user_type}</Tag>
                                </div>
                            </Col>
                            <Col md={16} span={24}>
                                <div className="right-align" style={{marginTop:-5, marginBottom:-5}}>
                                    <div className="inlineField">
                                        <Button icon="reload" onClick={this.refresh.bind(this)}>
                                            {' '}<Translate text={`Refresh`} />
                                        </Button>
                                    </div>
                                    <div className="inlineField">
                                        <Radio.Group value={period} onChange={this.changePeriod.bind(this)} style={{width: '100%'}}>
                                            <Radio.Button value="mtd"><Translate text={`This Month`} /></Radio.Button>
                                            <Radio.Button value="all_bfiles"><Translate text={`All B-Files`} /></Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <div className="inlineField">
                                        {period !== 'all_bfiles' ? (
                                            <RangePicker
                                                value={[moment(defaultFromDate), moment(defaultToDate)]}
                                                onChange={this.onChangeDateRange}
                                                format={dateFormat}
                                                style={{maxWidth:280}}
                                            />
                                        ) : null}
                                    </div>
                                    <div className="inlineField">
                                        <Select defaultValue="" style={{ width: 200 }} onChange={this.filterAgency}>
                                            <Option value=""><Translate text={`All Agencies`} />...</Option>
                                            {/* <Option value={user.email}><Translate text={`Me`} /></Option> */}
                                            {associations.map((asso, i) => {
                                       
                                                    return (
                                                        <Option value={asso.agency_id} key={i}>
                                                            {asso.agency_name}
                                                        </Option>
                                                    )
                                               
                                            })}

                                        </Select>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>

            <Row type="flex" gutter={16}>
                <Col lg={{ span: 24, order: 0 }} span={24} xs={{ order: 1 }}>
                    {/* <Row gutter={16}>
                        <Col lg={12} span={24}>
                            <OnboardingCircle
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                        <Col lg={12} span={24}>
                            <FinancialCircle
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                    </Row> */}
                    {/* <Row gutter={16}>
                        <Col xxl={14} xl={24} span={24}>
                            <PendingOpportunities
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                        <Col xxl={10} xl={16} span={24}>
                            <StrategicOpportunities
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                    </Row> */}
                    {/* <Row gutter={16}>
                        <Col xl={24} span={24}>
                            <RewardSystem />
                        </Col>
                    </Row> */}
                    <Row gutter={16} style={{ display: 'none'}}>
                        <Col xl={10} span={24}>
                            <MortgageReview
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                        <Col xl={14} span={24}>
                            <ReviewScheduledCalls
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                    </Row>
               
                        <VirtualOnboardStats
                            start_date={start_date || defaultFromDate}
                            end_date={end_date || defaultToDate}
                            period={period}
                            user_t = {this.state.user_t}
                            agency_id = {agency_id}
                        />
              
                    <TotalOpportunitiesUncovered
                        dashboard={dashboard}
                        associations={associations}
                        loading={loading}
                        user={user}
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        vonboard={this.state.vonboard}
                        user_t = {this.state.user_t}
                        agency_id = {this.state.agency_id}
                    />
                    {/* <Row gutter={16}>
                        <Col xl={10} span={24}  style={{ display: 'none'}}>
                            <MortgageReview
                                dashboard={dashboard}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                        <Col xl={24} span={24}>
                                <ReviewScheduledCalls
                                    dashboard={dashboard}
                                    loading={loading}
                                    user={user}
                                    start_date={start_date}
                                    end_date={end_date}
                                    period={period}
                                    user_t = {this.state.user_t}
                                />
                            </Col>
                    </Row> */}
                    
                    {/* <Row gutter={16} style={{ display: 'none'}}>
                        <Col xl={24} span={24}  >
                            <AgencyLifeRetirementActivity
                                dashboard={dashboard}
                                associations={associations}
                                loading={loading}
                                user={user}
                                start_date={start_date}
                                end_date={end_date}
                                period={period}
                            />
                        </Col>
                    </Row> */}
                     <RSCalendarInvites
                            dashboard={dashboard}
                            associations={associations}
                            loading={loading}
                            user={user}
                            start_date={start_date}
                            end_date={end_date}
                            period={period}
                            user_t = {this.state.user_t}
                            />
                    {/* {this.state.review ? (
                        <RSCalendarInvites
                            dashboard={dashboard}
                            associations={associations}
                            loading={loading}
                            user={user}
                            start_date={start_date}
                            end_date={end_date}
                            period={period}
                        />
                    ) : null} */}

                    
                </Col>
                {/* <Col lg={{ span: 6, order: 1 }} span={24} xs={{ order: 0 }}>
                    <NeedAttention />
                    <CalendarInvites />
                    <Games
                        dashboard={dashboard}
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                    />
                </Col> */}
            </Row>
        </div>
            // <div className="container">

            //     <div className="bg_white">
            //         <div className="w_100 card_head_padding">
            //             <div className="d_flex align_items_center">
            //                 <span className="mr_10_px">
            //                     <svg viewBox="64 64 896 896" focusable="false" data-icon="team" width="1em" height="1em" fill="#3490ff" aria-hidden="true">
            //                         <path d="M824.2 699.9a301.55 301.55 0 0 0-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 0 1 612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 0 0 8-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 0 1 612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z">
            //                         </path>
            //                     </svg>
            //                 </span>
            //                 <h1 className="text_black fw_500 mb_0">Virtual On-Board Stats (Completed)</h1>
            //             </div>
            //         </div>
            //         <div className="w_100 d_flex flex_wrap bb_color">
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Sent for Introduction to Financial Specialist</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Not Interested</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Appointments Made</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Appointments Kept</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Appointments Sold</h5>
            //             </div>
            //         </div>
            //     </div>

            //     <div className="bg_white total_opportunity_card">
            //         <div className="w_100 card_head_padding d_flex justify_between">
            //             <div className="d_flex align_items_center">
            //                 <span className="mr_10_px">
            //                     <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="team" width="1em" height="1em" fill="#3490ff" aria-hidden="true">
            //                         <path d="M824.2 699.9a301.55 301.55 0 0 0-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 0 1 612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 0 0 8-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 0 1 612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z">
            //                         </path>
            //                     </svg>
            //                 </span>
            //                 <h1 className="text_black fw_500 mb_0">Total Opportunities Uncovered</h1>
            //             </div>
            //             <div className="card_top_right_search">
            //                 {/* <select id="cars">
            //                     <option value="volvo">Volvo</option>
            //                     <option value="saab">Saab</option>
            //                     <option value="opel">Opel</option>
            //                     <option value="audi">Audi</option>
            //                 </select> */}
            //                  <Select
            //                     showSearch
            //                     optionFilterProp="children"
            //                     defaultValue={''} style={{ width: '100%' }} onChange={(value) => {
            //                     this.setState({ search_address: ' ' + value + ' ' }, () => {
            //                         this.state.test
            //                     })
            //                 }}></Select>
            //             </div>
            //         </div>
            //         <div className="w_100 d_flex flex_wrap bb_color">
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">2</h1>
            //                 <h5 className="mb_0 text_grey">Save for Later</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">1</h1>
            //                 <h5 className="mb_0 text_grey">No follow-Up</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">3</h1>
            //                 <h5 className="mb_0 text_grey">Sent for Internal Follow Up</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">2</h1>
            //                 <h5 className="mb_0 text_grey">Sent to Virtual Follow Up</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">3</h1>
            //                 <h5 className="mb_0 text_grey">Umbrellas Uncovered (Not Sold)</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Umbrellas Sold</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">4</h1>
            //                 <h5 className="mb_0 text_grey">Households w/P&C Sold Cross Sell Opportunities</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">4</h1>
            //                 <h5 className="mb_0 text_grey">Life Opportunities</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">3</h1>
            //                 <h5 className="mb_0 text_grey">Retirement Opportunities</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">$ 1,500,000</h1>
            //                 <h5 className="mb_0 text_grey">Total Retirement $'s Uncovered</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">$ 1,500,000</h1>
            //                 <h5 className="mb_0 text_grey">Remaining Retirement Opportunities</h5>
            //             </div>
            //         </div>
            //     </div>

            //     <div className="bg_white review_call_card">
            //         <div className="w_100 card_head_padding d_flex justify_between">
            //             <div className="d_flex align_items_center">
            //                 <span className="mr_10_px">
            //                     <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="team" width="1em" height="1em" fill="#3490ff" aria-hidden="true">
            //                         <path d="M824.2 699.9a301.55 301.55 0 0 0-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 0 1 612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 0 0 8-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 0 1 612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z">
            //                         </path>
            //                     </svg>
            //                 </span>
            //                 <h1 className="text_black fw_500 mb_0">Review Calls</h1>
            //             </div>
            //             <div>
            //                 <div className="btn_group">
            //                     <button className="active">My Calls</button>
            //                     <button>Agency Calls</button>
            //                 </div>
            //             </div>
            //         </div>
            //         <div className="w_100 d_flex flex_wrap bb_color">
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">7</h1>
            //                 <h5 className="mb_0 text_grey">Review Schedule Calls</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Not Interested</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Appointments Made</h5>
            //             </div>
            //             <div className="w_res border text_center card_box_p card_text">
            //                 <h1 className="mb_0 fw_500 text_grey">0</h1>
            //                 <h5 className="mb_0 text_grey">Appointments Kept</h5>
            //             </div>
            //         </div>
            //     </div>

            // </div>
        );
    }
}


 
export default AM;