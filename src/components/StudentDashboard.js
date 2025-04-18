// src/components/StudentDashboard.js

import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProjectSubmission from './ProjectSubmission';

function StudentDashboard() {
  const [myProject, setMyProject] = useState(null);
  const [isProjectSubmitted, setIsProjectSubmitted] = useState(false); // Add this state to track submission

  // Fetch the student's project from Firestore
  const fetchMyProject = async () => {
    const q = query(collection(db, 'projects'), where('studentId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const project = snapshot.docs[0].data();
      setMyProject(project);
      setIsProjectSubmitted(true); // If the project exists, mark it as submitted
    } else {
      setIsProjectSubmitted(false); // If no project exists, allow submission
    }
  };

  useEffect(() => {
    fetchMyProject(); // Fetch the project when the component loads
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      {isProjectSubmitted ? (
        <div>
          <h4>Status: {myProject.status}</h4>
          <h4>Selected Idea:</h4>
          <p>{myProject.selectedIdea || 'Not selected yet by Guide'}</p>
        </div>
      ) : (
        <ProjectSubmission /> // If no project is found, show the submission form
      )}
    </div>
  );
}

export default StudentDashboard;
