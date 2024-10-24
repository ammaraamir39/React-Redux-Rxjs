import React, { Component } from 'react';
import { Pagination  } from "antd";
import './pagination.css';
import { Translate } from 'react-translated';

class CPagination extends Component {
    state = {
        success: false,
        loading: false,
        errorMessage: ""
    }
    handlePageClick = (page) => {
        if (typeof this.props.onClick !== 'undefined') {
            this.props.onClick(page);
        }
    }
    render() {

        const { total_pages, current_page } = this.props;

        if (total_pages > 0) {
            return (
                <div className="cpagination">
                    <Pagination
                        showQuickJumper 
                        current={current_page}
                        defaultPageSize={1}
                        total={total_pages}
                        onChange={this.handlePageClick}
                    />
                </div>
            )
        } else {
            return null;
        }
    }
}

export default CPagination;
