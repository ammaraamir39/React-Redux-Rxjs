import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    Input,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';

class RSAgenciesModal extends Component {
    state = {
        loading: false,
        agencies: [],
        search: ''
    }
    componentDidMount = () => {
        
    }
    render() {
        const { loading, agencies } = this.state;

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            Select Agencies
                        </div>
                    }
                    loading={loading}
                >
                    <ul>
                        {agencies.map((agency, i) => (
                            <li key={i}>
                                <input type="checkbox" />
                                {' ' + agency}
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        );

    }
}

export default RSAgenciesModal;
