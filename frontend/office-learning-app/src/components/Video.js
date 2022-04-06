import React, { useEffect } from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../services/user.service';
const Video = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userService.uploadFile(file).then(
      (response) => {
        setContent(response.data.message);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );

    userService.getFiles().then((response) => {
      setFiles(response.data);
    });
  };

  useEffect(() => {
    userService.getFiles().then((response) => {
      setFiles(response.data);
    });
  }, [content]);

  const Files = () => {
    return (
      <section>
        <ul>
          {files.map((fileInfo, index) => {
            return (
              <div key={index}>
                <li className='List-item'>{fileInfo.name}</li>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    setSrcUrl(fileInfo.url);
                  }}
                >
                  Play
                </button>
              </div>
            );
          })}
        </ul>
      </section>
    );
  };

  return (
    <article>
      {<Files />}
      {srcUrl !== '' ? (
        <div className='container'>
          <video
            crossOrigin='anonymous'
            src={srcUrl}
            width='720px'
            height='480px'
            controls
          ></video>
        </div>
      ) : (
        <div className='container'>
          <h3>Upload Video to play</h3>
        </div>
      )}
      <div className='container mt-5'>
        <h3>Upload file</h3>
        <form className='mt-3' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>select file</label>
            <input
              id='file'
              name='file'
              type='file'
              onChange={handleChange}
            ></input>
          </div>
          <div className='form-group mt-3'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>
        </form>
        <div className='container'>{content}</div>
      </div>
    </article>
  );
};

export default Video;
