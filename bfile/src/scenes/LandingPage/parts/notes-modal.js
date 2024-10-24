import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Card,
    Modal,
    Radio,
    Button,
    List
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    render() {

        const { notes, notes_loading } = this.props;

        return (
            <Modal
                title={<Translate text={`Notes`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={null}
            >
                <div className="formBox">
                    <List
                        loading={notes_loading}
                        itemLayout="horizontal"
                        dataSource={notes}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.user_name}
                                    description={item.note}
                                />
                                <div>
                                    <Icon type="clock-circle-o" style={{marginRight: 10}} />
                                    {moment(item.created_on).format('MM/DD/YYYY hh:mmA')}
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>
        )
    }
}

export default DashModal;
