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
import Logo from './images/logo.png';
import Thumb1 from './images/hoopinsure-u/developing-referral-cates.jpg';
import Thumb2 from './images/hoopinsure-u/overcoming-fear-forrester.jpg';
import Thumb3 from './images/hoopinsure-u/social-intelligence-badgley.jpg';
import Thumb4 from './images/hoopinsure-u/active-listening-davenport.jpg';
import Thumb5 from './images/hoopinsure-u/making-connections-kuzmeski.jpg';
import Thumb6 from './images/hoopinsure-u/factfinding-life-davenport.jpg';
import Thumb7 from './images/hoopinsure-u/determining-life-davenport.jpg';
import Thumb8 from './images/hoopinsure-u/courageous-conversations-blaufus.jpg';
import Thumb9 from './images/hoopinsure-u/one-problem-jordan.jpg';
import Thumb10 from './images/hoopinsure-u/formula-success-hoopis.jpg';
import Thumb11 from './images/hoopinsure-u/five-disciplines-moran.jpg';

import TroyThumb1 from './images/hoopinsure-u/troy/1.jpg';
import TroyThumb2 from './images/hoopinsure-u/troy/2.jpg';
import TroyThumb3 from './images/hoopinsure-u/troy/3.jpg';
import TroyThumb4 from './images/hoopinsure-u/troy/4.jpg';
import TroyThumb5 from './images/hoopinsure-u/troy/5.jpg';
import TroyThumb6 from './images/hoopinsure-u/troy/6.jpg';
import TroyThumb7 from './images/hoopinsure-u/troy/7.jpg';
import TroyThumb8 from './images/hoopinsure-u/troy/8.jpg';
import TroyThumb9 from './images/hoopinsure-u/troy/9.jpg';
import TroyThumb10 from './images/hoopinsure-u/troy/10.jpg';

import { Translate } from 'react-translated';

class Training extends Component {
    state = {
        videos: [
            {
                image: Thumb1,
                title: 'Developing a Referral Mindset – Bill Cates',
                description: 'This segment features Bill Cates of Referral Coach International sharing his thoughts on what it means to have a referral mindset. He discusses the characteristics of a referral mindset and why these paradigms cause you to generate more favorable introductions. Bill’s insights will help you to overcome your limiting beliefs around referrals and embrace a mindset where referrals simply become a part of your everyday practice.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/developing-referral-cates.mp4'
            },
            {
                image: Thumb2,
                title: 'Overcoming the Fear of Prospecting – Katherine Forrester',
                description: 'Top producer and Wealth Management Advisor Katherine Forrester, CLU, ChFC, shares her experiences and the evolution of her prospecting processes that have lead her to her success today. Introspection has helped her to identify approaches that allow her to remove fear as an objection when prospecting with clients. She emphasizes the benefits of practices such as working closely with a coach, utilizing social media resources and reaffirming her mission. The practices mentioned in this video will help you to gain the confidence to overcome your fear of prospecting.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/overcoming-fear-forrester.mp4'
            },
            {
                image: Thumb3,
                title: 'Social Intelligence & the Art of Connecting – Don Badgley',
                description: 'How would your practice change if you shifted the focus from yourself to your client? In this module, top producer Don Badgley gets to the heart of success in this career - connecting with others. He introduces the idea that connecting is A.R.T - Attitude, Relationships, and Trust. To be truly successful, Badgley claims, you must shift your mindset from being a salesperson to being a counselor - the objective is not to prove you are the best and the brightest in your field, it\'s to work with the client to develop a plan that will work for them. If you care about your clients, you will be better equipped to listen and provide them with the best possible solution, making failure a thing of the past.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/social-intelligence-badgley.mp4'
            },
            {
                image: Thumb4,
                title: 'Active Listening Skills – Joey Davenport',
                description: 'Listening is a fundamental building block in making a connection with your prospects and clients. In this segment, Joey Davenport shares insights on how to improve your active listening skills. He discusses the benefits of active listening, as well as characteristics of good vs. poor listeners. He also shares best practices of those who have mastered the skill of active listening.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/active-listening-davenport.mp4'
            },
            {
                image: Thumb5,
                title: 'Making Connections through Questions – Maribeth Kuzmeski',
                description: 'As a financial representative, one of the ways you can differentiate yourself from other advisors is through the questions you ask during the factfinder. This segment features branding expert Maribeth Kuzmeski sharing powerful questions her top advisor clients utilize to differentiate themselves while identifying what is most important to the prospect. These questions will immediately improve the quality of your conversations with prospects and clients.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/making-connections-kuzmeski.mp4'
            },
            {
                image: Thumb6,
                title: 'Factfinding for Life Insurance – Joey Davenport',
                description: 'During this segment, Joey discusses the various steps to follow when factfinding for life insurance. He provides a proven process to determine the prospect\'s thoughts on life insurance as well as their current program. Joey also shares language to help you determine the life insurance need through a capital needs analysis. Most importantly, he focuses on how to create buy-in and ownership so you and the prospect are on the same page in regards to the life insurance need.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/factfinding-life-davenport.mp4'
            },
            {
                image: Thumb7,
                title: 'Factfinding: Determining the Life Insurance Need – Joey Davenport',
                description: 'In this session, Joey Davenport shares an approach used by top producers to identify the life insurance need during the factfinder. Joey shares insights and power phrases that will help you to position life insurance more effectively. He will teach you how to conduct a capital needs analysis during that meeting while creating buy-in and ownership from the prospect.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/determining-life-davenport.mp4'
            },
            {
                image: Thumb8,
                title: 'Three Reasons to Buy Life Insurance in Today’s Market – Tom Hegna',
                description: 'This video features author and retirement expert Tom Hegna summarizing an article he wrote for the American College on the value of life insurance in today\'s market. He identifies three simple reasons to buy life insurance and offers strategies to communicate these reasons to your clients. Life insurance is a women\'s issue, a tax issue, and a wealth-transfer issue. He explains how this is the best way to improve the quality of life of your beneficiaries and to ensure your wealth is passed on in the way you intend it.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/three-reasons-hegna.mp4'
            },
            {
                image: Thumb9,
                title: 'The #1 Problem that No One Talks About – Joe Jordan',
                description: 'During this segment, industry icon Joe Jordan discusses the importance of elevating yourself from motivation to inspiration. With so much negativity and rejection in the business, motivation alone is not enough to sustain you. Inspiration is comprised of your purpose and making a commitment to your purpose. Joe shares ideas and insights on how to become inspired and how to connect your daily commitment to your purpose.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/one-problem-jordan.mp4'
            },
            {
                image: Thumb10,
                title: 'DAD: My Formula for Success – Harry Hoopis',
                description: 'In this excerpt from the LAMP main platform, industry icon Harry Hoopis describes the formula he lived by and taught his reps to live by as well: a burning Desire to achieve more, an unflappable Attitude, and finally the self-Discipline to put the necessary systems, structure and routine in place. Hear about "move toward" and "move away" goals appropriate measures of progress and how the right combination of these things can get you to "The Bountiful Life."',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/formula-success-hoopis.mp4'
            },
            {
                image: Thumb11,
                title: 'Five Disciplines of Execution and High Performance – Brian Moran',
                description: 'Brian Moran, author of the best-selling book The 12 Week Year, is the foremost expert in the financial services industry on the topic of executing. In this video, Brian outlines the five disciplines of execution and high performance consistent among top producers. He share his insights and thoughts on the five disciplines: Vision-Planning-Process Control- Scorekeeping-Time Use.',
                video: 'http://s3.amazonaws.com/hpnProd/speaker/bFile/five-disciplines-moran.mp4'
            },
            {
                image: TroyThumb1,
                title: 'The Importance of Doubling Down on Relationships in Multiline',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%201.mp4'
            },
            {
                image: TroyThumb2,
                title: 'Becoming the Gateway for Service & Advice for Your Clients',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%202.mp4'
            },
            {
                image: TroyThumb3,
                title: 'The Model Change of the Property & Casualty Business',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%202-2.mp4'
            },
            {
                image: TroyThumb4,
                title: 'Introduction to the Review & Marketing Matrix',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%203.mp4'
            },
            {
                image: TroyThumb5,
                title: 'Overcoming Obstacles to Get the Appointment',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%203-2.mp4'
            },
            {
                image: TroyThumb6,
                title: 'Systematizing the Review for Better Consistency Among Your Team',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%204.mp4'
            },
            {
                image: TroyThumb7,
                title: 'Breaking Down the Review Process Step by Step for Multiline Sales',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%205.mp4'
            },
            {
                image: TroyThumb8,
                title: 'Troy Korsgaden 7 The Importance of Follow Up and the Customer Experience',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%207.mp4'
            },
            {
                image: TroyThumb9,
                title: 'Troy Korsgaden 9 The Set-Up: Making the Review Impactful for Your Clients',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%209.mp4'
            },
            {
                image: TroyThumb10,
                title: 'Troy Korsgaden 10 Don’t be Replaced: Building Relationships in Multiline Sales',
                description: '',
                video: 'https://s3.amazonaws.com/hpnProd/Troy%20Korsgaden/updated/Troy%2010.mp4'
            },
            
        ],
        modal: false,
        current_video: {}
    }
    render() {

        const { videos, modal, current_video } = this.state;

        return (
            <div>
                <div style={{textAlign:'right', marginBottom:20}}>
                    <Link to={"/training/spanish"}>
                        <Button>Spanish</Button>
                    </Link>
                </div>
                <Card style={{marginBottom:20}}>
                    <Row gutter={16}>
                        <Col md={8} span={24}>
                            <div className="hoopis_logo">
                                <img alt="Hoopis Performance Training" src={Logo} />
                            </div>
                        </Col>
                        <Col md={16} span={24}>
                            <p><Translate text={`Hoopis, the Leading provider of sales training & leadership solutions in financial services has teamed up with B-File to provide the best tools and resources for the entire life cycle of a financial professional's career.`} /></p>
                            <p>
                                <a href="/api/saml/login" target="_blank">
                                    <Button>Launch Hoopis Performance Network</Button>
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Card>

                <Row gutter={16} className="videoCards videoCards-u">
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
                                    style={(video.description === '') ? {
                                        height: 50
                                    } : null}
                                />
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

export default Training;
