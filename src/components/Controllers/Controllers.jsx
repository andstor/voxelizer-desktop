import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Slider from '../Slider/Slider';
import './Controllers.css';
import '../../index.css';

class Controllers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resolution: 50,
            color: true,
            fill: false,
            exportFormat: "xml",
            levelOfDetail: 0,
        }
        this.handleResolutionChange = this.handleResolutionChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleFillChange = this.handleFillChange.bind(this);
        this.handleExportFormatChange = this.handleExportFormatChange.bind(this);
        this.handleVoxelize = this.handleVoxelize.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }

    handleResolutionChange(value) {
        this.setState({ resolution: value })
        this.props.onSettingsChange({ resolution: value });
    }

    handleColorChange(event) {
        let value = event.target.checked;
        this.setState({ color: value })
        this.props.onSettingsChange({ color: value });
    }

    handleFillChange(event) {
        let value = event.target.checked;
        this.setState({ fill: value })
        this.props.onSettingsChange({ fill: value });
    }

    handleExportFormatChange(event) {
        let value = event.target.value;
        this.setState({ exportFormat: value })
    }

    handleVoxelize() {
        this.props.onVoxelize();
    }
    handleExport() {
        this.props.onExport(this.state.exportFormat);
    }

    render() {

        return (
            <Fragment>
                <div className="row controls-container">
                    <div className="header1">
                        <FormattedMessage
                            id="controls.settings"
                            defaultMessage="Settings"
                        />
                    </div>
                    <div className="column controls" style={{ margin: "35px 10px 20px 20px" }} >
                        <table>
                            <tbody>

                                <tr>
                                    <td><label>
                                        <FormattedMessage
                                            id="controls.fill-volume"
                                            defaultMessage="Fill volume"
                                        />:
                                        </label></td>
                                    <td><div className="left-align">
                                        <input
                                            type="checkbox"
                                            checked={this.state.fill}
                                            onChange={this.handleFillChange}
                                            disabled={this.state.color}
                                        />
                                    </div></td>
                                    <td><label><FormattedMessage
                                        id="controls.color"
                                        defaultMessage="Color"
                                    />:</label></td>

                                    <td><div>
                                        <input
                                            type="checkbox"
                                            checked={this.state.color}
                                            onChange={this.handleColorChange}
                                            disabled={this.state.fill}
                                        />
                                    </div></td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>
                                            <FormattedMessage
                                                id="controls.resolution"
                                                defaultMessage="Resolution"
                                            />:
                                        </label>
                                    </td>
                                    <td colSpan="2">
                                        <div>
                                            <Slider onChange={this.handleResolutionChange} />
                                        </div>
                                    </td>
                                    <td>{this.state.resolution}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4"><div>
                                        <button type="button" onClick={this.handleVoxelize}>
                                            <FormattedMessage
                                                id="controls.voxelize"
                                                defaultMessage="Voxelize"
                                            />
                                        </button></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="header2">
                        <FormattedMessage
                            id="controls.exporting"
                            defaultMessage="Exporting"
                        />
                    </div>
                    <div className="column controls" style={{ margin: "35px 20px 20px 10px" }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label>
                                        <FormattedMessage
                                            id="controls.export-format"
                                            defaultMessage="Export format"
                                        />:
                                        </label></td>
                                    <td><div>
                                        <select id="exportFormat" value={this.state.exportFormat} onChange={this.handleExportFormatChange} >
                                            <option value="xml">XML</option>
                                            <option value="binvox">BINVOX</option>
                                        </select>
                                    </div></td>
                                </tr>
                                <tr>
                                    <td> <label>
                                        <FormattedMessage
                                            id="controls.voxels"
                                            defaultMessage="Voxels"
                                        />:
                                        </label></td>
                                    <td>{this.props.numVoxels}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4"><div>
                                        <button type="button" onClick={this.handleExport}>
                                            <FormattedMessage
                                                id="controls.export"
                                                defaultMessage="Export"
                                            />
                                        </button></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Controllers;
