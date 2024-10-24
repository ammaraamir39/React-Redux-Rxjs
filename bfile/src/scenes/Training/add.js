import React, { Component } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
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
import Dropzone,{useDropzone} from 'react-dropzone';
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
        chars_left:500,
        total_chars:500,
        loggedin: this.props.auth.user,
        users: ['1', '2'],
        user: {},
        videoKey: '',
        thumbnailKey: '',
        uploadedVideo: false,
        uploadedThumbnail: false,
        categories: [],
        category: {
            title: 'User Category'
        },
        fileAttributes: {
            title: '',
            description: '',
            videos: [],
            videoUrl: '',
            thumbnail: []
        },
        youtubeUrlVideoUploaded: false,
        videoUploaded: false

    }
    componentDidMount = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/training_category').then((res) => {
            // console.log("categories = > ",res.data)
            this.setState({
                categories: res.data.objects,
                loading: false
            })

        }).catch((e) => {
            console.log(e)
        })

        // this.setState({ loading: true });

    }
    handleWordCount=(e)=>{
        const {fileAttributes,total_chars}= this.state
        const charCount = e.target.value.length;
        console.log("CharCount = > ",e.target.value.length)
        const charLeft = total_chars - charCount;
        this.setState({ fileAttributes: { ...fileAttributes, description: e.target.value },chars_left:charLeft })
    }

    // onDrop=(files)=>{
    //     console.log("Dropped Files => ",files)
    // }


    // save = () => {
    //     const { agency_id, game } = this.state;

    //     if (game.player_ids.length === 0) {
    //         message.error(F.translate(`Please select a least one player.`));
    //     } else if (game.name === '' || game.start_date_time === '' || game.end_date_time === '') {
    //         message.error(F.translate(`Please fill all fields.`));
    //     } else {
    //         this.setState({ loading: true });
    //         axios.post("/api/agency_game", {
    //             agency_id,
    //             name: game.name,
    //             start_date_time: moment(game.start_date_time).format('MM/DD/YYYY HH:mm a'),
    //             end_date_time: moment(game.end_date_time).format('MM/DD/YYYY HH:mm a'),
    //             trigger_one_value: game.trigger_one_value,
    //             player_ids: game.player_ids.join(",")
    //         }).then((res) => {
    //             this.setState({ loading: false });
    //             this.props.history.push("/dashboard");
    //         });
    //     }
    // }

  

    addVideo = (type) => {
        const { fileAttributes } = this.state
        let path = ''
        let mimeType = ''
        let size = ''
        let key = ''
        if (type === 1) {
            path = fileAttributes.videos[0].path
            mimeType = fileAttributes.videos[0].type
            size = fileAttributes.videos[0].size
        }
        if (type === 2) {
            path = fileAttributes.thumbnail[0].path
            mimeType = fileAttributes.thumbnail[0].type
            size = fileAttributes.thumbnail[0].size
        }

        let data = {
            file_name: path,
            content_type: mimeType,
            file_size : size
        }

        console.log("Date = > ", data)

        let promise = new Promise((resolve, reject) => {
            axios.post('/api/create_presigned_url', data).then((res) => {
                let { url, fields } = res.data.message

                console.log("Fields - > ", fields)

                type === 1 ? this.setState({ videoKey: `${url}${fields["key"]}` }) : this.setState({ thumbnailKey: `${url}${fields["key"]}` })

                let form = new FormData()


                form.append("key", fields["key"])
                form.append("acl", fields["acl"])
                form.append("x-amz-algorithm", fields["x-amz-algorithm"])
                form.append("x-amz-credential", fields["x-amz-credential"])
                form.append("x-amz-date", fields["x-amz-date"])
                form.append("x-amz-signature", fields["x-amz-signature"])
                form.append("Content-Disposition", fields["Content-Disposition"])
                form.append("Content-Type", fields["Content-Type"])
                form.append("policy", fields["policy"])
                type === 1 ? form.append("file", fileAttributes.videos[0]) : form.append("file", fileAttributes.thumbnail[0])

                // let config = {
                //     headers: {
                //         'Content-Type' : type === 1 ? `${fileAttributes.videos[0].type}`: `${fileAttributes.thumbnail[0].type}`
                //     }
                // }

                axios.post(url, form)
                    .then((res) => {
                        type === 1 ? this.setState({
                            uploadedVideo: true
                        }) : this.setState({
                            uploadedThumbnail: true
                        })
                        resolve()
                    }).catch((e) => {
                        reject()
                        console.log(e)
                    })

            }).catch((e) => {
                reject()
                console.log(e)
            })

        })
        // return 

    }

    addUrl = () => {
        const { fileAttributes, category, categories, thumbnailKey, youtubeUrlVideoUploaded } = this.state
        let cat = categories.filter(cat => cat.title == category.title)

        let data = {
            file_name: fileAttributes.thumbnail[0].path,
            content_type: fileAttributes.thumbnail[0].type,
            size : fileAttributes.thumbnail[0].size
        }
        this.setState({
            loading: true
        })
        axios.post('/api/create_presigned_url', data).then((res) => {
            let { url, fields } = res.data.message

            this.setState({
                thumbnailKey: `${url}${fields["key"]}`
            })

            let form = new FormData()

            form.append("key", fields["key"])
            form.append("acl", fields["acl"])
            form.append("x-amz-algorithm", fields["x-amz-algorithm"])
            form.append("x-amz-credential", fields["x-amz-credential"])
            form.append("x-amz-date", fields["x-amz-date"])
            form.append("x-amz-signature", fields["x-amz-signature"])
            form.append("Content-Disposition", fields["Content-Disposition"])
            form.append("Content-Type", fields["Content-Type"])
            form.append("policy", fields["policy"])
            form.append("file", fileAttributes.thumbnail[0])


            axios.post(url, form).then((res) => {
                let data = {
                    category_id: cat[0].id,
                    description: fileAttributes.description,
                    language: "english",
                    thumbnail_url: `${url}${fields["key"]}`,
                    title: fileAttributes.title,
                    url: fileAttributes.videoUrl
                }

                axios.post('/api/training_video', data).then((res) => {
                    console.log("Response after uploading to server ", res.data)
                    this.setState({
                        youtubeUrlVideoUploaded: true,
                        loading: false
                    })

                }).catch((e) => console.log(e))

            }).catch((e) => console.log(e))
        }).catch((e) => {
            console.log(e)
            this.setState({
                loading:false
            })
        })


        console.log("Data = > ", data)

    }

    save = async (e) => {
        e.preventDefault()
        const { category, fileAttributes } = this.state

        if (category.title === 'User Category' && fileAttributes.title === "" && fileAttributes.description === "" && fileAttributes.title === "") {

            message.error(F.translate(`Please fill all required fields`))
        }


        if (fileAttributes.videoUrl === '' && !fileAttributes.videos.length && !fileAttributes.thumbnail.length) {

            message.error(F.translate(`Please Input File or URL`))
        }
        if (fileAttributes.videoUrl !== '' && fileAttributes.videos.length && fileAttributes.thumbnail.length) {
            this.setState({
                fileAttributes: { ...fileAttributes, videos: [], videoUrl: '', thumbnail: [] }
            })
            message.error(F.translate(`both url and files cannot be entered`))
        }
        if (fileAttributes.videoUrl !== '' && fileAttributes.thumbnail.length > 1) {
            this.setState({
                fileAttributes: { ...fileAttributes, videos: [], videoUrl: '', thumbnail: [] }
            })
            message.error(F.translate(`Cannot enter more than 1 files`))
        }
        if (category.title !== 'User Category' && fileAttributes.title !== "" && fileAttributes.description !== "" && fileAttributes.videoUrl !== '' && !fileAttributes.videos.length && !fileAttributes.thumbnail.length) {
            this.setState({
                fileAttributes: { ...fileAttributes, videos: [], thumbnail: [] }
            })
            message.error(F.translate(`Add Thumbnail with Url`))
        }
        if (category.title !== 'User Category' && fileAttributes.title !== "" && fileAttributes.description !== "" && fileAttributes.videoUrl === '' && !fileAttributes.videos.length && fileAttributes.thumbnail.length) {
            this.setState({
                fileAttributes: { ...fileAttributes, videos: [] }
            })
            message.error(F.translate(`Add Url`))
        }
        if (category.title === 'User Category' || fileAttributes.title === '' || fileAttributes.description === '') {
            message.error(F.translate(`enter all required details`))
        }
        if (fileAttributes.videoUrl === '' && fileAttributes.videos.length > 1 && fileAttributes.thumbnail.length > 1) {
            this.setState({
                fileAttributes: { ...fileAttributes, videos: [], videoUrl: '', thumbnail: [] }
            })
            message.error(F.translate(`Cannot enter more than 1 files`))
        }
        if (category.title !== 'User Category' && fileAttributes.title !== "" && fileAttributes.description !== "" && fileAttributes.videoUrl === '' && fileAttributes.videos.length && fileAttributes.thumbnail.length && fileAttributes.videos.length === 1 && fileAttributes.thumbnail.length === 1) {
            this.setState({
                loading: true
            })
            Promise.all([this.addVideo(1), this.addVideo(2)]).then((val) => {
                console.log("Promise Completed")

            }).catch((e) => console.log(e))

        }
       
        if (fileAttributes.videoUrl !== '' && !fileAttributes.videos.length && fileAttributes.thumbnail.length === 1) {
            this.addUrl()

        }
      
      
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
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

    submit = () => {
        console.log("Submitted")
        const { videoKey, thumbnailKey, categories, category, fileAttributes } = this.state
    
        let cat = categories.filter(cat => cat.title == category.title)

        let data = {
            category_id: cat[0].id,
            description: fileAttributes.description,
            language: "english",
            thumbnail_url: thumbnailKey,
            title: fileAttributes.title,
            url: videoKey, 
        }
        console.log("Data = > ", data)
        axios.post('/api/training_video', data).then((res) => {
            console.log("Response from server", res.data)
            this.setState({
                videoUploaded: true,
                loading: false,
                videoKey: '',
                thumbnailKey: '',
                uploadedVideo: false,
                uploadedThumbnail: false,
            })

        }).catch((e) => {
            message.error(F.translate(`Video not uploaded`))
            this.setState({
                loading: false,
                fileAttributes: { ...fileAttributes, videos: [], videoUrl: '', thumbnail: [] }
            })
        })
    }

    redirect = () => {
        console.log("Inside Redirect")
        message.success(F.translate(`Video Uploaded`))
        this.setState({
            videoUploaded: false,
            youtubeUrlVideoUploaded: false,
          

            category: {
                title: 'User Category'
            },
            fileAttributes: {
                title: '',
                description: '',
                videos: [],
                videoUrl: '',
                thumbnail: []
            },
            loading: false
        })
        // const {title} = this.state.category
        // console.log("Title = > ",title)
        // if(title === 'Hoopinsure U') <Redirect to='/hoopinsure-u'/>
        // if(title === 'System Training') this.props.history.push('/training')
        // if(title === 'Hoopinsure U') this.props.history.push('/philosophy')
    }



    render() {

        const { loading, users, categories, category, videoUploaded, fileAttributes, videoKey, youtubeUrlVideoUploaded, thumbnailKey, uploadedThumbnail, uploadedVideo } = this.state;
        console.log("Categories=> ", categories)
        console.log("category =>", category)
        console.log("fileAttributes => ", fileAttributes)
        console.log("youtubevideo", youtubeUrlVideoUploaded)
        console.log("video", videoUploaded)
        console.log("VIdeo Key =>",videoKey)
        console.log("Thumbnail Key =>",thumbnailKey)
        console.log("Uploaded Thumbnail = > ",uploadedThumbnail)
        console.log("Uploaded Video = > ",uploadedVideo)

        // const updateCategory = this.updateCategory;
        // const updateField = this.updateField;

        //for vide upload
        videoKey !== '' && thumbnailKey !== '' && uploadedThumbnail && uploadedVideo && this.submit()

        youtubeUrlVideoUploaded && this.redirect()

        videoUploaded && this.redirect()
        return (
            <div>
                
                <Card type="inner" title={<Translate text={`Upload Training Content`} />} loading={loading}>
                    <div>
                    
                    
                        <Row gutter={16}>
                            <Col md={3} span={3}>
                                <div className="inputField">
                                <label><Translate text={`Category`} /> *</label>    
                                    <Select value={category.title} style={{ width: '130%' }} onChange={(val) => { this.setState({ category: { title: val } }) }}>

                                        {categories.map((cat, i) => (
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
                                    <Input value={fileAttributes.title} onChange={(e) => { this.setState({ fileAttributes: { ...fileAttributes, title: e.target.value } }) }

                                    } />
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Description`} /> *</label>
                                    <TextArea maxLength={500} value={fileAttributes.description} rows={6} onChange={(e) => { this.handleWordCount(e) }} />
                                    <p className='text-r'>{this.state.chars_left}/{this.state.total_chars}</p>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Add Video`} /></label>
                                    {/* <Input value={users.name} onChange={(e) => updateField('name', e.target.value)} /> */}
                                    <Dropzone accept={['video/mp4','video/webm','video/mpg','video/mpeg','video/flv']} onDrop={files => this.setState({fileAttributes:{...fileAttributes,videos:[...files]}})}>
                                        {({getRootProps, getInputProps}) => (
                                        <div className="container">
                                            <div className='disp-flex'>
                                                <div
                                                {...getRootProps({
                                                    className: 'dropzone',
                                                    onDrop: event => event.stopPropagation()
                                                })}
                                                >
                                                <input {...getInputProps()} />
                                                <span className='btn-drop'>Browse</span></div>
                                                <p>Video file (.mp4, .avi, .mov, .mpeg) here, click to select files</p>
                                            </div>
                                            <div className='box-bors'>
                                                <h4>File :</h4>
                                                {this.state.fileAttributes.videos && this.state.fileAttributes.videos.map(video => (
                                                <li><b>filename : </b>{video.path} <br/>  <b>Size : </b>{((video.size)/(1024*1024)).toFixed(2)} MB</li>
                                                ))}
                                            </div>
                                            </div>
                                        )}
                                      
                                    </Dropzone>
                                </div>


                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Video URL`} /></label>
                                    <Input value={fileAttributes.videoUrl} onChange={(e) => this.setState({ fileAttributes: { ...fileAttributes, videoUrl: e.target.value } })} />
                                </div>
                            </Col>
                        </Row>

                        {/* <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Add Thumbnail`} /></label>
                                    <TextArea rows={6} />
                                </div>
                            </Col>
                        </Row> */}

                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Add Thumbnail`} /> *</label>
                                    {/* <Input value={users.name} onChange={(e) => updateField('name', e.target.value)} /> */}
                                    <Dropzone accept={['image/png','image/jpg','image/jpeg']} onDrop={files => this.setState({fileAttributes:{...fileAttributes, thumbnail:[...files] }})}>
                                        {({getRootProps, getInputProps}) => (
                                        <div className="container">
                                            <div className='disp-flex'>
                                                <div
                                                {...getRootProps({
                                                    className: 'dropzone',
                                                    onDrop: event => event.stopPropagation()
                                                })}
                                                >
                                                <input {...getInputProps()} />
                                                <span className='btn-drop'>Browse</span>
                                                </div>
                                                <p>Image files (.jpg, .png) here, click to select files</p>
                                            </div>
                                            <div className='box-bors'>
                                                <h4>File :</h4>
                                                 {this.state.fileAttributes.thumbnail && this.state.fileAttributes.thumbnail.map(video => (
                                                <li><b>filename : </b>{video.path} <br/>  <b>Size : </b>{((video.size)/(1024*1024)).toFixed(2)} MB</li>
                                                
                                                ))}
                                            </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                </div>


                            </Col>
                        </Row>

                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={(e) => this.save(e)}>
                            <Translate text={`Save`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
};

export default Training;