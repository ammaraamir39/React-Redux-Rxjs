import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Tag,
    Input,
    InputNumber,
    Radio,
    Divider,
    Checkbox,
    Rate,
    Select,
    Button,
    Table
} from 'antd';
import WizardFooter from './wizard-footer';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';
import DatePicker from 'react-datepicker';
import SP500 from '../../Wizard/parts/images/sandp.png';
import VIP from '../../Wizard/parts/images/vip.png';

const RadioGroup = Radio.Group;
const Option = Select.Option;

const { TextArea } = Input;

class Step extends Component {
    state = {
        productsSoldData: [],
        productsSoldDataIndex: 0
    }
    componentDidMount = () => {
        const { wizard } = this.props;
        if (wizard.products_sold !== '' && wizard.products_sold !== null) {
            const products_sold = JSON.parse(wizard.products_sold);
            let productsSoldDataIndex = 0;
            for (let i = 0; i < products_sold.length; i++) {
                this.addProductsSoldRowJSON(productsSoldDataIndex, products_sold[i]);
                productsSoldDataIndex++;
            }
            this.setState({ productsSoldDataIndex });
        }
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    disabledDate = (current) => {
        return current && current < moment().add(-1, 'days');
    }
    disabledDateTime = () => {
        return {
            disabledHours: () => this.range(0, 6),
            //disabledMinutes: () => this.range(30, 60)
        };
    }
    addProductsSoldRowJSON = (index, data) => {
        const { productsSoldData } = this.state;
        let total_dollars = null;
        if (data.product_sold === 'Life') {
            total_dollars = "N/A";
        } else if (data.product_sold === '') {
            total_dollars = null;
        } else {
            total_dollars = (
                <InputNumber
                    defaultValue={data.total_dollars}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={(value) => this.updateProductsSoldRowField(index, "total_dollars_value", value)}
                />
            );
        }

        productsSoldData.push({
            key: index,
            product_sold: (
                <Select defaultValue={data.product_sold} style={{ width: 250 }} onChange={(value) => this.updateProductsSoldRowField(index, 'product_sold_value', value)}>
                    <Option value={''}><Translate text={`Product`} />...</Option>
                    <Option value={'Life'}><Translate text={`Life`} /></Option>
                    <Option value={'Annuity'}><Translate text={`Annuity`} /></Option>
                    <Option value={'Mutual Funds'}><Translate text={`Mutual Funds`} /></Option>
                </Select>
            ),
            product_sold_value: data.product_sold,
            total_dollars: total_dollars,
            total_dollars_value: data.total_dollars,
            estimated_production_credit: (<Input defaultValue={data.estimated_production_credit} placeholder="" onChange={(e) => this.updateProductsSoldRowField(index, "estimated_production_credit_value", e.target.value)} />),
            estimated_production_credit_value: data.estimated_production_credit,
            total_ips: (
                <Select defaultValue={data.total_ips} style={{ width: 120 }} onChange={(value) => this.updateProductsSoldRowField(index, 'total_ips_value', value)}>
                    <Option value={''}><Translate text={`Total IPS`} />...</Option>
                    {[...Array(15)].map((x, i) => (
                        <Option value={i+1} key={i}>{i+1}</Option>
                    ))}
                </Select>
            ),
            total_ips_value: data.total_ips,
            action: (
                <Button onClick={() => this.deleteProductsSoldRow(index)}>Delete</Button>
            )
        })
        this.setState({ productsSoldData })
    }
    addProductsSoldRow = () => {
        const { productsSoldData, productsSoldDataIndex } = this.state;
        productsSoldData.push({
            key: productsSoldDataIndex,
            product_sold: (
                <Select defaultValue={''} style={{ width: 250 }} onChange={(value) => this.updateProductsSoldRowField(productsSoldDataIndex, 'product_sold_value', value)}>
                    <Option value={''}><Translate text={`Product`} />...</Option>
                    <Option value={'Life'}><Translate text={`Life`} /></Option>
                    <Option value={'Annuity'}><Translate text={`Annuity`} /></Option>
                    <Option value={'Mutual Funds'}><Translate text={`Mutual Funds`} /></Option>
                </Select>
            ),
            product_sold_value: '',
            total_dollars: null,
            total_dollars_value: '',
            estimated_production_credit: (<Input placeholder="" onChange={(e) => this.updateProductsSoldRowField(productsSoldDataIndex, "estimated_production_credit_value", e.target.value)} />),
            estimated_production_credit_value: '',
            total_ips: (
                <Select defaultValue={''} style={{ width: 120 }} onChange={(value) => this.updateProductsSoldRowField(productsSoldDataIndex, 'total_ips_value', value)}>
                    <Option value={''}><Translate text={`Total IPS`} />...</Option>
                    {[...Array(15)].map((x, i) => (
                        <Option value={i+1} key={i}>{i+1}</Option>
                    ))}
                </Select>
            ),
            total_ips_value: '',
            action: (
                <Button onClick={() => this.deleteProductsSoldRow(productsSoldDataIndex)}>Delete</Button>
            )
        })
        this.setState({ productsSoldData, productsSoldDataIndex: productsSoldDataIndex + 1 }, () => {
            this.updateProductsSold();
        });
    }
    updateProductsSold = () => {
        const { productsSoldData } = this.state;
        const result = [];
        for (var i = 0; i < productsSoldData.length; i++) {
            result.push({
                product_sold: productsSoldData[i].product_sold_value,
                total_dollars: productsSoldData[i].total_dollars_value,
                estimated_production_credit: productsSoldData[i].estimated_production_credit_value,
                total_ips: productsSoldData[i].total_ips_value
            });
        }
        this.props.updateField("products_sold", JSON.stringify(result));
    }
    updateProductsSoldRowField = (index, name, value) => {
        const { productsSoldData } = this.state;
        const i = productsSoldData.findIndex(item => item.key === index);
        productsSoldData[i][name] = value;

        if (name === 'product_sold_value' && value === 'Life') {
            productsSoldData[i].total_dollars = "N/A";
            productsSoldData[i].total_dollars_value = '';
        } else if (name === 'product_sold_value' && value === '') {
            productsSoldData[i].total_dollars = null;
            productsSoldData[i].total_dollars_value = '';
        } else if (name === 'product_sold_value') {
            productsSoldData[i].total_dollars = (
                <InputNumber
                    defaultValue={null}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={(value) => this.updateProductsSoldRowField(index, "total_dollars_value", value)}
                />
            );
            productsSoldData[i].total_dollars_value = '';
        }

        this.setState({ productsSoldData }, () => {
            this.updateProductsSold();
        });
    }
    deleteProductsSoldRow = (index) => {
        const { productsSoldData } = this.state;
        const i = productsSoldData.findIndex(item => item.key === index);
        if (i >= 0) {
            productsSoldData.splice(i, 1);
        }
        this.setState({ productsSoldData }, () => {
            this.updateProductsSold();
        });
    }
    render() {

        const { wizard, bfile, updateField, user } = this.props;
        const productsSoldData = this.state.productsSoldData;
        const productsSoldColumns = [{
            title: <Translate text={`Product Sold`} />,
            dataIndex: 'product_sold',
            key: 'product_sold',
        }, {
            title: <Translate text={`Total Dollars`} />,
            dataIndex: 'total_dollars',
            key: 'total_dollars',
        }, {
            title: <Translate text={`Estimated Production Credit`} />,
            dataIndex: 'estimated_production_credit',
            key: 'estimated_production_credit',
        }, {
            title: <Translate text={`Total IPS`} />,
            dataIndex: 'total_ips',
            key: 'total_ips',
        }, {
            title: '',
            dataIndex: 'action',
            key: 'action',
        }];

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Translate text={`Appointment Outcome`} />
                    </div>
                }>
                    <Card type="inner" className="wizardBox center-align">
                        <RadioGroup value={wizard.appointment_status} onChange={(e) => updateField('appointment_status', e.target.value)}>
                            <Radio value="Complete Sold" className="btnYes"><Translate text={`Complete Sold`} /></Radio>
                            <Radio value="Complete Not Sold" className="btnYes"><Translate text={`Complete Not Sold`} /></Radio>
                            <Radio value="Appointment Rescheduled" className="btnYes"><Translate text={`Appoint. Rescheduled`} /></Radio>
                            <Radio value="Appointment Cancelled" className="btnYes"><Translate text={`Appoint. Cancelled`} /></Radio>
                            <Radio value="Call to Reschedule" className="btnYes"><Translate text={`Call to Reschedule`} /></Radio>
                        </RadioGroup>
                        {wizard.appointment_status === 'Appointment Cancelled' ? (
                            <div>
                                <Divider />
                                <RadioGroup value={wizard.appointment_cancelled_options} onChange={(e) => updateField('appointment_cancelled_options', e.target.value)}>
                                    <Radio value="Not Interested" className="btnYes"><Translate text={`Not Interested`} /></Radio>
                                    <Radio value="Call to Reschedule" className="btnYes"><Translate text={`Call to Reschedule`} /></Radio>
                                </RadioGroup>
                            </div>
                        ) : null}
                    </Card>

                    {wizard.appointment_status === 'Appointment Rescheduled' || wizard.appointment_status === 'Call to Reschedule' || (wizard.appointment_status === 'Appointment Cancelled' && wizard.appointment_cancelled_options === 'Call to Reschedule') ? (
                        <Card title={<Translate text={`Reschedule Date`} />} type="inner" className="wizardBox center-align">
                            <DatePicker
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeSelect
                                timeIntervals={15}
                                timeFormat="hh:mm aa"
                                selected={
                                    (wizard.appointment_reschedule_date && wizard.appointment_reschedule_date !== "")
                                    ? new Date(wizard.appointment_reschedule_date)
                                    : null
                                }
                                shouldCloseOnSelect={false}
                                onChange={(val) => {
                                    const date = moment(val).format("YYYY-MM-DD HH:mm:ss");
                                    updateField('appointment_reschedule_date', date)
                                }}
                            />
                        </Card>
                    ) : null}

                    <Card title={<Translate text={`Appointment Outcome Notes`} />} className="wizardBox wizardBoxBlue center-align" type="inner">
                        {wizard.appointment_status === 'Complete Sold' ? (
                            <div style={{marginBottom:20}}>
                                <Table
                                    dataSource={productsSoldData}
                                    columns={productsSoldColumns}
                                    pagination={false}
                                    style={{marginBottom:20}}
                                />
                                <div className="center-align">
                                    <Button onClick={this.addProductsSoldRow.bind(this)}><Translate text={`Select Financial Product`} /></Button>
                                </div>
                            </div>
                        ) : null}
                        <Card title={<Translate text={`Notes`} />} className="wizardBox center-align" type="inner">
                            <TextArea rows={4} onChange={(e) => updateField('appointment_info', e.target.value)} />
                        </Card>
                    </Card>

                    <Card className="wizardBox center-align" bordered={false} type="inner" style={{padding:0}}>
                        <div className="radioIcons" style={{maxWidth:350,margin:'0 auto'}}>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <Checkbox checked={(wizard.sp_500) ? true : false} onChange={(e) => updateField('sp_500', (e.target.checked) ? 1 : 0)}>
                                        <div className="radioIconOption">
                                            <div className="icon"><img src={SP500} alt="S&P 500" /></div>
                                            <div className="title"><Translate text={`S&P 500`} /></div>
                                        </div>
                                    </Checkbox>
                                </Col>
                                <Col md={12} span={24}>
                                    <Checkbox checked={(wizard.vip) ? true : false} onChange={(e) => updateField('vip', (e.target.checked) ? 1 : 0)}>
                                        <div className="radioIconOption">
                                            <div className="icon"><img src={VIP} alt="VIP" /></div>
                                            <div className="title"><Translate text={`VIP`} /></div>
                                        </div>
                                    </Checkbox>
                                </Col>
                            </Row>
                        </div>
                    </Card>

                </Card>

                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
