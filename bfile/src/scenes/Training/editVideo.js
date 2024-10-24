import React, { Component } from 'react';
import { Link , withRouter,Redirect } from "react-router-dom";
import PropTypes from "prop-types";
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
    message
} from 'antd';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';
import qs from 'querystring'

const Option = Select.Option;
const { TextArea } = Input;

  


class Training extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };



    state = {
        loading: false,
        agency_id: null,
        loggedin: this.props.auth.user,
        users: ['1','2'],
        user:{},
        categories:[],
        category:{
            title : 'User Category'
        },
        fileAttributes :{
            title:'',
            description:'',
            videos:[],
            videoUrl:'',
            thumbnail:[]
        },

       
    }
    componentDidMount = () => {
        
        
        console.log("link url = > ",this.props.match.params.id)
        let id= this.props.match.params.id
        this.setState({
            loading:true
        })

        axios.get('/api/training_category').then((res)=>{
            // console.log("categories = > ",res.data)
            this.setState({
                categories:res.data.objects,
                loading:false
            })
            
        }).catch((e)=>{
            console.log(e)
            this.setState({
                loading:false
            })
        })

        axios.get(`/api/training_video/${id}`).then((res)=>{
            console.log("Response-> ",res.data)
           
            this.setState({
                category:{title:res.data.category.title},
                fileAttributes:{
                    title : res.data.title,
                    description : res.data.description,
                    
                    
                }
                    
            })
        }).catch((e)=>{
            this.setState({
                loading:false
            })
        })
        // this.setState({ loading: true });
    
    }


 
    save=async(e)=>{
        e.preventDefault()
        const {fileAttributes,category:{title}} = this.state
        console.log("File Attributes = > ",fileAttributes)
       let id = this.props.match.params.id
        let data = {
            title : fileAttributes.title,
            description : fileAttributes.description
        }

        axios.put(`/api/training_video/${id}`,data).then((res)=>{
            console.log("updated Response = > ",res)
            message.success(F.translate(`Video Updated Successfully`))
             if(title === 'Hoopinsure U') this.props.history.push('/training/hoopinsure-u')
            if(title === 'System Training') this.props.history.push('/training/training')
            if(title === 'Philosophy') this.props.history.push('/training/philosophy')
        }).catch((e)=>{
            message.error(F.translate(`Cannot Update`))
            this.setState({
                loading:false
            })
        })
    }


    // updateCategory(name, value) {
    //     const { category } = this.state;
    //     console.log("Category=>",category)
    //     category[name] = value;

    //     this.setState({ category });
    // }
    updateField(name, value) {
        const { fileAttributes } = this.state;
        fileAttributes[name] = value;

        this.setState({ fileAttributes });
    }



    

    
    render() {
        // console.log("match",this.props.match.id)
        const { loading, categories,category,fileAttributes, } = this.state;
        console.log("Category => ",category)
        console.log("fileAttributes = > ",fileAttributes)
        return (
            <div>
                <Card type="inner" title={<Translate text={`Upload Training Content`} />} loading={loading}>
                    <div>
                        <Row gutter={16}>
                            <Col md={3} span={3}>
                                <div className="inputField">
                                    <Select value={category.title} disabled style={{ width: '130%' }} onChange={(val)=>{this.setState({category:{title:val}})}}>
                                        
                                        {categories.map((cat,i)=>(
                                            <Option value={cat.title} key={i}>{cat.title}</Option>    
                                        ))}
                                        {/* {[...Array(100)].map((x, i) => (
                                        <Option value={i+1} key={i}>{i}</Option>
                                    ))} */}
                                    </Select>
                                </div> 
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col md={12} span={12}>
                                <div className="inputField">
                                    <label><Translate text={`Title`} /> *</label>
                                    <Input value={fileAttributes.title} onChange={(e)=>{this.setState({fileAttributes:{...fileAttributes,title:e.target.value}})}
                                            
                                        } />
                                </div>
                            </Col>
                        </Row>
                            
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Description`} /> *</label>
                                    <TextArea value={fileAttributes.description} rows={6} onChange={(e)=>{this.setState({fileAttributes:{...fileAttributes,description:e.target.value}})}} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={(e)=>this.save(e)}>
                            <Translate text={`Save`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
};

export default Training;