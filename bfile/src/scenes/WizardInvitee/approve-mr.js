import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    message,
    Spin
} from 'antd';
import axios from 'axios';
import moment from 'moment';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ApproveMR extends Component {
    state = {
        loading: false,
        bfile_id: '',
        success: false
    }
    componentDidMount = () => {
        if (typeof this.props.match.params.token !== "undefined") {
            this.setState({ loading: true })
            axios.get('/api/bfile_token?q={"filters":[{"name":"token","op":"==","val":"' + this.props.match.params.token + '"}]}').then((res) => {
                if (res.data.objects.length > 0) {
                    const bfile_id = res.data.objects[0].id;
                    axios.put("/api/bfile_token/" + bfile_id, {
                        mortgage_review_approved: 1
                    }).then((res) => {
                        this.setState({ loading: false, success: true })
                    }).catch(() => {
                        this.setState({ loading: false })
                        message.error("Can't update B-File.");
                        this.props.history.push('/dashboard');
                    })
                } else {
                    this.setState({ loading: false })
                    message.error("Token is invalid.");
                    this.props.history.push('/dashboard');
                }
            })
        } else {
            message.error("Token is invalid.");
            this.props.history.push('/dashboard');
        }
    }
    render() {

        const { loading } = this.state;
        return (
            <div style={{textAlign: "center"}}>
                <Spin indicator={antIcon} spinning={loading} />
                {this.state.success ? (
                    <div className="simplePage">
                        <h2 className="pageTitle">APPROVED!</h2>
                        <p className="pageContent">You approved interest in a no obligation mortgage review. A Financial team member will contact you soon.</p>
                    </div>
                ) : null}
            </div>
        );

    }
}

export default ApproveMR;
