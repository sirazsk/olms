import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { message as antMessage } from 'antd';

import { getSections, newSection, setVideoUrl } from '../../slices/instructor';
import { clearMessage } from '../../slices/message';
import userService from '../../services/user.service';
import Section from './Section';

const AddSection = () => {
  const [sections, setSections] = useState([]);
  const inpRef = useRef(null);
  const [courseName, setCourseName] = useState('');
  const { message } = useSelector((state) => state.message);
  const { success, update, videoUrl } = useSelector(
    (state) => state.instructor
  );
  const [updateComp, setUpdateComp] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  console.count('rendered addSection component');

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(setVideoUrl(''));
    console.log('use effect for start');
    fetchData();
    userService
      .getCourseDetails(params.courseId)
      .then((resp) => {
        //console.log(resp.data);
        setCourseName(resp.data.courseName);
      })
      .catch((error) => console.log(error));
  }, []);

  const fetchData = useCallback(() => {
    dispatch(getSections(params))
      .unwrap()
      .then((resp) => {
        setSections(resp);
        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  useEffect(() => {
    setUpdateComp(!updateComp);
    console.log('update component');
    fetchData();
  }, [update]);

  useEffect(() => {
    if (message !== null && message) {
      if (success) {
        antMessage.success(message);
      } else antMessage.error(message);
    }
  }, [message]);

  const handleAddSection = useCallback(
    (e) => {
      e.preventDefault();
      if (inpRef.current.value !== '') {
        dispatch(newSection({ ...params, sectionName: inpRef.current.value }));
        // .unwrap()
        // .then(() => {
        //   successRef.current = true;
        //   console.log('in unwrap');
        // })
        // .catch((error) => {
        //   successRef.current = false;
        //   console.log(error);
        // });
      }
      console.log(inpRef.current.value);
      inpRef.current.value = '';
      fetchData();
    },
    [params]
  );

  return (
    <div className='container background-grey'>
      <div className='course-heading'>
        <h1 className='me-5 mt-3'>{courseName}</h1>
        <Link to={'/instructor'} className='btn btn-primary'>
          <h4>Go To My Courses</h4>
        </Link>
      </div>
      {videoUrl && (
        <div className='video-container mb-3'>
          <video
            crossOrigin='anonymous'
            src={videoUrl}
            width='1200px'
            height='800px'
            controls
          ></video>
        </div>
      )}

      <header className=''>
        <form className='form form-section' onSubmit={handleAddSection}>
          <h5>Section Name: </h5>
          <input className='mx-3' type='text' ref={inpRef} />
          <button className='btn btn-primary' type='submit'>
            Add Section
          </button>
        </form>
      </header>
      {sections.map((section) => {
        //console.log('section: ', section.id);
        return <Section key={section.id} section={section} />;
      })}
    </div>
  );
};

export default AddSection;
