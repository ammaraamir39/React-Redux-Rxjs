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
    Select,
    DatePicker,
    Input,
    Popover
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import './reporting.css';
import Filters from './filters';
import Filter from './filter-func';
import { Translate } from 'react-translated';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { compose, withProps, withStateHandlers } = require("recompose");

const Option = Select.Option;
const InputGroup = Input.Group;

const { RangePicker } = DatePicker;
const today = new Date();

const MapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={4}
        defaultCenter={{lat: 37.0625, lng: -95.677068}}
    >
        {props.markers.map((map, i) => {
            return (
                <Marker
                    position={{ lat: map.lat, lng: map.lng }}
                    onClick={() => props.open(i)}
                >
                    {map.open && <InfoBox
                            defaultPosition={new window.google.maps.LatLng(map.lat, map.lng)}
                            options={{ closeBoxURL: ``, enableEventPropagation: true }}
                        >
                            <div style={{ backgroundColor: `#FFF`, borderRadius: 3, padding: `12px` }}>
                                <h2>{map.title}</h2>
                                <div style={{marginTop:5}}><a href={map.link} target="_blank"><Button>Link</Button></a></div>
                            </div>
                        </InfoBox>
                    }
                </Marker>
            )
        })}
    </GoogleMap>
));

class Reporting extends Component {
    state = {
        loading: false,
        users: [],
        bfiles: [],
        page: 1,
        total_pages: 0,
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
        filters: [{
            filter1: '',
            filter2: '',
            filter3: '',
            value: ''
        }],
        filters_arr: [],
        markers: []
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        axios.get("/api/my_associations").then((res) => {
            let users = [];
            for (let x in res.data) {
                const agency = res.data[x];
                for (let i=0; i < agency.length; i++) {
                    const u = agency[i];
                    users.push({
                        name: u.first_name+" "+u.last_name,
                        id: u.id,
                        user_type: u.user_type
                    });
                }
            }
            this.setState({ users, loading: false });
        });

        /*window.onload = () => {
            window.map = new window.google.maps.Map(window.document.getElementById('map'), {
                zoom: 4,
                center: {lat: 37.0625, lng: -95.677068}
            });
            window.geocoder = new window.google.maps.Geocoder;
        }*/
    }
    filterUpdate = (i, filter) => {
        const { filters } = this.state;
        filters[i] = filter;
        this.setState({ filters });
    }
    addFilter = () => {
        const { filters } = this.state;
        filters.push({
            filter1: '',
            filter2: '',
            filter3: '',
            value: ''
        });
        this.setState({ filters });
    }
    deleteFilter = (i) => {
        const { filters } = this.state;
        filters.splice(i, 1);
        this.setState({ filters });
    }
    filter = (page) => {
        const { start_date, end_date } = this.state;

        let filters = Filter(this.state.filters);
        filters.push({"name":"created_on","op":">=","val":moment(start_date).format('YYYY-MM-DD')});
        filters.push({"name":"created_on","op":"<","val":moment(end_date).format('YYYY-MM-DD')});

        this.setState({
            filters_arr: filters
        }, () => {
            this.getBfiles(1);
        })
    }
    getBfiles = (page) => {
        const { filters_arr } = this.state;

        const url = '/api/b_file?page='+page+'&q={"filters":'+JSON.stringify(filters_arr)+',"order_by":[{"field":"id","direction":"desc"}]}';

        this.setState({ loading: true });
        axios.get(url).then((res) => {
            this.setState({
                loading: false,
                bfiles: res.data.objects,
                page: res.data.page,
                total_pages: res.data.total_pages
            })
        });
    }
    reset = () => {
        this.setState({
            filters: [{
                filter1: '',
                filter2: '',
                filter3: '',
                value: ''
            }]
        }, () => {
            this.filter();
        });
    }
    export = () => {
        this.setState({ loading: true });
        const { filters_arr } = this.state;

        const url = '/api/b_file?results_per_page=9999&q={"filters":'+JSON.stringify(filters_arr)+',"order_by":[{"field":"id","direction":"desc"}]}';

        this.setState({ loading: true });
        axios.get(url).then((res) => {
            const bfiles = res.data.objects;
            const data = [];
            for (let i=0; i < bfiles.length; i++) {
                let item = bfiles[i];
                data.push({
                    agency_name: item.agency.name,
                    date: moment(item.created_on).format('MM/DD/YYYY hh:mmA'),
                    name: item.first_name+" "+item.last_name,
                    life_retirement_opportunity: F.bfile_get_life_retirement_opp(item),
                    phone: item.phone,
                    status: F.bfile_status(item),
                    products_sold: F.bfile_items_sold(item).join(', '),
                    products_not_sold: F.bfile_items_not_sold(item).join(', ')
                })
            }
            axios.post("/api/download_report_csv", {
                bfiles: data
            }).then((res) => {
                this.setState({ loading: false });
                if (res.data.success && res.data.token !== "") {
                    window.location = "/api/download_file/report-"+res.data.token+".csv";
                } else {
                    message.error(F.translate(`Can't export the report.`));
                }
            });
        });
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1],
        })
    }
    addMarker(address, customer_name, id) {
        const geocoder = new window.google.maps.Geocoder;
        geocoder.geocode({'address': address}, (results, status) => {
            if (status == 'OK') {
                const markers = this.state.markers;
                markers.push({
                    title: customer_name,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                    link: '/customer/' + id,
                    open: false
                });
                this.setState({
                    markers
                });
                /*window.map.setCenter(results[0].geometry.location);
                const marker = new window.google.maps.Marker({
                    map: window.map,
                    //icon: icon,
                    position: results[0].geometry.location
                });
                const infowindow = new window.google.maps.InfoWindow({
                    content: '<div><strong>Customer:</strong> ' + customer_name + '</div>' +
                             '<div><a href="/customer/' + id + '" target="_blank">View</a></div>'
                });
                marker.addListener('click', function() {
                    infowindow.open(window.map, marker);
                });*/
            } else {
                //
            }
        });
    }
    render() {

        const {
            loading,
            users,
            bfiles,
            filters,
            page,
            total_pages,
            start_date,
            end_date
        } = this.state;

        const dateFormat = 'MM/DD/YYYY';

        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Life/Retirement Opportunity',
                dataIndex: 'life_opp',
                key: 'life_opp'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status'
            },
            {
                title: 'Products Sold',
                dataIndex: 'products_sold',
                key: 'products_sold'
            },
            {
                title: 'Products Not Sold',
                dataIndex: 'products_not_sold',
                key: 'products_not_sold'
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
        for (let i=0; i < bfiles.length; i++) {
            let item = bfiles[i];

            this.addMarker(item.address, item.first_name + " " + item.last_name, item.id);

            data.push({
                key: i,
                date: moment(item.created_on).format('MM/DD/YYYY hh:mmA'),
                name: item.first_name+" "+item.last_name,
                life_opp: F.bfile_get_life_retirement_opp(item),
                phone: item.phone,
                status: F.bfile_status(item),
                products_sold: F.bfile_items_sold(item).join(', '),
                products_not_sold: F.bfile_items_not_sold(item).join(', '),
                action: (
                    <div className="right-align">
                        <Link to={"/customer/" + item.id}>
                            <Button style={{marginLeft: 10}} type="primary" ghost>
                                <Translate text={`View`} />
                            </Button>
                        </Link>
                    </div>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="area-chart" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Reporting`} />
                        </div>
                    }
                    className="reporting tableCard"
                    loading={loading}
                >
                    <MapComponent
                        markers={this.state.markers}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB896cxwdpKJAXgZyvGz5CX2GMCgvVpeI8"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        open={(index) => {
                            const markers = this.state.markers;
                            for (var i = 0; i < markers.length; i++) {
                                if (i === index) {
                                    markers[i].open = true;
                                } else {
                                    markers[i].open = false;
                                }
                            }
                            this.setState({ markers});
                        }}
                    />
                    <Card bordered={false} className="filters">
                        {filters.map((filter, i) => (
                            <Filters
                                filter={filter}
                                users={users}
                                update={(f) => this.filterUpdate(i, f)}
                                key={i}
                                add={() => this.addFilter()}
                                delete={() => this.deleteFilter(i)}
                                is_last={(i + 1 === filters.length) ? true : false}
                            />
                        ))}
                    </Card>
                    <Card bordered={false} className="filters">
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <RangePicker
                                    value={[moment(start_date), moment(end_date)]}
                                    onChange={this.onChangeDateRange}
                                    format={dateFormat}
                                />
                            </Col>
                            <Col md={12} span={24}>
                                <div className="right-align">
                                    <Button type="primary" onClick={() => this.filter()}><Translate text={`Submit`} /></Button>
                                    <Button onClick={this.reset.bind(this)} style={{marginLeft:10}}><Translate text={`Reset`} /></Button>
                                    <Button onClick={this.export.bind(this)} style={{marginLeft:10}}><Translate text={`Export`} /></Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.getBfiles(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default Reporting;
