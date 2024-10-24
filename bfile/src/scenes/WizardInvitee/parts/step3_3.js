import React, { Component } from 'react';
import {
    Card,
    Tag,
    Slider
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import { Translate } from 'react-translated';

class Step extends Component {
    rangeSliderFormatter = (val, marks) => {
        return (marks[val].val !== '') ? marks[val].val : '$0';
    }
    sliderValue = (val, marks) => {
        return marks[val].val;
    }
    rangeToArray = (range) => {
        if (range !== "") {
            range = range.split('-');
            range[0] = parseInt(range[0].replace(/\$/g, '').replace(/,/g, ''), 10);
            range[1] = parseInt(range[1].replace(/\$/g, '').replace(/,/g, ''), 10);
            return range;
        } else {
            return [0, 0];
        }
    }
    render() {

        const { wizard, updateField } = this.props;

        let rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];
        let v1, v2;
        for (let i = 1; i < 21; i++) {
            v2 = 1000000 + 100000 * i;
            v1 = v2 - 100000 + 1;
            rangeValues.push(F.dollar_format(v1)+'-'+F.dollar_format(v2));
        }
        rangeValues.push("$3,000,001-$4,000,000");
        rangeValues.push("$4,000,001-$5,000,000");

        let marks = {};
        for (let i=0, rangeLen=rangeValues.length; i<rangeLen; i++) {
            marks[parseInt((i/(rangeLen-1)) * 100, 10)] = {
                label: (i === rangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let secondary_home_mortgage = 0;
        if (wizard.secondary_home_mortgage !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.secondary_home_mortgage) {
                    secondary_home_mortgage = parseInt(x, 10);
                }
            }
        }

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Secondary Property Mortgage"`} />
                    </div>
                }>
                    <div>
                        <Card title={<Translate text={`"What's the total mortgage balance owed on the secondary properties?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                            <Slider
                                className="rangeSlider"
                                marks={marks}
                                step={null}
                                defaultValue={secondary_home_mortgage}
                                included={false}
                                tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                onChange={(val) => updateField('secondary_home_mortgage', this.sliderValue(val, marks))}
                            />
                            <div className="sliderValue center-align">{wizard.secondary_home_mortgage || <Translate text={`No Mortgage`} />}</div>
                        </Card>
                    </div>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 4) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 4)}>1</a>
                        <a className={(wizard.stepIndex === 5) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 5)}>2</a>
                        <a className={(wizard.stepIndex === 6) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 6)}>3</a>
                        <a className={(wizard.stepIndex === 7) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 7)}>4</a>
                        <a className={(wizard.stepIndex === 8) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 8)}>5</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
