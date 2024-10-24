import React, { Component } from 'react';
import {
    Icon,
    Modal,
    Button,
} from 'antd';
import { Translate } from 'react-translated';

class CustomerExist extends Component {
    render() {
        return (
            <div style={{marginBottom: 20}}>
                <Modal
                    title={<Translate text={`Confirmation`} />}
                    visible={this.props.showModal}
                    onOk={this.props.ok}
                    onCancel={this.props.cancel}
                    okText={<Translate text={`Yes`} />}
                    cancelText={<Translate text={`No`} />}
                >
                    <div id="customer_exist_modal">
                        <p>
                            It looks like a profile already exists on this customer. Would you still like to create new?
                        </p>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default CustomerExist;
