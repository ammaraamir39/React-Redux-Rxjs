import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import {
    Layout,
    Icon,
    Tooltip,
    Row,
    Dropdown,
    Col,
    Button,
    Divider,
    Input
} from 'antd';
import './layout.css';
import DashMenu from './Menu';
import { Provider, Translate, Translator } from 'react-translated';
import translation from './lang/translation';
import Notificationbell from './components/notificationbell';
import axios from 'axios'

const { Header, Sider, Content, Footer } = Layout;

window.translate_db = translation;
window.translate_lang = "en";

class DashLayout extends Component {
    state = {
        logout: false,
        collapsed: false,
        search: '',
        showSearch: false,
    
    }

   

    logout = () => {
        this.props.logout((result) => {
            if (result.success) {
                this.setState({
                    logout: true
                })
            }
        })
    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    handleClick = (e) => {
        this.setState({
            selected_key: e.keyPath
        })
    }
    goTo = (path) => {
        this.props.history.push(path);
    }
    updateLang = (lang) => {
        this.setState({ lang })
    }
    search = () => {
        this.setState({
            showSearch: false
        }, () => {
            if (this.state.search !== '') {
                this.props.history.push('/search/' + this.state.search);
            }
        })
    }
    render() {

        const { logout, lang } = this.state;
        let user = this.props.auth.user;
        if (logout) {
            return <Redirect to={"/login"} />;
        }

        const selected_key = this.props.menu;
        const component = this.props.component;

        if (typeof user.language !== "undefined") {
            if (user.language === null || user.language === "") {
                user.language = "en";
            }
        } else {
            user.language = "en";
        }

        window.translate_lang = user.language;

        return (
            <Provider language={user.language} translation={translation}>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        breakpoint="lg"
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                    >
                        <div className="logo" />
                        <DashMenu
                            handleClick={this.handleClick}
                            selected_key={selected_key}
                            goTo={this.goTo}
                            user={user}
                        />
                    </Sider>
                    <Layout>
                        {!this.state.collapsed ? (
                            <div id="menu-overlay" onClick={() => this.setState({ collapsed: !this.state.collapsed })}></div>
                        ) : null}
                        <Header style={{ background: '#fff', padding: 0 }}>
                            <Row gutter={16}>
                                <Col xs={12} span={8}>
                                    <Button id="mobile-menu-icon" onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
                                        <Icon type="menu-unfold" />
                                    </Button>
                                    <Button id="search-icon" onClick={() => this.setState({ showSearch: true })}>
                                        <Icon type="search" />
                                    </Button>
                                    <div className={(this.state.showSearch) ? "searchForm show" : "searchForm"}>
                                        <Button onClick={() => this.setState({ showSearch: false })}>
                                            <Icon type="close" />
                                        </Button>
                                        <Translator>
                                            {({ translate }) => (
                                                <Input prefix={<Icon type="search" />} placeholder={translate({text: `Search`})+'...'} style={{width: '100%'}} onChange={(e) => this.setState({ search:  e.target.value })} onPressEnter={this.search.bind(this)} />
                                            )}
                                        </Translator>
                                    </div>
                                </Col>
                                <Col xs={12} span={16}>
                                    <div className="right">
                                        {user.user_type === 'EA' || user.user_type === 'LSP' ? (
                                            <span className="create_bfile_btn">
                                                <Link to={'/wizard?new'}>
                                                    <Icon type="plus" style={{marginRight: 10}} />
                                                    Create B-File
                                                </Link>
                                                <Divider type="vertical" style={{marginLeft: 20, marginRight: 20}} />
                                            </span>
                                        ) : null}
                                        <span className="username"><Translate text={`Welcome`} /> {user.first_name}</span>
                                        <Notificationbell />
                                        <Tooltip placement="bottom" title={<Translate text={`Logout`} />}>
                                            <a className="i logout" onClick={this.logout}>
                                                <Icon type="logout" />
                                            </a>
                                        </Tooltip>
                                    </div>
                                </Col>
                            </Row>
                        </Header>
                        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                            {component}
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            © 2021 PersistEplan Software, LLC - B-File is a registered trade mark of PersistEplan Software, LLC (patent pending)
                        </Footer>
                    </Layout>
                </Layout>
            </Provider>
        )

    }
}

export default DashLayout;
