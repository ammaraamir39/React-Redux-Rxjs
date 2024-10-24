import React, { Component } from 'react';
import {
    Col,
    Divider
} from 'antd';
import registerLogo from '../logo.png';

class Sidebar extends Component {
    render() {
        return (
            <Col md={8} span={24} className="sidebar">
                <div className="register-form-header">
                    <img src={registerLogo} alt="B-File" />
                </div>
                <div className="sidebar-content">
                    <h3>UNCOVER MORE:</h3>
                    <ul className="checkList">
                        <li>Personal Umbrella Opportunities</li>
                        <li>Life Insurance Opportunities</li>
                        <li>Cross-Sell Opportunities</li>
                        <li>Retirement Opportunities</li>
                    </ul>
                    <Divider />
                    <h3>Every Agency</h3>
                    <ul className="bulletList">
                        {/* <li>30 in 30 money-back guarantee</li> */}
                        <li>Live Training</li>
                        <li>Unlimited Users</li>
                    </ul>
                </div>
            </Col>
        );
    }
}

export default Sidebar;
