import React, { Component } from 'react';
import {
    Menu,
    Icon
} from 'antd';
import TransferBFilesModal from './components/transfer-bfiles-modal';
import UploadCustomersEAModal from './components/upload-customers-ea-modal';
import UploadCustomersRSModal from './components/upload-customers-rs-modal';
import HelpModal from './components/help-modal';
import { Translate } from 'react-translated';

const SubMenu = Menu.SubMenu;

window.openChat = () => {
    console.log("Open Chat");
    window.LC_API.open_chat_window();
};

class DashMenu extends Component {
    state = {
        agency_manager:[
            
                {
                    key: 'dashboard',
                    title: 'Dashboard',
                    path: '/dashboard',
                    icon: 'dashboard'
                },
                {
                    key: 'agency_manager_profile',
                    title: 'Profile',
                    path: '/profile/agency_manager',
                    icon: 'user'
                },
                {
                    key: 'training',
                    title: 'Training',
                    icon: 'video-camera',
                    menu: [
                       
                        {
                            key: 'training1',
                            title: 'Hoopinsure U',
                            path: '/training/hoopinsure-u'
                        },
                        {
                            key: 'training-index',
                            title: 'System Training',
                            path: '/training',
                        },
                        {
                            key: 'training2',
                            title: 'Philosophy',
                            path: '/training/philosophy'
                        },
                        // {
                        //     key: 'training3',
                        //     title: 'Nuts & Bolts',
                        //     path: '/training'
                        // },
                        // {
                        //     key: 'training4',
                        //     title: 'Customer Training',
                        //     path: '/training'
                        // },
                        // {
                        //     key: 'training5',
                        //     title: '3rd Party Products',
                        //     path: '/training'
                        // }
                    ]
                },
        ],
        ea: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'all-bfiles',
                        title: 'All B-Files',
                        path: '/bfiles'
                    },
                    {
                        key: 'create-bfile',
                        title: 'Create A New B-File',
                        path: '/wizard?new'
                    },
                    {
                        key: 'sp-reporting',
                        title: 'S&P Reporting',
                        path: '/bfiles/sp-500'
                    },
                    {
                        key: 'vip-reporting',
                        title: 'VIP Reporting',
                        path: '/bfiles/vip'
                    },
                    {
                        key: 'mortgage-review',
                        title: 'Mortgage Review',
                        path: '/bfiles/mortgage-review'
                    },
                    {
                        key: 'no-sale-archive',
                        title: 'No Sale Archive',
                        path: '/bfiles/no-sale-archive'
                    },
                    {
                        key: 'archived',
                        title: 'Archived',
                        path: '/bfiles/archived'
                    },
                    {
                        key: 'deleted-bfiles',
                        title: 'Deleted B-Files',
                        path: '/bfiles/deleted'
                    },
                    {
                        key: 'calendar-invites',
                        title: 'Calendar Invites',
                        path: '/calendar-invites'
                    },
                    {
                        key: 'transfer-bfiles',
                        title: 'Transfer B-Files',
                        path: '',
                        onClick: () => {
                            this.setState({ transfer_bfiles_modal: true })
                        }
                    },
                    // {
                    //     key: 'upload-customers',
                    //     title: 'Upload Customers',
                    //     path: '',
                    //     onClick: () => {
                    //         this.setState({ upload_customers_ea_modal: true })
                    //     }
                    // },
                    /*{
                        key: 'new-quote',
                        title: 'New Quote',
                        path: '/wizard/new-quote'
                    },*/
                ]
            },
            {
                key: 'training',
                title: 'Training',
                icon: 'video-camera',
                menu: [
                    {
                        key: 'training1',
                        title: 'Hoopinsure U',
                        path: '/training/hoopinsure-u'
                    },
                    {
                        key: 'training-index',
                        title: 'System Training',
                        path: '/training',
                    },
                    {
                        key: 'training2',
                        title: 'Philosophy',
                        path: '/training/philosophy'
                    },
                    // {
                    //     key: 'training',
                    //     title: 'Training',
                    //     icon: 'video-camera',
                    //     menu: [
                          
                            
                    //         {
                    //             key: 'training-index',
                    //             title: 'System Training',
                    //             path: '/training',
                    //         },
                    //         {
                    //             key: 'training2',
                    //             title: 'Philosophy',
                    //             path: '/training/philosophy'
                    //         },
                           
                    //     ]
                    // },
                    // {
                    //     key: 'training1',
                    //     title: 'Hoopinsure U',
                    //     path: '/training/hoopinsure-u'
                    // },
                    
                    // {
                    //     key: 'training3',
                    //     title: 'Nuts & Bolts',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training4',
                    //     title: 'Customer Training',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training5',
                    //     title: '3rd Party Products',
                    //     path: '/training'
                    // }
                ]
            },
            {
                key: 'manage-users',
                title: 'Manage Users',
                icon: 'usergroup-add',
                menu: [
                    {
                        key: 'manage-users-index',
                        title: 'Manage Users',
                        path: '/manage-users'
                    },
                    {
                        key: 'invite-lsp',
                        title: 'Invite Agency Sales Staff (LSP\'s)',
                        path: '/manage-users/invite-lsp'
                    },
                    {
                        key: 'link-efs',
                        title: 'Link Financial Specialist',
                        path: '/manage-users/link-efs'
                    },
                    {
                        key: 'invite-mortgage-broker',
                        title: 'Invite Mortgage Broker',
                        path: '/manage-users/invite-mortgage-broker'
                    },
                    {
                        key: 'invited-users',
                        title: 'Invited Users',
                        path: '/manage-users/invited-users'
                    },
                    {
                        key: 'inactive-users',
                        title: 'Inactive Users',
                        path: '/manage-users/inactive-users'
                    }
                ]
            },
            {
                key: 'profile',
                title: 'Profile',
                path: '/profile',
                icon: 'user'
            },
            {
                key: 'agency-profile',
                title: 'Agency Profile',
                path: '/profile/agency',
                icon: 'user'
            },
            {
                key: 'referrals',
                title: 'Referrals',
                icon: 'team',
                menu: [
                    {
                        key: 'referrals-index',
                        title: 'Referrals',
                        path: '/referrals'
                    },
                    {
                        key: 'referral-payouts',
                        title: 'Referral Payouts',
                        path: '/referrals/payouts'
                    },
                    {
                        key: 'paid-referrals',
                        title: 'Paid Referrals',
                        path: '/referrals/paid'
                    }
                ]
            },
            {
                key: 'reward-program',
                title: 'Reward Program',
                icon: 'gift',
                menu: [
                    {
                        key: 'reward-program-index',
                        title: 'Reward Program',
                        path: '/reward-program'
                    },
                    {
                        key: 'order-history',
                        title: 'Order History',
                        path: '/reward-program/order-history'
                    }
                ]
            },
            {
                key: 'send-a-gift',
                title: 'Send a Gift',
                path: '/send-a-gift',
                icon: 'gift'
            },
            {
                key: 'reporting',
                title: 'Reporting',
                path: '/reporting',
                icon: 'area-chart'
            },
            {
                key: 'gamification',
                title: 'Gamification',
                icon: 'trophy',
                menu: [
                    {
                        key: 'gamification-index',
                        title: 'Gamification',
                        path: '/gamification'
                    },
                    {
                        key: 'winners',
                        title: 'Winners',
                        path: '/gamification/winners'
                    },
                    {
                        key: 'archive',
                        title: 'Archive',
                        path: '/gamification/archive'
                    }
                ]
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        lsp: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'all-bfiles',
                        title: 'All B-Files',
                        path: '/bfiles'
                    },
                    {
                        key: 'create-bfile',
                        title: 'Create A New B-File',
                        path: '/wizard'
                    },
                    {
                        key: 'sp-reporting',
                        title: 'S&P Reporting',
                        path: '/bfiles/sp-500'
                    },
                    {
                        key: 'vip-reporting',
                        title: 'VIP Reporting',
                        path: '/bfiles/vip'
                    },
                    {
                        key: 'no-sale-archive',
                        title: 'No Sale Archive',
                        path: '/bfiles/no-sale-archive'
                    },
                    {
                        key: 'archived',
                        title: 'Archived',
                        path: '/bfiles/archived'
                    },
                    {
                        key: 'deleted-bfiles',
                        title: 'Deleted B-Files',
                        path: '/bfiles/deleted'
                    },
                    {
                        key: 'calendar-invites',
                        title: 'Calendar Invites',
                        path: '/calendar-invites'
                    },
                    {
                        key: 'new-quote',
                        title: 'New Quote',
                        path: '/wizard/new-quote'
                    },
                ]
            },
            {
                key: 'training',
                title: 'Training',
                icon: 'video-camera',
                menu: [
                    {
                        key: 'training1',
                        title: 'Hoopinsure U',
                        path: '/training/hoopinsure-u'
                    },
                    {
                        key: 'training-index',
                        title: 'Training',
                        path: '/training',
                    },
                    {
                        key: 'training2',
                        title: 'Philosophy',
                        path: '/training/philosophy'
                    }
                    // {
                    //     key: 'training3',
                    //     title: 'Nuts & Bolts',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training4',
                    //     title: 'Customer Training',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training5',
                    //     title: '3rd Party Products',
                    //     path: '/training'
                    // }
                ]
            },
            {
                key: 'profile',
                title: 'Profile',
                path: '/profile',
                icon: 'user'
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        efs: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'all-bfiles',
                        title: 'All B-Files',
                        path: '/bfiles'
                    }
                ]
            },
            {
                key: 'training',
                title: 'Training',
                icon: 'video-camera',
                menu: [
                    {
                        key: 'training1',
                        title: 'Hoopinsure U',
                        path: '/training/hoopinsure-u'
                    },
                    {
                        key: 'training-index',
                        title: 'Training',
                        path: '/training',
                    },
                    {
                        key: 'training2',
                        title: 'Philosophy',
                        path: '/training/philosophy'
                    }
                    // {
                    //     key: 'training3',
                    //     title: 'Nuts & Bolts',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training4',
                    //     title: 'Customer Training',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training5',
                    //     title: '3rd Party Products',
                    //     path: '/training'
                    // }
                ]
            },
            {
                key: 'profile',
                title: 'Profile',
                path: '/profile',
                icon: 'user'
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        vonboarder: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'dedicated-agency-dashboard',
                title: 'Dedicated Agency Dashboard',
                path: '/dashboard/select-agency',
                icon: 'appstore'
            },
            {
                key: 'training',
                title: 'Training',
                icon: 'video-camera',
                menu: [
                   
                    {
                        key: 'training1',
                        title: 'Hoopinsure U',
                        path: '/training/hoopinsure-u'
                    },
                    {
                        key: 'training-index',
                        title: 'System Training',
                        path: '/training',
                    },
                    {
                        key: 'training2',
                        title: 'Philosophy',
                        path: '/training/philosophy'
                    },
                    // {
                    //     key: 'training3',
                    //     title: 'Nuts & Bolts',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training4',
                    //     title: 'Customer Training',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training5',
                    //     title: '3rd Party Products',
                    //     path: '/training'
                    // }
                ]
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'claimed-bfiles',
                        title: 'My Claimed B-Files',
                        path: '/bfiles/claimed'
                    },
                    {
                        key: 'all-bfiles',
                        title: 'All Virtual B-Files',
                        path: '/bfiles'
                    },
                    {
                        key: 'sp-reporting',
                        title: 'S&P Reporting',
                        path: '/bfiles/sp-500'
                    },
                    {
                        key: 'vip-reporting',
                        title: 'VIP Reporting',
                        path: '/bfiles/vip'
                    },
                    {
                        key: 'no-sale-archive',
                        title: 'No Sale Archive',
                        path: '/bfiles/no-sale-archive'
                    },
                    {
                        key: 'archived',
                        title: 'Archived',
                        path: '/bfiles/archived'
                    },
                    {
                        key: 'calendar-invites',
                        title: 'Calendar Invites',
                        path: '/calendar-invites'
                    }
                ]
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            }
        ],
        vonboardadmin: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'all-bfiles',
                        title: 'All B-Files',
                        path: '/bfiles'
                    },
                    {
                        key: 'sp-reporting',
                        title: 'S&P Reporting',
                        path: '/bfiles/sp-500'
                    },
                    {
                        key: 'vip-reporting',
                        title: 'VIP Reporting',
                        path: '/bfiles/vip'
                    },
                    {
                        key: 'no-sale-archive',
                        title: 'No Sale Archive',
                        path: '/bfiles/no-sale-archive'
                    },
                    {
                        key: 'archived',
                        title: 'Archived',
                        path: '/bfiles/archived'
                    },
                    {
                        key: 'calendar-invites',
                        title: 'Calendar Invites',
                        path: '/calendar-invites'
                    }
                ]
            },
            {
                key: 'manage-users',
                title: 'Manage Users',
                icon: 'usergroup-add',
                menu: [
                    {
                        key: 'manage-users-index',
                        title: 'Manage Users',
                        path: '/manage-users'
                    },
                    {
                        key: 'invite-vo',
                        title: 'Invite a Virtual Onboarder',
                        path: '/manage-users/invite-vo'
                    },
                    {
                        key: 'invited-users',
                        title: 'Invited Users',
                        path: '/manage-users/invited-users'
                    },
                    {
                        key: 'inactive-users',
                        title: 'Inactive Users',
                        path: '/manage-users/inactive-users'
                    }
                ]
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        reviewscheduler: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'dedicated-agency-dashboard',
                title: 'Dedicated Agency Dashboard',
                path: '/dashboard/select-agency',
                icon: 'appstore'
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'all-bfiles',
                        title: 'All B-Files',
                        path: '/bfiles'
                    },
                    {
                        key: 'upcoming-calls',
                        title: 'Upcoming Calls',
                        path: '/bfiles/rs-upcoming-calls'
                    },
                    {
                        key: 'upload-customers',
                        title: 'Upload Customers',
                        path: '',
                        onClick: () => {
                            this.setState({ upload_customers_rs_modal: true })
                        }
                    },
                ]
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        rso: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'dedicated-agency-dashboard',
                title: 'Dedicated Agency Dashboard',
                path: '/dashboard/select-agency',
                icon: 'appstore'
            },
            {
                key: 'bfiles',
                title: 'B-Files',
                icon: 'folder',
                menu: [
                    {
                        key: 'claimed-bfiles',
                        title: 'My Claimed B-Files',
                        path: '/bfiles/claimed'
                    },
                    {
                        key: 'all-bfiles',
                        title: 'All B-Files',
                        path: '/bfiles'
                    },
                    {
                        key: 'upcoming-calls',
                        title: 'Upcoming Calls',
                        path: '/bfiles/rs-upcoming-calls'
                    },
                    {
                        key: 'sp-reporting',
                        title: 'S&P Reporting',
                        path: '/bfiles/sp-500'
                    },
                    {
                        key: 'vip-reporting',
                        title: 'VIP Reporting',
                        path: '/bfiles/vip'
                    },
                    {
                        key: 'no-sale-archive',
                        title: 'No Sale Archive',
                        path: '/bfiles/no-sale-archive'
                    },
                    {
                        key: 'archived',
                        title: 'Archived',
                        path: '/bfiles/archived'
                    },
                    {
                        key: 'calendar-invites',
                        title: 'Calendar Invites',
                        path: '/calendar-invites'
                    },
                    {
                        key: 'upload-customers',
                        title: 'Upload Customers',
                        path: '',
                        onClick: () => {
                            this.setState({ upload_customers_rs_modal: true })
                        }
                    },
                ]
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        reviewadmin: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'scheduled-calls',
                title: 'Scheduled Calls',
                path: '/bfiles/scheduled-calls',
                icon: 'calendar'
            },
            {
                key: 'calendar-invites',
                title: 'Calendar Invites',
                path: '/calendar-invites',
                icon: 'calendar'
            },
            {
                key: 'manage-users',
                title: 'Manage Users',
                icon: 'usergroup-add',
                menu: [
                    {
                        key: 'manage-users-index',
                        title: 'Manage Users',
                        path: '/manage-users'
                    },
                    {
                        key: 'invite-rs',
                        title: 'Invite a Review Scheduler',
                        path: '/manage-users/invite-rs'
                    },
                    {
                        key: 'invited-users',
                        title: 'Invited Users',
                        path: '/manage-users/invited-users'
                    },
                    {
                        key: 'inactive-users',
                        title: 'Inactive Users',
                        path: '/manage-users/inactive-users'
                    }
                ]
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/features',
            //     icon: 'tool'
            // },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        superadmin: [
            {
                key: 'active-agencies',
                title: 'Active Agencies',
                path: '/super-admin',
                icon: 'team'
            },
            {
                key: 'inactive-agencies',
                title: 'Inactive Agencies',
                path: '/super-admin/inactive-agencies',
                icon: 'close-square-o'
            },
            {
                key: 'training',
                title: 'Training',
                icon: 'video-camera',
                menu: [
                    {
                        key: 'videos',
                        title: 'Upload Training Video' ,
                        path: '/training/video'
                    },
                    {
                        key: 'training1',
                        title: 'Hoopinsure U',
                        path: '/training/hoopinsure-u'
                    },
                    {
                        key: 'training-index',
                        title: 'System Training',
                        path: '/training',
                    },
                    {
                        key: 'training2',
                        title: 'Philosophy',
                        path: '/training/philosophy'
                    },
                    // {
                    //     key: 'training3',
                    //     title: 'Nuts & Bolts',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training4',
                    //     title: 'Customer Training',
                    //     path: '/training'
                    // },
                    // {
                    //     key: 'training5',
                    //     title: '3rd Party Products',
                    //     path: '/training'
                    // }
                ]
            },
            /*{
                key: 'in-10-30-stats',
                title: '10 in 30 stats',
                path: '/super-admin/10-in-30-stats',
                icon: 'gift'
            },*/
            {
                key: 'stats',
                title: 'Stats',
                path: '/super-admin/stats',
                icon: 'area-chart'
            },
            {
                key: 'invite-admin',
                title: 'Notification',
                path: '/notification-admin',
                icon: 'bell'
            },
            {
                key: 'agency-stats',
                title: 'Stats by Agency (CSV)',
                path: '/super-admin/agency-stats',
                icon: 'area-chart'
            },
            {
                key: 'last-login',
                title: 'Last Login',
                path: '/super-admin/last-login',
                icon: 'area-chart'
            },
            {
                key: 'onboard-agencies',
                title: 'Onboard Agencies',
                path: '/super-admin/onboard-agencies',
                icon: 'area-chart'
            },
            {
                key: 'onboard-sent-bfiles',
                title: 'Onboard Sent B-Files',
                path: '/super-admin/onboard-sent-bfiles',
                icon: 'area-chart'
            },
            {
                key: 'manage',
                title: 'Manage Users',
                icon: 'usergroup-add',
                menu: [
                    {
                        key: 'manage-users-index',
                        title: 'Manage Users',
                        path: '/manage-users'
                    },
                    // {
                    //     key: 'invite-lsp',
                    //     title: 'Invite Agency Sales Staff (LSP\'s)',
                    //     path: '/manage-users/invite-lsp'
                    // },
                    {
                        key:'invite-agency-manager',
                        title : 'Invite Agency Manager',
                        path:'/manage-users/invite-agency-manager'
                    },
                    // {
                    //     key: 'link-efs',
                    //     title: 'Link Financial Specialist',
                    //     path: '/manage-users/link-efs'
                    // },
                    // {
                    //     key: 'invite-mortgage-broker',
                    //     title: 'Invite Mortgage Broker',
                    //     path: '/manage-users/invite-mortgage-broker'
                    // },
                    {
                        key: 'invited-users',
                        title: 'Invited Users',
                        path: '/manage-users/invited-users'
                    },
                    {
                        key: 'inactive-users',
                        title: 'Inactive Users',
                        path: '/manage-users/inactive-users'
                    }
                ]
            },
            {
                key: 'review-schedulers',
                title: 'Review Schedulers',
                path: '/super-admin/review-schedulers',
                icon: 'user'
            },
            {
                key: 'agency-manager',
                title: 'Agency Manager',
                path: '/super-admin/agency-manager',
                icon: 'user'
            },
            {
                key: 'rs-reporting',
                title: 'RS Reporting',
                path: '/super-admin/rs-reporting',
                icon: 'area-chart'
            },
            {
                key: 'rs-upload',
                title: 'RS Upload',
                path: '/super-admin/rs-upload',
                icon: 'user'
            },
            {
                key: 'region-stats',
                title: 'Region Stats',
                path: '/super-admin/region-stats',
                icon: 'area-chart'
            },
            {
                key: 'tango-accounts',
                title: 'Tango Accounts',
                path: '/super-admin/tango-accounts',
                icon: 'star-o'
            },
            {
                key: 'email-content',
                title: 'Email Content',
                path: '/super-admin/email-content',
                icon: 'mail'
            },
            // {
            //     key: 'features',
            //     title: 'Features & Fixes',
            //     path: '/super-admin/features',
            //     icon: 'tool'
            // },
            
            {
                key: 'profile',
                title: 'Profile',
                path: '/profile',
                icon: 'user'
            },
            
        ],
        mortgage_broker: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard'
            },
            {
                key: 'leads',
                title: 'Leads',
                path: '/bfiles/mb-leads',
                icon: 'folder'
            },
            {
                key: 'new-lead',
                title: 'New Lead',
                path: '/new-lead',
                icon: 'plus'
            },
            {
                key: 'help',
                title: 'Help & Suggestions',
                path: '',
                icon: 'question-circle-o',
                onClick: () => {
                    //this.setState({ help_modal: true })
                    window.openChat();
                }
            },
        ],
        user: this.props.user,
        transfer_bfiles_modal: false,
        upload_customers_ea_modal: false,
        upload_customers_rs_modal: false,
        help_modal: false
    }
    render() {
        const {
            selected_key,
            handleClick,
            goTo,
            user,
        } = this.props;

        const {
            ea,
            lsp,
            efs,
            vonboarder,
            vonboardadmin,
            reviewscheduler,
            reviewadmin,
            superadmin,
            mortgage_broker,
            rso,
            agency_manager
        } = this.state;

        let menu = [];
        if (user.user_type === 'EA' && user.id !== 2) {
            menu = ea;
        }
        if (user.user_type === 'LSP') {
            menu = lsp;
        }
        if (user.user_type === 'EFS') {
            menu = efs;
        }
        if (user.user_type === 'VONBOARDER') {
            menu = vonboarder;
        }
        if (user.user_type === 'EA' && user.id === 2) {
            menu = vonboardadmin;
        }
        if (user.user_type === 'REVIEWSCHEDULER') {
            menu = reviewscheduler;
        }
        if (user.user_type === 'RSO') {
            menu = rso;
        }
        if (user.user_type === 'REVIEWADMIN') {
            menu = reviewadmin;
        }
        if (user.user_type === 'SUPER_ADMIN') {
            menu = superadmin;
        }
        if (user.user_type === 'MORTGAGE_BROKER') {
            menu = mortgage_broker;
        }
        if (user.user_type === 'AGENCY_MANAGER') {
            menu = agency_manager;
        }

        return (
            <div>
                <Menu
                    defaultSelectedKeys={selected_key}
                    mode="inline"
                    theme="dark"
                    onClick={handleClick}
                >
                    {menu.map((item) => {
                        if (typeof item.menu !== 'undefined') {
                            return (
                                <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span><Translate text={item.title} /></span></span>}>
                                    {item.menu.map((subitem) => (
                                        <Menu.Item key={subitem.key} onClick={() => {
                                            if (typeof subitem.onClick !== 'undefined') {
                                                subitem.onClick();
                                            } else if (subitem.path !== '') {
                                                goTo(subitem.path);
                                            }
                                        }}><Translate text={subitem.title} /></Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item id={'menu-'+item.key} key={item.key} onClick={() => {
                                    if (typeof item.onClick !== 'undefined') {
                                        item.onClick();
                                    } else if (item.path !== '') {
                                        goTo(item.path);
                                    }
                                }}>
                                    <Icon type={item.icon} />
                                    <span><Translate text={item.title} /></span>
                                </Menu.Item>
                            )
                        }
                    })}
                </Menu>
                <TransferBFilesModal
                    history={this.props.history}
                    showModal={this.state.transfer_bfiles_modal}
                    hideModal={() => this.setState({ transfer_bfiles_modal: false })}
                    user={this.state.user}
                />
                <UploadCustomersEAModal
                    history={this.props.history}
                    showModal={this.state.upload_customers_ea_modal}
                    hideModal={() => this.setState({ upload_customers_ea_modal: false })}
                    user={this.state.user}
                />
                <UploadCustomersRSModal
                    history={this.props.history}
                    showModal={this.state.upload_customers_rs_modal}
                    hideModal={() => this.setState({ upload_customers_rs_modal: false })}
                    user={this.state.user}
                />
                <HelpModal
                    history={this.props.history}
                    showModal={this.state.help_modal}
                    hideModal={() => this.setState({ help_modal: false })}
                    user={this.state.user}
                />
            </div>
        )
    }
}

export default DashMenu;
