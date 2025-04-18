/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ReviewPage = () => {
  const [project, setProject] = useState(null);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        setProject(projectDoc.data());
      } else {
        navigate('/guide'); // Redirect to guide dashboard if project not found
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmitReview = async () => {
    if (answers.length !== 10) {
      alert("Please answer all 10 questions.");
      return;
    }

    await updateDoc(doc(db, 'projects', projectId), {
      reviews: [
        ...project.reviews,
        {
          date: new Date(),
          answers: answers
        }
      ],
      status: 'completed' // Mark project as completed after review
    });

    navigate('/guide'); // Redirect to guide dashboard after review is submitted
  };

  const questions = [
    "1. Does the statement give clear identification about what your project will accomplish?",
    "2. Is the statement short and concise?",
    "3. Can a person who is not familiar with the project understand the scope of the project by reading the project problem statement?",
    "4. The project’s objectives of study (what product, process, resource, etc.) are being addressed?",
    "5. Is a similar type of methodology/model used for existing work?",
    "6. Is the studied literature sufficient to decide the scope of the project?",
    "7. Are the objectives set that will help achieve the goal of the project?",
    "8. Does the research gap identified lead to the motivation of the project?",
    "9. Does your project contribute to society by any means and will lead to finding motivation?",
    "10. Are the objectives clearly and unambiguously listed?"
  ];

  return (
    <div>
      <h2>Review Project: {project?.teamMembers.join(', ')}</h2>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question}</p>
          <textarea
            rows="4"
            cols="50"
            placeholder="Enter your answer..."
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmitReview}>Submit Review</button>
    </div>
  );
};

export default ReviewPage;
