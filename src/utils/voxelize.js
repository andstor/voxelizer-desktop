import { Sampler } from 'voxelizer';

const voxelize = (mesh, options, resolution) => {
	// Setup Voxelizer.
	const sampler = new Sampler('raycast', options);

	// Voxelize torus.;
	let data = sampler.sample(mesh, resolution);
	return data;
};

export { voxelize };
