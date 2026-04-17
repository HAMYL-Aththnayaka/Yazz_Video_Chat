import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Line } from 'rc-progress';
import styles from './pollStyles';
import { PollContext } from './PollContext';
import ChatContext, { controlMessageEnum } from './ChatContext';

const Poll = () => {
  const {
    question,
    setQuestion,
    isModelOpen,
    setIsModelOpen,
    answers,
    setAnswers,
  } = useContext(PollContext);

  const chatCtx = useContext(ChatContext);
  const sendControlMessage = chatCtx?.sendControlMessage;

  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const total = answers?.reduce((acc, curr) => acc + (curr.votes || 0), 0);
    setTotalVotes(total);
  }, [answers]);

  // ✅ MAIN FIX: send FULL state
  const submitVote = (index: number) => {
    setAnswers((prev) => {
      const updated = prev.map((ans, i) =>
        i === index
          ? { ...ans, votes: (Number(ans.votes) || 0) + 1 }
          : ans
      );

      // broadcast full poll state
      sendControlMessage?.(controlMessageEnum.initiatePoll, {
        question,
        answers: updated,
      });

      return updated;
    });

    setVoted(true);
  };

  const closeModal = () => {
    setIsModelOpen(false);
    setVoted(false);
    setTotalVotes(0);
    setQuestion('');
    setAnswers([]);
  };

  return (
    <Modal
      isOpen={isModelOpen}
      onRequestClose={closeModal}
      style={styles.customStyles}
      ariaHideApp={false}
    >
      <div style={styles.container}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
          {question}
        </h2>

        <div style={styles.flexColumn}>
          {answers?.map((answer, index) =>
            !voted ? (
              <button
                key={index}
                style={styles.button}
                onClick={() => submitVote(index)}
              >
                {answer.option}
              </button>
            ) : (
              <div key={index} style={{ marginBottom: 15 }}>
                <div style={styles.resultContainer}>
                  <h3 style={styles.mr20}>{answer.option}</h3>

                  <div style={{ flex: 1 }}>
                    <Line
                      percent={
                        totalVotes
                          ? (answer.votes / totalVotes) * 100
                          : 0
                      }
                      strokeWidth="4"
                      trailWidth="4"
                      strokeColor="#3b82f6"
                    />
                  </div>

                  <p style={styles.ml20}>{answer.votes} votes</p>
                </div>
              </div>
            )
          )}

          {voted && (
            <h3 style={{ marginTop: 20, textAlign: 'center' }}>
              Total Votes: {totalVotes}
            </h3>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Poll;