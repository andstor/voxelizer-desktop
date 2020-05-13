import { LoadingManager, MeshPhongMaterial, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const loadModel = (files) => {

    return new Promise(function (resolve, reject) {
        let url = '';

        let fileList = new Map();
        files.forEach(file => {
            let name = file.name;
            let extension = name.split('.').pop().toLowerCase();
            fileList.set(name, file);
            if (isSupported(extension)) url = name;
        });

        if (url === '') {
            reject('No supported file type(s)');
        }

        // Initialize loading manager with URL callback.
        var manager = new LoadingManager();
        var objectURLs = [];
        manager.setURLModifier((url) => {
            let asset = url.substring(url.lastIndexOf('/') + 1);
            if (fileList.get(asset)) {
                url = URL.createObjectURL(fileList.get(asset));
                objectURLs.push(url);
            }
            return url;
        });


        let loader;
        let type = url.split('.').pop().toLowerCase();

        switch (type) {
            case 'glb':
                loader = new GLTFLoader(manager);
                loader.load(url, result => {
                    let model = result.scene || result.object || result;
                    resolve(model);
                });
                break;
            case 'gltf':
                loader = new GLTFLoader(manager);
                loader.load(url, result => {
                    let model = result.scene || result.object || result;
                    resolve(model);
                });
                break;
            case 'obj':
                loader = new OBJLoader(manager);
                loader.load(url, model => {
                    resolve(model);
                });
                break;
            case 'stl':
                loader = new STLLoader(manager);
                loader.load(url, geometry => {
                    var material = new MeshPhongMaterial();
                    var model = new Mesh(geometry, material);
                    resolve(model);
                });
                break;
            default:
                break;
        }

        objectURLs.forEach((url) => URL.revokeObjectURL(url));

    });
};

const isSupported = (type) => {
    let supportedTypes = ['gltf', 'glb', 'stl', 'obj'];
    if (supportedTypes.includes(type)) {
        return true;
    } else {
        return false;
    }
}

export { loadModel };
