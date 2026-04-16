import React, {createContext, useState} from 'react';

export const PollContext = createContext();

const PollProvider = ({children}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([
    {option: '', votes: 0},
    {option: '', votes: 0},
    {option: '', votes: 0},
    {option: '', votes: 0},
  ]);
  
  const [isModelOpen, setIsModelOpen] = useState(false);

  return (
    <PollContext.Provider 
      value={{
        answers,
        question, 
        setQuestion, 
        isModelOpen, 
        setIsModelOpen,
        setAnswers
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

export default PollProvider;