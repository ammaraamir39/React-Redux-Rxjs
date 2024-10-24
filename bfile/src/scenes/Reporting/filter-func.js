const Filter = (filters) => {
    const arr = [];
    for(let i=0; i<filters.length; i++) {
        const filter = filters[i];
        if (filter.filter1 !== "") {
            arr.push({
                "name": "user_id",
                "op": "==",
                "val": filter.filter1
            });
        }
        if (filter.filter2 === "Include Renters") {
            arr.push({
                "name": "home_toggle",
                "op": "==",
                "val": "2"
            });
        }
        if (filter.filter2 === "Include Mortgage") {
            arr.push({
                "name": "mortgage_review_approved",
                "op": "==",
                "val": "1"
            });
        }
        if (filter.filter2 === "Employed") {
            arr.push({
                "name": "employed_toggle",
                "op": "==",
                "val": "1"
            });
        }
        if (filter.filter2 === "Disabled") {
            arr.push({
                "name": "employed_retired_disabled",
                "op": "==",
                "val": "Disabled"
            });
        }
        if (filter.filter2 !== "" && filter.filter3 !== "") {
            if (filter.filter3 === "Sold") {
                arr.push({
                    "name": "policies",
                    "op": "any",
                    "val": {
                        "name": "policy_type2",
                        "op": "==",
                        "val": filter.filter2+":1"
                    }
                });
            }
            if (filter.filter3 === "Not Sold") {
                arr.push({
                    "name": "policies",
                    "op": "any",
                    "val": {
                        "name": "policy_type2",
                        "op": "==",
                        "val": filter.filter2+":0"
                    }
                });
            }
            if (filter.filter2 === "Cross Sell Opportunity") {
                if (filter.filter3 === "Available") {
                    arr.push({
                        "name": "policies",
                        "op": "is_not_null"
                    });
                }
                if (filter.filter3 === "Not Available") {
                    arr.push({
                        "name": "policies",
                        "op": "is_null"
                    });
                }
            }
            if (filter.filter2 === "Business Owner") {
                if (filter.filter3 === "True") {
                    arr.push({
                        "name": "business_owner_toggle",
                        "op": "==",
                        "val": "1"
                    });
                }
                if (filter.filter3 === "False") {
                    arr.push({
                        "name": "business_owner_toggle",
                        "op": "==",
                        "val": "0"
                    });
                }
            }
            if (filter.filter2 === "saved for later") {
                if (filter.filter3 === "True") {
                    arr.push({
                        "name": "is_saved_for_later",
                        "op": "==",
                        "val": "1"
                    });
                }
                if (filter.filter3 === "False") {
                    arr.push({
                        "name": "is_saved_for_later",
                        "op": "==",
                        "val": "0"
                    });
                }
            }
            if (filter.filter2 === "no sale archive") {
                if (filter.filter3 === "True") {
                    arr.push({
                        "name": "archive",
                        "op": "==",
                        "val": "1"
                    });
                }
                if (filter.filter3 === "False") {
                    arr.push({
                        "name": "archive",
                        "op": "==",
                        "val": "0"
                    });
                }
            }
            if (filter.filter2 === "sent for vonboard") {
                if (filter.filter3 === "True") {
                    arr.push({
                        "name": "vonboard",
                        "op": "==",
                        "val": "1"
                    });
                }
                if (filter.filter3 === "False") {
                    arr.push({
                        "name": "vonboard",
                        "op": "==",
                        "val": "0"
                    });
                }
            }
            if (filter.filter2 === "Life Insurance") {
                if (filter.filter3 === "Needed") {
                    arr.push({
                        "name": "home_mortgage_protection_toggle",
                        "op": "==",
                        "val": "1"
                    });
                }
                if (filter.filter3 === "Not Needed") {
                    arr.push({
                        "name": "home_mortgage_protection_toggle",
                        "op": "==",
                        "val": "0"
                    });
                }
            }
            if (filter.filter3 === "Sent" && filter.filter2 === "financial") {
                arr.push({
                    "name": "financial_id",
                    "op": "is_not_null",
                });
            }
            if (filter.filter3 === "Equal To" || filter.filter3 === "Greater Than" || filter.filter3 === "Less Than") {
                let colname = "";
                if (filter.filter2 === "Household Income") colname = "employed_anual_income";
                if (filter.filter2 === "# of Children") colname = "children";

                if (filter.filter2 === "Retirement Dollars") colname = "retirement_dollars";
                if (filter.filter2 === "401k") colname = "asset_401k_value";

                if (filter.filter3 === "Equal To") {
                    arr.push({
                        "name": colname,
                        "op": "==",
                        "val": filter.value
                    });
                }
                if (filter.filter3 === "Greater Than") {
                    arr.push({
                        "name": colname,
                        "op": ">",
                        "val": filter.value
                    });
                }
                if (filter.filter3 === "Less Than") {
                    arr.push({
                        "name": colname,
                        "op": "<",
                        "val": filter.value
                    });
                }
            }
            if (filter.filter3 === "All") {
                if (filter.filter2 === "onboarding") {
                    arr.push({
                        "name": "onboarding_id",
                        "op": "==",
                        "val": filter.filter1
                    });
                }
                if (filter.filter2 === "financial") {
                    arr.push({
                        "name": "financial_id",
                        "op": "==",
                        "val": filter.filter1
                    });
                }
            }
            if (filter.filter3 === "Not Complete") {
                if (filter.filter2 === "onboarding") {
                    arr.push({
                        "and": [
                            {
                                "name": "onboarding_id",
                                "op": "is_not_null"
                            },
                            {
                                "or": [
                                    {
                                        "name": "questions",
                                        "op": "is_null"
                                    },
                                    {
                                        "name": "questions",
                                        "op":"any",
                                        "val": {
                                            "name": "financial_conversion_action",
                                            "op":"is_null"
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
                if (filter.filter2 === "financial") {
                    arr.push({
                        "and": [
                            {
                                "name": "financial_id",
                                "op": "is_not_null"
                            },
                            {
                                "or": [
                                    {
                                        "name": "financial_conversion",
                                        "op": "is_null"
                                    },
                                    {
                                        "name": "financial_conversion",
                                        "op":"any",
                                        "val": {
                                            "name": "interested_in_appointment_toggle",
                                            "op":"is_null"
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            }
            if (filter.filter3 === "Complete") {
                if (filter.filter2 === "onboarding") {
                    arr.push({
                        "and": [
                            {
                                "name": "onboarding_id",
                                "op": "is_not_null"
                            },
                            {
                                "name": "questions",
                                "op":"any",
                                "val": {
                                    "name": "financial_conversion_action",
                                    "op":"is_not_null"
                                }
                            }
                        ]
                    });
                }
                if (filter.filter2 === "financial") {
                    arr.push({
                        "and": [
                            {
                                "name": "financial_id",
                                "op": "is_not_null"
                            },
                            {
                                "name": "financial_conversion",
                                "op":"any",
                                "val": {
                                    "name": "interested_in_appointment_toggle",
                                    "op":"is_not_null"
                                }
                            }
                        ]
                    });
                }
            }
        }
    }

    return arr;
}

export default Filter;
