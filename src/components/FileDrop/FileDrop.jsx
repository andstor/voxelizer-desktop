import React, { Component } from "react";
import PropTypes from "prop-types";
import { Loading } from "../Loading";
import "./FileDrop.css";
import { defineMessages, injectIntl } from 'react-intl';
import { compose } from 'redux';

const messages = defineMessages({
    drop_here: {
        id: 'fileDrop.drop_here',
        defaultMessage: 'Drop file here',
    }
});

/**
 * Upload component. Can be used for uploading files by clicking or dragging files onto it.
 */
class FileDrop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false
        };

        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.fileInputRef = React.createRef();
    }

    /**
     * Handle adding files through file dialog
     * @param {Object} event
     */
    onFilesAdded(event) {
        const { files } = event.target;
        this.props.onFilesAdded(this.fileListToArray(files));
    }

    /**
     * Handle file being dragged over drag area
     * @param {Object} event
     */
    onDragOver(event) {
        this.stopEvent(event);
        this.setState({ hover: true });
    }

    /**
     * Handle file being dragged out of drag area
     * @param {Object} event
     */
    onDragLeave(event) {
        this.stopEvent(event);
        this.setState({ hover: false });
    }

    /**
     * Handle file dropped into drag area
     * @param {Object} event
     */
    onDrop(event) {
        this.stopEvent(event);

        const { files } = event.dataTransfer;
        this.props.onFilesAdded(this.fileListToArray(files));

        this.setState({ hover: false });
    }

    /**
     * Prevent default event
     */
    stopEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Converts FileList into Array
     */
    fileListToArray(list) {
        const result = [];
        for (let i = 0; i < list.length; i++) {
            result.push(list.item(i));
        }
        return result;
    }

    /**
     * Opens file system dialog
     */
    openFileDialog() {
        this.fileInputRef.current.click();
    }

    render() {
        const { hover } = this.state;
        const { loading } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <div
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}
                className={hover ? "drop-zone-container hover" : "drop-zone-container"}
            >
                <input
                    ref={this.fileInputRef}
                    type="file"
                    multiple
                    onChange={this.onFilesAdded}
                />
                <div className="drag-files">
                    {loading ? <Loading /> : formatMessage(messages.drop_here)}
                </div>
            </div>
        );
    }
}

FileDrop.propTypes = {
    onFilesAdded: PropTypes.func,
    loading: PropTypes.bool
};

FileDrop.defaultProps = {
    onFilesAdded: () => null,
    loading: false
};

export default compose(injectIntl)(FileDrop);
