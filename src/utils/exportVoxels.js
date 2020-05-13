import { XMLExporter, BINVOXExporter } from 'voxelizer';
const { api } = window;

const exportVoxels = (voxels, format) => {
	let exporter;
	switch (format) {
		case 'binvox':
			exporter = new BINVOXExporter();
			break;
		case 'xml':
            exporter = new XMLExporter();
            break;
		default:
			break;
	}
	exporter.parse(voxels, data => {
		api.send('APP_SAVE_FILE', Buffer.from(data), format);
	});
};

export { exportVoxels };
