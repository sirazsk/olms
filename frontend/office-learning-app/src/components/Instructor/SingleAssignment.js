import React from 'react';

function SingleAssignment(obj) {
  var assignment = obj.assignment;
  return (
    <div>
      <h3>
        {assignment.assignmentName} : {assignment.grade}
      </h3>
    </div>
  );
}

export default SingleAssignment;
