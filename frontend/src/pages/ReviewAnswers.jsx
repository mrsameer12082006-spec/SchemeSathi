import React from 'react';
import CheckAnswersTable from '../components/review/CheckAnswersTable';
import { QUESTION_REGISTRY } from '../data/schemesData';

export default function ReviewAnswers({
  answers,
  onEditIndex,
  onConfirm,
  onBack,
  language
}) {
  return (
    <div className="space-y-6">
      <CheckAnswersTable
        questions={QUESTION_REGISTRY}
        answers={answers}
        onEditIndex={onEditIndex}
        onConfirm={onConfirm}
        onBack={onBack}
        language={language}
      />
    </div>
  );
}

