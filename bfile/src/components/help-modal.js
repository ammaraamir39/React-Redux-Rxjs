import React, { Component } from 'react';
import {
    Modal
} from 'antd';
import { Translate } from 'react-translated';


class DashModal extends Component {
    render() {
        return (
            <Modal
                wrapClassName="helpModal"
                title={<Translate text={`Help & Suggestions`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={null}
            >
                <iframe
                    src="https://pipedrivewebforms.com/form/e139abd53a9257cfe994ea2f78a9f82e470502" width="800" height="400"
                    style={{border: 'none', maxWidth:'100%', maxHeight:'100%'}}
                ></iframe>
            </Modal>
        )
    }
}

export default DashModal;
