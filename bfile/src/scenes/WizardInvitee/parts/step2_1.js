import React, { Component } from 'react';
import {
    Card,
    Tag,
    Select
} from 'antd';
import WizardFooter from './wizard-footer';
import { Translate } from 'react-translated';

const Option = Select.Option;

class Step extends Component {
    render() {

        const { wizard, updateField } = this.props;

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068">{wizard.status}</Tag>
                        <Translate text={`Children`} />
                    </div>
                }>
                    <Card title={<Translate text={`"How many children do you have living in your home or away at college?"`} />} className="wizardBox formBox" type="inner" style={{textAlign:"center"}}>
                        <Select defaultValue={wizard.children} style={{ width: 120 }} onChange={(value) => updateField('children', value)}>
                            <Option value={''}><Translate text={`Select`} />...</Option>
                            {[...Array(11)].map((x, i) => (
                                <Option value={i} key={i}>{i}</Option>
                            ))}
                        </Select>
                    </Card>
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`If the student is not taking a car to school, it is not the right choice to remove the child from an existing auto policy to reduce costs.`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 2) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 2)}>1</a>
                        <a className={(wizard.stepIndex === 3) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 3)}>2</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
