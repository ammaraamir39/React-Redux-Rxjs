import React, { Component } from 'react';
import ReviewScheduler from './rso-reviewscheduler';
import Vonboard from './rso-vonboard';
import AgencyModal from './parts/vonboard/dedicated-agency-modal';

class RSO extends Component {
    state = {
        view: 'review',
        agency_id: null,
        dedicated_agency_modal: false
    }
    componentDidMount() {
        let agency_id = null;

        if (typeof this.props.match.params.action !== 'undefined' && this.props.match.params.action === "select-agency") {
            this.setState({ dedicated_agency_modal: true });
        }
        if (typeof this.props.match.params.agency_id !== 'undefined') {
            agency_id = this.props.match.params.agency_id;
            if (agency_id === 'all') {
                agency_id = null;
                delete window.localStorage.rso_agency_id;
            } else {
                window.localStorage.rso_agency_id = agency_id;
            }
        } else {
            if ("rso_agency_id" in window.localStorage) {
                agency_id = window.localStorage.rso_agency_id;
            }
        }

        this.setState({ agency_id })
    }
    componentDidUpdate() {
        if ("agency_id" in this.props.match.params) {
            let { agency_id } = this.props.match.params;
            if (agency_id === 'all') {
                agency_id = null;
            }
            if (this.state.agency_id !== agency_id) {
                if (!agency_id) {
                    delete window.localStorage.rso_agency_id;
                } else {
                    window.localStorage.rso_agency_id = agency_id;
                }
                this.setState({ agency_id, dedicated_agency_modal: false });
            }
        } else if (this.state.agency_id !== null && this.props.location.pathname === '/dashboard') {
            delete window.localStorage.rso_agency_id;
            this.setState({ agency_id: null, dedicated_agency_modal: false });
        }
        if ("action" in this.props.match.params) {
            if (this.props.match.params.action === "select-agency" && !this.state.dedicated_agency_modal) {
                this.setState({ dedicated_agency_modal: true });
            }
        }
    }
    render() {
        const { agency_id, dedicated_agency_modal } = this.state;

        return (
            <div>
                {this.state.view === 'review' ? (
                    <ReviewScheduler agency_id={agency_id} view={this.state.view} setView={(view) => this.setState({ view })} {...this.props} />
                ) : (
                    <Vonboard agency_id={agency_id} view={this.state.view} setView={(view) => this.setState({ view })} {...this.props} />
                )}

                <AgencyModal history={this.props.history} showModal={dedicated_agency_modal}
                    reset={() => {
                        this.setState({ agency_id: null })
                    }}
                    hideModal={() => {
                        this.setState({ dedicated_agency_modal: false })
                    }}
                    cancelModal={() => {
                        this.setState({ dedicated_agency_modal: false }, () => {
                            this.props.history.push('/dashboard');
                        })
                    }}
                />
            </div>
        );
    }
}

export default RSO;
