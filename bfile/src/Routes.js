import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import DashLayout from './Layout';
import DashLayoutInvitee from './LayoutInvitee';
import Login from './scenes/Login/index';
import GuestLogin from './scenes/Login/guest-login';
import ForgotPassword from './scenes/Login/forgot-password';
import ResetPassword from './scenes/Login/reset-password';
import RegisterEA from './scenes/Register/register-ea';
import RegisterEFS from './scenes/Register/register-efs';
import RegisterLSP from './scenes/Register/register-lsp';
import Signup from './scenes/Signup/index';
import RegisterEASteps from './scenes/Register/register-ea-steps';
import Billing from './scenes/Register/billing';
import Dashboard from './scenes/Dashboard/index';
import ReviewAdminStats from './scenes/Dashboard/review-admin-stats';
import CallPage from './scenes/CallPage/index';
import Search from './scenes/CallPage/search';
import Wizard from './scenes/Wizard/index';
import WizardInvitee from './scenes/WizardInvitee/index';
import EZCustomers from './scenes/EZCustomers/new';
import QuoteForm from './scenes/Quote/form';
import Quotes from './scenes/Quote/index';
import ApproveMR from './scenes/WizardInvitee/approve-mr';
import Onboarding from './scenes/Onboarding/index';
import Financial from './scenes/Financial/index';
import LandingPage from './scenes/LandingPage/index';
import LandingPageInvitee from './scenes/LandingPage/invitee';
import Training from './scenes/Training/index';
import TrainingPhilosophy from './scenes/Training/philosophy'
import TrainingSpanish from './scenes/Training/spanish';
import TrainingHoopinsure from './scenes/Training/hoopinsure-u';
import CalendarInvites from './scenes/CalendarInvites/index';
import Features from './scenes/Features/index';
import ManageUsers from './scenes/ManageUsers/index';
import EditUser from './scenes/ManageUsers/edit';
import InviteLSP from './scenes/ManageUsers/invite-lsp';
import InviteRS from './scenes/ManageUsers/invite-rs';
import InviteVO from './scenes/ManageUsers/invite-vo';
import InviteMortgageBroker from './scenes/ManageUsers/invite-mb';
import LinkEFS from './scenes/ManageUsers/link-efs';
import InvitedUsers from './scenes/ManageUsers/invited-users';
import InactiveUsers from './scenes/ManageUsers/inactive-users';
import Profile from './scenes/Profile/index';
import AgencyProfile from './scenes/Profile/agency';
import AgencyManagerProfile from './scenes/Profile/agency_manager'
import Referrals from './scenes/Referrals/index';
import AddReferrals from './scenes/Referrals/add-referrals';
import EditReferral from './scenes/Referrals/edit';
import ReferralPayouts from './scenes/Referrals/referral-payouts';
import PaidReferrals from './scenes/Referrals/paid-referrals';
import SendAGift from './scenes/SendAGift/index';
import RewardProgram from './scenes/RewardProgram/index';
import OrderHistory from './scenes/RewardProgram/order-history';
import Gamification from './scenes/Gamification/index';
import AddGame from './scenes/Gamification/add';
import Videoform from './scenes/Training/add';

import EditGame from './scenes/Gamification/edit';
import GameReporting from './scenes/Gamification/reporting';
import Winners from './scenes/Gamification/winners';
import GameArchive from './scenes/Gamification/archive';
import Reporting from './scenes/Reporting/index';
import AdminActiveAgencies from './scenes/SuperAdmin/active-agencies';
import AdminAgencyInfo from './scenes/SuperAdmin/agency-info';
import AdminInactiveAgencies from './scenes/SuperAdmin/inactive-agencies';
import Admin10in30Stats from './scenes/SuperAdmin/10-in-30-stats';
import AdminStats from './scenes/SuperAdmin/stats';
import AdminLastLogin from './scenes/SuperAdmin/last-login';
import AdminOnboardAgencies from './scenes/SuperAdmin/onboard-agencies';
import AdminRSAdmin from './scenes/SuperAdmin/rs-admin';
import AdminAgencyStats from './scenes/SuperAdmin/agency-stats';
import AdminRSReporting from './scenes/SuperAdmin/rs-reporting';
import AdminOnboardSentBFiles from './scenes/SuperAdmin/onboard-sent-bfiles';
import AdminRegionStats from './scenes/SuperAdmin/region-stats';
import AdminTangoAccounts from './scenes/SuperAdmin/tango-accounts';
import AdminEmailContent from './scenes/SuperAdmin/email-content';
import AdminRSUpload from './scenes/SuperAdmin/rs-upload';
import AdminFeaturesAndFixes from './scenes/SuperAdmin/features-fixes';
import AdminAddFeature from './scenes/SuperAdmin/add-feature';
import AdminEditFeature from './scenes/SuperAdmin/edit-feature';
import NewLead from './scenes/NewLead/index';
import AM from './scenes/Dashboard/testRoute';
import AgencyManagerNew from './scenes/SuperAdmin/agencymanagernew';
import InviteAgencyManager from './scenes/ManageUsers/invite-agency-manager';
import NotificationAdmin from './scenes/Notification/add'
import EditVideoForm from './scenes/Training/editVideo';


const auth = {
    user: (typeof Cookies.get('user_info') !== "undefined") ? JSON.parse(Cookies.get('user_info')) : {},
    isAuthenticated: (typeof Cookies.get('is_logged_in') !== "undefined") ? true : false,
    authenticate(values, cb) {
        axios.post('/api/v2/login', {
            email: values.email,
            password: values.password
        }).then(res => {
            let json = res.data;
            if (json.success) {
                this.isAuthenticated = true;
                Cookies.set('is_logged_in', 'true');
                axios.get('/api/user').then(res => {
                    let user = res.data;
                    this.user = user;
                    Cookies.set("user_info", JSON.stringify({
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        id: user.id,
                        user_type: user.user_type,
                        jobs: user.jobs,
                        default_date: user.default_date,
                        last_login: user.last_login,
                        language: user.language
                    }));
                    cb({
                        success: true,
                        user
                    });
                });
            } else {
                cb({
                    success: false,
                    errorMessage: json.errorMessage
                });
            }
        }).catch((error) => {
            cb({
                success: false,
                errorMessage: error.message
            });
        });
    },
    getUser(cb) {
        axios.get('/api/user').then(res => {
            this.user = res.data;
            if (typeof cb !== "undefined") {
                cb(this.user);
            }
        });
    },
    refresh(cb) {
        this.user = (typeof Cookies.get('user_info') !== "undefined") ? JSON.parse(Cookies.get('user_info')) : {};
        this.isAuthenticated = (typeof Cookies.get('is_logged_in') !== "undefined") ? true : false;
        if (typeof cb !== "undefined") {
            cb();
        }
    },
    signout(cb) {
        this.isAuthenticated = false;
        Cookies.remove('is_logged_in');
        Cookies.remove('user_info');
        window.localStorage.clear();
        cb({
            success: true
        });
    }
}

const auth1 = {
    isAuthenticated: (typeof Cookies.get('is_logged_in_guest') !== "undefined") ? true : false,
    authenticate(values, cb) {
        axios.post('/api/bfile_login', {
            password: values.password,
            token: values.token
        }).then(res => {
            let json = res.data;
            if (json.success) {
                this.isAuthenticated = true;
                Cookies.set('is_logged_in_guest', 'true');
                cb(json);
            } else {
                cb({
                    success: false,
                    errorMessage: json.errorMessage
                });
            }
        }).catch((error) => {
            cb({
                success: false,
                errorMessage: error.message
            });
        });
    },
    refresh(cb) {
        this.isAuthenticated = (typeof Cookies.get('is_logged_in_guest') !== "undefined") ? true : false;
        if (typeof cb !== "undefined") {
            cb();
        }
    }
}

const PrivateRoute = ({ component: Component, menu: Menu, ...rest }) => (
    <Route strict exact {...rest} render={(props) => {
        auth.refresh();
        return (
            auth.isAuthenticated === true
                ?   <DashLayout
                        component={
                            <Component
                                {...props}
                                auth={auth}
                                user={auth.user}
                            />
                        }
                        {...props}
                        auth={auth}
                        menu={Menu}
                        user={auth.user}
                        logout={auth.signout.bind(this)}
                    />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )
    }} />
)

const PublicRoute = ({ component: Component, menu: Menu, ...rest }) => (
    <Route exact {...rest} render={(props) => {
        auth1.refresh();
        return (
            (auth1.isAuthenticated === true || props.location.pathname.indexOf("/approve-mr/") >= 0 || props.location.pathname.indexOf("/create-bfile/") >= 0)
                ? <DashLayoutInvitee
                    component={
                        <Component
                            {...props}
                            auth={auth1}
                        />
                    }
                    {...props}
                    auth={auth}
                    menu={Menu}
                />
                : <Redirect to={{
                    pathname: '/guest-login/' + props.match.params.token,
                    state: { from: props.location }
                }} />
        )
    }} />
)

class Routes extends Component {
    render() {
        return (
            <Router basename={'/app'}>
                <Switch>
                    <Route exact path="/" render={() => (
                        <Redirect to="/login"/>
                    )} />
                    <Route exact path="/login" render={(props) => (
                        <Login
                            login={auth.authenticate.bind(this)}
                            refresh={auth.refresh.bind(this)}
                            {...props}
                        />
                    )} />
                    <Route exact path="/guest-login/:token" render={(props) => (
                        <GuestLogin
                            login={auth1.authenticate.bind(this)}
                            refresh={auth1.refresh.bind(this)}
                            {...props}
                        />
                    )} />
                    <Route exact path="/reset-password/:token" render={(props) => (
                        <ResetPassword {...props} />
                    )} />
                    <Route exact path="/forgot-password" render={(props) => (
                        <ForgotPassword {...props} />
                    )} />
                    <Route exact path="/signup" render={(props) => (
                        <Signup {...props} />
                    )} />
                    <Route exact path="/register-lsp/:token" render={(props) => (
                        <RegisterLSP {...props} />
                    )} />
                    <Route exact path="/register-efs/:token" render={(props) => (
                        <RegisterLSP {...props} />
                    )} />   
                    <Route exact path="/register-efs" render={(props) => (
                        <RegisterEFS {...props} />
                    )} />
                    <Route exact path="/register-mb/:token" render={(props) => (
                        <RegisterLSP {...props} />
                    )} />
                    <Route exact path="/register-rs/:token" render={(props) => (
                        <RegisterLSP {...props} />
                    )} />
                    <Route exact path="/register-vo/:token" render={(props) => (
                        <RegisterLSP {...props} />
                    )} />
                    <Route exact path="/register/wizard" render={(props) => (
                        <RegisterEASteps {...props} />
                    )} />
                    <Route exact path="/register/:token" render={(props) => (
                        <RegisterLSP {...props} />
                    )} />
                    <Route exact path="/register" render={(props) => (
                        <RegisterEA {...props} />
                    )} />
                    <Route exact path="/add-referrals/:token" render={(props) => (
                        <AddReferrals {...props} />
                    )} />
                    <Route exact path="/billing/:token" render={(props) => (
                        <Billing {...props} />
                    )} />
                    <PrivateRoute path="/dashboard/rs-stats/:user_id(\d+)" component={ReviewAdminStats} menu={["dashboard"]} />
                    <PrivateRoute path="/dashboard/agency_manager" component={AM} menu={["dashboard"]} />
                    <PrivateRoute path="/dashboard/agency/:agency_id" component={Dashboard} menu={["dashboard"]} />
                    <PrivateRoute path="/dashboard/:action" component={Dashboard} menu={["dashboard"]} />
                    <PrivateRoute path="/dashboard" component={Dashboard} menu={["dashboard"]} />
                    <PrivateRoute path="/search/:search" component={Search} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/ea/:ea/:from/:to" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/ea/:ea" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/efs/:efs/:from/:to" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/efs/:efs" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/lsp/:lsp(\d+)/:from/:to" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/lsp/:lsp(\d+)" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/all/:from/:to" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter/:from/:to" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles/:filter" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/bfiles" component={CallPage} menu={["bfiles"]} />
                    <PrivateRoute path="/wizard/step/:step/:bfile_id/:action" component={Wizard} menu={["bfiles","create-bfile"]} />
                    <PrivateRoute path="/wizard/step/:step/:bfile_id" component={Wizard} menu={["bfiles","create-bfile"]} />
                    <PrivateRoute path="/wizard/step/:step" component={Wizard} menu={["bfiles","create-bfile"]} />
                    <PrivateRoute path="/wizard/new-ez-lynx-customer" component={EZCustomers} menu={["bfiles","new-ez-lynx-customer"]} />
                    <PrivateRoute path="/quotes/new" component={QuoteForm} menu={["bfiles","new-quote"]} />
                    <PrivateRoute path="/quotes/edit/:quote_id" component={QuoteForm} menu={["bfiles","edit-quote"]} />
                    <PrivateRoute path="/quotes" component={Quotes} menu={["bfiles","quotes"]} />
                    <PublicRoute path="/bfile/:token" component={LandingPageInvitee} menu={["bfiles","create-bfile"]} />
                    <PublicRoute path="/approve-mr/:token" component={ApproveMR} menu={[]} />
                    <PublicRoute path="/edit-bfile/:token" component={WizardInvitee} menu={["bfiles","create-bfile"]} />
                    <PublicRoute path="/create-bfile/:agency/:lsp" component={WizardInvitee} menu={["bfiles","create-bfile"]} />
                    <PublicRoute path="/create-bfile/:agency" component={WizardInvitee} menu={["bfiles","create-bfile"]} />
                    <PrivateRoute path="/wizard" component={Wizard} menu={["bfiles","create-bfile"]} />
                    <PrivateRoute path="/customer/:bfile_id/:action" component={LandingPage} menu={["bfiles"]} />
                    <PrivateRoute path="/customer/:bfile_id" component={LandingPage} menu={["bfiles"]} />
                    <PrivateRoute path="/calendar-invites" component={CalendarInvites} menu={["calendar-invites"]} />
                    <PrivateRoute path="/training/video" component={Videoform} menu={["training"]} />
                    <PrivateRoute path="/training/video/:id" component={EditVideoForm} menu={["training"]}/>
                    <PrivateRoute path="/training/hoopinsure-u" component={TrainingHoopinsure} menu={["training"]} />
                    <PrivateRoute path="/training/spanish/:category_id" component={TrainingSpanish} menu={["training"]} />
                    <PrivateRoute path="/training/philosophy" component={TrainingPhilosophy} menu={["training"]} />
                    <PrivateRoute path="/edit-video/:id" component={EditVideoForm} menu={["training"]} />
                    <PrivateRoute path="/training" component={Training} menu={["training"]} />
                   
                    Videoform
                    {/*  */}
                    {/* <PrivateRoute path="/training-copy" component={TrainingCopy} menu={["training"]} />
                    <PrivateRoute path="/training-copy/spanish" component={TrainingCopySpanish} menu={["training"]} /> */}
                    <PrivateRoute path="/notification-admin" component={NotificationAdmin} menu={["dashboard"]} />

                    <PrivateRoute path="/features" component={Features} menu={["features"]} />
                    <PrivateRoute path="/profile/agency" component={AgencyProfile} menu={["agency-profile"]} />
                    <PrivateRoute path="/profile" component={Profile} menu={["profile"]} />
                    <PrivateRoute path="/profile/agency_manager" component={AgencyManagerProfile} menu={["profile"]} />
                    <PrivateRoute path="/onboarding/step/:step/:bfile_id" component={Onboarding} menu={["bfiles"]} />
                    <PrivateRoute path="/financial/step/:step/:bfile_id/:action" component={Financial} menu={["bfiles"]} />
                    <PrivateRoute path="/financial/step/:step/:bfile_id" component={Financial} menu={["bfiles"]} />
                    <PrivateRoute path="/manage-users/invite-lsp" component={InviteLSP} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/invite-agency-manager" component={InviteAgencyManager} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/invite-rs" component={InviteRS} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/invite-vo" component={InviteVO} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/invite-mortgage-broker" component={InviteMortgageBroker} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/link-efs" component={LinkEFS} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/invited-users" component={InvitedUsers} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/inactive-users" component={InactiveUsers} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users/edit-user/:user_id" component={EditUser} menu={["manage-users"]} />
                    <PrivateRoute path="/manage-users" component={ManageUsers} menu={["manage-users"]} />
                    <PrivateRoute path="/referrals/edit/:referral_id" component={EditReferral} menu={["referrals"]} />
                    <PrivateRoute path="/referrals/payouts" component={ReferralPayouts} menu={["referrals"]} />
                    <PrivateRoute path="/referrals/paid" component={PaidReferrals} menu={["referrals"]} />
                    <PrivateRoute path="/referrals" component={Referrals} menu={["referrals"]} />
                    <PrivateRoute path="/send-a-gift" component={SendAGift} menu={["send-a-gift"]} />
                    <PrivateRoute path="/reward-program/order-history" component={OrderHistory} menu={["reward-program"]} />
                    <PrivateRoute path="/reward-program" component={RewardProgram} menu={["reward-program"]} />
                    <PrivateRoute path="/gamification/add" component={AddGame} menu={["gamification"]} />

                    

                    <PrivateRoute path="/gamification/edit/:game_id" component={EditGame} menu={["gamification"]} />
                    <PrivateRoute path="/gamification/view/:game_id" component={GameReporting} menu={["gamification"]} />
                    <PrivateRoute path="/gamification/winners" component={Winners} menu={["gamification"]} />
                    <PrivateRoute path="/gamification/archive" component={GameArchive} menu={["gamification"]} />
                    <PrivateRoute path="/gamification" component={Gamification} menu={["gamification"]} />
                    <PrivateRoute path="/reporting" component={Reporting} menu={["reporting"]} />
                    <PrivateRoute path="/new-lead" component={NewLead} menu={["new-lead"]} />
                    <PrivateRoute path="/super-admin/agency/:agency_id" component={AdminAgencyInfo} menu={["active-agencies"]} />
                    <PrivateRoute path="/super-admin/inactive-agencies" component={AdminInactiveAgencies} menu={["inactive-agencies"]} />
                    <PrivateRoute path="/super-admin/10-in-30-stats" component={Admin10in30Stats} menu={["10-in-30-stats"]} />
                    <PrivateRoute path="/super-admin/agency-stats" component={AdminAgencyStats} menu={["agency-stats"]} />
                    <PrivateRoute path="/super-admin/stats" component={AdminStats} menu={["stats"]} />
                    <PrivateRoute path="/super-admin/last-login" component={AdminLastLogin} menu={["last-login"]} />
                    <PrivateRoute path="/super-admin/onboard-agencies" component={AdminOnboardAgencies} menu={["onboard-agencies"]} />
                    <PrivateRoute path="/super-admin/onboard-sent-bfiles" component={AdminOnboardSentBFiles} menu={["onboard-sent-bfiles"]} />
                    <PrivateRoute path="/super-admin/region-stats" component={AdminRegionStats} menu={["region-stats"]} />
                    <PrivateRoute path="/super-admin/rs-upload" component={AdminRSUpload} menu={["rs-upload"]} />
                    <PrivateRoute path="/super-admin/review-schedulers" component={AdminRSAdmin} menu={["review-schedulers"]} />
                    <PrivateRoute path="/super-admin/agency-manager" component={AgencyManagerNew} menu={["agency-manager"]} />
                    <PrivateRoute path="/super-admin/rs-reporting" component={AdminRSReporting} menu={["review-schedulers"]} />
                    <PrivateRoute path="/super-admin/tango-accounts" component={AdminTangoAccounts} menu={["tango-accounts"]} />
                    <PrivateRoute path="/super-admin/email-content" component={AdminEmailContent} menu={["email-content"]} />
                    <PrivateRoute path="/super-admin/features/add" component={AdminAddFeature} menu={["features"]} />
                    <PrivateRoute path="/super-admin/features/edit/:post_id" component={AdminEditFeature} menu={["features"]} />
                    <PrivateRoute path="/super-admin/features" component={AdminFeaturesAndFixes} menu={["features"]} />
                    <PrivateRoute path="/super-admin" component={AdminActiveAgencies} menu={["active-agencies"]} />
                </Switch>
            </Router>
        )
    }
}

export default Routes;
