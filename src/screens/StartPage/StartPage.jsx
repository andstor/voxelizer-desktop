import React, { Component } from 'react';
import FileDrop from '../../components/FileDrop/FileDrop';
import './StartPage.css';
import { loadModel } from '../../utils/loadModel'
const { api } = window;

class StartPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
        this.initApplication = this.initApplication.bind(this);
    }

    initApplication(files) {
        this.setState({ loading: true })

        setTimeout(() => {
            loadModel(files).then(model => {
                this.props.onFilesLoaded(model);
                this.props.history.push("/main");
            }).catch(error => {
                api.send('APP_ALERT', 'Not valid filetype(s)', 'No valid filetype(s) supplied.\n\nSupported filetypes are: gltf, glb, stl or obj');
                this.setState({ loading: false });
            });
        }, 1000);
    }

    render() {
        return (
            <div className="startpage-container">
                <FileDrop onFilesAdded={this.initApplication} loading={this.state.loading} />
            </div>
        );
    }
}

export default StartPage;
