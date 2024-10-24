import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import {
    Layout,
    Icon,
    Tooltip,
    Row,
    Col,
    Button,
    Divider,
    Input
} from 'antd';
import './layout.css';
import DashMenu from './Menu';
import { Provider, Translate, Translator } from 'react-translated';
import translation from './lang/translation';

const { Header, Sider, Content, Footer } = Layout;

window.translate_db = translation;
window.translate_lang = "en";

class DashLayout extends Component {
    state = {
        logout: false,
        collapsed: false,
        search: '',
        showSearch: false
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
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                            <div className="logo logo-b" />
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
