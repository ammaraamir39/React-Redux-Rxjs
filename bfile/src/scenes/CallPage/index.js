import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    DatePicker,
    Input,
    Table,
    Button,
    Menu,
    Select,
    Popconfirm
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import Filters from './filters';
import ActionMenu from '../LandingPage/menu';
import { Translate, Translator } from 'react-translated';
import SetupAppointment from '../LandingPage/parts/setup-appointment-modal';
import TransferBfile from './parts/transfer-bfile-modal';
import ChangeCreator from './parts/change-creator-modal';
import './callpage.css';

const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const today = new Date();

class CallPage extends Component {
    state = {
        loading: true,
        callpage: 'allbfiles',
        title: 'B-Files',
        path: this.props.location.pathname,
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        bfiles: [],
        user: this.props.auth.user,
        selectedRowKeys: [],
        selectedBfiles: [],
        windowHeight: window.innerHeight - 350,
        page: 1,
        total_pages: 0,
        filters: '',
        endpoint: 'b_file',
        columns: null,
        order_by: null,
        date_range: true,
        periodAll: false,
        search: '',
        agencies: [],
        agency: '',
        setup_appointment_modal: false,
        bfile: null,
        transfer_bfile_modal: false,
        change_creator_modal: false,
        orderBy: null,
        orderBySort: null
    }
    componentDidMount = () => {
        const { user } = this.state;
        let search = '';
        let agency = '';

        if (typeof this.props.match.params.search !== 'undefined') {
            search = this.props.match.params.search;
        }

        if (user.user_type === 'EFS') {
            axios.get('/api/my_agencies').then((res) => {
                this.setState({ agencies: res.data })
            });
            if ("efs_agency_id" in window.localStorage && window.localStorage.efs_agency_id !== "") {
                agency = parseInt(window.localStorage.efs_agency_id);
            }
        }

        if (user.user_type === 'REVIEWSCHEDULER') {
            if ("rs_agency_id" in window.localStorage && window.localStorage.rs_agency_id !== "") {
                agency = parseInt(window.localStorage.rs_agency_id);
            }
            axios.get('/api/rs_agencies').then((res) => {
                this.setState({ agencies: res.data })
            });
        }

        this.setState({
            search,
            agency
        }, () => {
            this.updateFilters();
        })
    }
    componentDidUpdate = () => {
        if (this.props.location.pathname !== this.state.path) {
            this.setState({ path: this.props.location.pathname }, () => {
                this.updateFilters();
            })
        }
        if (typeof this.props.match.params.search !== "undefined" && this.props.match.params.search !== this.state.search) {
            this.setState({ search: this.props.match.params.search }, () => {
                this.updateFilters();
            })
        }
    }
    updateFilters = () => {
        const { user } = this.state;
        let { start_date, end_date, agencies } = this.state;
        const today = moment(new Date()).format('YYYY-MM-DD');
        let title = 'B-Files';
        let filters = '';
        let callpage = 'bfiles';
        let endpoint = 'b_file';
        let columns = null;
        let order_by = null;
        let date_range = true;

        if (typeof this.props.match.params.from !== 'undefined' && typeof this.props.match.params.to !== 'undefined') {
            start_date = moment(decodeURIComponent(this.props.match.params.from));
            end_date = moment(decodeURIComponent(this.props.match.params.to));
            this.setState({ start_date, end_date })
        }

        if (typeof this.props.match.params.filter !== 'undefined') {
            callpage = this.props.match.params.filter;
            if (typeof Filters[this.props.match.params.filter] !== "undefined") {
                const f = Filters[this.props.match.params.filter];
                title = (f.title !== '') ? f.title : 'B-Files';
                if (typeof f.filters !== 'undefined') {
                    filters = f.filters;
                }
                if (typeof f.endpoint !== 'undefined') {
                    endpoint = f.endpoint;
                }
                if (typeof f.columns !== 'undefined') {
                    columns = f.columns;
                }
                if (typeof f.order_by !== 'undefined') {
                    order_by = f.order_by;
                }
                if (typeof f.date_range !== 'undefined') {
                    date_range = f.date_range;
                }
            }
        } else {
            date_range = false;
        }

        if (this.state.agency && this.state.agency !== '') {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"agency_id","op":"==","val":"' + this.state.agency + '"}';
        }

        if (this.state.search !== '') {
            const queries = [];
            queries.push({ "name": "first_name", "op": "like", "val": encodeURIComponent("%" + this.state.search + "%") });
            queries.push({ "name": "last_name", "op": "like", "val": encodeURIComponent("%" + this.state.search + "%") });
            queries.push({ "name": "spouse_first_name", "op": "like", "val": encodeURIComponent("%" + this.state.search + "%") });
            queries.push({ "name": "spouse_last_name", "op": "like", "val": encodeURIComponent("%" + this.state.search + "%") });
            queries.push({ "name": "email", "op": "like", "val": encodeURIComponent("%" + this.state.search + "%") });

            const search_arr = this.state.search.split(" ");
            for (let x in search_arr) {
                if (x != "") {
                    queries.push({ "name": "first_name", "op": "like", "val": encodeURIComponent("%" + search_arr[x] + "%") });
                    queries.push({ "name": "last_name", "op": "like", "val": encodeURIComponent("%" + search_arr[x] + "%") });
                    queries.push({ "name": "spouse_first_name", "op": "like", "val": encodeURIComponent("%" + search_arr[x] + "%") });
                    queries.push({ "name": "spouse_last_name", "op": "like", "val": encodeURIComponent("%" + search_arr[x] + "%") });
                }
            }
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"or":' + JSON.stringify(queries) + '}';
        }

        if (callpage.indexOf("saved-for-later") < 0 && callpage !== "bfiles") {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"is_saved_for_later","op":"==","val":"0"}';
        }

        let is_all_bfiles = false;
        if (this.props.history.location.search !== "" && this.props.history.location.search.indexOf("all_bfiles") >= 0) {
            is_all_bfiles = true;
        }

        if (!is_all_bfiles) {
            if (callpage !== 'onboarding-calls' && callpage !== 'financial-intro' && callpage !== 'renewal' && callpage !== 'renewal-mycalls' && callpage !== 'onboarding-calls-attempted') {
                if (date_range) {
                    if (callpage !== 'rs-upcoming-calls' && callpage !== 'sent-to-vonboarder' && callpage.indexOf("vo-") < 0 && callpage.indexOf("pending-") < 0 && callpage !== 'renewals' && callpage !== 'onboarding-calls-total' && callpage.indexOf("rs-") < 0 && callpage.indexOf("review-scheduler-") < 0) {
                        // if (filters !== '') filters = filters + ',';
                        // filters = filters + '{"name":"created_on","op":">=","val":"%from%"},{"name":"created_on","op":"<","val":"%to%"}';
                        if (filters !== '') filters = filters + ',';
                        filters = filters + '{"or":[{"and":[{"name":"vo_sent_date","op":">=","val":"%from%"},{"name":"vo_sent_date","op":"<","val":"%to%"}]},{"and":[{"name":"created_on","op":">=","val":"%from%"},{"name":"created_on","op":"<","val":"%to%"}]}]}';
                    }
                    if (callpage === "sent-to-vonboarder" || callpage.indexOf("vo-") >= 0) {
                        if (filters !== '') filters = filters + ',';
                        filters = filters + '{"name":"vo_sent_date","op":">=","val":"%from%"},{"name":"vo_sent_date","op":"<","val":"%to%"}';
                    }
                    if (callpage === "onboarding-calls-total") {
                        if (filters !== '') filters = filters + ',';
                        filters = filters + '{"or":[{"and":[{"name":"vo_sent_date","op":">=","val":"%from%"},{"name":"vo_sent_date","op":"<","val":"%to%"}]},{"and":[{"name":"created_on","op":">=","val":"%from%"},{"name":"created_on","op":"<","val":"%to%"}]}]}';
                    }
                    if (callpage === "rs-upcoming-calls") {
                        if (filters !== '') filters = filters + ',';
                        filters = filters + '{"or":[{"and":[{"name":"rs_date","op":">=","val":"%from%"},{"name":"rs_date","op":"<","val":"%to%"}]},{"and":[{"name":"created_on","op":">=","val":"%from%"},{"name":"created_on","op":"<","val":"%to%"}]}]}';
                    }
                }
            }
        }

        if (!is_all_bfiles) {
            if (callpage === 'review-scheduler-bfiles') {
                if (filters !== '') filters = filters + ',';
                filters = filters + '{"name":"rs_appointment_date","op":">=","val":"%from%"},{"name":"rs_appointment_date","op":"<","val":"%to%"}';
            } else if (callpage === "user-rs-appointments-scheduled") {
                if (filters !== '') filters = filters + ',';
                filters = filters + '{"name":"rs_date","op":">=","val":"%from%"},{"name":"rs_date","op":"<","val":"%to%"}';
            } else {
                if (callpage.indexOf("rs-") >= 0 || callpage.indexOf("review-scheduler-") >= 0) {
                    if (filters !== '') filters = filters + ',';
                    filters = filters + '{"or":[{"and":[{"name":"rs_date","op":">=","val":"%from%"},{"name":"rs_date","op":"<","val":"%to%"}]},{"and":[{"name":"created_on","op":">=","val":"%from%"},{"name":"created_on","op":"<","val":"%to%"}]}]}';
                }
            }
        }

        if (callpage !== 'deleted' && callpage !== 'archived' && callpage !== 'renewals' && callpage !== "review-scheduler-not-interested" && filters.indexOf("archive") < 0) {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"archive","op":"==","val":"0"}';
        }

        if (callpage !== 'deleted') {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"deleted","op":"==","val":"0"}';
        }

        filters = filters.replace(/%reviewer_id%/g, new URLSearchParams(this.props.location.search).get("reviewer_id"));

        filters = filters.replace(/%user_id%/g, user.id);
        filters = filters.replace(/%from%/g, moment(start_date).format('YYYY-MM-DD'));
        filters = filters.replace(/%to%/g, moment(end_date).add(1, 'day').format('YYYY-MM-DD'));
        filters = filters.replace(/%today%/g, today);

        if (typeof this.props.match.params.ea !== 'undefined' && typeof this.props.match.params.ea !== 'undefined') {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"onboarding_id","op":"==","val":"' + this.props.match.params.ea + '"}';
        }
        if (typeof this.props.match.params.lsp !== 'undefined' && typeof this.props.match.params.lsp !== 'undefined') {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"user_id","op":"==","val":"' + this.props.match.params.lsp + '"}';
        }
        if (typeof this.props.match.params.efs !== 'undefined' && typeof this.props.match.params.efs !== 'undefined') {
            if (filters !== '') filters = filters + ',';
            filters = filters + '{"name":"financial_id","op":"==","val":"' + this.props.match.params.efs + '"}';
        }

        this.setState({ title, filters, endpoint, columns, order_by, date_range, callpage }, () => {
            this.loadCalls(1);
        })
    }
    loadCalls = (page) => {
        const { start_date, end_date, filters, endpoint } = this.state;
        let { order_by, orderBy, orderBySort } = this.state;
        let url = '/api/' + endpoint + '?page=' + page;

        this.setState({ loading: true });

        if (orderBy && orderBySort) {
            order_by = '{"field":"' + orderBy + '","direction":"' + orderBySort + '"}';
        } else {
            if (!order_by) {
                order_by = '{"field":"created_on","direction":"desc"}';
            }
            let orderByObj = JSON.parse(order_by);
            this.setState({
                orderBy: orderByObj.field,
                orderBySort: orderByObj.direction
            })
        }

        if (filters !== '') {
            url = url + '&q={"filters":[' + filters + '],"order_by":[' + order_by + ']}';
        }

        axios.get(url).then((res) => {
            let bfiles = [];
            let total_pages = 0;
            let page = 1;

            if (typeof res.data.objects !== 'undefined') {
                bfiles = res.data.objects;
                page = res.data.page;
                total_pages = res.data.total_pages;
            }

            if (typeof res.data.results !== 'undefined') {
                bfiles = res.data.results;
            }

            for (let i = 0; i < bfiles.length; i++) {
                bfiles[i].checked = false;
            }

            this.setState({
                loading: false,
                bfiles,
                page,
                total_pages
            })
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    updateSelected = (index, checked) => {
        const { bfiles } = this.state;
        bfiles[index].checked = checked;
        this.setState({ bfiles })
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1],
            period: "from_to",
            periodAll: false
        }, () => {
            this.updateFilters();
        })
    }
    all = () => {
        this.setState({
            start_date: new Date('2010-01-01'),
            end_date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            period: "from_to",
            periodAll: true
        }, () => {
            this.updateFilters();
        })
    }
    delete = (bfile_id) => {
        this.setState({ loading: true });
        axios.put('/api/b_file/' + bfile_id, {
            deleted: 1
        }).then((res) => {
            /*axios.post("/api/bfile_notes", {
                "bfile_id": bfile_id,
                "note": "Customer B-File has been deleted.",
                "user_id": user.id
            });*/

            this.setState({ loading: false }, () => {
                this.loadCalls(1);
            })
        });
    }
    archive = (bfile_id) => {
        this.setState({ loading: true });
        axios.put('/api/b_file/' + bfile_id, {
            archive: 1
        }).then((res) => {
            this.setState({ loading: false }, () => {
                this.loadCalls(1);
            })
        });
    }
    reactivate = (bfile_id) => {
        this.setState({ loading: true });
        axios.put('/api/b_file/' + bfile_id, {
            deleted: 0
        }).then((res) => {
            this.setState({ loading: false }, () => {
                this.loadCalls(1);
            })
        });
    }
    delete_bfile = () => {
        const { selectedRowKeys, bfiles } = this.state;
        const promises = [];
        const selectedBfiles = [];
        for (var i = 0; i < selectedRowKeys.length; i++) {
            selectedBfiles.push(bfiles[selectedRowKeys[i]]);
        }
        this.setState({ loading: true });
        for (let i = 0; i < selectedBfiles.length; i++) {
            let bfile = selectedBfiles[i].id;
            let promise = new Promise(function (resolve, reject) {
                axios.put('/api/b_file/' + bfile, {
                    deleted: 1
                }).then((res) => {
                    resolve();
                }).catch((res) => {
                    reject();
                });
            });
            promises.push(promise);
        }
        Promise.all(promises).then((val) => {
            this.setState({ loading: false, selectedBfiles: [], selectedRowKeys: [] }, () => {
                this.loadCalls(1);
            });
        });
    }
    archive_bfile = () => {
        const { selectedRowKeys, bfiles } = this.state;
        const promises = [];
        const selectedBfiles = [];
        for (var i = 0; i < selectedRowKeys.length; i++) {
            selectedBfiles.push(bfiles[selectedRowKeys[i]]);
        }
        this.setState({ loading: true });
        for (let i = 0; i < selectedBfiles.length; i++) {
            let bfile = selectedBfiles[i].id;
            let promise = new Promise(function (resolve, reject) {
                axios.put('/api/b_file/' + bfile, {
                    archive: 1
                }).then((res) => {
                    resolve();
                }).catch((res) => {
                    reject();
                });
            });
            promises.push(promise);
        }
        Promise.all(promises).then((val) => {
            this.setState({ loading: false, selectedBfiles: [], selectedRowKeys: [] }, () => {
                this.loadCalls(1);
            });
        });
    }
    transfer_bfile = () => {
        const { selectedRowKeys, bfiles } = this.state;
        const selectedBfiles = [];
        for (var i = 0; i < selectedRowKeys.length; i++) {
            selectedBfiles.push(bfiles[selectedRowKeys[i]]);
        }
        this.setState({ selectedBfiles, transfer_bfile_modal: true });
    }
    change_creator = () => {
        const { selectedRowKeys, bfiles } = this.state;
        const selectedBfiles = [];
        for (var i = 0; i < selectedRowKeys.length; i++) {
            selectedBfiles.push(bfiles[selectedRowKeys[i]]);
        }
        this.setState({ selectedBfiles, change_creator_modal: true });
    }
    parseIntAdv = (str) => {
        if (str && str !== "") {
            return parseInt(str);
        }
        return 0;
    }
    render() {

        const {
            title,
            start_date,
            end_date,
            bfiles,
            user,
            loading,
            selectedRowKeys,
            windowHeight,
            page,
            total_pages,
            date_range,
            agencies,
            callpage
        } = this.state;

        const dateFormat = 'MM/DD/YYYY';

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const menu = (
            <Menu />
        );

        let columns = [{
            title: <div><Translate text={`Name`} /> <br /> <Translate text={`Phone`} /> #</div>,
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: <div><Translate text={`Ages`} /> <br /> <Translate text={`Employment`} /></div>,
            dataIndex: 'ages',
            key: 'ages',
            width: 200
        },
        {
            title: <Translate text={`Type`} />,
            dataIndex: 'type',
            key: 'type',
            width: 200
        },
        {
            title: <div><Translate text={`Status`} /> <br /> <Translate text={`Due Date`} /> <br /> # <Translate text={`Call Attempts`} /></div>,
            dataIndex: 'status',
            key: 'status',
            width: 200
        },
        {
            title: <Translate text={`Products Sold`} />,
            dataIndex: 'products_sold',
            key: 'products_sold',
            width: 200
        },
        {
            title: <div><Translate text={`Who Created`} /> <br /> <Translate text={`Last Updated`} /> <br /> <Translate text={`Who Referred`} /></div>,
            dataIndex: 'who_created',
            key: 'who_created',
            width: 200
        },
        {
            title: <Translate text={`Life Stage`} />,
            dataIndex: 'life_stage',
            key: 'life_stage',
            width: 200
        },
        {
            title: <Translate text={`Retirement Dollars`} />,
            dataIndex: 'retirement_dollars',
            key: 'retirement_dollars',
            width: 200
        },
        {
            title: <Translate text={`P&C Cross Sell Opportunities`} />,
            dataIndex: 'pc_cross_sell_opp',
            key: 'pc_cross_sell_opp',
            width: 200
        },
        {
            title: <Translate text={`Priority Status`} />,
            dataIndex: 'priority_status',
            key: 'priority_status',
            width: 200
        }];

        if (this.state.columns) {
            columns = this.state.columns;
        }

        const data = [];
        for (let i = 0; i < bfiles.length; i++) {
            let bfile = bfiles[i];

            console.log(bfile,"bfileee")
            let ages = [];
            if (bfile.birthday !== "" && bfile.birthday !== null) {
                ages.push(F.getAge(F.validDate(bfile.birthday, "/")));
            }
            if (bfile.spouse_birthday !== "" && bfile.spouse_birthday !== null) {
                ages.push(F.getAge(F.validDate(bfile.spouse_birthday, "/")));
            }
            bfile.age_age = (ages.length > 0) ? ages.join("/") : "-";

            let creator_name = "";
            if (bfile.user !== null) {
                creator_name = bfile.user.first_name[0] + ". " + bfile.user.last_name;
            }

            bfile.priority = "Standard";
            if (bfile.need_attention == 1) {
                bfile.priority = "Urgent";
            }
            if (bfile.sp_500 == 1) {
                bfile.priority = "S&P";
            }
            if (bfile.vip == 1) {
                bfile.priority = "VIP";
            }

            const employment_status = F.bfile_employment_status(bfile);
            const status = F.bfile_status(bfile);
            const life_stage = F.bfile_life_stage(bfile).title;

            data.push({
                key: i,
                date: moment(bfile.created_on).format('MM/DD/YYYY hh:mmA'),
                expiration_date: moment(bfile.expiration_date).format('MM/DD/YYYY hh:mmA'),
                rs_scheduled_date: bfile.rs_scheduled_date ? moment(bfile.rs_scheduled_date).format('MM/DD/YYYY hh:mmA') : '-',
                rs_appointment_date: bfile.rs_appointment_date ? moment(bfile.rs_appointment_date).format('MM/DD/YYYY hh:mmA') : '-',
                first_name: <Link to={"/customer/" + bfile.id}>{bfile.first_name}</Link>,
                last_name: <Link to={"/customer/" + bfile.id}>{bfile.last_name}</Link>,
                customer_name: <Link to={"/customer/" + bfile.id}>{bfile.first_name} {bfile.last_name}</Link>,
                name: (
                    <div>
                        <div><ActionMenu bfile={bfile} user={user} history={this.props.history} update={(bfile) => this.loadCalls(page)} refresh={() => this.loadCalls(page)} is_callpage={true} /></div>

                        <div className="phoneField">
                            <Icon type="phone" style={{ marginRight: 10 }} />
                            <a href={"tel:" + F.phone_format(bfile.phone)}>{F.phone_format(bfile.phone)}</a>
                            {' '}
                        </div>
                        {bfile.phone2 && bfile.phone2 !== "" ? (
                            <div className="phoneField">
                                <Icon type="phone" style={{ marginRight: 10 }} />
                                <a href={"tel:" + F.phone_format(bfile.phone2)}>{F.phone_format(bfile.phone2)}</a>
                            </div>
                        ) : null}
                    </div>
                ),
                agency_name: bfile.agency.name,
                phone: <a href={"tel:" + F.phone_format(bfile.phone)}>{F.phone_format(bfile.phone)}</a>,
                email: bfile.email,
                lsp: bfile.user.first_name + ' ' + bfile.user.last_name,
                appointment_date: moment(bfile.rs_appointment_date).format('MM/DD/YYYY hh:mm a'),
                ages: <div>{bfile.age_age} <br /> <Translate text={(employment_status) ? employment_status : ''} /></div>,
                type: <Translate text={(bfile.status) ? F.bfile_type(bfile.status) : ''} />,
                status: (
                    <div>
                        <Translate text={(status) ? status : ''} /><br />
                        {F.bfile_due_date(bfile, user.default_date)}<br />
                        {bfile.rs_attempts ? (
                            <span>{this.parseIntAdv(bfile.attempts) + this.parseIntAdv(bfile.rs_attempts) || 0}</span>
                        ) : (
                            <span>{bfile.attempts || 0}</span>
                        )}
                    </div>
                ),
                products_sold: (
                    <div>
                        {F.bfile_items_sold(bfile).map((item, i) => (
                            <span key={i}>
                                {i > 0 ? ', ' : null}
                                <Translate text={(item) ? item : ''} />
                            </span>
                        ))}
                    </div>
                ),
                who_created: <div>{creator_name} <br /> {moment(bfile.updated_on).format('MM/DD/YYYY hh:mmA')} <br /> {bfile.referred_by || '-'}</div>,
                life_stage: <Translate text={(life_stage) ? life_stage : ''} />,
                retirement_dollars: F.dollar_format(F.bfile_get_retirement_dollars(bfile)),
                pc_cross_sell_opp: bfile.cross_sell_policies_uncovered,
                priority_status: <Translate text={(bfile.priority) ? bfile.priority : ''} />,
                view: (
                    <Link to={"/customer/" + bfile.id}>
                        <Button type="primary">
                            <Translate text={`View`} />
                        </Button>
                    </Link>
                ),
                upcoming_calls_actions: (
                    <div>
                        <Link to={"/customer/" + bfile.id}>
                            <Button type="primary">
                                <Translate text={`View`} />
                            </Button>
                        </Link>
                        <Popconfirm placement="topRight" title={'Do you really want to delete this B-File?'} onConfirm={() => this.delete(bfile.id)} okText="Yes" cancelText="No">
                            <Button style={{ marginLeft: 10 }}>
                                <Translate text={`Delete`} />
                            </Button>
                        </Popconfirm>
                        <Button style={{ marginLeft: 10 }} onClick={() => this.setState({
                            setup_appointment_modal: true,
                            bfile
                        })}>
                            <Translate text={`Setup Appointment`} />
                        </Button>
                    </div>
                ),
                reactivate_action: (
                    <div>
                        <Button onClick={() => this.reactivate(bfile.id)}>
                            <Translate text={`Re-activate`} />
                        </Button>
                    </div>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{ paddingTop: 7 }}>
                            <Icon type="folder" style={{ marginRight: 10, color: "#1890ff" }} />
                            <Translate text={title} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Row gutter={16} style={{ width: 800, maxWidth: '100%' }} type="flex" justify="end">
                            <Col span={24} style={{ flex: 1 }}>
                                <Row gutter={16} type="flex" justify="end">
                                    <Col span={24} style={{ flex: 1 }}>
                                        <InputGroup compact style={{ whiteSpace: 'nowrap' }}>
                                            <div><Icon type="swap" style={{ marginTop: 10, marginRight: 10, color: "#1890ff" }} /></div>
                                            <Select
                                                value={this.state.orderBy}
                                                style={{ minWidth: 150 }}
                                                onChange={(val) => {
                                                    this.setState({ orderBy: val }, () => {
                                                        this.updateFilters()
                                                    })
                                                }}
                                            >
                                                <Option value={'id'}>{"Order by..."}</Option>
                                                <Option value={'created_on'}>{"Date"}</Option>
                                                <Option value={'last_name'}>{"Customer Name"}</Option>
                                                <Option value={'expiration_date'}>{"Expiration Date"}</Option>
                                                <Option value={'rs_scheduled_date'}>{"Scheduled Date"}</Option>
                                            </Select>

                                            <Select
                                                value={this.state.orderBySort}
                                                style={{ minWidth: 100 }}
                                                onChange={(val) => {
                                                    this.setState({ orderBySort: val }, () => {
                                                        this.updateFilters()
                                                    })
                                                }}
                                            >
                                                <Option value={'asc'}>{"Asc."}</Option>
                                                <Option value={'desc'}>{"Desc."}</Option>
                                            </Select>
                                        </InputGroup>
                                    </Col>
                                    <Col span={24} style={{ flex: 1 }}>
                                        <Translator>
                                            {({ translate }) => (
                                                <Input prefix={<Icon type="search" />} placeholder={translate({ text: `Search` }) + '...'} style={{ width: '100%' }} onChange={(e) => this.setState({ search: e.target.value })} onPressEnter={this.updateFilters.bind(this)} />
                                            )}
                                        </Translator>
                                    </Col>
                                    {user.user_type === 'EFS' || user.user_type === 'REVIEWSCHEDULER' ? (
                                        <Col span={24} style={{ flex: 1 }}>
                                            <Select value={this.state.agency} style={{ width: '100%' }} onChange={(val) => {
                                                this.setState({ agency: val }, () => {
                                                    if (user.user_type === 'REVIEWSCHEDULER') {
                                                        window.localStorage.rs_agency_id = val;
                                                    } else {
                                                        window.localStorage.efs_agency_id = val;
                                                    }
                                                    this.updateFilters()
                                                })
                                            }}>
                                                <Option value={''}>{"Filter by Agency"}</Option>
                                                {agencies.map((agency, i) => (
                                                    <Option key={i} value={agency.id}>{agency.name}</Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    ) : null}
                                </Row>
                            </Col>
                            {this.state.date_range ? (
                                <Col md={14} span={24}>
                                    <Row gutter={16}>
                                        <Col md={20} span={24}>
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                value={[moment(start_date), moment(end_date)]}
                                                onChange={this.onChangeDateRange}
                                                format={dateFormat}
                                            />
                                        </Col>
                                        <Col md={4} span={24}>
                                            {this.state.periodAll ? (
                                                <Button style={{ width: '100%' }} type="primary" onClick={this.all.bind(this)}>
                                                    <Translate text={`All`} />
                                                </Button>
                                            ) : (
                                                <Button style={{ width: '100%' }} onClick={this.all.bind(this)}>
                                                    <Translate text={`All`} />
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            ) : null}
                        </Row>
                    }
                >
                    {this.state.selectedRowKeys.length > 0 && (user.user_type === 'EA' || user.user_type === "LSP") ? (
                        <div className="toolbarButtons">
                            <Button type="default" onClick={this.delete_bfile.bind(this)}>
                                <Translate text={`Delete B-File`} />
                            </Button>
                            <Button type="default" onClick={this.transfer_bfile.bind(this)}>
                                <Translate text={`Transfer B-File`} />
                            </Button>
                            <Button type="default" onClick={this.change_creator.bind(this)}>
                                <Translate text={`Change Creator`} />
                            </Button>
                        </div>
                    ) : null}
                    {this.state.selectedRowKeys.length > 0 && user.user_type === 'REVIEWSCHEDULER' ? (
                        <div className="toolbarButtons">
                            <Button type="default" onClick={this.archive_bfile.bind(this)}>
                                <Translate text={`Archive B-File`} />
                            </Button>
                        </div>
                    ) : null}
                    {callpage === 'deleted' ? (
                        <Table
                            columns={columns}
                            dataSource={data}
                            bordered={false}
                            pagination={false}
                        />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={data}
                            bordered={false}
                            pagination={false}
                            rowSelection={rowSelection}
                        />
                    )}
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadCalls(page);
                    }} />
                </Card>
                {this.state.setup_appointment_modal ? (
                    <SetupAppointment
                        history={this.props.history}
                        showModal={this.state.setup_appointment_modal}
                        hideModal={() => this.setState({ setup_appointment_modal: false })}
                        bfile={this.state.bfile}
                        user={user}
                        {...this.props}
                    />
                ) : null}
                {this.state.transfer_bfile_modal ? (
                    <TransferBfile
                        history={this.props.history}
                        showModal={this.state.transfer_bfile_modal}
                        hideModal={() => this.setState({ transfer_bfile_modal: false })}
                        bfiles={this.state.selectedBfiles}
                        user={user}
                        done={() => {
                            this.setState({
                                transfer_bfile_modal: false,
                                selectedBfiles: [],
                                selectedRowKeys: []
                            }, () => {
                                this.loadCalls(1);
                            });
                        }}
                        {...this.props}
                    />
                ) : null}
                {this.state.change_creator_modal ? (
                    <ChangeCreator
                        history={this.props.history}
                        showModal={this.state.change_creator_modal}
                        hideModal={() => this.setState({ change_creator_modal: false })}
                        bfiles={this.state.selectedBfiles}
                        user={user}
                        done={() => {
                            this.setState({
                                change_creator_modal: false,
                                selectedBfiles: [],
                                selectedRowKeys: []
                            }, () => {
                                this.loadCalls(1);
                            });
                        }}
                        {...this.props}
                    />
                ) : null}
            </div>
        );

    }
}

export default CallPage;
