import "../css/question.css";
import { OPTIONS, DEFAULT_OPTIONS, TYPE, STATUS } from "../constants";

const Question = ({ data, selected, select, quizOptions, status }) => {
  const { question, choices, type } = data;
  const options = { ...DEFAULT_OPTIONS, ...quizOptions, ...data.options };
  return (
    <div className="Question">
      <div className="Question-text">{question}</div>
      <div className="Question-choices">
        {<Answer {...{ selected, options, select, choices, type, status }} />}
      </div>
    </div>
  );
};

const Answer = (props) => {
  switch (props.type) {
    case TYPE.MULTIPLE_CHOICE:
      return <Choices {...props} />;
    case TYPE.NUMBER:
      return <Field {...props} type="number" />;
    case TYPE.TEXT:
    case TYPE.MIXED:
    default:
      return <Field {...props} type="text" />;
  }
};

const Field = ({ type, selected, select, status }) => (
  <input
    className="Question-answer-field"
    disabled={status !== STATUS.ONGOING}
    type={type}
    value={selected || ""}
    onChange={(e) => select(e.target.value)}
    placeholder={`Answer here ${type === "number" ? "(eg. 4.2)" : ""}`}
  />
);

const Choices = ({ choices = {}, selected = [], options, select, status }) =>
  Object.keys(choices).map((key) => (
    <div
      key={key}
      className={`Question-answer-choice ${
        selected.includes(key) ? "selected " : ""
      }${status !== STATUS.ONGOING ? "disabled " : ""}`}
      onClick={() => {
        if (status !== STATUS.ONGOING) return; 
        const index = selected.indexOf(key);
        const filtered = selected.filter((v, i) => i !== index);
        if (options[OPTIONS.MULTIPLE_ANSWERS])
          select(filtered.concat(index === -1 ? key : []));
        else select(index === -1 ? [key] : []);
      }}
    >
      {options[OPTIONS.ANSWER_LABELS] &&
        `${key}${options[OPTIONS.ANSWER_LABELS_SUFFIX]}`}
      {choices[key]}
    </div>
  ));

export default Question;
