import { useHistory, useParams } from "react-router";
import { useQuiz } from "../hooks";
import { Question, Timer } from "../components";
import { useState } from "react";
import { STATUS } from "../constants";

import "../css/quiz.css";

const Quiz = () => {
  const { id } = useParams();
  const { data, isError, isSuccess, isFetching } = useQuiz(id);
  const [selected, setSelected] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const { duration, options } = data || {};
  const history = useHistory();
  const finish = () => {
    console.log("done");
    history.push(`/results/${id}`, { results: selected });
  };
  return (
    <div className={`Quiz ${isFetching ? "is-fetching" : ""}`}>
      {isError ? (
        <div>Quiz not found</div>
      ) : (
        isSuccess && (
          <>
            <div className="Quiz-title">{data.title}</div>
            {data.duration && (
              <Timer {...{ duration, finish, status, setStatus }} />
            )}
            <div className="Quiz-questions">
              {data.questions.map((question, i) => (
                <Question
                  key={i}
                  status={status}
                  data={question}
                  quizOptions={options}
                  selected={selected[question.id]}
                  select={(answer) =>
                    setSelected({ ...selected, [question.id]: answer })
                  }
                />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Quiz;
