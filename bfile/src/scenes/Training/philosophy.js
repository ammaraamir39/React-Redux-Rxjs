import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Modal,
    Button,
    message,
    Select
} from 'antd';
import { Translate } from 'react-translated';

import axios from 'axios'
import ReactPlayer from 'react-player';
import Pagination from '../../components/pagination';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import F from '../../Functions';
import './training.css';
const Option = Select.Option



class Training extends Component {
    state = {
        modal: false,
        page:1,
        total_pages:0,
        current_video: {},
        apiVideos : [],
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
        let api = `/api/training_video?page=${page}&q={"filters":[{"name":"language","op":"==","val":"english"},{"name":"category_id","op":"==","val":3}]}`
        axios.get(api).then((res)=>{
            console.log("training videos = > ",res.data)
            this.setState({
                apiVideos:res.data.objects,
                page:res.data.page,
                total_pages:res.data.total_pages
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

        const {  modal, current_video,apiVideos,page,total_pages ,user_type} = this.state;

        return (
            <div>
            
                <Row gutter={16} style={{marginBottom:20}}>
                    <Col span={12}>
                        <div style={{fontSize:22,color:'rgba(0, 0, 0, 0.85)'}}>Philosophy</div>
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
                            <p>
                                <a href="/api/saml/login" target="_blank">
                                    <Button>Launch Hoopis Performance Network</Button>
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Card> */}

                <Row gutter={16} className="videoCards videoCards-u">
                    {apiVideos.map((video, i) => (
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
                                ): (
                                    <div></div>
                                )}
                                    
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