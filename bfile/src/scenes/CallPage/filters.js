const filters = {
    'bfiles': {
        date_range: false
    },
    'internet-leads': {
        title: 'Leads',
        filters: '{"name":"archive","op":"==","val":0},{"name":"referral_data","op":"any","val":{"name":"status","op":"==","val":1}}'
    },
    'mortgage-review': {
        title: 'Mortgage Review',
        filters: '{"name":"archive","op":"==","val":0},{"name":"mortgage_review","op":"==","val":1},{"name":"mortgage_review_approved","op":"==","val":1}'
    },
    'pending-internet-leads': {
        title: 'Leads',
        filters: '{"name":"archive","op":"==","val":0},{"name":"referral_data","op":"any","val":{"name":"status","op":"==","val":0}}'
    },
    'approved-referrals': {
        title: 'Leads',
        filters: '{"name":"referral_data","op":"any","val":{"name":"status","op":"==","val":1}}',
        //endpoint: 'referrals_data',
        date_range: false
    },
    'pc-referrals-leads': {
        title: 'P&C Referrals Leads',
        filters: '{"name":"referral_data","op":"any","val":{"name":"status","op":"==","val":3}}'
    },
    'mb-leads': {
        title: 'Leads',
        filters: '{"name":"mortgage_referral","op":"==","val":1}'
    },
    'deleted': {
        title: 'Deleted B-Files',
        filters: '{"name":"deleted","op":"==","val":1}',
        date_range: false,
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: '',
                dataIndex: 'reactivate_action',
                key: 'reactivate_action',
                width: 200
            }
        ]
    },
    'pending-internet-leads-mycalls': {
        title: 'Leads',
        filters: '{"name":"archive","op":"==","val":0},{"name":"referral_data","op":"any","val":{"name":"status","op":"==","val":0}},{"name":"user_id","op":"==","val":%user_id%}'
    },
    'umbrella-uncovered': {
        title: 'Umbrella Opportunities',
        filters: '{"or":[{"name":"umbrella_policy_uncovered","op":">","val":0},{"name":"umbrella_policy_quoted","op":">","val":0}]},{"name":"is_saved_for_later","op":"==","val":"0"}'
    },
    'umbrella-sold': {
        title: 'Umbrella Sold',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"umbrella_policy_sold","op":">","val":0}'
    },
    'cross-sell-policies-uncovered': {
        title: 'P&C Cross Sell Opportunities',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"cross_sell_policies_uncovered","op":"!=","val":"0"},{"name":"childs","op":"is_null"}'
    },
    'attempted': {
        title: 'Attempted Calls',
        filters: '{"name":"attempts","op":"!=","val":"0"}'
    },
    'pending-attempted': {
        title: 'Attempted Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"attempts","op":"!=","val":"0"}'
    },
    'financial-calls': {
        title: 'Life & Retirement',
        filters: '{"or":[{"and":[{"name":"questions","op":"any","val":{"name":"financial_conversion_specialist","op":"==","val":"%user_id%"}},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_not_null"}},{"name":"financial_conversion","op":"is_null"}]},{"and":[{"name":"questions","op":"any","val":{"name":"financial_conversion_specialist","op":"==","val":"%user_id%"}},{"name":"financial_conversion","op":"any","val":{"name":"call_attempts","op":"==","val":"0"}},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}}]}]}'
    },
    'pending-financial-calls': {
        title: 'Life & Retirement',
        filters: '{"name":"financial_id","op":"==","val":"%user_id%"},{"name":"financial_conversion","op":"is_null"}'
    },
    'financial-attempted': {
        title: 'Attempted Life & Retirement Calls',
        filters: '{"name":"financial_id","op":"==","val":"%user_id%"},{"name":"financial_conversion","op":"any","val":{"name":"call_attempts","op":"!=","val":"0"}},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}}'
    },
    'pending-financial-attempted': {
        title: 'Attempted Life & Retirement Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"financial_id","op":"==","val":"%user_id%"},{"name":"financial_conversion","op":"any","val":{"name":"call_attempts","op":"!=","val":"0"}},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}}'
    },
    'onboarded': {
        title: '',
        filters: '{"name":"is_onboarded","op":"==","val":"1"},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_not_null"}}'
    },
    'not-interested': {
        title: 'Not Interested',
        filters: '{"or":[{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":0}},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"==","val":0}}]}'
    },
    'vo-not-interested': {
        title: 'Not Interested',
        filters: '{"name":"vob_archived","op":"==","val":"1"}'
    },
    'not-reached': {
        title: 'Not Reached',
        filters: '{"or":[{"and":[{"name":"archive","op":"==","val":1},{"name":"questions","op":"is_null"}]},{"and":[{"name":"questions","op":"any","val":{"name":"call_attempts","op":">","val":0}},{"name":"questions","op":"any","val":{"name":"call_reached_toggle","op":"is_null"}}]}]},{"name":"financial_conversion","op":"is_null"}'
    },
    'no-follow-up': {
        title: 'No Follow Up',
        filters: '{"name":"no_follow_up","op":"==","val":1}'
    },
    'financial-intro': {
        title: '',
        filters: '{"name":"onboarding_id","op":"==","val": "%user_id%"},{"or":[{"and":[{"name":"archive","op":"==","val":0},{"name":"financial_id","op":"is_not_null"},{"or":[{"and": [{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_not_null"}},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"!=","val":3}}]},{"name":"questions","op":"any","val":{"name":"skip","op":"==","val":1}}]},{"name":"financial_conversion","op":"is_null"}]},{"and":[{"name":"archive","op":"==","val":0},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}},{"name":"financial_conversion","op":"any","val":{"name":"products_sold","op":"is_null"}}]}]},{"name":"expiration_date","op":"<=","val":"%to%"},{"name":"expiration_date","op":"<=","val":"%today%"}'
    },
    'pending-financial-intro': {
        title: '',
        filters: '{"name":"onboarding_id","op":"==","val": "%user_id%"},{"or":[{"and":[{"name":"archive","op":"==","val":0},{"name":"financial_id","op":"is_not_null"},{"or":[{"and": [{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_not_null"}},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"!=","val":3}}]},{"name":"questions","op":"any","val":{"name":"skip","op":"==","val":1}}]},{"name":"financial_conversion","op":"is_null"}]},{"and":[{"name":"archive","op":"==","val":0},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}},{"name":"financial_conversion","op":"any","val":{"name":"products_sold","op":"is_null"}}]}]}'
    },
    'life-asset': {
        title: '',
        filters: '{"name":"home_mortgage_protection_toggle","op":"==","val":"1"},{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[]"}'
    },
    'no-sale-archive': {
        title: 'No Sale Archive',
        filters: '{"name":"auto_sold_toggle","op":"==","val":"0"},{"name":"home_sold_toggle","op":"==","val":"0"}'
    },
    'archived': {
        title: 'Archived',
        filters: '{"name":"archive","op":"==","val":"1"}',
        date_range: false
    },
    'sp-500': {
        title: 'S&P 500',
        filters: '{"name":"sp_500","op":"==","val":"1"}'
    },
    'pending-sp-500': {
        title: 'S&P 500',
        filters: '{"name":"archive","op":"==","val":0},{"name":"sp_500","op":"==","val":"1"}'
    },
    'vip': {
        title: 'VIP',
        filters: '{"name":"vip","op":"==","val":"1"}'
    },
    'pending-vip': {
        title: 'VIP',
        filters: '{"name":"archive","op":"==","val":0},{"name":"vip","op":"==","val":"1"}'
    },
    'cross-sell-opps': {
        title: 'Cross Sell Opportunities',
        filters: '{"name":"cross_sell_policies_uncovered","op":">","val":0}'
    },
    'umbrella-opps': {
        title: '',
        filters: '{"name":"umbrella_policy_uncovered","op":">","val":0}'
    },
    'life-opps-created': {
        title: 'Life Insurance Opportunities',
        filters: '{"name":"is_onboarded","op":"==","val":"1"},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_not_null"}}'
    },
    'onboarded-not-interested': {
        title: '',
        filters: '{"or":[{"and":[{"name":"is_onboarded","op":"==","val":"1"},{"name":"not_interested","op":"==","val":"1"}]},{"name":"is_sent_to_financial","op":"==","val":"1"}]}'
    },
    'saved-for-later': {
        title: 'Saved for Later',
        filters: '{"name":"is_saved_for_later","op":"==","val":"1"}'
    },
    'pending-saved-for-later': {
        title: 'Saved for Later',
        filters: '{"name":"is_saved_for_later","op":"==","val":"1"}'
    },
    'pending-saved-for-later-mycalls': {
        title: 'Saved for Later',
        filters: '{"name":"archive","op":"==","val":0},{"name":"is_saved_for_later","op":"==","val":"1"},{"name":"user_id","op":"==","val":%user_id%}'
    },
    'renewal': {
        title: 'Renewals',
        filters: '{"or":[{"and":[{"name":"auto_policy_sold_term","op":"==","val":"6 Months"},{"name":"auto_policy_sold_effective_date","op":"<=","val":"%term6_to%"},{"name":"auto_policy_sold_effective_date","op":">=","val":"%term6_from%"}]},{"and":[{"name":"home_policy_sold_term","op":"==","val":"6 Months"},{"name":"home_policy_sold_effective_date","op":"<=","val":"%term6_to%"},{"name":"home_policy_sold_effective_date","op":">=","val":"%term6_from%"}]},{"and":[{"name":"auto_policy_sold_term","op":"==","val":"1 Year"},{"name":"auto_policy_sold_effective_date","op":"<=","val":"%term12_to%"},{"name":"auto_policy_sold_effective_date","op":">=","val":"%term12_from%"}]},{"and":[{"name":"home_policy_sold_term","op":"==","val":"1 Year"},{"name":"home_policy_sold_effective_date","op":"<=","val":"%term12_to%"},{"name":"home_policy_sold_effective_date","op":">=","val":"%term12_from%"}]},{"and":[{"name":"is_renewal","op":"==","val":1},{"name":"status","op":"==","val":"Renewal"}]}]}'
    },
    'renewal-mycalls': {
        title: 'Renewals',
        filters: '{"name":"archive","op":"==","val":0},{"or":[{"and":[{"name":"auto_policy_sold_term","op":"==","val":"6 Months"},{"name":"auto_policy_sold_effective_date","op":"<=","val":"%term6_to%"},{"name":"auto_policy_sold_effective_date","op":">=","val":"%term6_from%"}]},{"and":[{"name":"home_policy_sold_term","op":"==","val":"6 Months"},{"name":"home_policy_sold_effective_date","op":"<=","val":"%term6_to%"},{"name":"home_policy_sold_effective_date","op":">=","val":"%term6_from%"}]},{"and":[{"name":"auto_policy_sold_term","op":"==","val":"1 Year"},{"name":"auto_policy_sold_effective_date","op":"<=","val":"%term12_to%"},{"name":"auto_policy_sold_effective_date","op":">=","val":"%term12_from%"}]},{"and":[{"name":"home_policy_sold_term","op":"==","val":"1 Year"},{"name":"home_policy_sold_effective_date","op":"<=","val":"%term12_to%"},{"name":"home_policy_sold_effective_date","op":">=","val":"%term12_from%"}]},{"and":[{"name":"is_renewal","op":"==","val":1},{"name":"status","op":"==","val":"Renewal"}]}]}'
    },
    'onboarding-calls': {
        title: 'Thank You/Intro to Life & Retirement Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"is_onboarded","op":"==","val":"1"},{"name":"onboarding_id","op":"==","val":"%user_id%"},{"name":"expiration_date","op":"<=","val":"%to%"},{"name":"expiration_date","op":"<=","val":"%today%"},{"name":"questions","op":"is_null"}'
    },
    'pending-onboarding-calls': {
        title: 'Thank You/Intro to Life & Retirement Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"is_onboarded","op":"==","val":"1"},{"name":"onboarding_id","op":"==","val":"%user_id%"},{"name":"questions","op":"is_null"}'
    },
    'onboarding-calls-total': {
        title: 'Thank You/Intro to Life & Retirement Calls',
        filters: '{"or":[{"name":"is_onboarded","op":"==","val":"1"},{"name":"vonboard","op":"==","val":"1"}]}'
    },
    'sent-for-follow-up': {
        title: 'Sent for Follow Up',
        filters: '{"name":"vonboard","op":"==","val":"0"},{"or":[{"name":"is_onboarded","op":"==","val":"1"},{"name":"need_attention","op":"==","val":"1"}]},{"name":"is_saved_for_later","op":"==","val":"0"}'
    },
    'sent-to-ea': {
        title: 'Thank You/Intro to Life & Retirement Calls',
        filters: '{"name":"is_onboarded","op":"==","val":"1"}'
    },
    'sent-to-vonboarder': {
        title: 'Sent to Virtual Onboarder',
        filters: '{"name":"vonboard","op":"==","val":"1"}'
    },
    'onboarding-calls-attempted': {
        title: 'Thank You/Intro to Life & Retirement Calls Attempted',
        filters: '{"name":"archive","op":"==","val":0},{"name":"financial_conversion","op":"is_null"},{"name":"onboarding_id","op":"==","val":"%user_id%"},{"name":"questions","op":"any","val":{"name":"call_attempts","op":">","val":0}},{"or":[{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_null"}},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":"3"}}]},{"name":"expiration_date","op":"<=","val":"%to%"},{"name":"expiration_date","op":"<=","val":"%today%"}'
    },
    'pending-onboarding-calls-attempted': {
        title: 'Thank You/Intro to Life & Retirement Calls Attempted',
        filters: '{"name":"archive","op":"==","val":0},{"name":"financial_conversion","op":"is_null"},{"name":"onboarding_id","op":"==","val":"%user_id%"},{"name":"questions","op":"any","val":{"name":"call_attempts","op":">","val":0}},{"or":[{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"is_null"}},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":"3"}}]}'
    },
    'sent-to-onboarding': {
        title: 'Sent to Thank You/Intro to Life & Retirement Calls',
        filters: '{"name":"is_onboarded","op":"==","val":"1"}'
    },
    'new-bfiles': {
        title: 'B-Files Created',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"}'
    },
    'new-bfiles-efs': {
        title: 'B-Files Created',
        filters: '{"or":[{"name":"need_attention","op":"==","val":"1"},{"name":"is_onboarded","op":"==","val":"1"}]}'
    },
    'need-attention': {
        title: 'Sent for Immediate Attention',
        filters: '{"name":"need_attention","op":"==","val":"1"},{"name":"is_saved_for_later","op":"==","val":"0"}'
    },
    'sent-to-financial': {
        title: '',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"financial_id","op":"is_not_null"}'
    },
    'mylife-sent-to-financial': {
        title: '',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"financial_id","op":"is_not_null"}'
    },
    'vo-sent-to-financial': {
        title: '',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"financial_id","op":"is_not_null"},{"or":[{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":"1"}},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":"2"}}]}'
    },
    'appointments-made': {
        title: 'Appointments Made',
        filters: '{"name":"archive","op":"==","val":0},{"or":[{"and":[{"name":"financial_id","op":"==","val":"%user_id%"},{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":2}},{"or":[{"name":"financial_conversion","op":"is_null"},{"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}}]}]},{"and":[{"name":"financial_id","op":"==","val":"%user_id%"},{"name":"financial_conversion","op":"any","val":{"name":"schedule_time","op":"is_not_null"}},{"or":[{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"is_null"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":""}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Appointment Rescheduled"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Call to Reschedule"}}]}]}]}'
    },
    'pending-appointments-made': {
        title: 'Appointments Made',
        filters: `
            {"name":"archive","op":"==","val":0},
            {"or":[
                {"and":[
                    {"name":"financial_id","op":"==","val":"%user_id%"},
                    {"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":2}},
                    {"or":[
                        {"name":"financial_conversion","op":"is_null"},
                        {"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}}
                    ]}
                ]},
                {"and":[
                    {"name":"financial_id","op":"==","val":"%user_id%"},
                    {"name":"financial_conversion","op":"any","val":{"name":"schedule_time","op":"is_not_null"}},
                    {"or":[
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"is_null"}},
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":""}},
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Appointment Rescheduled"}},
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Call to Reschedule"}}
                    ]}
                ]}
            ]}`
    },
    'appointments-made-total': {
        title: 'Appointments Made',
        filters: `
            {"name":"archive","op":"==","val":0},
            {"or":[
                {"and":[
                    {"name":"financial_id","op":"==","val":"%user_id%"},
                    {"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":2}},
                    {"or":[
                        {"name":"financial_conversion","op":"is_null"},
                        {"name":"financial_conversion","op":"any","val":{"name":"interested_in_appointment_toggle","op":"is_null"}}
                    ]}
                ]},
                {"and":[
                    {"name":"financial_id","op":"==","val":"%user_id%"},
                    {"name":"financial_conversion","op":"any","val":{"name":"schedule_time","op":"is_not_null"}},
                    {"or":[
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"is_null"}},
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":""}},
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Appointment Rescheduled"}},
                        {"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Call to Reschedule"}}
                    ]}
                ]}
            ]}`
    },
    'pc-reviews': {
        title: 'P&C Reviews',
        filters: '{"name":"archive","op":"==","val":0},{"name":"rs_appointment_date","op":"is_not_null"}'
    },
    'mylife-appointments-made-total': {
        title: 'Appointments Made',
        filters: '{"or":[{"and": [{"name":"questions","op":"any","val":{"name":"financial_conversion_action","op":"==","val":2}}]},{"and": [{"or":[{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"is_null"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":""}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Appointment Rescheduled"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Call to Reschedule"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Sold"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Not Sold"}}]}]}]}'
    },
    'appointments-kept': {
        title: 'Appointments Kept',
        filters: '{"or":[{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Sold"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Not Sold"}}]}'
    },
    'mylife-appointments-kept': {
        title: 'Appointments Kept',
        filters: '{"or":[{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Sold"}},{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Not Sold"}}]}'
    },
    'appointments-sold': {
        title: 'Life/Financial Sale',
        filters: '{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Sold"}}'
    },
    'mylife-appointments-sold': {
        title: 'Life/Financial Sale',
        filters: '{"name":"financial_conversion","op":"any","val":{"name":"appointment_status","op":"==","val":"Complete Sold"}}'
    },
    'review-scheduler-bfiles': {
        title: 'Review Scheduled Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"review","op":"==","val":1},{"name":"rs_call_made","op":"==","val":1}'
    },
    'review-scheduler-bfiles-mycalls': {
        title: 'Review Scheduled Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"review","op":"==","val":1},{"name":"rs_call_made","op":"==","val":1},{"name":"user_id","op":"==","val":%user_id%}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'Customer Name',
                dataIndex: 'customer_name',
                key: 'customer_name',
                width: 200
            },
            {
                title: 'Calendar Time',
                dataIndex: 'appointment_date',
                key: 'appointment_date',
                width: 200
            },
            {
                title: 'LSP',
                dataIndex: 'lsp',
                key: 'lsp',
                width: 200
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 200
            },
            {
                title: 'View',
                dataIndex: 'view',
                key: 'view',
                width: 200
            },
        ]
    },
    'review-scheduler-upcoming-calls': {
        title: 'Upcoming Calls',
        filters: '{"name":"archive","op":"==","val":0},{"name":"review","op":"==","val":1},{"name":"rs_action","op":"is_null"}'
    },
    'review-scheduler-calls-made': {
        title: 'Calls Made',
        filters: '{"name":"archive","op":"==","val":0},{"name":"review","op":"==","val":1},{"name":"rs_action","op":"is_not_null"}'
    },
    'review-scheduler-appointments-scheduled': {
        title: 'Appointments Scheduled',
        filters: '{"name":"archive","op":"==","val":0},{"name":"review","op":"==","val":1},{"name":"rs_action","op":"==","val":1}'
    },
    'review-scheduler-not-reached': {
        title: 'Not Reached',
        filters: '{"name":"archive","op":"==","val":0},{"name":"review","op":"==","val":1},{"name":"rs_action","op":"==","val":0}'
    },
    'review-scheduler-not-interested': {
        title: 'Not Interested',
        filters: '{"name":"review","op":"==","val":1},{"name":"rs_action","op":"==","val":2}'
    },
    'life-opportunities': {
        title: 'Life Opportunities',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"life_opportunities","op":">","val":0}'
    },
    'mylife-life-opportunities': {
        title: 'Life Opportunities',
        filters: '{"name":"is_saved_for_later","op":"==","val":"0"},{"name":"life_opportunities","op":">","val":0}'
    },
    'life-calls': {
        title: '',
        filters: '{"name":"home_mortgage_protection_toggle","op":"==","val":"1"},{"name":"asset_401k_accounts","op":"==","val":"[]"},{"name":"asset_accounts","op":"==","val":"[]"}'
    },
    'pending-life-calls': {
        title: '',
        filters: '{"name":"archive","op":"==","val":0},{"name":"home_mortgage_protection_toggle","op":"==","val":"1"},{"name":"asset_401k_accounts","op":"==","val":"[]"},{"name":"asset_accounts","op":"==","val":"[]"}'
    },
    'retirement-ops': {
        title: 'Retirement Opportunities',
        filters: '{"name":"childs","op":"is_null"},{"name":"is_saved_for_later","op":"==","val":"0"},{"or":[{"and":[{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_401k_accounts","op":"!=","val":"[\\"None\\"]"}]},{"and":[{"name":"asset_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[\\"None\\"]"}]}]}'
    },
    'mylife-retirement-ops': {
        title: 'Retirement Opportunities',
        filters: '{"name":"childs","op":"is_null"},{"name":"is_saved_for_later","op":"==","val":"0"},{"or":[{"and":[{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_401k_accounts","op":"!=","val":"[\\"None\\"]"}]},{"and":[{"name":"asset_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[\\"None\\"]"}]}]}'
    },
    'retirement-dollars': {
        title: 'Remaining Retirement Opportunities',
        filters: '{"name":"childs","op":"is_null"},{"name":"is_saved_for_later","op":"==","val":"0"},{"or":[{"and":[{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_401k_accounts","op":"!=","val":"[\\"None\\"]"}]},{"and":[{"name":"asset_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[\\"None\\"]"}]}],"or":[{"name":"asset_total_value","op":"!=","val":""},{"name":"asset_preservation_value","op":"!=","val":""}]}'
    },
    'mylife-retirement-dollars': {
        title: 'Remaining Retirement Opportunities',
        filters: '{"name":"childs","op":"is_null"},{"name":"is_saved_for_later","op":"==","val":"0"},{"or":[{"and":[{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_401k_accounts","op":"!=","val":"[\\"None\\"]"}]},{"and":[{"name":"asset_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[\\"None\\"]"}]}],"or":[{"name":"asset_total_value","op":"!=","val":""},{"name":"asset_preservation_value","op":"!=","val":""}]}'
    },
    'retirement-uncovered': {
        title: 'Total Retirement $\'s Uncovered',
        filters: '{"name":"childs","op":"is_null"},{"name":"is_saved_for_later","op":"==","val":"0"},{"or":[{"and":[{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_401k_accounts","op":"!=","val":"[\\"None\\"]"}]},{"and":[{"name":"asset_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[\\"None\\"]"}]}],"or":[{"name":"asset_total_value","op":"!=","val":""},{"name":"asset_preservation_value","op":"!=","val":""}]}'
    },
    'mylife-retirement-uncovered': {
        title: 'Total Retirement $\'s Uncovered',
        filters: '{"name":"childs","op":"is_null"},{"name":"is_saved_for_later","op":"==","val":"0"},{"or":[{"and":[{"name":"asset_401k_accounts","op":"!=","val":"[]"},{"name":"asset_401k_accounts","op":"!=","val":"[\\"None\\"]"}]},{"and":[{"name":"asset_accounts","op":"!=","val":"[]"},{"name":"asset_accounts","op":"!=","val":"[\\"None\\"]"}]}],"or":[{"name":"asset_total_value","op":"!=","val":""},{"name":"asset_preservation_value","op":"!=","val":""}]}'
    },
    'lsp-life': {
        title: 'Life Insurance Leads',
        filters: '{"name":"is_onboarded","op":"==","val":1},{"name":"financial_id","op":"==","val":%user_id%}'
    },
    'claimed': {
        title: 'My Claimed B-Files',
        filters: '{"name":"onboarding_id","op":"==","val":"%user_id%"}',
        endpoint: 'my_vonboard_bfiles'
    },
    'total-opportunities-uncovered-boat': {
        title: 'Boat',
        filters: '{"name":"policies","op":"any","val":{"name":"policy_type","op":"==","val":"Boat"}}',
    },
    'total-opportunities-uncovered-motorcycle': {
        title: 'Motorcycle',
        filters: '{"name":"policies","op":"any","val":{"name":"policy_type","op":"==","val":"Motorcycle"}}',
    },
    'total-opportunities-uncovered-rv': {
        title: 'RV',
        filters: '{"name":"policies","op":"any","val":{"name":"policy_type","op":"==","val":"RV"}}',
    },
    'total-opportunities-uncovered-commercial': {
        title: 'Commercial',
        filters: '{"name":"business_owner_toggle","op":"==","val":1}',
    },
    'total-opportunities-uncovered-auto': {
        title: 'Auto',
        filters: '{"name":"primary_vehicles_toggle","op":"==","val":1}',
    },
    'total-opportunities-uncovered-home': {
        title: 'Home',
        filters: '{"name":"home_toggle","op":"==","val":1}',
    },
    'scheduled-calls': {
        title: 'Scheduled Calls',
        filters: '{"name":"review","op":"==","val":1},{"name":"rs_call_made","op":"==","val":1}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Appointment Date',
                dataIndex: 'appointment_date',
                key: 'appointment_date',
                width: 200
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 200
            }
        ]
    },
    'upcoming-calls': {
        title: 'Upcoming Calls',
        filters: '{"name":"expiration_date","op":">=","val":"%today%"},{"name":"archive","op":"==","val":0},{"name":"rs_action","op":"is_null"}',
        order_by: '{"field":"expiration_date","direction":"asc"}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date',
                width: 200
            },
            {
                title: '',
                dataIndex: 'upcoming_calls_actions',
                key: 'upcoming_calls_actions',
                width: 400
            }
        ]
    },
    'rs-upcoming-calls': {
        title: 'Upcoming Calls',
        filters: '{"name":"expiration_date","op":">=","val":"%today%"},{"name":"archive","op":"==","val":0},{"name":"rs_action","op":"is_null"}',
        order_by: '{"field":"expiration_date","direction":"asc"}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date',
                width: 200
            },
            {
                title: '',
                dataIndex: 'upcoming_calls_actions',
                key: 'upcoming_calls_actions',
                width: 400
            }
        ]
    },
    'rs-calls-made': {
        title: 'Calls Made',
        filters: '{"name":"archive","op":"==","val":0},{"name":"rs_action","op":"is_not_null"},{"name":"rs_action","op":"!=","val":0}',
        order_by: '{"field":"expiration_date","direction":"asc"}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date',
                width: 200
            },
            {
                title: '',
                dataIndex: 'upcoming_calls_actions',
                key: 'upcoming_calls_actions',
                width: 400
            }
        ]
    },
    'user-rs-calls-made': {
        title: 'Calls Made',
        filters: '{"name":"archive","op":"==","val":0},{"name":"rs_action","op":"is_not_null"},{"name":"rs_action","op":"!=","val":0},{"name":"reviewer_id","op":"==","val":%reviewer_id%}',
        order_by: '{"field":"expiration_date","direction":"asc"}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date',
                width: 200
            },
            {
                title: '',
                dataIndex: 'upcoming_calls_actions',
                key: 'upcoming_calls_actions',
                width: 400
            }
        ]
    },
    'rs-appointments-scheduled': {
        title: 'Appointments Scheduled',
        filters: '{"name":"archive","op":"==","val":0},{"name":"rs_action","op":"==","val":1}',
        order_by: '{"field":"expiration_date","direction":"asc"}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date',
                width: 200
            },
            {
                title: '',
                dataIndex: 'upcoming_calls_actions',
                key: 'upcoming_calls_actions',
                width: 400
            }
        ]
    },
    'user-rs-appointments-scheduled': {
        title: 'Appointments Scheduled',
        filters: '{"name":"archive","op":"==","val":0},{"name":"rs_action","op":"==","val":1},{"name":"reviewer_id","op":"==","val":%reviewer_id%}',
        order_by: '{"field":"expiration_date","direction":"asc"}',
        columns: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 200
            },
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                width: 200
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                width: 200
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 200
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 300
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expiration_date',
                key: 'expiration_date',
                width: 200
            },
            {
                title: 'Scheduled Date',
                dataIndex: 'rs_scheduled_date',
                key: 'rs_scheduled_date',
                width: 200
            },
            {
                title: 'Appointment Date',
                dataIndex: 'rs_appointment_date',
                key: 'rs_appointment_date',
                width: 200
            },
            {
                title: '',
                dataIndex: 'upcoming_calls_actions',
                key: 'upcoming_calls_actions',
                width: 400
            }
        ]
    },
    'user-rs-not-interested': {
        title: 'Not Interested',
        filters: '{"name":"review","op":"==","val":1},{"name":"rs_action","op":"==","val":2},{"name":"reviewer_id","op":"==","val":%reviewer_id%}'
    },
}
export default filters;
