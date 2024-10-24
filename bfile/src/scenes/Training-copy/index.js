import React, { Component } from 'react';

import {
    Row,
    Col,
    Card,
    Icon,
    Modal,
    Button
} from 'antd';
import ReactPlayer from 'react-player';
import { Link } from "react-router-dom";
import './training.css';
import axios from 'axios';
import Logo from './images/logo.png';
import Thumb1 from './images/1-overview-b-file.png';
import Thumb2 from './images/2-RAC-calc.png';
import Thumb3 from './images/3-data-filters.png';
import Thumb4 from './images/4-B-Onboard-thumb.png';
import Thumb5 from './images/5-customer-service-product-lines.png';
import Thumb6 from './images/6-referral-gift-card.png';
import Thumb7 from './images/1.jpg';
import Thumb8 from './images/2.jpg';
import Thumb9 from './images/3.jpg';
import Thumb10 from './images/4.jpg';
import Thumb11 from './images/5.jpg';

import { Translate } from 'react-translated';

class TrainingCopy extends Component {
    
    state = {
        apiVideos :[],
        videos: [
            {
                image: Thumb1,
                title: 'Introducing The B-File System',
                description: 'Hear Jim Bologna, founder of B-File System explain how the B-File works, and what drove him to creating his process software.',
                video: 'http://s3.amazonaws.com/hpnProd/BFile/Overview%20of%20the%20B%20File%20System.mp4'
            },
            {
                image: Thumb2,
                title: 'The Scripted B-File Conversation',
                description: 'Understand how to create a B-File, and the questions to ask as you quote your new & renewal customers.',
                video: 'http://s3.amazonaws.com/hpnProd/BFile/Scripted%20B%20File%20Conversation.mp4'
            },
            {
                image: Thumb3,
                title: 'B-File Data & Filters',
                description: 'Explore the data on your dashboard, and understand the custom filters built for your agency.',
                video: 'http://s3.amazonaws.com/hpnProd/BFile/B-File%20Data%20%26%20Filters.mp4'
            },
            {
                image: Thumb4,
                title: 'B On-Board - Increasing Efficiency through a Live Virtual Employee',
                description: 'Learn about our new service “B On-Board” and understand how a Virtual Employee can help your agency.',
                video: 'http://s3.amazonaws.com/hpnProd/BFile/B%20On-Board%20-%20Increasing%20Efficiency%20through%20a%20Live%20Virtual%20Employee.mp4'
            },
            {
                image: Thumb5,
                title: 'Customer Service & Introduction Additional Product Lines',
                description: 'After the P&C sale, learn about selling addition product lines to help meet your agency goals.',
                video: 'http://s3.amazonaws.com/hpnProd/BFile/Customer%20Service%20%26%20Introduction%20Additional%20Product%20Lines.mp4'
            },
            {
                image: Thumb6,
                title: 'Referral Gift Program and Gamification',
                description: 'B-File automates the process of rewarding customers for referrals. In addition, learn how we can motivate your sales team with our gamification platform.',
                video: 'http://s3.amazonaws.com/hpnProd/BFile/Referral%20Gift%20Program%20and%20Gamification.mp4'
            },
            {
                image: Thumb8,
                title: 'Using a P&C Quote to Identify Life & Retirement Opportunities',
                description: '',
                video: 'https://www.youtube.com/watch?v=M8YEqlIEPnY'
            },
            {
                image: Thumb9,
                title: 'Cross Selling By Educating Customers on Liability Limits',
                description: '',
                video: 'https://www.youtube.com/watch?v=3i-w6VF1tQE'
            },
            {
                image: Thumb10,
                title: 'Using Policy Renewal Reviews to Increase Retention & Cross Selling',
                description: '',
                video: 'https://www.youtube.com/watch?v=1CeX2gdC0es'
            },
            {
                image: Thumb11,
                title: 'Why Multiline Agents Have a Bigger Opportunity Than Life or Retirement Advisors',
                description: '',
                video: 'https://www.youtube.com/watch?v=Fy25aqWf00s'
            },
            {
                image: Thumb7,
                title: 'Cross Selling Opportunities 15 Days After a New P&C Sale or Renewal',
                description: '',
                video: 'https://www.youtube.com/watch?v=1LMKMKjXWDc',
                drop:'sasa'
            },
        ],
        modal: false,
        current_video: {}
    }

    componentDidMount=()=>{
        axios.get('/api/training_video').then((res)=>{
            console.log(res.data)
        }).catch((e)=>{
            console.log("Error in getting video = > ",e)
        })
    }


    render() {

        const { videos, modal, current_video } = this.state;

        return (
            <div>
                <Row gutter={16} style={{marginBottom:20}}>
                    <Col span={12}>
                        <div style={{fontSize:16,color:'rgba(0, 0, 0, 0.85)'}}>Introducion</div>
                    </Col>
                    {/* <Col span={12}>
                        <div style={{fontSize:14,textAlign:'right',color: '#1890ff'}}>
                            <Link to="/">View all</Link>
                        </div>
                    </Col> */}
                </Row>

                <Row gutter={16} className="videoCards">
                    {videos.map((video, i) => (
                        <Col md={8} key={i} span={24}>
                            <Card
                                hoverable
                                onClick={() => this.setState({ modal: true, current_video: video })}
                                cover={<img alt={video.title} src={video.image} />}
                                style={{marginBottom:20}}

                                
                            >
                                <Card.Meta
                                    title={<Translate text={video.title} />}
                                    description={<Translate text={video.description} />}
                                />
                                {/* <div className="dropdown_custom" style={{position: 'absolute',top: '0',right: '0',textAlign: 'right',paddingRight: 20,paddingTop: 20}}
                                    
                                >®
                                    <div className="dropdown_menu">
                                        <ul style={{listStyleType:'none',backgroundColor:'#fff',padding:0,width:'100px'}}>
                                            <li style={{borderBottom:'1px solid grey'}}>
                                                <Link to="/" style={{fontSize:16,color:'rgba(0, 0, 0, 0.85)',textAlign: 'left',padding:5}}>Edit</Link>
                                            </li>
                                            <li>
                                                <Link to="/" style={{fontSize:16,color:'rgba(0, 0, 0, 0.85)',textAlign: 'left',padding:5}}>Delete</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div> */}
                                
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title={<Translate text={(current_video.title) ? current_video.title : ''} />}
                    visible={modal}
                    footer={null}
                    width={688}
                    onCancel={() => this.setState({ modal: false, current_video: {}})}
                >
                    <ReactPlayer
                        url={current_video.video}
                        controls={true}
                        playing
                    />
                </Modal>
            </div>
        );

    }
}

export default TrainingCopy;
