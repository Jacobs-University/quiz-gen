import { useState } from "react";
import { DEFAULT_OPTIONS, OPTIONS, TYPE } from "../constants";

import "../css/editor.css";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [type, setType] = useState(TYPE.MIXED);
  const [duration, setDuration] = useState(30 * 60);
  const [questions, setQuestions] = useState([]);
  const addQuestion = (question) => setQuestions([...questions, question]);
  const editQuestion = (id, data) =>
    setQuestions(
      questions.map((question) =>
        question.id !== id ? question : { ...question, ...data }
      )
    );
  const removeQuestion = (id) =>
    setQuestions(questions.filter((v) => v.id !== id));
  const setOption = (key, value) => setOptions({ ...options, [key]: value });

  return (
    <div className="Editor">
      <h2>Create your own quiz</h2>
      <label>
        Title <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Duration (in minutes):
        <input
          type="number"
          value={duration / 60}
          onChange={(e) => setDuration(e.target.value * 60)}
        />
      </label>
      <label>
        Type:{" "}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value={TYPE.MULTIPLE_CHOICE}>Multiple Choice</option>
          <option value={TYPE.NUMBER}>Only number answers allowed</option>
          <option value={TYPE.TEXT}>Any text answers allowed</option>
          <option value={TYPE.MIXED}>
            Mixed (manually choose for each question)
          </option>
        </select>
      </label>
      <h4>General Options</h4>
      <label>
        Show labels of multiple choice answers:{" "}
        <input
          type="checkbox"
          checked={options[OPTIONS.ANSWER_LABELS]}
          onChange={(e) => setOption(OPTIONS.ANSWER_LABELS, e.target.checked)}
        />
      </label>
      {options[OPTIONS.ANSWER_LABELS] && (
        <label>
          Label suffix for multiple choice answers:{" "}
          <input
            type="text"
            value={options[OPTIONS.ANSWER_LABELS_SUFFIX]}
            onChange={(e) =>
              setOption(OPTIONS.ANSWER_LABELS_SUFFIX, e.target.value)
            }
          />
        </label>
      )}
      <label>
        Allow multiple answers:{" "}
        <input
          type="checkbox"
          checked={options[OPTIONS.MULTIPLE_ANSWERS]}
          onChange={(e) =>
            setOption(OPTIONS.MULTIPLE_ANSWERS, e.target.checked)
          }
        />
      </label>
      <label>
        Case-sensitive check for text answers:{" "}
        <input
          type="checkbox"
          checked={options[OPTIONS.CASE_SENSITIVE]}
          onChange={(e) => setOption(OPTIONS.CASE_SENSITIVE, e.target.checked)}
        />
      </label>
      <h4>Questions</h4>
      <div className="Editor-questions">
        {questions.map((question, i) => (
          <EditorQuestion
            key={i}
            {...{ question, type, editQuestion, removeQuestion, options }}
          />
        ))}
      </div>
      <button
        className="Editor-add-question"
        onClick={() =>
          addQuestion({
            id: (questions[questions.length - 1]?.id || 0) + 1,
            type: type === TYPE.MIXED ? TYPE.MULTIPLE_CHOICE : type,
          })
        }
      >
        Add a Question
      </button>
      <br />
      <br />
      <button
        className="Editor-submit"
        onClick={() => exportToJson({ title, options, duration, questions })}
      >
        Export the Quiz
      </button>
    </div>
  );
};

const EditorQuestion = ({
  question,
  type,
  editQuestion,
  removeQuestion,
  options,
}) => {
  const edit = (data) => editQuestion(question.id, data);
  return (
    <div className="Editor-question">
      <label>
        Question:{" "}
        <input
          value={question.text}
          onChange={(e) => edit({ question: e.target.value })}
        />
      </label>
      {type === TYPE.MIXED && (
        <label>
          Type:{" "}
          <select
            value={question.type || type}
            onChange={(e) =>
              console.log("setting type") || edit({ type: e.target.value })
            }
          >
            <option value={TYPE.MULTIPLE_CHOICE}>Multiple Choice</option>
            <option value={TYPE.NUMBER}>Only number answers</option>
            <option value={TYPE.TEXT}>Any text can be an answer</option>
          </select>
        </label>
      )}
      {[type, question.type].includes(TYPE.MULTIPLE_CHOICE) ? (
        <>
          <div className="Editor-question-choices">
            {Object.keys(question.choices || {}).map((key) => (
              <div className="Editor-question-choice" key={key}>
                <input
                  type="text"
                  className="choice-label"
                  value={key}
                  onChange={(e) => {
                    edit({
                      choices: Object.keys(question.choices).reduce(
                        (acc, k) => {
                          acc[
                            k.toString() === key.toString() ? e.target.value : k
                          ] = question.choices[k];
                          return acc;
                        },
                        {}
                      ),
                    });
                  }}
                />
                <input
                  type="text"
                  className="choice-text"
                  value={question.choices[key]}
                  onChange={(e) =>
                    edit({
                      choices: { ...question.choices, [key]: e.target.value },
                    })
                  }
                />
                <button
                  onClick={() =>
                    edit({
                      choices: Object.keys(question.choices).reduce(
                        (acc, k) => {
                          if (k.toString() !== key.toString())
                            acc[k] = question.choices[k];
                          return acc;
                        },
                        {}
                      ),
                    })
                  }
                >
                  Remove choice
                </button>
                {question.answers?.includes(key.toString()) ? (
                  <button
                    onClick={() =>
                      edit({
                        answers: (question.answers || []).filter(
                          (v) => v !== key.toString()
                        ),
                      })
                    }
                  >
                    Mark as Incorrect
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      edit({
                        answers: [
                          ...((options[OPTIONS.MULTIPLE_ANSWERS] &&
                            question.answers) ||
                            []),
                          key.toString(),
                        ],
                      })
                    }
                  >
                    Mark as Correct
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            className="Editor-question-add-choice"
            onClick={() => {
              let key = 1;
              while (question.choices?.[key] !== undefined) {
                key++;
              }
              edit({
                choices: { ...question.choices, [key]: "" },
              });
            }}
          >
            Add Choice
          </button>
        </>
      ) : (
        <input
          type="text"
          value={question.answers?.[0] || ""}
          onChange={(e) => edit({ answers: [e.target.value] })}
        />
      )}
      <button
        onClick={() => removeQuestion(question.id)}
        className="Editor-remove-question"
      >
        Remove Question
      </button>
    </div>
  );
};

const exportToJson = (objectData) => {
  const a = document.createElement("a");
  a.download = "export.json";
  a.href =
    "data:application/json;charset=utf-8;," +
    encodeURIComponent(JSON.stringify(objectData));
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default Editor;
