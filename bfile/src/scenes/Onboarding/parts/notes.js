import React, { Component } from 'react';
import {
    Card,
    List,
    Icon
} from 'antd';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';

class WizardNotes extends Component {
    state = {
        loading: false,
        notes: []
    }
    componentDidMount = () => {
        if (typeof this.props.match.params.bfile_id !== "undefined") {
            const bfile_id = this.props.match.params.bfile_id;
            this.setState({ loading: true });
            axios.get('/api/get_bfile_notes/' + bfile_id).then((res) => {
                this.setState({
                    notes: res.data,
                    loading: false
                })
            });
        }
    }
    render() {
        const { loading, notes } = this.state;
        return (
            <div id="notes" style={{marginTop:20}}>
                <Card title={<Translate text={`Notes`} />} className="wizardCard wizardNotes" type="inner">
                    <List
                        loading={loading}
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
                </Card>
            </div>
        );

    }
}

export default WizardNotes;
