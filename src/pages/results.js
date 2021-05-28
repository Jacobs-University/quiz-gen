import { useHistory, useParams } from "react-router";
import { useQuiz } from "../hooks";

import "../css/results.css";

const Results = () => {
  const { id } = useParams();
  const { location } = useHistory();
  const { results } = location?.state || {};
  console.log("results -> ", results);
  const { data: quiz } = useQuiz(id);
  if (!results || !quiz)
    return <div className="empty">No results to display</div>;

  const maxPoints = quiz.questions.length;
  const points = quiz.questions.reduce((acc, question) => {
    const result = results[question.id];
    if (question.correct.some((v) => result === v || result.includes(v))) acc++;
    return acc;
  }, 0);

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
