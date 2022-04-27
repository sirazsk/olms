import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteSubSection,
  updateSubSection,
  setVideoUrl,
  uploadVideo,
} from '../../slices/instructor';

const SubSection = (obj) => {
  const { id, subSectionName, subSectionDescription, videoUrl } =
    obj.subSection;
  const [showEdit, setShowEdit] = useState(false);
  const [showEdit2, setShowEdit2] = useState(false);
  const [file, setFile] = useState(null);
  const inpRef2 = useRef(null);
  const inpRef3 = useRef(null);
  const dispatch = useDispatch();

  const handleUpdateSubSection = (e) => {
    e.preventDefault();
    console.log(inpRef2.current.value);
    console.log(inpRef3.current.value);
    const subSectionName = inpRef2.current.value;
    const subSectionDescription = inpRef3.current.value;

    if (subSectionName !== '') {
      dispatch(
        updateSubSection({
          sectionId: obj.sectionId,
          subSectionId: id,
          subSectionName,
          subSectionDescription,
        })
      )
        .unwrap()
        .then(() => {
          setShowEdit(false);
        });
    }
    console.log('handle add subsection');
    //dispatch(getSections(params));
  };

  const handlePlay = () => {
    console.log('video play');
    dispatch(setVideoUrl(videoUrl));
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('uploading video');
    dispatch(uploadVideo({ subSectionId: id, file }))
      .unwrap()
      .then(() => {
        setShowEdit2(false);
      });
  };

  console.log(obj);
  return (
    <div className='sub-section'>
      <div>
        <h5>{subSectionName}</h5>
        <p className='mx-3'>{subSectionDescription}</p>
        <button
          onClick={() => {
            setShowEdit2(!showEdit2);
          }}
        >
          upload/update video
        </button>
        {showEdit2 && (
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
        )}
      </div>
      <div>
        {videoUrl && (
          <button className='mx-3' onClick={handlePlay}>
            play video
          </button>
        )}
        {showEdit && (
          <form className='form mb-3' onSubmit={handleUpdateSubSection}>
            <div>
              <label>Sub Section Name: </label>
              <input className='mx-3' type='text' ref={inpRef2} />
            </div>
            <div>
              <label className='label'>Description: </label>
              <textarea
                rows='4'
                cols='35'
                className='mx-3'
                type='text'
                ref={inpRef3}
              />
            </div>
            <button className='btn btn-primary mt-3' type='submit'>
              Update Sub Section
            </button>
          </form>
        )}
        <button className='mx-3' onClick={() => setShowEdit(!showEdit)}>
          edit
        </button>
        <button
          className='mx-3'
          onClick={() =>
            dispatch(
              deleteSubSection({ sectionId: obj.sectionId, subSectionId: id })
            )
          }
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default SubSection;
