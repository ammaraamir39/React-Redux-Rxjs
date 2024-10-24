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
    message,
    Select,
    Switch
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import EAProfile from './ea';
import LSPProfile from './lsp';
import DefaultProfile from './default';
import { Translate } from 'react-translated';
import AddressField from '../../components/address-field';

const Option = Select.Option;

class Profile extends Component {
    state = {
        loading: true,
        loggedin: this.props.auth.user,
        agency: {},
    }
    componentDidMount = () => {
        const { loggedin } = this.state;

        this.setState({ loading: true });

        let user_id = loggedin.id;
        axios.get("/api/users/" + user_id).then((res) => {
            let agency_id = null;
            for (let i=0; i < res.data.user_agency_assoc.length; i++) {
                agency_id = res.data.user_agency_assoc[i].agency_id;
                break;
            }

            axios.get("/api/agencies/" + agency_id).then((res) => {
                this.setState({ agency: res.data, loading: false });
            });
        });
    }
    updateField = (name, val) => {
        const { agency }  = this.state;
        agency[name] = val;
        this.setState({ agency });
    }
    update = () => {
        const { agency } = this.state;

        this.setState({ loading: true });

        axios.put('/api/agencies/' + agency.id, {
            name: agency.name,
            address: agency.address,
            facebook: agency.facebook,
            linkedin: agency.linkedin,
            twitter: agency.twitter
        }).then((res) => {
            message.success(F.translate(`Agency has been updated successfully.`));
            this.setState({ loading: false })
        });
    }
    render() {

        const { loading, agency } = this.state;
        const updateField = this.updateField;

        return (
            <div>
                <Card type="inner" title={<Translate text={`Personal Information`} />} loading={loading}>
                    <div>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Agency Name`} />:</label>
                                    <Input value={agency.name} onChange={(e) => updateField('name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Address`} />:</label>
                                    <AddressField value={agency.address}
                                        onChange={(val) => updateField('address', val)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <h2><Translate text={`Social Media`} /></h2>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Input addonBefore={<Icon type="facebook" style={{color:"#3b5999"}} />} value={agency.facebook} onChange={(e) => updateField('facebook', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Input addonBefore={<Icon type="linkedin" style={{color:"#0077B5"}} />} value={agency.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Input addonBefore={<Icon type="twitter" style={{color:"#55acee"}} />} value={agency.twitter} onChange={(e) => updateField('twitter', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.update.bind(this)}>
                            <Translate text={`Edit Agency`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default Profile;
