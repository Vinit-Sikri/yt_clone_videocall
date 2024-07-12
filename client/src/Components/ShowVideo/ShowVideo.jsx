import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './ShowVideo.css';

function ShowVideo({ vid }) {
  console.log('Video object:', vid); // Log the entire video object for inspection
  console.log('Video filePath:', vid.filePath); // Log just the filePath to check its value

  // Replace backslashes with forward slashes
  const normalizedFilePath = vid.filePath.replace(/\\/g, '/');
  // Construct the video URL
  const videoURL = `https://youtube-clone-53sz.onrender.com/${normalizedFilePath}`;
  console.log('Constructed Video URL:', videoURL); // Log the constructed video URL

  return (
    <>
      <Link to={`/videopage/${vid?._id}`}>
        <video 
          src={videoURL}
          className="video_ShowVideo"
        />
      </Link>
      <div className='video_description'>
        <div className='Chanel_logo_App'>
          <div className='fstChar_logo_App'>
            <>{vid?.Uploder?.charAt(0).toUpperCase()}</>
          </div>
        </div>
        <div className='video_details'>
          <p className='title_vid_ShowVideo'>{vid?.videoTitle}</p>
          <pre className='vid_views_UploadTime'>{vid?.Uploder}</pre>
          <pre className='vid_views_UploadTime'>
            {vid?.Views} views <div className="dot"></div> {moment(vid?.createdAt).fromNow()}
          </pre>
        </div>
      </div>
    </>
  );
}

export default ShowVideo;
