import { useHistory } from "react-router";
import "../css/quizList.css";
import useQuizList from "../hooks/useQuizList";

const QuizList = () => {
  const { data: quizList, isLoading, isSuccess } = useQuizList();
  const history = useHistory();
  if (isLoading) return <div className="loading">Loading...</div>;
  if (isSuccess && !Object.keys(quizList).length)
    return <div className="empty">No Quizzes found</div>;
  return (
    <div className="QuizList">
      <div className="QuizList-title">List of All Quizzes</div>
      <div className="QuizList-list">
        {Object.keys(quizList).map((key) => (
          <div
            key={key}
            className="QuizList-quiz"
            onClick={() => history.push(`/quiz/${key}`)}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
