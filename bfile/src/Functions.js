import React from 'react';
import moment from 'moment';
import YoungHousehold from './assets/bfile-life-stage-2.png';
import EmergingAdult from './assets/bfile-life-stage-1.png';
import EstablishedHousehold from './assets/bfile-life-stage-3.png';
import MatureHousehold from './assets/bfile-life-stage-4.png';
import Retiree from './assets/bfile-life-stage-5.png';

const Functions = {
    translate: (text) => {
        if (text in window.translate_db && window.translate_lang in window.translate_db[text]) {
            return window.translate_db[text][window.translate_lang];
        } else {
            return text;
        }
    },
    dollar_format: (val, toFixed) => {
        if (typeof toFixed === "undefined")
            toFixed = 0;
        if (typeof val !== "undefined") {
            let n = parseFloat(val);
            return "$" + n.toFixed(toFixed).replace(/./g, function(c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
            });
        } else {
            return "";
        }
    },
    phone_format: (phone) => {
        if (typeof phone !== "undefined" && phone) {
            phone = phone.replace(/ /g, '');
            phone = phone.replace(/-/g, '');
            phone = phone.replace(/\(/g, '');
            phone = phone.replace(/\)/g, '');
            phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            if (phone.length > 14) phone = phone.substring(0, 14);
            return phone;
        } else {
            return "";
        }
    },
    get_first_value: (str) => {
        if (typeof str !== "undefined" && str !== "" && str !== null) {
            str = str.replace(/\$/g, "");
            str = str.replace(/,/g, "");
            let arr = str.split("-");
            let num;
            if (arr.length > 1) {
                num = arr[0] * 1;
                return num;
            } else {
                arr = str.split("+");
                if (arr.length > 1) {
                    num = arr[0] * 1;
                    return num;
                }
            }
        }
        return 0;
    },
    get_second_value: (str) => {
        if (typeof str !== "undefined" && str !== "" && str !== null) {
            str = str.replace(/\$/g, "");
            str = str.replace(/,/g, "");
            let arr = str.split("-");
            let num;
            if (arr.length > 1) {
                num = arr[1] * 1;
                return num;
            } else {
                arr = str.split("+");
                if (arr.length > 1) {
                    num = arr[0] * 1;
                    return num;
                }
            }
        }
        return 0;
    },
    bfile_rac: (bfile) => {
        let rac = 0;
        let auto = 0;
        let home = 0;
        let financial = 0;
        let customary_items = 0;

        const get_second_value = (str) => {
            if (typeof str !== "undefined" && str !== "" && str !== null) {
                str = str.replace(/\$/g, "");
                str = str.replace(/,/g, "");
                let arr = str.split("-");
                let num;
                if (arr.length > 1) {
                    num = arr[1] * 1;
                    return num;
                } else {
                    arr = str.split("+");
                    if (arr.length > 1) {
                        num = arr[0] * 1;
                        return num;
                    }
                }
            }
            return 0;
        };

        if (bfile.primary_vehicles_toggle === '1' && bfile.primary_vehicles_num > 0) {
            rac += bfile.primary_vehicles_num * 15000;
            auto += bfile.primary_vehicles_num * 15000;
        }

        if (bfile.secondary_vehicles_toggle === '1') {
            if (bfile.secondary_vehicles_value !== null && bfile.secondary_vehicles_value !== "") {
                rac += get_second_value(bfile.secondary_vehicles_value);
                auto += get_second_value(bfile.secondary_vehicles_value);
            }
        }

        let mm;
        if (bfile.home_toggle === '1') {
            const home_market_value = get_second_value(bfile.home_market_value);
            if (bfile.home_market_value !== null && bfile.home_market_value !== "") {
                rac += home_market_value;
                home += home_market_value;
            }

            if (bfile.home_mortgage_toggle === '1') {
                mm = home_market_value - get_second_value(bfile.home_mortgage);
                if (mm >= 0) {
                    rac -= home_market_value;
                    home -= home_market_value;
                    rac += mm;
                    home += mm;
                } else {
                    rac -= home_market_value;
                    home -= home_market_value;
                }
            }
        }

        if (bfile.secondary_home_toggle === '1') {
            if (bfile.secondary_home_market_value !== null && bfile.secondary_home_market_value !== '') {
                rac += get_second_value(bfile.secondary_home_market_value);
                home += get_second_value(bfile.secondary_home_market_value);
            }

            if (bfile.secondary_home_mortgage_toggle === '1') {
                mm = get_second_value(bfile.secondary_home_market_value) - get_second_value(bfile.secondary_home_mortgage);
                if (mm >= 0) {
                    rac -= get_second_value(bfile.secondary_home_market_value);
                    home -= get_second_value(bfile.secondary_home_market_value);
                    rac += mm;
                    home += mm;
                } else {
                    rac -= get_second_value(bfile.secondary_home_market_value);
                    home -= get_second_value(bfile.secondary_home_market_value);
                }
            }
        }

        if (bfile.personal_property_toggle === 1) {
            if (bfile.personal_property_value !== '' && bfile.personal_property_value !== null) {
                customary_items = get_second_value(bfile.personal_property_value);
                rac += get_second_value(bfile.personal_property_value);
                home += get_second_value(bfile.personal_property_value);
            }
        }

        if (bfile.employed_anual_income !== null && bfile.employed_anual_income !== '') {
            mm = get_second_value(bfile.employed_anual_income) * 0.5;
            rac += mm;
            financial += mm;
        }

        if (bfile.asset_preservation_value !== null && bfile.asset_preservation_value !== '') {
            rac += get_second_value(bfile.asset_preservation_value);
            financial += get_second_value(bfile.asset_preservation_value);
        }

        if (bfile.asset_total_value !== null && bfile.asset_total_value !== '') {
            rac += get_second_value(bfile.asset_total_value);
            financial += get_second_value(bfile.asset_total_value);
        }

        return {
            rac: rac.toFixed(0),
            auto,
            home,
            financial,
            customary_items
        };
    },
    bfile_status: (bfile) => {
        let status = bfile.status;

        if (bfile.is_saved_for_later === 1) {
            status = "Saved for Later";
        }

        bfile.items_sold = [];
        bfile.items_sold_length = 0;
        if (bfile.auto_sold_toggle === "1") {
            bfile.items_sold.push("Auto");
            bfile.items_sold_length++;
        }
        if (bfile.home_sold_toggle === "1") {
            bfile.items_sold.push("Home");
            bfile.items_sold_length++;
        }

        let ii, len;
        if (bfile.policies && bfile.policies.length > 0) {
            for(ii = 0, len = bfile.policies.length; ii < len; ii++) {
                let item = bfile.policies[ii].policy_type;
                if (bfile.policies[ii].policy_sold === 1) {
                    bfile.items_sold.push(item);
                    bfile.items_sold_length++;
                }
            }
        }
        if (bfile.financial_conversion && bfile.financial_conversion.length > 0) {
            if (bfile.financial_conversion[0].appointment_status === "Complete Sold") {
                let products_sold = bfile.financial_conversion[0].products_sold;
                let json = [];
                if (products_sold !== "" && products_sold !== 0 && products_sold !== null) {
                    json = JSON.parse(products_sold);
                }
                for (ii = 0, len = json.length; ii < len; ii++) {
                    if (json[ii].product_sold !== "") {
                        bfile.items_sold.push(json[ii].product_sold);
                    }
                }
            }
        }

        if (bfile.is_onboarded) {
            status = "Sent for Thank You Call";
        }
        if (bfile.questions.length > 0) {
            if (bfile.questions[0].financial_conversion_action !== 0
                && bfile.questions[0].financial_conversion_action !== null
                && bfile.questions[0].financial_conversion_action !== 3) {
                status = "Sent for Financial Conversation";
            }
            if (bfile.questions[0].financial_conversion_action === 2) {
                status = "Pending Financial Review";
            }
            if (bfile.questions[0].financial_conversion_action === 0) {
                status = "Renewal";
            }
        }
        if (bfile.vob_archived === 1) {
            status = "Not Interested in Financial";
        } else {
            if (bfile.vonboard === 1) {
                status = "Sent to Virtual Onboarding";
                if (bfile.vob_completed === 1) {
                    status = "Sent for Financial Conversation";
                }
            }
        }
        if (bfile.financial_id !== null) {
            status = "Sent for Financial Conversation";

            if (bfile.questions.length > 0) {
                if (bfile.questions[0].financial_conversion_action === 2) {
                    status = "Pending Financial Review";
                }
            }
        }
        if (bfile.financial_conversion.length > 0) {
            if (bfile.financial_conversion[0].interested_in_appointment_toggle === "1") {
                status = "Financial Appointment Scheduled";
            }
            if (bfile.financial_conversion[0].appointment_status === "Complete Not Sold") {
                if (bfile.items_sold_length === 0) {
                    status = "No Sale Archived";
                } else {
                    status = "Renewal";
                }
            }
            if (bfile.financial_conversion[0].appointment_status === "Complete Sold") {
                if (bfile.items_sold_length === 0) {
                    status = "No Sale Archived";
                } else {
                    status = "Renewal";
                }
            }
            if (bfile.financial_conversion[0].appointment_status === "Appointment Rescheduled") {
                status = "Appointment Rescheduled";
            }
            if (bfile.financial_conversion[0].appointment_status === "Call to Reschedule") {
                status = "Call to Reschedule";
            }
            if (bfile.financial_conversion[0].appointment_status === "Appointment Cancelled") {
                status = "Appointment Cancelled";
            }
        }
        if (bfile.archive === 1) {
            status = "No Sale Archived";
            if (bfile.items_sold.length > 0) {
                status = "Renewal";
            }
        }
        if (bfile.is_saved_for_later === 1) {
            status = "Saved for Later";
        }
        return status;
    },
    getAge: (birthday) => {
        let today = new Date();
        let thisYear = 0;
        if (today.getMonth() < birthday.getMonth()) {
            thisYear = 1;
        } else if ((today.getMonth() === birthday.getMonth()) && today.getDate() < birthday.getDate()) {
            thisYear = 1;
        }
        let age = today.getFullYear() - birthday.getFullYear() - thisYear;
        return age;
    },
    validDate: (date, split) => {
        let dateString = date;
        let dataSplit = dateString.split(split);
        return new Date(dataSplit[2]+"/"+dataSplit[1]+"/"+dataSplit[0]);
    },
    bfile_items_sold: (bfile) => {
        let items_sold = [];
        if (bfile.auto_sold_toggle === "1") {
            items_sold.push("Auto");
        }
        if (bfile.home_sold_toggle === "1") {
            items_sold.push("Home");
        }
        if (bfile.policies && bfile.policies.length > 0) {
            for(let ii=0; ii < bfile.policies.length; ii++) {
                let item = bfile.policies[ii].policy_type;
                if (bfile.policies[ii].policy_sold === 1) {
                    items_sold.push(item);
                }
            }
        }
        if (bfile.financial_conversion && bfile.financial_conversion.length > 0) {
            if (bfile.financial_conversion[0].appointment_status === "Complete Sold") {
                let products_sold = bfile.financial_conversion[0].products_sold;
                let json = [];
                if (products_sold !== "" && products_sold !== 0 && products_sold !== null) {
                    json = JSON.parse(products_sold);
                }
                for (let ii = 0; ii < json.length; ii++) {
                    if (json[ii].product_sold !== "") {
                        items_sold.push(json[ii].product_sold);
                    }
                }
            }
        }
        return items_sold;
    },
    bfile_items_not_sold: (bfile) => {
        let items_not_sold = [];
        if (bfile.auto_sold_toggle === "0") {
            items_not_sold.push("Auto");
        }
        if (bfile.home_sold_toggle === "0") {
            items_not_sold.push("Home");
        }
        if (bfile.policies && bfile.policies.length > 0) {
            for(let ii=0; ii < bfile.policies.length; ii++) {
                let item = bfile.policies[ii].policy_type;
                if (bfile.policies[ii].policy_sold === 0) {
                    items_not_sold.push(item);
                }
            }
        }
        return items_not_sold;
    },
    bfile_due_date: (bfile, user_default_date) => {
        let due_date = "-";
        let _due_date = "-";
        let due_date_late = false;

        if ((bfile.is_saved_for_later === 0 && bfile.questions.length === 0) || (bfile.is_saved_for_later === 0 && bfile.questions.length > 0 && bfile.questions[0].financial_conversion_action === null)) {
            due_date = _due_date = bfile.expiration_date;

            if (bfile.need_attention === 1) {
                due_date = _due_date = bfile.created_on;
            }
            
            due_date_late = false;
            if (due_date === "" || due_date === null) {
                if (user_default_date === null || user_default_date === 0) {
                    user_default_date = 15;
                }
                due_date = moment(bfile.created_on).add(user_default_date, 'days').format("MM/DD/YYYY");
                _due_date = moment(bfile.created_on).add(user_default_date, 'days').format("MM/DD/YYYY");
            }

            if (moment(new Date(_due_date)).add(1, 'day') < moment()) {
                //due_date = moment(new Date(_due_date)).add(1, 'day').fromNow(true)+" late";
                due_date = moment(new Date(_due_date)).format("MM/DD/YYYY");
                due_date_late = true;
            }
        }

        if (due_date_late) {
            return <span style={{color:"red"}}>{due_date}</span>
        } else {
            if (due_date !== '-') {
                return moment(due_date).format('MM/DD/YYYY');
            } else {
                return due_date;
            }
        }
    },
    bfile_employment_status: (bfile) => {
        let employment_status = "-";
        if (bfile.business_owner_toggle === "1") {
            employment_status = "Business Owner";
        } else {

            if (bfile.employed_toggle === "1") {
                employment_status = "Employed";

            }  else {
                if (bfile.employed_retired_disabled !== null && bfile.employed_retired_disabled !== '' && bfile.employed_retired_disabled !== 'Unemployed') {
                    employment_status = bfile.employed_retired_disabled;
                }
                if (bfile.employed_retired_disabled !== null && bfile.employed_retired_disabled !== '' && bfile.employed_retired_disabled === 'Unemployed') {
                    employment_status = "Unemployed";
                }
                if (bfile.employed_toggle === '0' && (bfile.employed_retired_disabled === null || bfile.employed_retired_disabled === '')) {
                    employment_status = "Homemaker";
                }
            }
        }
        return employment_status;
    },
    bfile_get_retirement_dollars: (bfile) => {
        const get_second_value = (str) => {
            if (typeof str !== "undefined" && str !== "" && str !== null) {
                str = str.replace(/\$/g, "");
                str = str.replace(/,/g, "");
                let arr = str.split("-");
                let num;
                if (arr.length > 1) {
                    num = arr[1] * 1;
                    return num;
                } else {
                    arr = str.split("+");
                    if (arr.length > 1) {
                        num = arr[0] * 1;
                        return num;
                    }
                }
            }
            return 0;
        };

        let retirement_dollars = 0;
        if (bfile.asset_total_value !== "" && get_second_value(bfile.asset_total_value) !== "") {
            retirement_dollars += get_second_value(bfile.asset_total_value);
        }
        if (bfile.asset_preservation_value !== "" && get_second_value(bfile.asset_preservation_value) !== "") {
            retirement_dollars += get_second_value(bfile.asset_preservation_value);
        }
        if (bfile.financial_conversion.length > 0 && bfile.financial_conversion[0].products_sold !== "" && bfile.financial_conversion[0].products_sold !== null) {
            const products_sold = JSON.parse(bfile.financial_conversion[0].products_sold);
            for (let j = 0; j < products_sold.length; j++) {
                if (typeof products_sold[j].total_dollars !== "undefined") {
                    retirement_dollars = retirement_dollars - products_sold[j].total_dollars;
                }
            }
        }
        if (retirement_dollars < 0) retirement_dollars = 0;
        return retirement_dollars;
    },
    bfile_get_ages: (bfile) => {
        let ages = [];
        if (bfile.birthday !== "" && bfile.birthday !== null) {
            ages.push(this.a.getAge(this.a.validDate(bfile.birthday, "/")));
        }
        if (bfile.spouse_birthday !== "" && bfile.spouse_birthday !== null) {
            ages.push(this.a.getAge(this.a.validDate(bfile.spouse_birthday, "/")));
        }
        return ages;
    },
    bfile_get_life_retirement_opp: (bfile) => {
        let life_retirement = "";
        if ((bfile.asset_401k_accounts === null || bfile.asset_401k_accounts === "[]" || bfile.asset_401k_accounts === '["None"]') && (bfile.asset_accounts === null || bfile.asset_accounts === "[]" || bfile.asset_accounts === '["None"]')) {
            life_retirement = "Life";
        }
        if ((bfile.asset_401k_accounts !== null && bfile.asset_401k_accounts !== "[]" && bfile.asset_401k_accounts !== '["None"]') || (bfile.asset_accounts !== null && bfile.asset_accounts !== "[]" && bfile.asset_accounts !== '["None"]')) {
            life_retirement = "Life/Retirement";
        }
        return life_retirement;
    },
    bfile_renewal_date: (effective_date, term) => {
        if (effective_date && effective_date !== "") {
            const date = effective_date.split("-");
            if (date.length > 2) {
                if (term === '6 Months') {
                    return moment(new Date(date[0], parseInt(date[1])-1, date[2])).add(6, 'months').format('MM/DD/YYYY');
                }
                if (term === '1 Year') {
                    return moment(new Date(date[0], parseInt(date[1])-1, date[2])).add(1, 'years').format('MM/DD/YYYY');
                }
            }
        }
        return '';
    },
    bfile_type: (type) => {
        if (type === "New Bfile") {
            return 'New B-File';
        }
        return type;
    },
    bfile_life_stage: (bfile) => {
        let life_stage = "";
        let life_stage_desc = "";
        let life_stage_thumb = null;
        let ages = [];
        if (bfile.birthday !== "" && bfile.birthday !== null) {
            ages.push(this.a.getAge(this.a.validDate(bfile.birthday, "/")));
        }
        if (bfile.spouse_birthday !== "" && bfile.spouse_birthday !== null) {
            ages.push(this.a.getAge(this.a.validDate(bfile.spouse_birthday, "/")));
        }
        if (ages.length > 0) {
            let customer_age = ages[0];
            if (customer_age <= 30) {
                if (bfile.spouse_first_name !== '') {
                    life_stage = "Young Household";
                    life_stage_desc = "Young families facing a world of firsts - first home, first child - and the responsibilities they bring.";
                    life_stage_thumb = YoungHousehold;
                } else {
                    life_stage = "Emerging Adult";
                    life_stage_desc = "Twenty somethings who are just grasping the basics of finances and insurance.";
                    life_stage_thumb = EmergingAdult;
                }
            } else if (customer_age <= 50) {
                life_stage = "Established Household";
                life_stage_desc = "Families on the verge of entering their prime earning years, generally with roots in the community and children in their tweens/teens.";
                life_stage_thumb = EstablishedHousehold;
            } else if (customer_age <= 65) {
                life_stage = "Mature Household";
                life_stage_desc = "Families that may have adult children, the prospect of retirement on the horizon, and care for aging parents.";
                life_stage_thumb = MatureHousehold;
            } else {
                life_stage = "Retiree";
                life_stage_desc = "Retired customers who want to enjoy life and leave their legacy.";
                life_stage_thumb = Retiree;
            }
            if (bfile.employed_retired_disabled === 'Retired') {
                life_stage = "Retiree";
                life_stage_desc = "Retired customers who want to enjoy life and leave their legacy.";
                life_stage_thumb = Retiree;
            }
        }
        return {
            title: life_stage,
            desc: life_stage_desc,
            thumb: life_stage_thumb
        };
    },
    validateEmail: (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
};

export default Functions
