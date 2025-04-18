// src/components/ProjectSubmission.js

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

function ProjectSubmission() {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState('');
  const [projectIdeas, setProjectIdeas] = useState(['', '', '']); // 3 project ideas
  const [teamMembers, setTeamMembers] = useState(['', '', '', '']); // 4 team members
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch available guides
  const fetchGuides = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'guide')); // Ensure the role is 'guide'
    const snapshot = await getDocs(q);
    const guidesList = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    setGuides(guidesList);
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Handle project idea input change
  const handleProjectIdeaChange = (index, value) => {
    const updatedIdeas = [...projectIdeas];
    updatedIdeas[index] = value;
    setProjectIdeas(updatedIdeas);
  };

  // Handle team member input change
  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = value;
    setTeamMembers(updatedMembers);
  };

  // Handle project submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGuide || projectIdeas.some(idea => !idea) || teamMembers.some(member => !member)) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      // Add project to Firestore with selected guide and student data
      await addDoc(collection(db, 'projects'), {
        projectIdeas,
        teamMembers,
        studentId: auth.currentUser.uid,
        guideId: selectedGuide,
        status: 'pending', // Initial project status
        selectedIdea: '', // Idea not yet selected by guide
      });
      alert('Project submitted successfully!');
      setProjectIdeas(['', '', '']);
      setTeamMembers(['', '', '', '']);
      setSelectedGuide('');
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <div>
      <h2>Submit Your Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Ideas:</label>
          {projectIdeas.map((idea, index) => (
            <div key={index}>
              <input
                type="text"
                value={idea}
                onChange={(e) => handleProjectIdeaChange(index, e.target.value)}
                placeholder={`Project Idea ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>
        <div>
          <label>Team Members:</label>
          {teamMembers.map((member, index) => (
            <div key={index}>
              <input
                type="text"
                value={member}
                onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                placeholder={`Team Member ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>
        <div>
          <label>Guide:</label>
          <select
            value={selectedGuide}
            onChange={(e) => setSelectedGuide(e.target.value)}
            required
          >
            <option value="">Select a Guide</option>
            {guides.map(guide => (
              <option key={guide.id} value={guide.id}>{guide.name}</option>
            ))}
          </select>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Submit Project</button>
      </form>
    </div>
  );
}

export default ProjectSubmission;
