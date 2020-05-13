import React, { Component, Fragment } from 'react';
import ThreeWindow from '../../components/ThreeWindow/ThreeWindow';
import '../../index.css';
import './MainPage.css';
import Controllers from '../../components/Controllers/Controllers';
import { voxelize } from '../../utils/voxelize';
import { generateMesh } from '../../utils/generateMesh';
import { exportVoxels } from '../../utils/exportVoxels';
const { api } = window;

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resolution: 50,
            color: true,
            fill: false,
            mesh: null,
            levelOfDetail: 0,
            numVoxels: 0,
            showModel: true,
        }
        this.volume = null;
        this.voxelMesh = null;

        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleSettingsChange = this.handleSettingsChange.bind(this);
        this.voxelize = this.voxelize.bind(this);
        this.export = this.export.bind(this);
    }

    handleGoBack() {
        this.props.history.push("/");
    }

    handleSettingsChange(setting) {
        this.setState({ ...setting })
    }

    voxelize() {
        const { resolution, color, fill } = this.state;
        const options = { color, fill };
        this.volume = voxelize(this.props.data, options, resolution);
        this.updateNumVoxels();
        this.updateGraphics(this.volume);
    }

    updateNumVoxels() {
        let dimensions = this.volume.voxels.shape;
        let numVoxels = dimensions[0] * dimensions[1] * dimensions[2];
        this.setState({ numVoxels: numVoxels })

    }

    updateGraphics(voxels) {
        let that = this;
        (async () => {
            that.voxelMesh = await generateMesh(voxels);
            this.setState({ showModel: false })
            that.forceUpdate();
        })();
    }

    export(exportType) {
        if (this.volume !== null) {
            exportVoxels(this.volume, exportType)
        } else {
            api.send('APP_ALERT', 'No voxels generated', 'You need to voxelize the model first!');
        }
    }

    render() {
        return (
            <Fragment>
                <div className="btnBack"><button onClick={this.handleGoBack} /></div>
                <div style={{ width: "100%", height: "70vh" }}>
                    <ThreeWindow showModel={this.state.showModel} mesh={this.voxelMesh} model={this.props.data} />
                </div>
                <Controllers
                    onSettingsChange={this.handleSettingsChange}
                    onExportingChange={this.handleExportingChange}
                    onVoxelize={this.voxelize}
                    onExport={this.export}
                    numVoxels={this.state.numVoxels}
                />
            </Fragment>
        );
    }
}

export default MainPage;
