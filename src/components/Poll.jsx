import React, { useContext, useEffect, useState } from 'react'; 
import Modal from 'react-modal';
import { Line } from 'rc-progress';
import styles from './pollStyles';
import { PollContext } from './PollContext';

const Poll = () => { 
  const {
    question,
    setQuestion,
    isModelOpen,
    setIsModelOpen,
    answers:voteData,
    setAnswers,
  } = useContext(PollContext);

  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  const submitVote = (e, answer) => {
    const newAnswers = voteData.map((ans) => {
      if (ans.option === answer.option) {
        return { ...ans, votes: ans.votes + 1 };
      }
      return ans;
    });
    setAnswers(newAnswers);
    setTotalVotes(totalVotes + 1);
    setVoted(true);
  };

  const closeModal = () => {
    setIsModelOpen(false);
    setTotalVotes(0);
    setVoted(false);
    setQuestion('');
    setAnswers([
      { option: '', votes: 0 },
      { option: '', votes: 0 },
    ]);
  };

  return (
    <Modal
      isOpen={isModelOpen}
      onRequestClose={closeModal}
      style={styles.customStyles}
      ariaHideApp={false}>
      <div style={styles.container}>
        <h2>{question}</h2>
        <div style={styles.flexColumn}>
            {voteData?.map((answer, index) => !voted ? (
              <button 
                key={index}
                style={styles.button}
                onClick={(e) => {
                  submitVote(e, answer);
                }}>
                {answer.option}
              </button>
            ) : (
              <div key={index}>
                <div style={styles.resultContainer}>
                  <h2 style={styles.mr20}>{answer.option}</h2>
                  <Line 
                    percent={totalVotes ? (answer.votes / totalVotes) * 100 : 0}
                    strokeWidth="4"
                    trailWidth="4"
                    strokeColor="#3b82f6"
                  />
                  <p style={styles.ml20}>{answer.votes} votes</p>
                </div>    
              </div>
            ))}
            {voted && <h3>Total Votes: {totalVotes}</h3>}
        </div>
      </div>
    </Modal>
  );
};

export default Poll;