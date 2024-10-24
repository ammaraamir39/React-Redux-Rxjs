//import fs from 'fs';
//import jsonxml from 'jsonxml';
import format from 'xml-formatter';
import axios from 'axios';
// import x from 'libxmljs';

const uploadEZ = function(data, callback) {

    let { wizard, childs, autos } = data;

    data = {
        "Applicant": {
            "ApplicantType": "Applicant",
            "PersonalInfo": {
                "Name": {
                    "Prefix": "MR",
                    "FirstName": wizard.first_name,
                    "MiddleName": null,
                    "LastName": wizard.last_name,
                    "Suffix": "III"
                },
                "DOB": "1970-12-16",
                "SSN": "123456789",
                "Gender": "Male",
                "MaritalStatus": "Separated",
                "Relation": "Insured",
                "Industry": "Unemployed",
                "Occupation": "Unemployed",
                "Education": "Phd"
            },
            "Address": [
                {
                    "AddressCode": "StreetAddress",
                    "Addr1": {
                    "StreetName": "Main St.",
                    "StreetNumber": "123",
                    "UnitNumber": null
                    },
                    "Addr2": null,
                    "City": "COVINGTON",
                    "StateCode": "GA",
                    "County": "NEWTON",
                    "Zip5": "30014",
                    "Phone": [
                    {
                        "PhoneType": "Home",
                        "PhoneNumber": "2145551212"
                    },
                    {
                        "PhoneType": "Work",
                        "PhoneNumber": "2145551212",
                        "Extension": null
                    }
                    ],
                    "Email": "unknown@unknown.com",
                    "YearsAtAddress": "6-12 months",
                    "Validation": "Invalid"
                },
                {
                    "AddressCode": "PreviousAddress",
                    "Addr1": {
                    "StreetName": "Main St.",
                    "StreetNumber": "123",
                    "UnitNumber": null
                    },
                    "Addr2": null,
                    "City": "Atlanta",
                    "StateCode": "GA",
                    "County": "Fulton",
                    "Zip5": "30303",
                    "YearsAtAddress": "1",
                    "Validation": "Invalid"
                }
            ]
        },
        "PriorPolicyInfo": {
            "PriorCarrier": "AAA",
            "Expiration": "2008-09-13",
            "YearsWithPriorCarrier": {
                "Years": "3",
                "Months": "3"
            },
            "YearsWithContinuousCoverage": {
                "Years": "3",
                "Months": "3"
            }
        },
        "PolicyInfo": {
            "PolicyTerm": "12 Month",
            "PolicyType": "HO6",
            "Package": "Yes",
            "Effective": "2008-07-13",
            "CreditCheckAuth": "No"
        },
        "RatingInfo": {
            "PropertyInsCancelledLapsed": "No",
            "YearBuilt": "1970",
            "Dwelling": "Two Family",
            "DwellingUse": "Secondary",
            "NumberOfFullTimeDomEmps": "0",
            "DistanceToFireHydrant": "1401-1500",
            "WithinCityLimits": "Yes",
            "DistanceToFireStation": "4",
            "WithinFireDistrict": "No",
            "ProtectionClass": "1",
            "NumberOfStories": "4",
            "Construction": "Concrete Decorative Block, Painted",
            "Structure": "Apartment",
            "Roof": "TAR and GRAVEL",
            "SwimmingPool": "No",
            "SwimmingPoolFenced": "No",
            "DogOnPremises": "No",
            "HeatingType": "Solid Fuel",
            "WoodBurningStove": "Yes",
            "NumberOfWoodBurningStoves": "1",
            "RoofingUpdate": "PARTIAL UPDATE",
            "RoofingUpdateYear": "1999",
            "ElectricalUpdate": "PARTIAL UPDATE",
            "ElectricalUpdateYear": "1997",
            "PlumbingUpdate": "PARTIAL UPDATE",
            "PlumbingUpdateYear": "1981",
            "HeatingUpdate": "PARTIAL UPDATE",
            "HeatingUpdateYear": "1980",
            "UnderConstruction": "Yes",
            "SquareFootage": "2200",
            "PurchaseDate": "2000-03-24",
            "PurchasePrice": "14560",
            "SecondaryHeatingSource": "Yes",
            "SecondaryHeatingSourceType": "Natural Gas",
            "BusinessOnPremises": "No",
            "FirstMortgagee": "Yes",
            "SecondMortgagee": "Yes",
            "ThirdMortgagee": "No",
            "EquityLineOfCredit": "Yes",
            "CoSigner": "Yes",
            "NumberOfOtherInterests": "0"
        },
        "ReplacementCost": {
            "ReplacementCost": "40000",
            "Dwelling": "40000",
            "LossOfUse": "1250",
            "PersonalProperty": "14000",
            "PersonalLiability": "500000",
            "MedicalPayments": "5000",
            "DeductibeInfo": {
                "Deductible": "500",
                "TheftDeductible": "500"
            },
            "RatingCredits": {
                "RetireesCredit": "No",
                "MatureDiscount": "No",
                "RetirementCommunity": "No",
                "LimitedAccessCommunity": "No",
                "GatedCommunity": "No",
                "Multipolicy": "No",
                "NonSmoker": "No"
            }
        },
        "Endorsements": {
            "BuildingAddAlt": "Yes",
            "BuildingAddAltAmount": "5000",
            "Earthquake": {
                "Earthquake": "Yes",
                "Coverage": {
                    "Zone": "6",
                    "ExcludeMasonryVeneer": "Yes",
                    "Deductible": "15%",
                    "PercentVeneer": "10"
                }
            },
            "IdentityTheft": {
                "IdentityTheft": "Yes"
            },
            "IncreasedMold": {
                "IncreasedMold": "Yes",
                "PropertyDamage": "75000",
                "IncreaseLiability": "Yes"
            },
            "LossAssessment": {
                "LossAssessment": "Yes",
                "Amount": "25000"
            },
            "OrdinanceOrLaw": {
                "OrdinanceOrLaw": "Yes",
                "Percent": "25"
            },
            "ProtectiveDevices": {
                "SmokeDetector": {
                    "BaseProtectionDevice": "Central",
                    "FireExtinguisher": "No"
                },
                "Fire": "Central",
                "BurglarAlarm": {
                    "BaseProtectionDevice": "Central",
                    "DeadBolt": "Yes",
                    "VisibleToNeighbor": "Yes",
                    "MannedSecurity": "Yes"
                }
            },
            "ReplacementCostDwelling": {
                "ReplacementCostDwelling": "Yes",
                "Amount": "0",
                "ReplacementCostDwellingPercentage": "100"
            },
            "ReplacementCostContent": {
                "ReplacementCostContent": "Yes",
                "Amount": "0"
            },
            "WaterBackup": {
                "WaterBackup": "Yes",
                "Amount": "10000"
            },
            "StateSpecificEndorsements": {
                "GA-Endorsements": {
                    "WindHailExclusion": "Yes"
                }
            }
        },
        "GeneralInfo": {
            "RatingStateCode": "GA"
        }
    };

    //data = jsonxml(data);
    let xml_head = '<?xml version="1.0" encoding="utf-8"?> <EZHOME xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.ezlynx.com/XMLSchema/Home/V200">';
    let xml_body = xml_head.concat(data, "</EZHOME>")

    // var xsd = fs.readFileSync("ezlynxautoV200.xsd", "utf8");
    // var xsdDoc = x.parseXmlString(xsd);
    // var xml = x.parseXmlString(xml_body);

    console.log(xml_body);

    // var Valid = xml.validate(xsdDoc);
    
    // console.log("result:", Valid);

    let encodedData = new Buffer(xml_body).toString('base64');

    let xml_authentication_header = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope  xmlns:soap="http://www.w3.org/2003/05/soap-envelope"  xmlns:tem="http://tempuri.org/"  xmlns:v100="http://www.ezlynx.com/XMLSchema/EZLynxUpload/V100">  <soap:Header>   <tem:AuthenticationHeaderAcct> <tem:Username>xi_uploadUAT</tem:Username>  <tem:Password>Cojoanin93</tem:Password>  <tem:AccountUsername>xi_userUAT</tem:AccountUsername>  </tem:AuthenticationHeaderAcct> </soap:Header>';
    let xml_soap_body_opens = '<soap:Body> <tem:UploadFile> <v100:EZLynxUploadRequest>  <v100:UploadRequest RefID="test123" XrefKey="DHO6" DataUploadFlags="4"><v100:FileData Name="EZHome" MimeType="text/xml">';
    let xml_soap_body_close = "</v100:FileData> </v100:UploadRequest> </v100:EZLynxUploadRequest> </tem:UploadFile> </soap:Body></soap:Envelope>";

    let xml_string = xml_authentication_header.concat(xml_soap_body_opens, encodedData, xml_soap_body_close);

    console.log(format(xml_string));

    // var options = {
    //     method: 'POST',
    //     url: 'https://test.webcetera.com/EzLynxWebService/EzLynxFileUpload.asmx',
    //     qs: { WSDL: '' },
    //     headers: {
    //         SOAPAction: 'http://tempuri.org/UploadFile',    
    //         'Content-Type': 'text/xml'
    //     },
    //     body: xml_string 
    // };

    axios.post('/api/ezlynx-upload', xml_string, {
        headers: {
            SOAPAction: 'http://tempuri.org/UploadFile',    
            'Content-Type': 'text/xml',
            'Content-Length': xml_string.length
        }
    }).then((res) => {
        callback(res);
    })
    // request(options, function (error, response, body) {
    //     callback({ error, response, body });
    // }); 
};

export default uploadEZ