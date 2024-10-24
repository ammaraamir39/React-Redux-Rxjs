import React, { Component } from 'react';
import './dashboard.css';

import EA from './ea';
import EACalculatorOnly from './ea-calculator-only';
import LSP from './lsp';
import EFS from './efs';
import VONBOARDER from './vonboard';
import VONBOARDADMIN from './vonboard-admin';
import REVIEWSCHEDULER from './reviewscheduler';
import REVIEWADMIN from './reviewscheduler-admin';
import MORTGAGE_BROKER from './mortgagebroker';
import RSO from './rso';
import axios from 'axios';
import { Skeleton } from 'antd';
import AM from './testRoute'

class Dashboard extends Component {
    state = {
        loading: false,
        calculator_only: false
    }
    componentDidMount = () => {
        this.props.auth.refresh();

        if (this.props.auth.user.user_type === "EA") {
            this.setState({
                loading: true
            })
            axios.get("/api/user").then((res) => {
                const user = res.data;
                this.setState({
                    loading: false
                })
                if (user.user_agency_assoc.length > 0) {
                    var agency_id = user.user_agency_assoc[0].agency_id;
                    axios.get("/api/agencies/" + agency_id).then((res) => {
                        if (res.data.calculator_only == 1) {
                            this.setState({
                                calculator_only: true
                            })
                        }
                    });
                }
            })
        }
    }
    render() {
        const { user } = this.props.auth;

        
       
        if (this.state.loading) {
            return <Skeleton active />
        }
        if (user.user_type === "EA" && user.id !== 2) {
            return <EA {...this.props} />
        }

        if (user.id === 2) {
            return <VONBOARDADMIN {...this.props} />
        }

        if (user.user_type === "EA" && !this.state.calculator_only) {
            return <EA {...this.props} />
        }

        if (user.user_type === "EA" && this.state.calculator_only) {
            return <EACalculatorOnly {...this.props} />
        }

        if (user.user_type === "EFS") {
            return <EFS {...this.props} />
        }

        if (user.user_type === "LSP") {
            return <LSP {...this.props} />
        }

        if (user.user_type === "VONBOARDER") {
            return <VONBOARDER {...this.props} />
        }
        if (user.user_type === "EA" && user.id === 2) {
            return <VONBOARDADMIN {...this.props} />
        }

        if (user.user_type === "REVIEWSCHEDULER") {
            return <REVIEWSCHEDULER {...this.props} />
        }

        if (user.user_type === "REVIEWADMIN") {
            return <REVIEWADMIN {...this.props} />
        }

        if (user.user_type === "MORTGAGE_BROKER") {
            return <MORTGAGE_BROKER {...this.props} />
        }

        if (user.user_type === "RSO") {
            return <RSO {...this.props} />
        }

        if(user.user_type === "AGENCY_MANAGER"){
            return <AM {...this.props}/>
        }

        return (
            <div>Something Wrong</div>
        );
    }
}

export default Dashboard;
