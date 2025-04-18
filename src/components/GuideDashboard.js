import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

function GuideDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState('');
  const [reviewData, setReviewData] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isReviewLoaded, setIsReviewLoaded] = useState(false);

  // 8 sets of review questions
  const reviewQuestions = [
    [
      "Does the project have a clear purpose?",
      "Is the project feasible within the given timeframe?",
      "Are the objectives of the project well-defined?",
      "Is the project design innovative?",
      "Does the project align with current research or industry trends?",
      "Is the problem statement well-articulated?",
      "Is the methodology proposed for the project clear and suitable?",
      "Is the timeline realistic?",
      "Are the resources required for the project clearly listed?",
      "Does the project consider potential risks?"
    ],
    [
      "Does the project have clear, measurable outcomes?",
      "Are the goals of the project feasible?",
      "Is the project scope properly defined?",
      "Does the project make use of existing technologies or frameworks?",
      "Are there any ethical concerns addressed?",
      "Is the project well-organized?",
      "Is the project design scalable?",
      "Does the project show potential for future development?",
      "Are there adequate resources to complete the project?",
      "Does the project propose innovative solutions?"
    ],
    [
      "Is the project concept clearly presented?",
      "Are the project deliverables clearly defined?",
      "Does the project meet the industry standards?",
      "Is there a proper risk management plan in place?",
      "Does the project timeline seem realistic?",
      "Are there measurable and tangible outcomes?",
      "Is the project methodology suitable for the problem?",
      "Are there measurable results expected from the project?",
      "Is the project scope clearly stated?",
      "Are there plans for scalability?"
    ],
    [
      "Is the project innovative in terms of technology used?",
      "Does the project idea contribute to the field?",
      "Is the research problem relevant?",
      "Does the methodology consider current research techniques?",
      "Is there enough documentation available?",
      "Is the project's impact on the target audience clear?",
      "Are the challenges and limitations of the project addressed?",
      "Is the scope of the project appropriate?",
      "Does the project align with the company/organization’s goals?",
      "Are the project results likely to make a significant impact?"
    ],
    [
      "Are the project deliverables well-defined?",
      "Does the project have a clear implementation plan?",
      "Is the timeline realistic for the scope of the project?",
      "Are the project's expected outcomes measurable?",
      "Is the project's research methodology sound?",
      "Are potential challenges identified and accounted for?",
      "Is the team capable of executing the project?",
      "Are the resources necessary for the project listed?",
      "Does the project account for environmental or ethical concerns?",
      "Are the project goals clear and achievable?"
    ],
    [
      "Does the project impact society or the community?",
      "Are the objectives clearly articulated?",
      "Is the project's scope clearly defined?",
      "Does the project methodology meet research standards?",
      "Is the project relevant to current trends in the industry?",
      "Is the project appropriately scaled for its resources?",
      "Are the risks and challenges considered?",
      "Does the project consider the scalability and sustainability?",
      "Are there any ethical issues addressed?",
      "Does the project have clear deliverables?"
    ],
    [
      "Is the project innovative in its approach?",
      "Does the project have a clear timeline for completion?",
      "Are the deliverables measurable and realistic?",
      "Does the project show potential for long-term success?",
      "Is the project's methodology well-defined?",
      "Are the expected outcomes clearly stated?",
      "Is the project team equipped to handle the tasks?",
      "Does the project involve relevant stakeholders?",
      "Is there a clear plan for implementing the project?",
      "Does the project demonstrate feasible and innovative solutions?"
    ],
    [
      "Are the project objectives achievable within the timeframe?",
      "Is the project using an appropriate methodology?",
      "Does the project have measurable and achievable outcomes?",
      "Is the project scalable for future growth?",
      "Are the required resources clearly stated?",
      "Does the project include appropriate risk management?",
      "Is the project suitable for its intended target audience?",
      "Are there plans for long-term sustainability?",
      "Does the project address relevant industry needs?",
      "Is the project timeline realistic for completion?"
    ]
  ];

  const fetchProjects = async () => {
    const q = query(collection(db, 'projects'), where('guideId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(projectList);
  };

  // Fetch review data for a specific review round (index 0 to 7)
  const fetchReviewData = async (projectId, index) => {
    const projectRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      const projectData = docSnap.data();
      const review = projectData[`review${index + 1}`];
      if (review) {
        setReviewData(review);
      } else {
        setReviewData(reviewQuestions[index].map(() => ({ date: '', remarks: '' })));
      }
      setIsReviewLoaded(true);
    }
  };

  const handleReviewChange = (index, field, value) => {
    const updated = [...reviewData];
    updated[index] = { ...updated[index], [field]: value };
    setReviewData(updated);
  };

  const handleSubmitReview = async () => {
    const projectRef = doc(db, 'projects', selectedProject.id);
    await updateDoc(projectRef, {
      [`review${currentReviewIndex + 1}`]: reviewData,
    });

    alert(`Review ${currentReviewIndex + 1} submitted!`);

    if (currentReviewIndex < 7) {
      const nextIndex = currentReviewIndex + 1;
      setCurrentReviewIndex(nextIndex);
      fetchReviewData(selectedProject.id, nextIndex);
    } else {
      alert('All 8 reviews submitted!');
    }
  };

  // When a project is selected, reset idea selection and review states.
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedIdea('');
    setCurrentReviewIndex(0);
    setIsReviewLoaded(false);
  };

  const handleIdeaSelect = async (idea) => {
    const projectRef = doc(db, 'projects', selectedProject.id);
    await updateDoc(projectRef, { selectedIdea: idea });
    setSelectedIdea(idea);
    fetchReviewData(selectedProject.id, 0);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Guide Dashboard</h2>

      {projects.length === 0 ? (
        <p>No projects assigned yet.</p>
      ) : (
        projects.map(project => (
          <div key={project.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <p><strong>Group Members:</strong> {(project.members || []).join(', ')}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <button onClick={() => handleSelectProject(project)}>Select Project</button>
          </div>
        ))
      )}

      {selectedProject && (
        <div>
          <h3>Project Ideas</h3>
          {(selectedProject.projectIdeas || []).length > 0 ? (
            selectedProject.projectIdeas.map((idea, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <p>{idea}</p>
                <button
                  onClick={() => handleIdeaSelect(idea)}
                  disabled={selectedIdea !== ''}
                >
                  {selectedIdea === idea ? 'Selected' : 'Select This Idea'}
                </button>
              </div>
            ))
          ) : (
            <p>No project ideas available.</p>
          )}
        </div>
      )}

      {selectedIdea && isReviewLoaded && (
        <div>
          <h3>Reviewing Idea: {selectedIdea}</h3>
          <h4>Review {currentReviewIndex + 1}</h4>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Question</th>
                <th>Date</th>
                <th>Remarks/Grade</th>
              </tr>
            </thead>
            <tbody>
              {reviewQuestions[currentReviewIndex]?.map((question, idx) => (
                <tr key={idx}>
                  <td>{question}</td>
                  <td>
                    <input
                      type="date"
                      value={reviewData[idx]?.date || ''}
                      onChange={(e) => handleReviewChange(idx, 'date', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={reviewData[idx]?.remarks || ''}
                      onChange={(e) => handleReviewChange(idx, 'remarks', e.target.value)}
                      placeholder="Grade/Remarks"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmitReview}>Submit Review {currentReviewIndex + 1}</button>
        </div>
      )}
    </div>
  );
}

export default GuideDashboard;
