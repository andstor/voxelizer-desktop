import { ArrayExporter } from 'voxelizer';
import VoxelLoader from 'three-voxel-loader';

const generateMesh = async (data) => {
	const exporter = new ArrayExporter()
	return new Promise(function (resolve, reject) {
		exporter.parse(data, function ([voxels, colors]) {
			const voxelLoader = new VoxelLoader();
			voxelLoader.setVoxelSize(0.95)

			let volume = { voxels, colors }
			voxelLoader.parseData(volume, 'array').then((octree) => {
				let mesh = voxelLoader.generateMesh(octree);
				resolve(mesh);
			})
		});
	});
};

export { generateMesh };
