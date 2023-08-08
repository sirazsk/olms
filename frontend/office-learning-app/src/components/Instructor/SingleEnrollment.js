import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignments, newAssignment } from '../../slices/instructor';
import SingleAssignment from './SingleAssignment';
import { clearMessage } from '../../slices/message';

const SingleEnrollment = (obj) => {
  const enrollment = obj.enrollment;
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [updateComp, setUpdateComp] = useState(false);
  const { update } = useSelector((state) => state.instructor);
  const inpRef2 = useRef(null);
  const inpRef3 = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    console.log(enrollment.id);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    setUpdateComp(!updateComp);
    console.log('update component');
  }, [update]);

  const fetchData = useCallback(() => {
    dispatch(getAssignments({ enrollmentId: enrollment.id }))
      .unwrap()
      .then((resp) => {
        setAssignments(resp);
        //setUpdateComp(!updateComp);
      })
      .catch((error) => console.log(error));
  }, [obj.enrollment]);

  const newAssignments = useCallback((e) => {
    e.preventDefault();
    const enrollmentId = enrollment.id;
    const assignmentName = inpRef2.current.value;
    const grade = inpRef3.current.value;
    dispatch(newAssignment({ enrollmentId, assignmentName, grade }));
    inpRef2.current.value = '';
    inpRef3.current.value = '';
    fetchData();
    //setUpdateComp(!updateComp);
  }, []);

  return (
    <div className='section'>
      <header>
        <div>
          <h1>{enrollment.myUser.fullName}</h1>
          <h5>Enroll ID:{enrollment.id}</h5>
          <button onClick={() => setShowEdit(!showEdit)}>Add Assignment</button>
          {showEdit && (
            <form className='form mb-3' onSubmit={newAssignments}>
              <div>
                <label>Assignment Name: </label>
                <input className='mx-3' type='text' ref={inpRef2} />
              </div>
              <div>
                <label className='label'>grade: </label>
                <input className='mx-3' type='text' ref={inpRef3} />
              </div>
              <button className='btn btn-primary mt-3' type='submit'>
                Add
              </button>
            </form>
          )}
        </div>
        <button
          onClick={() => {
            setShowAssignment(!showAssignment);
          }}
        >
          {showAssignment ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </button>
      </header>
      {showAssignment && assignments.length == 0 ? (
        <h5 className='mx-3'>nothing to show</h5>
      ) : (
        <h4></h4>
      )}
      {showAssignment &&
        assignments.map((assignment) => {
          return (
            <SingleAssignment key={assignment.id} assignment={assignment} />
          );
        })}
    </div>
  );
};

export default SingleEnrollment;
