import React, { Component } from 'react';
import { message } from 'antd';
import F from '../../../Functions';

const Print = () => {
    let tWindow = window.open("");
    if (tWindow) {
        const PrintCSS = `
            body {
                font-family: 'Roboto', sans-serif;
            }
            .bfileInfo {
                text-align: left;
                overflow: auto;
                margin-bottom: 20px;
            }
            a {
                color: #000;
                text-decoration: none;
            }
            button {
                display: none;
            }
            .bfileInfo h2 {
                margin: 0;
            }
            .bfileInfo .ant-avatar {
                float: left;
            }
            .bfileInfo .ant-avatar img {
                width: 90px;
                vertical-align: middle;
                margin-right: 20px;
            }
            #notes {
                display: none;
            }
            .cardBlue {
                width: 50%;
                float: left;
            }
            .cardBlue .ant-card-body {
                padding: 20px;
            }
            .cardBlue .ant-card-head {
                background: #1890ff;
                padding: 14px 20px;
                color: #FFF;
                font-weight: bold;
            }
            .ant-list-item {
                clear: both;
                padding: 10px 0;
                overflow: auto;
                border-bottom: 1px solid #E6E6E6;
            }
            .ant-list-item-meta-title {
                float: left;
                width: 50%;
                margin: 0;
            }
            .ant-list-item-meta-title + .ant-list-item-meta-description {
                float: left;
                width: 50%;
            }
            .ant-list-item img {
                width: 24px;
                height: auto;
                margin-right: 20px;
                vertical-align: middle;
            }
            .ant-list-item .ant-avatar img {
                width: 35px;
            }
            hr {
                display: block;
                clear: both;
                border: none;
                height: 20px;
            }
            .ant-card-head-title {
                display: none;
            }
            .ant-card-bordered {
                border: 1px solid #000;
                padding: 40px;
                margin-bottom: 40px;
                text-align: center;
            }
            .ant-radio-group > label {
                display: none;
            }
            .ant-radio-group .ant-radio-wrapper-checked {
                display: block;
            }
            .ant-radio {
                display: none;
            }
            .ant-col-12 {
                float: left;
                width: 50%;
            }
            .racAmount {
                font-size: 20px;
                margin-top: 5px;
            }
        `;
        tWindow.document.write('<html><head><title>Print it!</title><link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet"><style>' + PrintCSS + '</style></head><body>' + document.getElementById("liabilityCard").innerHTML + '</body></html>');
        const elems = tWindow.document.querySelectorAll('[style]');
        for (var i = 0; i < elems.length; i++) {
            elems[i].removeAttribute('style');
        }
        const cards = tWindow.document.querySelectorAll('.cardBlue');
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && i % 2 === 0) {
                var element = cards[i];
                var newElement = document.createElement('hr');
                var elementParent = element.parentNode;
                elementParent.insertBefore(newElement, element);
            }
        }
        tWindow.document.close();
        tWindow.focus();
        setTimeout(function(){
            tWindow.print();
        }, 1000);

    } else {
        message.error(F.translate(`Please allow the popup in your browser.`));
    }
}

export default Print;
