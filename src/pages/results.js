import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { useQuiz } from "../hooks";

import "../css/results.css";

const Results = () => {
  const { id } = useParams();
  const { location } = useHistory();
  const [results, setResults] = useState(location?.state?.results);
  const { data: quiz } = useQuiz(id);
  if (!results || !quiz)
    return <div className="empty">No results to display</div>;

  let points = 0,
    maxPoints = 0;

  quiz.questions.forEach((question) => {
    const result = results[question.id];
    maxPoints += question.correct.length;
    points += question.correct.reduce(
      (acc, v) => (result === v || result.includes(v) ? 1 : 0) + acc,
      0
    );
  });

  return (
    <div className="Results">
      <div>
        Score: {points} / {maxPoints}
      </div>
      <br />
      <div>
        Percentage:{" "}
        {((points / maxPoints) * 100).toLocaleString("de-DE", {
          maximumFractionDigits: 0,
        })}
        %
      </div>
    </div>
  );
};

export default Results;
