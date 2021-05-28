import axios from "axios";
import { useQuery } from "react-query";
import useQuizList from "./useQuizList";

const useQuiz = (id) => {
  const { data: quizList, isSuccess: enabled } = useQuizList();
  return useQuery(
    ["quiz", id],
    () => axios.get(`/quizzes/${quizList?.[id]}`).then((res) => res.data),
    { staleTime: Infinity, enabled }
  );
};

export default useQuiz;
