import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../services/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { message as antMessage } from 'antd';
import { upload } from '../slices/video';
import { clearMessage } from '../slices/message';
import 'antd/dist/antd.min.css';

const Video = () => {
  const [file, setFile] = useState(null);
  const [srcUrl, setSrcUrl] = useState('');
  const [files, setFiles] = useState([]);
  const { message } = useSelector((state) => state.message);

  // using useref for this reason https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
  const successRef = useRef(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    successRef.current = false;
    dispatch(upload({ file }))
      .unwrap()
      .then(() => {
        userService.getAllFiles().then((response) => {
          setFiles(response.data);
        });
        //console.log('set success true');
        successRef.current = true;
        console.log('set success ' + successRef.current);
      })
      .catch((error) => {
        successRef.current = false;
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(successRef);
    console.log('use effect called for dependency dispatch');
    userService.getAllFiles().then((response) => {
      setFiles(response.data);
    });
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (message !== null && message) {
      if (successRef.current) antMessage.success(message);
      else antMessage.error(message);
    }
  }, [message]);

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
    <div className='container'>
      <Files />
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
      <div className='container m-3'>
        <h3>Upload file</h3>
        <form className='my-3' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>select file</label>
            <input
              id='file'
              name='file'
              type='file'
              onChange={handleChange}
            ></input>
          </div>
          <div className='form-group my-3'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Video;
