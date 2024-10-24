import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Modal,
    message,
    Button,
    Select
} from 'antd';
import ReactPlayer from 'react-player';
import { Link } from "react-router-dom";
import Pagination from '../../components/pagination'
import Cookies from 'js-cookie'
import F from '../../Functions';
import './training.css';
import { Translate } from 'react-translated';
import axios from 'axios';

const Option = Select.Option

class Training extends Component {
    state = {
        apiVideos :[],
        page:1,
        total_pages: 0,
        // videos: [
        //     {
        //         image: Thumb1,
        //         title: 'Introducing The B-File System',
        //         description: 'Hear Jim Bologna, founder of B-File System explain how the B-File works, and what drove him to creating his process software.',
        //         video: 'http://s3.amazonaws.com/hpnProd/BFile/Overview%20of%20the%20B%20File%20System.mp4'
        //     },
        //     {
        //         image: Thumb2,
        //         title: 'The Scripted B-File Conversation',
        //         description: 'Understand how to create a B-File, and the questions to ask as you quote your new & renewal customers.',
        //         video: 'http://s3.amazonaws.com/hpnProd/BFile/Scripted%20B%20File%20Conversation.mp4'
        //     },
        //     {
        //         image: Thumb3,
        //         title: 'B-File Data & Filters',
        //         description: 'Explore the data on your dashboard, and understand the custom filters built for your agency.',
        //         video: 'http://s3.amazonaws.com/hpnProd/BFile/B-File%20Data%20%26%20Filters.mp4'
        //     },
        //     {
        //         image: Thumb4,
        //         title: 'B On-Board - Increasing Efficiency through a Live Virtual Employee',
        //         description: 'Learn about our new service “B On-Board” and understand how a Virtual Employee can help your agency.',
        //         video: 'http://s3.amazonaws.com/hpnProd/BFile/B%20On-Board%20-%20Increasing%20Efficiency%20through%20a%20Live%20Virtual%20Employee.mp4'
        //     },
        //     {
        //         image: Thumb5,
        //         title: 'Customer Service & Introduction Additional Product Lines',
        //         description: 'After the P&C sale, learn about selling addition product lines to help meet your agency goals.',
        //         video: 'http://s3.amazonaws.com/hpnProd/BFile/Customer%20Service%20%26%20Introduction%20Additional%20Product%20Lines.mp4'
        //     },
        //     {
        //         image: Thumb6,
        //         title: 'Referral Gift Program and Gamification',
        //         description: 'B-File automates the process of rewarding customers for referrals. In addition, learn how we can motivate your sales team with our gamification platform.',
        //         video: 'http://s3.amazonaws.com/hpnProd/BFile/Referral%20Gift%20Program%20and%20Gamification.mp4'
        //     },
        //     {
        //         image: Thumb8,
        //         title: 'Using a P&C Quote to Identify Life & Retirement Opportunities',
        //         description: '',
        //         video: 'https://www.youtube.com/watch?v=M8YEqlIEPnY'
        //     },
        //     {
        //         image: Thumb9,
        //         title: 'Cross Selling By Educating Customers on Liability Limits',
        //         description: '',
        //         video: 'https://www.youtube.com/watch?v=3i-w6VF1tQE'
        //     },
        //     {
        //         image: Thumb10,
        //         title: 'Using Policy Renewal Reviews to Increase Retention & Cross Selling',
        //         description: '',
        //         video: 'https://www.youtube.com/watch?v=1CeX2gdC0es'
        //     },
        //     {
        //         image: Thumb11,
        //         title: 'Why Multiline Agents Have a Bigger Opportunity Than Life or Retirement Advisors',
        //         description: '',
        //         video: 'https://www.youtube.com/watch?v=Fy25aqWf00s'
        //     },
        //     {
        //         image: Thumb7,
        //         title: 'Cross Selling Opportunities 15 Days After a New P&C Sale or Renewal',
        //         description: '',
        //         video: 'https://www.youtube.com/watch?v=1LMKMKjXWDc'
        //     },
        // ],
        modal: false,
        current_video: {},
        user_type : ''
    }


    componentDidMount=()=>{
        let user_type = JSON.parse(Cookies.get('user_info')).user_type
        console.log("User type = > ",user_type)
        this.setState({
            user_type
        })
      this.loadVideos(1)
    }


    loadVideos=(page)=>{
        let api = `/api/training_video?page=${page}&q={"filters":[{"name":"language","op":"==","val":"english"},{"name":"category_id","op":"==","val":2}]}`
        axios.get(api).then((res)=>{
            console.log("training videos = > ",res.data)
            this.setState({
                apiVideos:res.data.objects,
                page:res.data.page,
                total_pages: res.data.total_pages
            })
        }).catch((error)=>{
            console.log("error in getting videos = > ",error)
        })
    }


    toggleEditDropDown=(i)=>{
        const {toggleEditDropDown,apiVideos} = this.state
        // console.log("event = > ",event)
        // event.stopImmediatePropagation()
        // event.stopPropagation()
        if(!apiVideos[i].isCheck){
            const newApiVideo = [...apiVideos];
            newApiVideo[i]["isCheck"] = true;
            this.setState({
                apiVideos: newApiVideo
            })

        }else if(apiVideos[i].isCheck){
            const newApiVideo = [...apiVideos]
            newApiVideo[i]["isCheck"] = false
            this.setState({
                apiVideos : newApiVideo
            })
        }

    }

    deleteVideo=(video,page)=>{
        console.log("delete Video => ",video)
        let data = {
            active:0
        }
        axios.put(`/api/training_video/${video.id}`,data).then((res)=>{
            console.log("response = > ",res.data)
            message.success(F.translate(`Video Deleted`))
            this.loadVideos(page)
        }).catch((e)=>{
            message.error(F.translate(`Unable to delete video`))
        })
    }

    editVideo = (video)=>{
        console.log("Video = > ",video) 
        // let link = `/video/${video.id}`
        this.props.history.push(`/edit-video/${video.id}`)
    }

    render() {

        const { videos, modal, current_video,apiVideos ,page,total_pages,user_type} = this.state;
        
        return (    
            <div class="hei-wrap">
            
                <Row gutter={16} style={{marginBottom:20}}>
                    <Col span={12}>
                        <div style={{fontSize:22,color:'rgba(0, 0, 0, 0.85)'}}>System Training</div>
                    </Col>
                    {/* <Col span={12}>
                        <div style={{fontSize:14,textAlign:'right',color: '#1890ff'}}>
                            <Link to="/">View all</Link>
                        </div>
                    </Col> */}
                </Row>
                {/* <Card style={{marginBottom:20}}>
                    <Row gutter={16}>
                        <Col md={8} span={24}>
                            <div className="hoopis_logo">
                                <img alt="Hoopis Performance Training" src={Logo} />
                            </div>
                        </Col>
                        <Col md={16} span={24}>
                            <p><Translate text={`Hoopis, the Leading provider of sales training & leadership solutions in financial services has teamed up with B-File to provide the best tools and resources for the entire life cycle of a financial professional's career.`} /></p>
                        </Col>
                    </Row>
                </Card> */}

                <Row gutter={16} className="videoCards hei-lenght">
                    {apiVideos.map((video, i) => {
                        console.log("video = >",video)
                        return(
                        <Col md={8} key={i} span={24}>
                            <Card
                                hoverable
                                onClick={() => this.setState({ modal: true, current_video: video })}
                                cover={<img alt={video.title} src={video.thumbnail_url} />}
                                style={{marginBottom:20}}
                            >
                                {user_type === 'SUPER_ADMIN' ? (
                                     <div className="navbar">
                                      <button className="btn_cust_style"  onClick={(event)=>{event.stopPropagation();this.toggleEditDropDown(i)}}> 
                                                        <Select  className="custom_dropdown">
                                                            <Option value={'Edit'} onClick={()=>{this.editVideo(video)}}  id="check" unselectable="of">Edit</Option>
                                                            <Option value={'Delete'} onClick={()=>{this.deleteVideo(video,page)}} id="check" unselectable="of">Delete</Option>
                                                        </Select>
                                                    
                                                    </button>
                                 </div>
                                ):(
                                    <div></div>
                                )}
                               
                                <Card.Meta
                                    title={<Translate text={video.title} />}
                                    description={<Translate text={video.description} />}
                                />
                            </Card>
                        </Col>
                    )})}
                </Row>
                {
                    apiVideos.length ? (

                <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                    this.loadVideos(page);
                }} />
                    ) : (
                        <div></div>
                    )
                }
                <Modal
                    title={<Translate text={(current_video.title) ? current_video.title : ''} />}
                    visible={modal}
                    footer={null}
                    width={688}
                    onCancel={() => this.setState({ modal: false, current_video: {}})}
                >
                    <ReactPlayer
                        url={current_video.url}
                        controls={true}
                        playing
                    />
                </Modal>
            </div>
        );

    }
}

export default Training;
