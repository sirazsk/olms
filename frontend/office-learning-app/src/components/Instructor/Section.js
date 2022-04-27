import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getSubSection,
  updateSection,
  deleteSection,
  getSections,
  newSubSection,
} from '../../slices/instructor';
import { clearMessage } from '../../slices/message';
import SubSection from './SubSection';

const Section = (obj) => {
  const params = useParams();
  const { id, sectionName } = obj.section;
  const [showSubsections, setShowSubsections] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showEdit2, setShowEdit2] = useState(false);
  const [subSection, setSubSection] = useState([]);
  const inpRef = useRef(null);
  const inpRef2 = useRef(null);
  const inpRef3 = useRef(null);
  const [updateComp, setUpdateComp] = useState(false);
  const { update } = useSelector((state) => state.instructor);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    console.log(id);
    fetchData();
  }, []);

  useEffect(() => {
    setUpdateComp(!updateComp);
    console.log('update component');
    fetchData();
  }, [update]);

  const fetchData = useCallback(() => {
    dispatch(getSubSection({ sectionId: id }))
      .unwrap()
      .then((resp) => {
        setSubSection(resp);
        console.log(resp);
      })
      .catch((error) => console.log(error));
  }, [obj.section]);

  const handleDelete = () => {
    dispatch(deleteSection({ ...params, sectionId: id }));
    console.log('delete');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (inpRef.current.value !== '') {
      dispatch(
        updateSection({
          ...params,
          sectionId: id,
          sectionName: inpRef.current.value,
        })
      );
      console.log(inpRef.current.value);
      inpRef.current.value = '';
      //dispatch(getSections(params));
    }
  };

  const handleAddSubSection = (e) => {
    e.preventDefault();
    const subSectionName = inpRef2.current.value;
    const subSectionDescription = inpRef3.current.value;

    if (subSectionName !== '') {
      dispatch(
        newSubSection({ sectionId: id, subSectionName, subSectionDescription })
      )
        .unwrap()
        .then(() => {
          setShowEdit2(false);
        });
    }
    console.log('handle add subsection');
    fetchData();
  };

  return (
    <article className='section'>
      <header>
        <div>
          <div>
            <h4>{sectionName}</h4>
            <button
              onClick={() => {
                setShowEdit2(!showEdit2);
              }}
            >
              Add sub section
            </button>
          </div>

          {showEdit2 && (
            <form className='form mb-3' onSubmit={handleAddSubSection}>
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
                Add Sub Section
              </button>
            </form>
          )}
        </div>

        <div>
          {showEdit && (
            <form className='form mb-3' onSubmit={handleEditSubmit}>
              <h6>Section Name: </h6>
              <input className='mx-3' type='text' ref={inpRef} />
              <button className='btn btn-primary' type='submit'>
                Edit Section
              </button>
            </form>
          )}
          <button className='mx-3' onClick={() => setShowEdit(!showEdit)}>
            edit
          </button>
          <button className='mx-3' onClick={handleDelete}>
            delete
          </button>
          <button
            className='ms-3'
            onClick={() => {
              setShowSubsections(!showSubsections);
            }}
          >
            {showSubsections ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </button>
        </div>
      </header>
      {showSubsections && subSection.length == 0 ? (
        <h5 className='mx-3'>nothing to show</h5>
      ) : (
        <h4></h4>
      )}
      {showSubsections &&
        subSection.map((subSection) => {
          return (
            <SubSection
              key={subSection.id}
              subSection={subSection}
              sectionId={id}
            />
          );
        })}
    </article>
  );
};

export default Section;
