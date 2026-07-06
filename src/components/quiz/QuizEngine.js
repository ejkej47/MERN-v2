'use client';
import { useState } from 'react';
import TrueFalseBlock from './TrueFalseBlock';
import MatrixRatingBlock from './MatrixRatingBlock';
import { submitQuizResults } from '@/actions/quiz';

export default function QuizEngine({ quizConfig }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAnswerChange = (blockId, value) => {
    setAnswers(prev => {
      // Poseban tretman za matricu jer vraća objekat sa redom i vrednošću
      if (typeof value === 'object' && value.row) {
        return {
          ...prev,
          [blockId]: {
            ...prev[blockId],
            [value.row]: value.value
          }
        };
      }
      return { ...prev, [blockId]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const result = await submitQuizResults(quizConfig.quiz_id, quizConfig.type, answers);
    
    if (result.success) {
      setMessage('Rezultati su uspešno sačuvani!');
    } else {
      setMessage('Greška: ' + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">{quizConfig.title}</h2>
      
      {quizConfig.blocks.map((block) => {
        if (block.type === 'true_false') {
          return <TrueFalseBlock key={block.id} data={block} onChange={handleAnswerChange} />;
        }
        if (block.type === 'matrix_rating') {
          return <MatrixRatingBlock key={block.id} data={block} onChange={handleAnswerChange} />;
        }
        return <div key={block.id} className="p-4 text-red-500">Nepoznat tip: {block.type}</div>;
      })}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="px-6 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
      >
        {isSubmitting ? 'Čuvanje...' : 'Sačuvaj rezultate'}
      </button>

      {message && <p className="mt-4 font-medium text-green-600">{message}</p>}
    </form>
  );
}