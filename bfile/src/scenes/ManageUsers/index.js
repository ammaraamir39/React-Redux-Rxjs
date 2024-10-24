import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message,
    Checkbox
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import AssignUsersModal from './parts/assign-users-modal';
import UnlinkUserModal from './parts/unlink-user-modal';
import DeleteRSUserModal from './parts/delete-rs-user-modal';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';
import Cookies from 'js-cookie';

class ManageUsers extends Component {
    state = {
        loading: true,
        users: [],
        unlink_user_modal: false,
        loggedin: this.props.auth.user,
        user: {},
        page: 1,
        total_pages: 0,
        delete_rs_user_modal: false,
        assign_users_modal: false,
        updatedUser: {}
    }
    componentDidMount = () => {
        this.loadUsers(1);
    }
    switchUser = (user) => {
        this.setState({ loading: true });
        axios.post("/api/switchuser/" + user.id).then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                const user = res.data.user;
                Cookies.set("user_info", JSON.stringify({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    id: user.id,
                    user_type: user.user_type,
                    default_date: user.default_date,
                    last_login: user.last_login,
                    language: user.language
                }));
                this.props.history.push('/dashboard');
            } else {
                message.error(F.translate(`Can't switch to the user.`));
            }
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't switch to the user.`));
        });
    }
    loadUsers = (page) => {
        const users_list = [];
        const api = "/api/associations?page=" + page + '&q={"filters":[{"name":"child","op":"has","val":{"name":"active","op":"==","val":true}}]}';

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const users = res.data.objects;
            console.log("User ->", users)
            if (users.length > 0) {
                const users_id = [];
                for (let i = 0; i < users.length; i++) {
                    const u = users[i].child;
                    u.association_id = users[i].id;
                    u.user_type2 = u.user_type;
                    if (u.user_type === "MORTGAGE_BROKER") {
                        u.user_type2 = "Mortgage Broker";
                    }
                    if (u.jobs && typeof u.jobs !== "undefined" && u.user_type === "LSP") {
                        var jobs = JSON.parse(u.jobs);
                        if (typeof jobs.onboarding !== "undefined" && typeof jobs.life_licensed !== "undefined") {
                            if (jobs.onboarding && jobs.life_licensed) {
                                u.user_type2 = u.user_type2 + " (Onboarding & Life Licensed)";
                            } else if (jobs.onboarding) {
                                u.user_type2 = u.user_type2 + " (Onboarding)";
                            } else if (jobs.life_licensed) {
                                u.user_type2 = u.user_type2 + " (Life Licensed)";
                            }
                        }
                    }
                    users_list.push(u);
                }
            }
            this.setState({
                loading: false,
                users: users_list,
                page: res.data.page,
                total_pages: res.data.total_pages
            });
        });
    }

    updateHiddenStatus = (id, e, status, page) => {

        e.preventDefault()
        // console.log("Id => ",id)
        let api = "/api/users"
        let data = {
            'hidden': status
        }
        axios.put(`${api}/${id}`, data).then((res) => {
            console.log(res.data)
            this.setState({
                updatedUser: res.data,

            })

            window.location.reload()
        })

        // this.loadUsers(page)


    }

    render() {

        const { loading, users, page, total_pages } = this.state;

        const columns = [
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name'
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'User Type',
                dataIndex: 'user_type',
                key: 'user_type'
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            console.log("User = >", user.hidden)

            data.push({
                key: i,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_type: user.user_type2,
                action: (
                    <div className="right-align">

                        {/* {
                            user.hidden
                        }
                        <Checkbox checked={this.state.hidden} onChange={(e) => this.setState({ hidden: e.target.checked })}>
                            <Translate text={`Hide`} />
                        </Checkbox>
                     */}
                        {user.hidden ? (
                            <Button  style={{marginRight:10}} onClick={(e)=>this.updateHiddenStatus(user.id,e,false,page)}> <Translate text={`UnHide User`} /></Button>    
                        ): ( 
                            <Button style={{marginRight:10, display:'none'}} onClick={(e)=>this.updateHiddenStatus(user.id,e,true,page)}> <Translate text={`Hide User`} /></Button>    
                        )}

                        <Link to={'/manage-users/edit-user/' + user.id}>
                            <Button><Icon type="edit" /> <Translate text={`Edit User`} /></Button>
                        </Link>
                        {user.user_type === "MORTGAGE_BROKER" ? (
                            <Button style={{ marginLeft: 10 }} onClick={() => {
                                this.setState({ user, assign_users_modal: true })
                            }}>
                                <Icon type="plus" /> <Translate text={`Assign Users`} />
                            </Button>
                        ) : null}
                        {user.user_type !== 'REVIEWSCHEDULER' ? (
                            <Button style={{ marginLeft: 10 }} type="danger" ghost onClick={() => {
                                this.setState({ user, unlink_user_modal: true })
                            }}>
                                <Icon type="minus" />
                                {user.user_type === 'LSP' ? (
                                    <span><Translate text={`Disable User`} /></span>
                                ) : (
                                    <span><Translate text={`Unlink User`} /></span>
                                )}
                            </Button>
                        ) : null}
                        {this.state.loggedin.user_type === "REVIEWADMIN" ? (
                            <Button style={{ marginLeft: 10 }} onClick={() => this.setState({
                                user,
                                delete_rs_user_modal: true
                            })}><Icon type="edit" /> <Translate text={`Transfer B-Files`} /></Button>
                        ) : null}
                        {this.state.loggedin.user_type === "REVIEWADMIN" ? (
                            <Button style={{ marginLeft: 10 }} onClick={() => this.switchUser(user)}><Icon type="sync" /> <Translate text={`Switch to Review Scheduler`} /></Button>
                        ) : null}
                    </div>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{ paddingTop: 7 }}>
                            <Icon type="team" style={{ marginRight: 10, color: "#1890ff" }} />
                            <Translate text={`Users`} />
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
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadUsers(page);
                    }} />
                </Card>
                <UnlinkUserModal
                    history={this.props.history}
                    showModal={this.state.unlink_user_modal}
                    hideModal={() => this.setState({ unlink_user_modal: false })}
                    user={this.state.user}
                    refresh={() => this.loadUsers(1)}
                />
                {this.state.delete_rs_user_modal ? (
                    <DeleteRSUserModal
                        history={this.props.history}
                        showModal={this.state.delete_rs_user_modal}
                        hideModal={() => this.setState({ delete_rs_user_modal: false })}
                        user={this.state.user}
                        refresh={() => this.loadUsers(1)}
                    />
                ) : null}
                {this.state.assign_users_modal ? (
                    <AssignUsersModal
                        history={this.props.history}
                        showModal={this.state.assign_users_modal}
                        hideModal={() => this.setState({ assign_users_modal: false })}
                        user={this.state.user}
                        refresh={() => this.loadUsers(1)}
                    />
                ) : null}
            </div>
        );

    }
}

export default ManageUsers;
