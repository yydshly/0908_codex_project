# Independent video experiment

Author: N. Escobar / nickesc.

Source page: https://nickesc.github.io/PhotogrammetryVideoInstructions/

Original capture: https://github.com/nickesc/PhotogrammetryVideoInstructions/blob/main/sample/sampleVideo.mp4

The author explicitly offers this capture as a downloadable photogrammetry input. Our experiment uses the original MP4, not the author's sample render or point cloud. The source is unrelated to the Splat.js project.

Local source.mp4: 82,580,751 bytes; 2160 × 3840; 60 fps; 65.516667 seconds; H.264 / AAC. Downloaded for local testing on 2026-09-09 Asia/Shanghai. The original media is ignored by Git; use projects/008-splat-js/experiments/video-sample/fetch_source.py to restore it before building.

The software's MIT license does not relicense this separate media. No general redistribution license was found in the source repository. The original MP4 remains Git-ignored; the public viewer references the author's original URL. Generated research artifacts retain attribution and do not imply a general commercial media license.

model.sog was newly trained locally using Splat.js from this video: 223 extracted frames, 223 registered views, 10,015 iterations, Draft 480px / SH0. The file has 311,757 exported Gaussians (350,000 during training), 3,783,221 bytes. SHA256: 7601ca28bb1a27e4becef6ffaca6d7984108cb394f7f368a98662f50e9201795. The frames/ JPEGs are 720px previews of the actual extracted frames; original-recon.json in the project experiment directory preserves the original metadata. The model was not obtained from the source video's author or from Splat.js presets.
