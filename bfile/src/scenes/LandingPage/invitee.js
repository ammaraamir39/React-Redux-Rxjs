import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Dropdown,
    Menu,
    List,
    Avatar,
    Divider,
    Modal
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Masonry from 'react-masonry-component';
import './landingpage.css';
import Thumb from './images/bfile-thumb.jpg';
import Init from './init';
import Print from './parts/print';
import { Link } from "react-router-dom";
import { Translate } from 'react-translated';

const confirm = Modal.confirm;

class LandingPage extends Component {
    state = {
        loading: true,
        bfile_id: null,
        token: null,
        bfile: {},
        user: this.props.auth.user,
        notes_loading: true,
        notes: [],
        few_notes: [],
        setup_appointment_modal: false,
        show_notes_modal: false,
        transfer_bfile_modal: false,
        change_creator_modal: false,
        add_note_modal: false,
        invitation_link_modal: false,
        history: []
    }
    componentDidMount = () => {
        if (typeof this.props.match.params.token !== "undefined") {
            this.setState({ token: this.props.match.params.token }, () => this.init());
        } else {
            if (typeof this.props.match.params.bfile_id !== "undefined") {
                const bfile_id = this.props.match.params.bfile_id;
                this.setState({ bfile_id }, () => this.init());
            } else {
                this.props.history.push('/404');
            }
        }
    }
    componentDidUpdate = () => {
        if (typeof this.props.match.params.bfile_id !== "undefined") {
            const bfile_id = this.props.match.params.bfile_id;
            if (bfile_id !== this.state.bfile_id) {
                this.setState({ bfile_id }, () => this.init());
            }
        }
    }
    init = () => {
        let {bfile_id, token} = this.state;
        this.setState({ loading: true });

        let url = '/api/b_file/' + bfile_id;
        if (token) {
            url = '/api/bfile_token?q={"filters":[{"name":"token","op":"==","val":"' + token + '"}]}';
        }

        axios.get(url).then((res) => {

            if (typeof res.data.objects !== "undefined" && res.data.objects.length > 0) {
                res.data = res.data.objects[0];
            }

            bfile_id = res.data.id;

            let parent_bfile = bfile_id;
            if (res.data.parent_id) {
                parent_bfile = res.data.parent_id;
            }

            const q = {
                "filters": [
                    {
                        "or": [
                            {"name": "id", "op": "==", "val": parent_bfile},
                            {"name": "parent_id", "op": "==", "val": parent_bfile}
                        ]
                    }
                ]
            };
            axios.get("/api/b_file?q="+JSON.stringify(q)).then((res) => {
                this.setState({
                    history: res.data.objects
                });
            });

            axios.get('/api/get_bfile_notes/' + bfile_id).then((res) => {
                const few_notes = [];
                let len = res.data.length;
                if (len > 2) len = 2;
                for (var i = 0; i < len; i++) {
                    few_notes.push(res.data[i]);
                }
                this.setState({
                    notes: res.data,
                    few_notes,
                    notes_loading: false
                })
            });

            this.setState({
                bfile: res.data,
                loading: false
            }, () => {
                if (typeof this.props.match.params.action !== 'undefined') {
                    const action = this.props.match.params.action;
                    if (action === 'print') {
                        Print();
                    }
                }
            })
        });
    }
    edit = () => {
        this.props.history.push('/edit-bfile/' + this.state.token);
    }
    goTo = (path) => {
        this.props.history.push(path);
    }
    print = () => {
        Print();
    }
    render() {

        const {
            bfile,
            bfile_id,
            loading,
            notes_loading,
            notes,
            user,
            few_notes,
            show_notes_modal
        } = this.state;

        let landingPageCards = [];
        if (typeof bfile.id !== 'undefined') {
            landingPageCards = Init(bfile);
        }

        return (
            <div id="landingPage">
                <Card className="bfileInfo" type="inner" bordered={false} loading={loading} style={{marginBottom: 20}}>
                    <Row gutter={16}>
                        <Col md={24} span={24}>
                            <div className="bfile_title_contact_info">
                                <h2 className="title">
                                    {bfile.profile_photo === '' || bfile.profile_photo === null ? (
                                        <Avatar src={Thumb} style={{marginRight: 10}} />
                                    ) : (
                                        <Avatar src={bfile.profile_photo} style={{marginRight: 10}} />
                                    )}
                                    {bfile.first_name+" "+bfile.last_name}
                                </h2>
                                {bfile.spouse_first_name !== null && bfile.spouse_first_name !== '' ? (
                                    <div className="spouse_name">
                                        <Icon type="user" style={{marginRight:10}} />
                                        Spouse name: {bfile.spouse_first_name+' '+bfile.spouse_last_name}
                                    </div>
                                ) : null}
                                {bfile.email !== null && bfile.email !== '' ? (
                                    <div className="email">
                                        <Icon type="mail" style={{marginRight:10}} />
                                        <a href={'mailto:'+bfile.email}>{bfile.email}</a>
                                    </div>
                                ) : null}
                                {bfile.phone !== null && bfile.phone !== '' ? (
                                    <div className="phone">
                                        <Icon type="phone" style={{marginRight:10}} />
                                        <a href={'tel:'+F.phone_format(bfile.phone)}>{F.phone_format(bfile.phone)}</a>
                                    </div>
                                ) : null}
                                {bfile.address !== null && bfile.address !== '' || bfile.city !== null && bfile.city !== '' || bfile.state !== null && bfile.state !== '' || bfile.zipcode !== null && bfile.zipcode !== '' ? (
                                    <div className="address">
                                        <Icon type="home" style={{marginRight:10}} />
                                        {bfile.address + ', ' + bfile.city + ' ' + bfile.state + ' ' + bfile.zipcode}
                                    </div>
                                ) : null}
                                <div className="socialIcons">
                                    {bfile.facebook !== null && bfile.facebook !== '' ? (
                                        <a href={bfile.facebook} target="_blank">
                                            <Button shape="circle" icon="facebook" />
                                        </a>
                                    ) : null}

                                    {bfile.twitter !== null && bfile.twitter !== '' ? (
                                        <a href={bfile.twitter} target="_blank">
                                            <Button shape="circle" icon="twitter" />
                                        </a>
                                    ) : null}

                                    {bfile.linkedin !== null && bfile.linkedin !== '' ? (
                                        <a href={bfile.linkedin} target="_blank">
                                            <Button shape="circle" icon="linkedin" />
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                            <Button onClick={this.edit.bind(this)}><Translate text={`Edit / Update`} /></Button>
                        </Col>
                    </Row>

                </Card>

                <div className="gutter"></div>

                <Masonry
                    className={'my-gallery-class'}
                    elementType={'div'}
                    options={{gutter: 20}}
                >
                    {landingPageCards.map((card, i) => {
                        if (card.data.length > 0) {
                            return (
                                <Card key={i} title={card.title} className={"cardBlue listCard " + card.id} type="inner">
                                    <List
                                        loading={loading}
                                        itemLayout="horizontal"
                                        dataSource={card.data}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.name}
                                                    description={item.value}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            )
                        } else {
                            return null;
                        }
                    })}
                </Masonry>

            </div>
        );

    }
}

export default LandingPage;
