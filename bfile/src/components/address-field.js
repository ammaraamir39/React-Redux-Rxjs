import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import axios from 'axios';

class AddressField extends Component {
    timer = null
    state = {
        dataSource: [],
        addresses: {}
    }
    handleSearch = (query) => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB896cxwdpKJAXgZyvGz5CX2GMCgvVpeI8&address="+query+"@&sensor=true").then((res) => {
                const dataSource = [];
                const addresses = {};
                for (var j = 0; j < res.data.results.length; j++) {
                    const address = res.data.results[j];
                    let street_number = '',
                        route = '',
                        city = '',
                        state = '',
                        postal_code = '',
                        country = '';
                    dataSource.push(address.formatted_address);
                    for (var i = 0; i < address.address_components.length; i++) {
                        if (address.address_components[i].types.indexOf('street_number') >= 0) {
                            street_number = address.address_components[i].short_name;
                        }
                        if (address.address_components[i].types.indexOf('route') >= 0) {
                            route = address.address_components[i].short_name;
                        }
                        if (address.address_components[i].types.indexOf('locality') >= 0) {
                            city = address.address_components[i].long_name;
                        }
                        if (address.address_components[i].types.indexOf('administrative_area_level_1') >= 0) {
                            state = address.address_components[i].short_name;
                        }
                        if (address.address_components[i].types.indexOf('postal_code') >= 0) {
                            postal_code = address.address_components[i].long_name;
                        }
                        if (address.address_components[i].types.indexOf('country') >= 0) {
                            country = address.address_components[i].short_name;
                        }
                    }
                    if (country === 'US') {
                        addresses[address.formatted_address] = {
                            address: street_number + ' ' + route,
                            city,
                            state,
                            postal_code,
                            country
                        }
                    }
                }
                this.setState({ dataSource, addresses });
            });
        }, 1000);
     }
     select(val) {
         const { addresses } = this.state;
         if (val in addresses) {
             const address = addresses[val];
             if ("setAddress" in this.props) {
                 this.props.setAddress(address.address);
             }
             if ("setCity" in this.props) {
                 this.props.setCity(address.city);
             }
             if ("setState" in this.props) {
                 this.props.setState(address.state);
             }
             if ("setZipCode" in this.props) {
                 this.props.setZipCode(address.postal_code);
             }
             if ("setCityStateZip" in this.props) {
                 this.props.setCityStateZip(address.city+' '+address.state+' '+address.postal_code);
             }
         }
         if ("onChange" in this.props) {
             this.props.onChange(val);
         }
     }
    render() {

        if ("style" in this.props) {
            return (
                <AutoComplete
                    value={this.props.value}
                    dataSource={this.state.dataSource}
                    onChange={this.props.onChange}
                    onSelect={this.select.bind(this)}
                    onSearch={this.handleSearch.bind(this)}
                    placeholder={this.props.placeholder}
                    style={this.props.style}
                />
            )
        } else {
          return (
              <AutoComplete
                  value={this.props.value}
                  dataSource={this.state.dataSource}
                  style={{ width: '100%' }}
                  onChange={this.props.onChange}
                  onSelect={this.select.bind(this)}
                  onSearch={this.handleSearch.bind(this)}
                  placeholder={this.props.placeholder}
              />
          )
        }
    }
}

export default AddressField;
