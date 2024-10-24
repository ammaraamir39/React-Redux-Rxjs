import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    Select,
    Radio,
    Icon,
    Spin,
    message
} from 'antd';
import { Translate } from 'react-translated';
import AddressField from '../../components/address-field';
import axios from 'axios';
import F from '../../Functions';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import uploadEZ from './uploadEZ';

const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const yearsDropdown = [];
for (let i = 1900; i < 2026; i++) {
    yearsDropdown.push(i);
}
const { TextArea } = Input;

class NewQuote extends Component {
    state = {
        loading: false,
        quote_id: null,
        childs: [
            {
                name: null,
                birthday: null,
                is_home: null,
                gpa: null
            }
        ],
        autos: [
            {
                loading: false,
                yr: null,
                make: null,
                makeOptions: [],
                model: null,
                modelOptions: [],
                vin: null,
                is_own_or_lease: null,
                collision: null,
                collision_type: null,
                comp: null,
                towing: null,
                ext_trans_expense: null
            }
        ],
        wizard: {
            agency_id: null,
            first_name: null,
            last_name: null,
            birthday: null,
            education: null,
            occupation: null,
            industry: null,
            employer: null,
            occupation_years: null,
            spouse_first_name: null,
            spouse_last_name: null,
            spouse_birthday: null,
            spouse_education: null,
            spouse_industry: null,
            spouse_occupation: null,
            spouse_employer: null,
            spouse_occupation_years: null,
            address_type: null,
            address: null,
            how_long_address: null,
            previous_address: null,
            mobile: null,
            phone: null,
            business_phone: null,
            email: null,
            additional_occupants: null,
            verified_customer_reports: null,
            number_of_stories: null,
            home_current_insurance_co: null,
            home_number_of_years: null,
            home_liability_limit: null,
            deductible: null,
            year_built: null,
            sq_ft: null,
            style: null,
            foundation: null,
            finished_perc: null,
            exterior_primary: null,
            exterior_secondary: null,
            garage: null,
            kitchen: null,
            num_of_bth_full: null,
            half: null,
            deck_porch: null,
            sq_ft2: null,
            shed: null,
            heating_type: null,
            fireplace_stove: null,
            central_air: null,
            age_of_roof: null,
            renovations: null,
            pool_hot_tub: null,
            trampoline: null,
            locked_fenced_gated: null,
            dogs: null,
            breed: null,
            other_properties: null,
            auto_insurance_co: null,
            auto_number_of_years: null,
            prior_bi_limits: null,
            coordination_of_medical: null,
            waive_work_loss: null,
            additional_drivers: null,
            tickets_accidents_claims: null,
            do_own_secondary_vehicles: null,
            additional_notes: null,
            have_home: 0,
            have_auto: 0,
            bfile_id: null,
            roof_type: null
        }   
    }
    componentDidMount() {
        if ("quote_id" in this.props.match.params) {
            const { quote_id } = this.props.match.params;
            axios.get("/api/quotes/" + quote_id).then((res) => {
                let wizard = res.data;
                const childs = (wizard.childs && wizard.childs !== '') ? JSON.parse(wizard.childs) : [{
                    name: null,
                    birthday: null,
                    is_home: null,
                    gpa: null
                }];
                const autos = (wizard.autos && wizard.autos !== '') ?  JSON.parse(wizard.autos) : [{
                    loading: false,
                    yr: null,
                    make: null,
                    makeOptions: [],
                    model: null,
                    modelOptions: [],
                    vin: null,
                    is_own_or_lease: null,
                    collision: null,
                    collision_type: null,
                    comp: null,
                    towing: null,
                    ext_trans_expense: null
                }];
                delete wizard.childs;
                delete wizard.autos;
                this.setState({
                    quote_id,
                    wizard,
                    autos,
                    childs
                })
            });
        } else {
            const { wizard } = this.state;
            axios.get("/api/user").then((res) => {
                const u = res.data;
                for (let i=0; i < u.user_agency_assoc.length; i++) {
                    wizard.agency_id = u.user_agency_assoc[i].agency_id;
                }
                wizard.user_id = u.id;
                this.setState({ wizard });
            }).catch(() => {
                message.error(F.translate("User not logged in."));
                this.props.history.push('/login');
            });
        }
    }
    updateField(name, value) {
        const { wizard } = this.state;
        wizard[name] = value;
        this.setState({ wizard });
    }
    updateChildField(i, name, value) {
        const { childs } = this.state;
        childs[i][name] = value;
        this.setState({ childs });
    }
    updateAutoField(i, name, value) {
        const { autos } = this.state;
        autos[i][name] = value;
        this.setState({ autos });
    }
    addChild() {
        const { childs } = this.state;
        childs.push({
            name: null,
            birthday: null,
            is_home: null,
            gpa: null
        })
        this.setState({ childs });
    }
    removeChild(i) {
        const { childs } = this.state;
        childs.splice(i, 1);
        this.setState({ childs });
    }
    addAuto() {
        const { autos } = this.state;
        autos.push({
            loading: false,
            yr: null,
            make: null,
            makeOptions: [],
            model: null,
            modelOptions: [],
            vin: null,
            is_own_or_lease: null,
            collision: null,
            collision_type: null,
            comp: null,
            towing: null,
            ext_trans_expense: null
        })
        this.setState({ autos });
    }
    removeAuto(i) {
        const { autos } = this.state;
        autos.splice(i, 1);
        this.setState({ autos });
    }
    decodeVIN(i, vin, year) {
        const { autos } = this.state;
        if (vin && year && vin !== "" && year !== "") {
            autos[i].loading = true;
            this.setState({ autos })
            axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/"+vin+"?format=json&modelyear="+year).then((res) => {
                const data = res.data;
                const makeOptions = [];
                const modelOptions = [];
                if ("Results" in data && data.Results.length > 0) {
                    for (let i = 0; i < data.Results.length; i++) {
                        const item = data.Results[i];
                        makeOptions.push(item.Make);
                        modelOptions.push(item.Model);
                    }
                }
                autos[i].loading = false;
                autos[i].makeOptions = makeOptions;
                autos[i].modelOptions = modelOptions;
                this.setState({ autos });
            });
        }
    }
    submit(redir) {
        const { wizard, childs, autos } = this.state;

        if (!wizard.first_name || !wizard.last_name || !wizard.birthday || !wizard.address || !wizard.how_long_address || !wizard.phone) {
            message.error('Please fill all required fields.');
            return false;
        }

        let data = wizard;
        data.childs = JSON.stringify(childs);
        data.autos = JSON.stringify(autos);

        this.setState({ loading: true })


        axios.post("/api/quotes", data).then((res) => {

            const quote_id = res.data.id;

            data = {
                agency_id: data.agency_id,
                first_name: data.first_name,
                address: data.address,
                zipcode: '',
                city: '',
                state: '',
                address_cont: '',
                employed_toggle: (data.employer) ? 1 : 0,
                employer_name: data.employer,
                employer_years: data.occupation_years,
                email: data.email,
                home_toggle: data.have_home,
                last_name: data.last_name,
                phone: data.phone,
                primary_vehicles_toggle: data.have_auto,
                spouse_first_name: data.spouse_first_name,
                spouse_last_name: data.spouse_last_name,
                spouse_toggle: (data.spouse_first_name) ? 1 : 0,
                status: 'New Bfile',
                children: childs.length,
                birthday: (data.birthday) ? moment(data.birthday).format("MM/DD/YYYY") : null,
                spouse_birthday: (data.spouse_birthday) ? moment(data.spouse_birthday).format("MM/DD/YYYY") : null,
                user_id: data.user_id
            }
    
            let ajax = null;
            if (data.bfile_id) {
                ajax = axios.put("/api/b_file/"+data.bfile_id, data);
            } else {
                ajax = axios.post("/api/b_file", data);
            }
            ajax.then((res) => {
                axios.put("/api/quotes/" + quote_id, {
                    bfile_id: res.data.id
                });
                this.setState({
                    loading: false,
                    quote_id
                }, () => {
                    if (typeof redir !== "undefined" && redir) {
                        this.props.history.push('/customer/' + res.data.id);
                    } else {
                        this.props.history.push('/dashboard');
                    }
                })
            });
        });
    }
    save() {
        const { quote_id, wizard, childs, autos } = this.state;
        this.setState({ loading: true });
        let data = wizard;
        data.childs = JSON.stringify(childs);
        data.autos = JSON.stringify(autos);
        axios.put("/api/quotes/" + quote_id, data).then((res) => {
            this.setState({ loading: false }, () => {
                this.props.history.push('/dashboard');
            });
        });
    }
    uploadEz() {
        const { wizard, childs, autos } = this.state;

        if (!wizard.first_name || !wizard.last_name || !wizard.birthday || !wizard.address || !wizard.how_long_address || !wizard.phone) {
            message.error('Please fill all required fields.');
            return false;
        }

        this.setState({ loading: true })
        uploadEZ({ wizard, childs, autos }, (res) => {
            this.setState({ loading: false })
            if (res.data.success) {
                message.success('File uploaded successfully.');
            } else {
                message.error(res.data.error);
            }
        })
    }
    render() {
        const { loading, wizard } = this.state;

        let less_than_2years = false;
        if (wizard.how_long_address === 'Less Than 1 Year' ) less_than_2years = true;
        if (wizard.how_long_address === '1 Year' ) less_than_2years = true;
        const top_companies = ['Other Standard', 'other non-standard', 'no prior insurance', '21st Century', 'AAA', 'AAANCNU', 'AARP', 'Acuity', 'Adirondack Ins Exchange', 'Aegis', 'AIG', 'Alfa Alliance', 'Allianz of America', 'Allianz of America-Jefferson', 'Allied Trust', 'Allied', 'Allmerica', 'Allstate', 'America First', 'American Commerce', 'American Family', 'American Freedom Insurance Company', 'American Integrity', 'American Risk Insurance', 'American Traditions', 'Amica', 'AmShield', 'Anchor Insurance', 'Andover Companies', 'ASI Lloyds', 'Atlantic Mutual', 'Atlas General Agency', 'Austin Mutual', 'Auto-Owners', 'Badger Mutual Insurance Company', 'Badger Mutual', 'Balboa', 'Bankers', 'Beacon National', 'Bear River Mutual', 'Berkshire Hathaway GUARD', 'Brethren Mutual Insurance Company', 'Bunker Hill', 'Cabrillo Coastal', 'California Casualty', 'Capital Insurance Group', 'Capitol Preferred', 'Celina', 'Centauri', 'Central Mutual of Omaha OH', 'Century National', 'Chautauqua Patrons Insurance Company', 'Chubb', 'Cincinnati Casualty', 'Cincinnati Insurance', 'Citizens', 'CNA', 'Colorado Casualty', 'Commonwealth', 'Concord Group Insurance', 'Consumers Insurance', 'Countryway Insurance Co', 'CSE', 'Cumberland', 'Cypress', 'Dairyland', 'Delta Lloyds Insurance Company', 'Donegal', 'Edison Insurance Company', 'Electric', 'EMC', 'Encompass', 'Enumclaw Insurance', 'Eerie', 'Esurance', 'Excelsior Insurance Company', 'Fair Plan', 'Farm Bureau', 'Farmers of Salem', 'Farmers', 'FedNat Insurance Company', 'Fidelity', 'Fireman’s Fund', 'First American', 'Flagship Insurance', 'Florida Family', 'Florida Peninsula', 'Florida Specialty', 'Frankenmuth Mutual Insurance Company', 'Geico', 'General Casualty', 'Germantown Mutual', 'GMAC', 'Goodville Mutual', 'Grange', 'GRE/Go America', 'Great American', 'Grinnell', 'Guide One', 'GulfStream', 'Hallmark Insurance Company', 'Hanover', 'Harleysville', 'Hartford OMNI', 'Hartford', 'Hastings Mutual', 'Hawkeye Security', 'Heritage P/C', 'Hippo Insurance', 'Homeowners of America', 'Horace Mann', 'Houston General', 'Imperial Fire and Casualty Insurance', 'Indiana Farmers', 'Indiana', 'Insurors Indemnity', 'Integon', 'Integrity', 'Interboro Insurance Company', 'Kemper', 'LeMars Insurance', 'Liberty Mutual', 'Liberty Northwest', 'LightHouse', 'Lititz Mutual', 'Lloyds', 'Madison Mutual Insurance Company', 'Maidstone Insurance Company', 'Mainstreet America', 'Maison Insurance', 'MAPFRE', 'Merchants Group', 'Mercury', 'MetLife', 'Michigan Insurance Company', 'Michigan Millers Mutual Insurance Company', 'Midwestern Indemnity', 'MissionSelect Insurance Services', 'MMG Insurance Company', 'Modern USA', 'Monarch National Ins Co', 'Montgomery', 'Motorists Mutual', 'MSA', 'Mutual Benefit', 'Mutual of Enumclaw', 'National General One Choice', 'National Lloyds Insurance Company', 'Nationwide', 'Nationwide-Scottsdale', 'New York Central Mutual', 'NJSkylands', 'NLC Insurance Companies', 'Northern Neck Insurance Company', 'Northstar', 'Ohio Casualty', 'Ohio Mutual', 'Omaha P/C', 'One Beacon', 'Oregon Mutual', 'Pacific Specialty Insurance Company', 'Pacific Specialty', 'Patriot Insurance', 'Patrons Oxford', 'Peerless', 'Peerless/Montgomery', 'Pekin', 'PEMCO Insurance', 'Peninsula Insurance Companies', 'Penn National', 'Pioneer State Mutual', 'Plymouth Rock', 'Preferred Mutual', 'Prepared Insurance Company', 'Progressive', 'Providence Mutual Fire Insurance Company', 'Prudential', 'QVE', 'Quincy Mutual', 'RAM Mutual Insurance Company', 'Republic', 'Rockford Mutual', 'Rockingham Casualty Company', 'Royal and Son Alliance', 'Safeco', 'SECURA', 'Selective', 'Service Insurance Company', 'Sheboygan Falls Insurance', 'Shelter Insurance', 'Southern Fidelity P/C', 'Southern Fidelity', 'Southern Mutual', 'Southern Oak Insurance Company', 'Southern Trust', 'St. Johns', 'St. Paul/Travelers', 'Standard Mutual', 'State Auto', 'State Farm', 'Sterling Insurance Company', 'Stillwater Property and Casualty', 'Sublimity Insurance Company', 'The Philadelphia Contributionship XML', 'Titan', 'Tower', 'Towerhill', 'Travelers', 'TWFG', 'TWICO', 'Unigard', 'United Fire and Casualty', 'United Heritage Property and Casualty Company', 'United Home', 'Unitrin', 'Universal North America', 'Universal Property and Casualty Insurance Company', 'Universal/Arrowhead Insurance Company', 'UPCIC', 'USAA', 'Utica First Insurance Company', 'Utica National Insurance', 'Utica National', 'Velocity Risk Underwriters LLC', 'Vermont Mutual', 'Wellington Select', 'Wellington Standard', 'West Bend', 'Western National', 'Western Reserve Group', 'Westfield', 'White Mountains', 'Wilson Mutual', 'Windsor', 'Zurich'];
        const industries = {
            "Homemaker/house person": [
                "Homemaker/house person"
            ],
            "Retired": [
                "Retired"
            ],
            "Disabled": [
                "Disabled"
            ],
            "Unemployed": [
                "Unemployed"
            ],
            "Student": [
                "Graduate Student", "Highschool", "Other", "Undergraduate"
            ],
            "Agriculture/forestry/fishing": [
                "Agriculture Inspector/Grader", "Arborist", "Clerk", "Equipment Operator", "Farm/Ranch Owner", "Farm/Ranch Worker", "Fisherman", "Florist", "Laborer/Vorker", "Landscaper/Nursery Worker", "Landscaper", "Logger", "Mill worker", "Other", "Ranger", "Supervisor", "Timber Grader/Scale"
            ],
            "Art/design/media": [
                "Actor", "Administrative Assistant", "Announcer/Broadcaster", "Artist/Animator", "Author/Writer", "Choreography/Dancer", "Clerk", "Composer/Director", "Curator", "Designer", "Editor", "Journalist/Reporter", "Musician/Singer", "Other", "Printer", "Producer", "Production Crew", "Projectionist", "Receptionist/Secretary", "Ticket Sales/Usher"
            ],
            "Banking/finance/real estate": [
                "Accountant/Auditor", "Administrative Assistant", "Analyst/Broker", "Bookkeeper", "Branch Manager", "Clerk", "Collections", "Consultant", "Controller", "CSR/Teller", "Director/Administrator", "Executive", "Financial Advisor", "Investment Banker", "Investor", "Loan/Escrow Processor", "Manager-Credit/Loan", "Manager-Portfolio/Production", "Manager-Property ", "Other", "Realtor", "Receptionist/Secretary", "Sales Agent/Representative", "Trader, Financial Instruments", "Underwriter"
            ],
            "Business/sales/office": [
                "Account Executive", "Administrative Assistant", "Buyer", "Clerk-Office", "Consultant", "Customer Service Representative", "Director/Administrator", "Executive", "H.R. Representative", "Marketing Researcher", "Messenger/Courier", "Manager - District", "Manager - Finance", "Manager - Department/Store", "Manager - General Operations", "Manager - H.R./Public Relations", "Manager - Marketing/Sales", "Manager/Supervisor - Office", "Other ", "Receptionist/Secretary", "Sales-Counter/Rental", "Sales-Home Based", "Sales-Manufacture Rep", "Sales-Retail/Wholesale", "Sales-Route/Vendor"
            ],
            "Construction/energy trades": [
                "Boiler Operator/Maker", "Bricklayer/Mason", "Carpenter", "Carpet Installer", "Concrete Worker", "Construction - Project Manager", "Contractor", "Crane Operator", "Electrician/Linesman", "Elevator Technician/Installer", "Equipment Operator", "Floor Layer/Finisher", "Foreman/Supervisor", "Handyman", "Heat/Air Technician", "Inspector", "Laborer/Worker", "Metalworker", "Miner", "Oil/Gas Driller/Rig Operator", "Other", "Painter", "Plaster/Drywall/Stucco", "Plumber", "Roofer"
            ],
            "Education/library": [
                "Administrative Assistant", "Audio-Visual Tech.", "Child/Daycare Worker", "Clerk", "Counselor", "Graduate Teaching Assistant", "Instructor-Vocation", "Librarian/Curator", "Other", "Professor, College", "Receptionist/Secretary", "Superintendent", "Teacher, College", "Teacher, K-12", "Teaching Assistant/Aide", "Tutor"
            ],
            "Engineer/architect/science/math": [
                "Actuary", "Administrative", "Assistant", "Analyst", "Architect", "Clerk", "Clinical Data Coordinator", "Drafter", "Engineer", "Manager-Project", "Manager-R&D", "Mathematician", "Other", "Receptionist/Secretary", "Research Program Director", "Researcher", "Scientist", "Sociologist", "Surveyor/Mapmaker", "Technician"
            ],
            "Government/military": [
                "Accountant/Auditor", "Administrative Assistant", "Analyst", "Attorney", "Chief Executive", "Clerk", "Commissioner", "Council member", "Director/Administrator", "Enlisted Military Personnel (E1-4)", "Legislator", "Mayor/City Manager", "Meter Reader", "NCO (E5-9)", "Officer-Commissioned", "Officer-Warrant", "Other", "Park Ranger", "Planner ", "Postmaster", "Receptionist/Secretary", "Regulator", "US Postal Worker"
            ],
            "Information technology": [
                "Administrative Assistant", "Analyst", "Clerk", "Director/Administrator", "Engineer-Hardware", "Engineer-Software", "Engineer-Systems", "Executive", "Manager-Systems", "Network Administrator", "Other", "Programmer", "Project Coordinator", "Receptionist/Secretary", "Support Technician", "Systems Security", "Technical Writer", "Web Developer"
            ],
            "Insurance, legal/law enforcement/security": [
                "Accountant/Auditor", "Actuarial Clerk", "Actuary", "Administrative Assistant", "Agent/Broker", "Analyst", "Attorney", "Claims Adjuster", "Clerk", "Commissioner", "Customer Service Representative", "Director/Administrator", "Executive", "Other", "Product Manager", "Receptionist/Secretary", "Sales Representative", "Underwriter"
            ],
            "Maintenance/repair/housekeeping": [
                "Building Maintenance Engineer", "Custodian/Janitor", "Electrician", "Field Service Technician", "Handyman", "Heat/Air Conditioner Repairman", "Housekeeper/Maid", "Landscape/Grounds Maintenance", "Maintenance Mechanic", "Mechanic", "Other"
            ],
            "Manufacturing/production": [
                "Administrative Assistant", "Clerk", "Factory Worker", "Foreman/Supervisor", "Furniture Finisher", "Inspector", "Jeweler", "Machine Operator", "Other", "Packer", "Plant Manager", "Printer/Bookbinder", "Quality Control", "Receptionist/Secretary", "Refining Operator", "Shoemaker", "Tailor/Custom Sewer", "Textile Worker", "Upholsterer"
            ],
            "Medical/social services/religion": [
                "Administrative Assistant", "Assistant - Medic/Dent/Vet", "Clergy", "Clerk", "Client Care Worker", "Dental Hygienist", "Dentist", "Doctor", "Hospice Volunteer", "Mortician", "Nurse - C.N.A.", "Nurse - LPN", "Nurse - RN", "Nurse Practitioner", "Optometrist", "Other", "Paramedic/E.M. Technician", "Pharmacist", "Receptionist/Secretary ", "Social Worker", "Support services", "Technician", "Therapist", "Veterinarian"
            ],
            "Personal care/service": [
                "Caregiver", "Dry Cleaner/Laundry", "Hair Stylist/Barber", "Housekeeper", "Manicurist", "Masseuse", "Nanny", "Other", "Pet Services", "Receptionist/Secretary"
            ],
            "Restaurant/hotel services": [
                "Baker", "Bartender", "Bellhop", "Bus Person", "Caterer", "Chef", "Concessionaire", "Concierge", "Cook - Restaurant/Cafeteria", "Cook/Worker-Fast Food", "Delivery Person", "Desk Clerk", "Dishwasher", "Food Production/Packing", "Host/Maitre d", "Housekeeper/Maid", "Manager", "Other", "Valet"
            ],
            "Sports/recreation": [
                "Activity/Recreational Assistant", "Administrative Assistant", "Agent", "Athlete", "Camp Counselor/Lead", "Clerk", "Coach", "Concessionaire", "Director, Program", "Event Manager/Promoter", "Life Guard", "Manager - Fitness Club", "Other", "Park Ranger", "Receptionist/Secretary", "Sales-Ticket/Membership", "Sports Broadcaster/Journalist", "Trainer/Instructor", "Umpire/Referee"
            ],
            "Travel/transportation/warehousing": [
                "Administrative Assistant", "Air Traffic Control", "Airport Operations Crew", "Bellhop/Porter", "Clerk", "Crane Loader/Operator", "Dispatcher", "Driver - Bus/Streetcar", "Driver-Taxi/Limo", "Driver-Truck/Delivery", "Flight Attendant", "Forklift Operator", "Laborer", "Longshoreman", "Mate/Sailor", "Manager - Warehouse/District", "Other", "Parking Lot Attendant", "Pilot/Captain/Engineer", "Railroad Worker", "Receptionist/Secretary", "Shipping/Receiving Clerk", "Subway/Light Rail Operator", "Ticket Agent", "Transportation Specialist"
            ],
            "Other": ["Other"]
        };

        return (
            <div id="new-quote">
                <Card type="inner" title={<Translate text={`Quote`} />} loading={loading} style={{marginBottom: 20}}>
                    <Spin indicator={antIcon} spinning={loading}>
                        <div>
                            <div className="new_quote">
                                <h1>Quote</h1>
                                <Row gutter={16}>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`First Name`} /> *</label>
                                            <Input value={wizard.first_name} onChange={(e) => this.updateField('first_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Last Name`} /> *</label>
                                            <Input value={wizard.last_name} onChange={(e) => this.updateField('last_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Date of Birth`} /> *</label>
                                            <DatePicker
                                                dateFormat="MM/dd/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                style={{width: '100%'}}
                                                value={new Date(wizard.birthday)}
                                                selected={
                                                    (wizard.birthday && wizard.birthday !== "")
                                                    ? new Date(wizard.birthday)
                                                    : null
                                                }
                                                onChange={(val) => {
                                                    const date = moment(val).format("MM/DD/YYYY");
                                                    this.updateField('birthday', date)
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Education`} /></label>
                                            <Select value={wizard.education} style={{ width: '100%' }} onChange={(value) => this.updateField('education', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                <Option value={'High School'}><Translate text={`High School`} /></Option>
                                                <Option value={'Associate'}><Translate text={`Associate`} /></Option>
                                                <Option value={'Bachelor'}><Translate text={`Bachelor`} /></Option>
                                                <Option value={'Masters'}><Translate text={`Masters`} /></Option>
                                                <Option value={'Doctorate'}><Translate text={`Doctorate`} /></Option>
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Industry`} /></label>
                                            <Select value={wizard.industry} style={{ width: '100%' }} onChange={(value) => {
                                                this.updateField('industry', value);
                                                this.updateField('occupation', null);
                                            }}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                {Object.keys(industries).map((industry, i) => (
                                                    <Option value={industry} key={i}>
                                                        <Translate text={industry} />
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Occupation`} /></label>
                                            <Select value={wizard.occupation} style={{ width: '100%' }} onChange={(value) => this.updateField('occupation', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                {wizard.industry && wizard.industry in industries && industries[wizard.industry].map((item, i) => (
                                                    <Option value={item} key={i}>
                                                        <Translate text={item} />
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Employer`} /></label>
                                            <Input value={wizard.employer} onChange={(e) => this.updateField('employer', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Years`} /></label>
                                            <Select value={wizard.occupation_years} style={{ width: '100%' }} onChange={(value) => this.updateField('occupation_years', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                <Option value={'Less Than 1 Year'}><Translate text={`Less Than 1 Year`} /></Option>
                                                <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                                {[...Array(69).keys()].map((i) => (
                                                    <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Spouse First Name`} /></label>
                                            <Input value={wizard.spouse_first_name} onChange={(e) => this.updateField('spouse_first_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Spouse Last Name`} /></label>
                                            <Input value={wizard.spouse_last_name} onChange={(e) => this.updateField('spouse_last_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Spouse Date of Birth`} /></label>
                                            <DatePicker
                                                dateFormat="MM/dd/yyyy"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                style={{width: '100%'}}
                                                value={new Date(wizard.spouse_birthday)}
                                                selected={
                                                    (wizard.spouse_birthday && wizard.spouse_birthday !== "")
                                                    ? new Date(wizard.spouse_birthday)
                                                    : null
                                                }
                                                onChange={(val) => {
                                                    const date = moment(val).format("MM/DD/YYYY");
                                                    this.updateField('spouse_birthday', date)
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Education`} /></label>
                                            <Select value={wizard.spouse_education} style={{ width: '100%' }} onChange={(value) => this.updateField('spouse_education', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                <Option value={'High School'}><Translate text={`High School`} /></Option>
                                                <Option value={'Associate'}><Translate text={`Associate`} /></Option>
                                                <Option value={'Bachelor'}><Translate text={`Bachelor`} /></Option>
                                                <Option value={'Masters'}><Translate text={`Masters`} /></Option>
                                                <Option value={'Doctorate'}><Translate text={`Doctorate`} /></Option>
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Industry`} /></label>
                                            <Select value={wizard.spouse_industry} style={{ width: '100%' }} onChange={(value) => {
                                                this.updateField('spouse_industry', value);
                                                this.updateField('spouse_occupation', null);
                                            }}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                {Object.keys(industries).map((industry, i) => (
                                                    <Option value={industry} key={i}>
                                                        <Translate text={industry} />
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Occupation`} /></label>
                                            <Select value={wizard.spouse_occupation} style={{ width: '100%' }} onChange={(value) => this.updateField('spouse_occupation', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                {wizard.spouse_industry && wizard.spouse_industry in industries && industries[wizard.spouse_industry].map((item, i) => (
                                                    <Option value={item} key={i}>
                                                        <Translate text={item} />
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Employer`} /></label>
                                            <Input value={wizard.spouse_employer} onChange={(e) => this.updateField('spouse_employer', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Years`} /></label>
                                            <Select value={wizard.spouse_occupation_years} style={{ width: '100%' }} onChange={(value) => this.updateField('spouse_occupation_years', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                <Option value={'Less Than 1 Year'}><Translate text={`Less Than 1 Year`} /></Option>
                                                <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                                {[...Array(69).keys()].map((i) => (
                                                    <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="row_dynamic">
                                    {this.state.childs.map((child, i) => (
                                        <div key={i} className="item">
                                            <Row key={i} gutter={16}>
                                                <Col md={6} span={24}>
                                                    <div className="inputField">
                                                        <label><Translate text={`Child Name`} /></label>
                                                        <Input value={child.name} onChange={(e) => this.updateChildField(i, 'name', e.target.value)} />
                                                    </div>
                                                </Col>
                                                <Col md={6} span={24}>
                                                    <div className="inputField">
                                                        <label><Translate text={`DOB`} /></label>
                                                        <DatePicker
                                                            format="MM/DD/YYYY"
                                                            style={{width: '100%'}}
                                                            value={child.birthday}
                                                            onChange={(val) => this.updateChildField(i, 'birthday', val)}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6} span={24}>
                                                    <div className="inputField">
                                                        <label><Translate text={`Is home`} /></label>
                                                        <Select value={child.is_home} style={{ width: '100%' }} onChange={(value) => this.updateChildField(i, 'is_home', value)}>
                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                            <Option value={'Yes'}><Translate text={`Yes`} /></Option>
                                                            <Option value={'No'}><Translate text={`No`} /></Option>
                                                        </Select>
                                                    </div>
                                                </Col>
                                                <Col md={6} span={24}>
                                                    <div className="inputField">
                                                        <label><Translate text={`GPA`} /></label>
                                                        <Input value={child.gpa} onChange={(e) => this.updateChildField(i, 'gpa', e.target.value)} />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="addRemoveButtons">
                                                <Button className="add" onClick={this.addChild.bind(this)}>
                                                    <Translate text={`+`} />
                                                </Button>
                                                {this.state.childs.length > 1 ? (
                                                    <Button className="remove" onClick={() => this.removeChild(i)}>
                                                        <Translate text={`-`} />
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Row gutter={16}>
                                    <Col md={(less_than_2years) ? 6 : 8} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Address Type`} /></label>
                                            <Select value={wizard.address_type} style={{ width: '100%' }} onChange={(value) => this.updateField('address_type', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                <Option value={'Home'}><Translate text={`Home`} /></Option>
                                                <Option value={'Mailing'}><Translate text={`Mailing`} /></Option>
                                                <Option value={'Office'}><Translate text={`Office`} /></Option>
                                                <Option value={'Billing'}><Translate text={`Billing`} /></Option>
                                                <Option value={'Seasonal'}><Translate text={`Seasonal`} /></Option>
                                                <Option value={'Rental'}><Translate text={`Rental`} /></Option>
                                                <Option value={'Other'}><Translate text={`Other`} /></Option>
                                                <Option value={'Business'}><Translate text={`Business`} /></Option>
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col md={(less_than_2years) ? 6 : 8} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Address`} /> *</label>
                                            <AddressField value={wizard.address}
                                                onChange={(val) => this.updateField('address', val)}
                                                setCity={(val) => this.updateField('city', val)}
                                                setState={(val) => this.updateField('state', val)}
                                                setZipCode={(val) => this.updateField('zipcode', val)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={(less_than_2years) ? 6 : 8} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Time at Address?`} /> *</label>
                                            <Select value={wizard.how_long_address} style={{ width: '100%' }} onChange={(value) => this.updateField('how_long_address', value)}>
                                                <Option value={null}><Translate text={`Select...`} /></Option>
                                                <Option value={'Less Than 1 Year'}><Translate text={`Less Than 1 Year`} /></Option>
                                                <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                                {[...Array(11).keys()].map((i) => (
                                                    <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    {less_than_2years ? (
                                        <Col md={6} span={24}>
                                            <div className="inputField">
                                                <label><Translate text={`Previous Address`} /></label>
                                                <AddressField value={wizard.previous_address}
                                                    onChange={(val) => this.updateField('previous_address', val)}
                                                />
                                            </div>
                                        </Col>
                                    ) : null}
                                </Row>
                                <Row gutter={16}>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Cell`} /></label>
                                            <Input value={F.phone_format(wizard.mobile)} onChange={(e) => this.updateField('mobile', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Phone`} /></label>
                                            <Input value={F.phone_format(wizard.phone)} onChange={(e) => this.updateField('phone', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Business Phone`} /></label>
                                            <Input value={F.phone_format(wizard.business_phone)} onChange={(e) => this.updateField('business_phone', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={6} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Email`} /></label>
                                            <Input value={wizard.email} onChange={(e) => this.updateField('email', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`Additional Occupants`} /></label>
                                            <Input value={wizard.additional_occupants} onChange={(e) => this.updateField('additional_occupants', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <div className="inputField inputFieldRadio">
                                            <label><Translate text={`Verified Consumer Reports`} /></label>
                                            <RadioGroup value={wizard.verified_customer_reports} onChange={(e) => this.updateField('verified_customer_reports', e.target.value)}>
                                                <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <div className="toggleHomeAuto">
                                    <a 
                                        href="javascript:void(0)"
                                        onClick={() => {
                                            const { wizard } = this.state;
                                            wizard.have_home = (wizard.have_home) ? 0 : 1;
                                            this.setState({wizard});
                                        }}
                                        className={(this.state.show_home) ? 'active' : ''}
                                    >
                                        {this.state.wizard.have_home ? (
                                            <Icon type="close" />
                                        ) : (
                                            <Icon type="plus" />
                                        )}
                                        {' Home'}
                                    </a>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                            const { wizard } = this.state;
                                            wizard.have_auto = (wizard.have_auto) ? 0 : 1;
                                            this.setState({wizard});
                                        }}
                                        className={(this.state.show_auto) ? 'active' : ''}
                                    >
                                        {this.state.wizard.have_auto ? (
                                            <Icon type="close" />
                                        ) : (
                                            <Icon type="plus" />
                                        )}
                                        {' Auto'}
                                    </a>
                                </div>
                                
                                {this.state.wizard.have_home ? (
                                    <div>
                                        <h1>Home</h1>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Prior Carrier`} /> *</label>
                                                    <Select value={wizard.home_current_insurance_co} style={{ width: '100%' }} onChange={(value) => this.updateField('home_current_insurance_co', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {top_companies.map((val, i) => (
                                                            <Option key={i} value={val}><Translate text={val} /></Option>
                                                        ))}
                                                        <Option value={'None'}><Translate text={`None`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`# of Yrs`} /> *</label>
                                                    <Select value={wizard.home_number_of_years} style={{ width: '100%' }} onChange={(value) => this.updateField('home_number_of_years', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                                        {[...Array(24).keys()].map((i) => (
                                                            <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Personal Liability`} /></label>
                                                    <Select value={wizard.home_liability_limit} style={{ width: '100%' }} onChange={(value) => this.updateField('home_liability_limit', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'25,000'}><Translate text={`25,000`} /></Option>
                                                        <Option value={'50,000'}><Translate text={`50,000`} /></Option>
                                                        <Option value={'100,000'}><Translate text={`100,000`} /></Option>
                                                        <Option value={'200,000'}><Translate text={`200,000`} /></Option>
                                                        <Option value={'300,000'}><Translate text={`300,000`} /></Option>
                                                        <Option value={'400,000'}><Translate text={`400,000`} /></Option>
                                                        <Option value={'500,000'}><Translate text={`500,000`} /></Option>
                                                        <Option value={'1,000,000'}><Translate text={`1,000,000`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Deductible`} /></label>
                                                    <Select value={wizard.deductible} style={{ width: '100%' }} onChange={(value) => this.updateField('deductible', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'½%'}><Translate text={`½%`} /></Option>
                                                        <Option value={'1%'}><Translate text={`1%`} /></Option>
                                                        <Option value={'$100'}><Translate text={`$100`} /></Option>
                                                        <Option value={'$250'}><Translate text={`$250`} /></Option>
                                                        <Option value={'$500'}><Translate text={`$500`} /></Option>
                                                        <Option value={'$750'}><Translate text={`$750`} /></Option>
                                                        <Option value={'$1000'}><Translate text={`$1000`} /></Option>
                                                        <Option value={'$1500'}><Translate text={`$1500`} /></Option>
                                                        <Option value={'$2000'}><Translate text={`$2000`} /></Option>
                                                        <Option value={'$2500'}><Translate text={`$2500`} /></Option>
                                                        <Option value={'$3000'}><Translate text={`$3000`} /></Option>
                                                        <Option value={'$4000'}><Translate text={`$4000`} /></Option>
                                                        <Option value={'$5000'}><Translate text={`$5000`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Year Built`} /> *</label>
                                                    <Select value={wizard.year_built} style={{ width: '100%' }} onChange={(value) => this.updateField('year_built', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {[...Array(161).keys()].map((i) => (
                                                            <Option key={i} value={i + 1860}>{i + 1860}</Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Sq. Ft.'} /> *</label>
                                                    <Input value={wizard.sq_ft} onChange={(e) => this.updateField('sq_ft', e.target.value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Number of Stories'} /> *</label>
                                                    <Select value={wizard.number_of_stories} style={{ width: '100%' }} onChange={(value) => this.updateField('number_of_stories', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {["1", "1.5", "2", "2.5", "3", "3.5", "4", "bi-level", "tri-level", ].map((item, i) => (
                                                            <Option value={item} key={i}><Translate text={item} /></Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Construction Style`} /> *</label>
                                                    <Select value={wizard.style} style={{ width: '100%' }} onChange={(value) => this.updateField('style', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {["Apartment", "backsplit", "bi-level", "bi-level/row center", "bi-level/row end", "bungalow", "cape cod", "colonial", "condo", "coop", "contemporary", "cottage", "dwelling", "federal colonial", "Mediterranean", "ornate Victorian", "Queen Anne", "raised ranch", "rambler", "ranch", "rowhouse", "rowhouse center", "rowhouse end", "southwest adobe", "split foyer", "split level", "substandard", "townhouse", "townhouse center", "townhouse end", "tri-level", "tri-level center", "Victorian"].map((item, i) => (
                                                            <Option value={item} key={i}><Translate text={item} /></Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Foundation'} /> *</label>
                                                    <Input value={wizard.foundation} onChange={(e) => this.updateField('foundation', e.target.value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Exterior Primary'} /></label>
                                                    <Select value={wizard.exterior_primary} style={{ width: '100%' }} onChange={(value) => this.updateField('exterior_primary', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Wood'}><Translate text={`Wood`} /></Option>
                                                        <Option value={'Vinyl'}><Translate text={`Vinyl`} /></Option>
                                                        <Option value={'Aluminum'}><Translate text={`Aluminum`} /></Option>
                                                        <Option value={'T-111'}><Translate text={`T-111`} /></Option>
                                                        <Option value={'Brick'}><Translate text={`Brick`} /></Option>
                                                        <Option value={'Brick Veneer'}><Translate text={`Brick Veneer`} /></Option>
                                                        <Option value={'Cement Block'}><Translate text={`Cement Block`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Exterior Secondary'} /></label>
                                                    <Select value={wizard.exterior_secondary} style={{ width: '100%' }} onChange={(value) => this.updateField('exterior_secondary', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Wood'}><Translate text={`Wood`} /></Option>
                                                        <Option value={'Vinyl'}><Translate text={`Vinyl`} /></Option>
                                                        <Option value={'Aluminum'}><Translate text={`Aluminum`} /></Option>
                                                        <Option value={'T-111'}><Translate text={`T-111`} /></Option>
                                                        <Option value={'Brick'}><Translate text={`Brick`} /></Option>
                                                        <Option value={'Brick Veneer'}><Translate text={`Brick Veneer`} /></Option>
                                                        <Option value={'Cement Block'}><Translate text={`Cement Block`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Garage`} /> *</label>
                                                    <Select value={wizard.garage} style={{ width: '100%' }} onChange={(value) => this.updateField('garage', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'1 car det'}><Translate text={`1 car det`} /></Option>
                                                        <Option value={'2 car det'}><Translate text={`2 car det`} /></Option>
                                                        <Option value={'3 car det'}><Translate text={`3 car det`} /></Option>
                                                        <Option value={'1 car att'}><Translate text={`1 car att`} /></Option>
                                                        <Option value={'2 car att'}><Translate text={`2 car att`} /></Option>
                                                        <Option value={'3 car att'}><Translate text={`3 car att`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Kitchen`} /></label>
                                                    <Select value={wizard.kitchen} style={{ width: '100%' }} onChange={(value) => this.updateField('kitchen', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Builders Grade'}><Translate text={`Builders Grade`} /></Option>
                                                        <Option value={'Upgrade'}><Translate text={`Upgrade`} /></Option>
                                                        <Option value={'Semi-custom'}><Translate text={`Semi-custom`} /></Option>
                                                        <Option value={'Custom'}><Translate text={`Custom`} /></Option>
                                                        <Option value={'Designer'}><Translate text={`Designer`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`# of bth full`} /></label>
                                                    <Select value={wizard.num_of_bth_full} style={{ width: '100%' }} onChange={(value) => this.updateField('num_of_bth_full', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {[...Array(5).keys()].map((i) => (
                                                            <Option key={i} value={(i + 1)}>{(i + 1)}</Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Half`} /></label>
                                                    <Select value={wizard.half} style={{ width: '100%' }} onChange={(value) => this.updateField('half', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {[...Array(5).keys()].map((i) => (
                                                            <Option key={i} value={(i + 1)}>{(i + 1)}</Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Deck/Porch`} /></label>
                                                    <Select value={wizard.deck_porch} style={{ width: '100%' }} onChange={(value) => this.updateField('deck_porch', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Deck Cendar'}><Translate text={`Deck Cedar`} /></Option>
                                                        <Option value={'Deck Composite'}><Translate text={`Deck Composite`} /></Option>
                                                        <Option value={'Deck Wood'}><Translate text={`Deck Wood`} /></Option>
                                                        <Option value={'Open Porch'}><Translate text={`Open Porch`} /></Option>
                                                        <Option value={'Enclosed Porch'}><Translate text={`Enclosed Porch`} /></Option>
                                                        <Option value={'Open Breezeway'}><Translate text={`Open Breezeway`} /></Option>
                                                        <Option value={'Closed Breezeway'}><Translate text={`Closed Breezeway`} /></Option>
                                                        <Option value={'Balcony'}><Translate text={`Balcony`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Sq Ft`} /></label>
                                                    <Input value={wizard.sq_ft2} onChange={(e) => this.updateField('sq_ft2', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Shed`} /></label>
                                                    <Select value={wizard.shed} style={{ width: '100%' }} onChange={(value) => this.updateField('shed', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Metal Small'}><Translate text={`Metal Small`} /></Option>
                                                        <Option value={'Metal Medium'}><Translate text={`Metal Medium`} /></Option>
                                                        <Option value={'Metal Large'}><Translate text={`Metal Large`} /></Option>
                                                        <Option value={'Wood Small'}><Translate text={`Wood Small`} /></Option>
                                                        <Option value={'Wood Medium'}><Translate text={`Wood Medium`} /></Option>
                                                        <Option value={'Wood Large'}><Translate text={`Wood Large`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Heating Type`} /></label>
                                                    <Select value={wizard.heating_type} style={{ width: '100%' }} onChange={(value) => this.updateField('heating_type', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Electric'}><Translate text={`Electric`} /></Option>
                                                        <Option value={'Gas Forced Air'}><Translate text={`Gas Forced Air`} /></Option>
                                                        <Option value={'Geothermal'}><Translate text={`Geothermal`} /></Option>
                                                        <Option value={'Heat Pump'}><Translate text={`Heat Pump`} /></Option>
                                                        <Option value={'Hot Water Baseboard'}><Translate text={`Hot Water Baseboard`} /></Option>
                                                        <Option value={'Oil'}><Translate text={`Oil`} /></Option>
                                                        <Option value={'Propane'}><Translate text={`Propane`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Fireplace/Stove`} /></label>
                                                    <Select value={wizard.fireplace_stove} style={{ width: '100%' }} onChange={(value) => this.updateField('fireplace_stove', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Fireplace Wood Single'}><Translate text={`Fireplace Wood Single`} /></Option>
                                                        <Option value={'Fireplace Gas Single'}><Translate text={`Fireplace Gas Single`} /></Option>
                                                        <Option value={'Fireplace Electric'}><Translate text={`Fireplace Electric`} /></Option>
                                                        <Option value={'Fireplace Gas Double'}><Translate text={`Fireplace Gas Double`} /></Option>
                                                        <Option value={'Fireplace Wood Double'}><Translate text={`Fireplace Wood Double`} /></Option>
                                                        <Option value={'Wood Stove Freestanding'}><Translate text={`Wood Stove Freestanding`} /></Option>
                                                        <Option value={'Pellet Stove'}><Translate text={`Pellet Stove`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Central Air`} /></label>
                                                    <Select value={wizard.central_air} style={{ width: '100%' }} onChange={(value) => this.updateField('central_air', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Central Air Same Ducts'}><Translate text={`Central Air Same Ducts`} /></Option>
                                                        <Option value={'Central Air Seperate Ducts'}><Translate text={`Central Air Seperate Ducts`} /></Option>
                                                        <Option value={'Evaporative Cooler'}><Translate text={`Evaporative Cooler`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={6} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Roof Type'} /> *</label>
                                                    <Input value={wizard.roof_type} onChange={(e) => this.updateField('roof_type', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={6} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Age of Roof'} /> *</label>
                                                    <Input value={wizard.age_of_roof} onChange={(e) => this.updateField('age_of_roof', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={6} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Renovations'} /> *</label>
                                                    <Input value={wizard.renovations} onChange={(e) => this.updateField('renovations', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={6} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={'Pool/Hot Tub'} /> *</label>
                                                    <Select value={wizard.pool_hot_tub} style={{ width: '100%' }} onChange={(value) => this.updateField('pool_hot_tub', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'Above Ground Small'}><Translate text={`Above Ground Small`} /></Option>
                                                        <Option value={'Above Ground Medium'}><Translate text={`Above Ground Medium`} /></Option>
                                                        <Option value={'Above Ground Large'}><Translate text={`Above Ground Large`} /></Option>
                                                        <Option value={'Inground Small'}><Translate text={`Inground Small`} /></Option>
                                                        <Option value={'Inground Medium'}><Translate text={`Inground Medium`} /></Option>
                                                        <Option value={'Inground Large'}><Translate text={`Inground Large`} /></Option>
                                                        <Option value={'Hot Tub/Jacuzzi'}><Translate text={`Hot Tub/Jacuzzi`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                        </Row>


                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField inputFieldRadio">
                                                    <label><Translate text={`Trampoline`} /> *</label>
                                                    <RadioGroup value={wizard.trampoline} onChange={(e) => this.updateField('trampoline', e.target.value)}>
                                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                                    </RadioGroup>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField inputFieldRadio">
                                                    <label><Translate text={`Locked, fenced & gated`} /> *</label>
                                                    <RadioGroup value={wizard.locked_fenced_gated} onChange={(e) => this.updateField('locked_fenced_gated', e.target.value)}>
                                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                                    </RadioGroup>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField inputFieldRadio">
                                                    <label><Translate text={`Dogs`} /> *</label>
                                                    <RadioGroup value={wizard.dogs} onChange={(e) => this.updateField('dogs', e.target.value)}>
                                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                                    </RadioGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={12} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Breed`} /> *</label>
                                                    <Input value={wizard.breed} onChange={(e) => this.updateField('breed', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={12} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Properties other than primary residence?`} /> *</label>
                                                    <Input value={wizard.other_properties} onChange={(e) => this.updateField('other_properties', e.target.value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : null}

                                {this.state.wizard.have_auto ? (
                                    <div>
                                        <h1>Auto</h1>
                                        <Row gutter={16}>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Prior Carrier`} /> *</label>
                                                    <Select value={wizard.auto_insurance_co} style={{ width: '100%' }} onChange={(value) => this.updateField('auto_insurance_co', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        {top_companies.map((val, i) => (
                                                            <Option key={i} value={val}><Translate text={val} /></Option>
                                                        ))}
                                                        <Option value={'None'}><Translate text={`None`} /></Option>
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Yrs W/Prior`} /> *</label>
                                                    <Select value={wizard.auto_number_of_years} style={{ width: '100%' }} onChange={(value) => this.updateField('auto_number_of_years', value)}>
                                                        <Option value={null}><Translate text={`Select...`} /></Option>
                                                        <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                                        {[...Array(24).keys()].map((i) => (
                                                            <Option key={i} value={(i + 2) + ' Years'}><Translate text={(i + 2) + ' Years'} /></Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Col>
                                            <Col md={8} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Prior BI Limits`} /></label>
                                                    <Input value={wizard.prior_bi_limits} onChange={(e) => this.updateField('prior_bi_limits', e.target.value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="row_dynamic">
                                            {this.state.autos.map((auto, i) => (
                                                <div key={i} className="item">
                                                    <Spin indicator={antIcon} spinning={auto.loading}>
                                                        <div>
                                                            <Row gutter={16}>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Year`} /></label>
                                                                        <Select
                                                                            value={auto.yr} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'yr', value)}
                                                                            onBlur={() => this.decodeVIN(i, auto.vin, auto.yr)}
                                                                        >
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            {yearsDropdown.reverse().map((item) => (
                                                                                <Option key={i} value={item}>{item}</Option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`VIN`} /></label>
                                                                        <Input
                                                                            value={auto.vin} onChange={(e) => this.updateAutoField(i, 'vin', e.target.value)} 
                                                                            onBlur={() => this.decodeVIN(i, auto.vin, auto.yr)}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Make`} /></label>
                                                                        <Select value={auto.make} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'make', value)}>
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            {auto.makeOptions.map((item, ii) => (
                                                                                <Option key={ii} value={item}>{item}</Option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Model`} /></label>
                                                                        <Select value={auto.model} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'model', value)}>
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            {auto.modelOptions.map((item, ii) => (
                                                                                <Option key={ii} value={item}>{item}</Option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                                <Col md={8} span={24}>
                                                                    <div className="inputField inputFieldRadio">
                                                                        <label><Translate text={`Ownership Type`} /></label>
                                                                        <RadioGroup value={auto.is_own_or_lease} onChange={(e) => this.updateAutoField(i, 'is_own_or_lease', e.target.value)}>
                                                                            <Radio value={"Own"} className="btnYes"><Translate text={`Own`} /></Radio>
                                                                            <Radio value={"Lease"} className="btnNo"><Translate text={`Lease`} /></Radio>
                                                                        </RadioGroup>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row gutter={16}>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Collision`} /></label>
                                                                        <Select value={auto.collision} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'collision', value)}>
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            <Option value={'50'}><Translate text={`50`} /></Option>
                                                                            <Option value={'100'}><Translate text={`100`} /></Option>
                                                                            <Option value={'200'}><Translate text={`200`} /></Option>
                                                                            <Option value={'250'}><Translate text={`250`} /></Option>
                                                                            <Option value={'500'}><Translate text={`500`} /></Option>
                                                                            <Option value={'1000'}><Translate text={`1000`} /></Option>
                                                                            <Option value={'2000'}><Translate text={`2000`} /></Option>
                                                                            <Option value={'2500'}><Translate text={`2500`} /></Option>
                                                                            <Option value={'500/500'}><Translate text={`500/500`} /></Option>
                                                                            <Option value={'1000/1000'}><Translate text={`1000/1000`} /></Option>
                                                                            <Option value={'55 CSL or 50/50/50'}><Translate text={`55 CSL or 50/50/50`} /></Option>
                                                                            <Option value={'100 CSL or 100/100/100'}><Translate text={`100 CSL or 100/100/100`} /></Option>
                                                                            <Option value={'300 CSL or 300/300/250'}><Translate text={`300 CSL or 300/300/250`} /></Option>
                                                                            <Option value={'500 CSL or 500/500/500'}><Translate text={`500 CSL or 500/500/500`} /></Option>
                                                                            <Option value={'300 CSL'}><Translate text={`300 CSL`} /></Option>
                                                                            <Option value={'500 CSL'}><Translate text={`500 CSL`} /></Option>
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField inputFieldRadio">
                                                                        <label><Translate text={`Collision Type`} /></label>
                                                                        <Select value={auto.collision_type} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'collision_type', value)}>
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            <Option value={'Regular'}><Translate text={`Regular`} /></Option>
                                                                            <Option value={'Broad'}><Translate text={`Broad`} /></Option>
                                                                            <Option value={'Limited'}><Translate text={`Limited`} /></Option>
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Comprehensive`} /></label>
                                                                        <Input value={auto.comp} onChange={(e) => this.updateAutoField(i, 'comp', e.target.value)} />
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Towing & Labor`} /></label>
                                                                        <Select value={auto.towing} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'towing', value)}>
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            <Option value={'No Coverage'}><Translate text={`No Coverage`} /></Option>
                                                                            <Option value={'$25'}><Translate text={`$25`} /></Option>
                                                                            <Option value={'$50'}><Translate text={`$50`} /></Option>
                                                                            <Option value={'$75'}><Translate text={`$75`} /></Option>
                                                                            <Option value={'$100'}><Translate text={`$100`} /></Option>
                                                                            <Option value={'$200'}><Translate text={`$200`} /></Option>
                                                                            <Option value={'Unlimited'}><Translate text={`Unlimited`} /></Option>
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} span={24}>
                                                                    <div className="inputField">
                                                                        <label><Translate text={`Ext Trans Expense`} /></label>
                                                                        <Select value={auto.ext_trans_expense} style={{ width: '100%' }} onChange={(value) => this.updateAutoField(i, 'ext_trans_expense', value)}>
                                                                            <Option value={null}><Translate text={`Select...`} /></Option>
                                                                            <Option value={'20/600'}><Translate text={`20/600`} /></Option>
                                                                            <Option value={'30/900'}><Translate text={`30/900`} /></Option>
                                                                            <Option value={'40/1200'}><Translate text={`40/1200`} /></Option>
                                                                            <Option value={'50/1500'}><Translate text={`50/1500`} /></Option>
                                                                        </Select>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Spin>
                                                    <div className="addRemoveButtons">
                                                        <Button className="add" onClick={this.addAuto.bind(this)}>
                                                            <Translate text={`+`} />
                                                        </Button>
                                                        {this.state.autos.length > 1 ? (
                                                            <Button className="remove" onClick={() => this.removeAuto(i)}>
                                                                <Translate text={`-`} />
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Row gutter={16}>
                                            <Col md={12} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Personal Injury Protection`} /></label>
                                                    <Input value={wizard.coordination_of_medical} onChange={(e) => this.updateField('coordination_of_medical', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={12} span={24}>
                                                <div className="inputField inputFieldRadio">
                                                    <label><Translate text={`Pip Work Loss Waiver`} /></label>
                                                    <RadioGroup value={wizard.waive_work_loss} onChange={(e) => this.updateField('waive_work_loss', e.target.value)}>
                                                        <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                        <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                                    </RadioGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={12} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Additional Drivers`} /></label>
                                                    <Input value={wizard.additional_drivers} onChange={(e) => this.updateField('additional_drivers', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={12} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Tickets, accidents or claims in past 5 yrs`} /></label>
                                                    <Input value={wizard.tickets_accidents_claims} onChange={(e) => this.updateField('tickets_accidents_claims', e.target.value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col md={24} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Do you own any secondary vehicles (classic cars, ATV's, RV's Motorcycles, Boats)? Value?`} /></label>
                                                    <TextArea value={wizard.do_own_secondary_vehicles} onChange={(e) => this.updateField('do_own_secondary_vehicles', e.target.value)} />
                                                </div>
                                            </Col>
                                            <Col md={24} span={24}>
                                                <div className="inputField">
                                                    <label><Translate text={`Additional Notes`} /></label>
                                                    <TextArea value={wizard.additional_notes} onChange={(e) => this.updateField('additional_notes', e.target.value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : null}
                            </div>
                            {this.state.quote_id ? (
                                <div className="footer right-align">
                                    <Button type="default" onClick={() => this.save()}>
                                        <Translate text={`Save`} />
                                    </Button>
                                </div>
                            ) : (
                                <div className="footer right-align">
                                    <Button type="primary" onClick={() => this.submit(true)}>
                                        <Translate text={`Assess Liability`} />
                                    </Button>
                                    <Button type="default" onClick={() => this.submit()}>
                                        <Translate text={`Save`} />
                                    </Button>
                                    <Button type="secondary" onClick={this.uploadEz.bind(this)}>
                                        <Translate text={`Upload to EzLynx`} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Spin>
                </Card>
            </div>
        );

    }
}

export default NewQuote;
