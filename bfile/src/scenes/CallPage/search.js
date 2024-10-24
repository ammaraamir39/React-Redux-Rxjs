import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

class Search extends Component {
    state = {
        loading: true,
        bfiles: [],
        agency_id: '',
        user: this.props.auth.user,
    }
    componentDidMount = () => {
    	if (typeof this.props.match.params.search !== "undefined") {
        	this.loadBfiles(this.props.match.params.search);
        }
    }
    loadBfiles = (search) => {
    	const { user, agency_id } = this.state;

    	let api = '/api/search_bfile/' + search;
    	if (user.user_type === 'VONBOARDER' && agency_id !== '') {
    		api = '/api/search_bfile/' + agency_id + '/' + search;
    	}

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const bfiles = res.data;
            this.setState({
                loading: false,
                bfiles
            });
        });
    }
    render() {

        const { loading, bfiles, user } = this.state;

        let columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Created Date',
                dataIndex: 'created_on',
                key: 'created_on'
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action'
            }
        ];

        if (user.user_type === 'VONBOARDER') {
        	columns = [
	            {
	                title: 'Name',
	                dataIndex: 'name',
	                key: 'name'
	            },
              {
                  title: 'Created Date',
                  dataIndex: 'created_on',
                  key: 'created_on'
              },
	            {
	                title: 'Agency Name',
	                dataIndex: 'agency_name',
	                key: 'agency_name'
	            },
	            {
	                title: 'Status',
	                dataIndex: 'status',
	                key: 'status'
	            },
	            {
	                title: 'Phone',
	                dataIndex: 'phone',
	                key: 'phone'
	            },
	            {
	                title: 'Email',
	                dataIndex: 'email',
	                key: 'email'
	            },
	            {
	                title: '',
	                dataIndex: 'action',
	                key: 'action'
	            }
	        ];
        }

        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < bfiles.length; i++) {
            let bfile = bfiles[i];
            let stage = "";
            let today = new Date();
            if (bfile.vob_attempted == null && bfile.vob_completed == null && bfile.onboarding_user_type == "VONBOARDER") {
                stage = "Claimed";
            }
            if ((bfile.onboarding_id == null || bfile.onboarding_user_type != "VONBOARDER") && new Date(bfile.expiration_date) < today) {
                stage = "Due Calls";
            }
            if (bfile.vob_attempted == 1 && bfile.vob_completed == null && bfile.onboarding_user_type == "VONBOARDER") {
                stage = "Attempted Calls";
            }
            if ((bfile.onboarding_id == null || bfile.onboarding_user_type != "VONBOARDER") && new Date(bfile.expiration_date) >= today) {
                stage = "Upcoming Calls";
            }
            if (bfile.vob_completed == 1 && bfile.not_interested == 0 && bfile.onboarding_user_type == "VONBOARDER") {
                stage = "Completed Calls";
            }
            if (bfile.vob_completed == 1 && bfile.not_interested == 1 && bfile.onboarding_user_type == "VONBOARDER") {
                stage = "Not Reached Archived";
            }

            let bfile_name = bfile.first_name + ' ' + bfile.last_name;
            if (!bfile.last_bfile) {
                bfile_name = (
                    <div style={{paddingLeft: 20}}>{bfile.first_name + ' ' + bfile.last_name}</div>
                );
            }

            data.push({
                key: i,
                name: bfile_name,
                created_on: moment(new Date(bfile.date)).format('MM/DD/YYYY'),
                agency_name: bfile.agency_name,
                status: stage,
                phone: bfile.phone,
                email: bfile.email,
                action: (
                	<Link to={'/customer/' + bfile.id}>
                		<Button type="primary">View</Button>
                	</Link>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Translate text={`B-Files`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                </Card>
            </div>
        );

    }
}

export default Search;
