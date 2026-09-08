// Keep the original 82 MB capture at its author's source on public sites.
// Local previews use the checksum-verified download from fetch_source.py.
export const videoSourceUrl = ['localhost','127.0.0.1','[::1]'].includes(location.hostname)
  ? new URL('./video-assets/source.mp4', import.meta.url).href
  : 'https://raw.githubusercontent.com/nickesc/PhotogrammetryVideoInstructions/main/sample/sampleVideo.mp4';
