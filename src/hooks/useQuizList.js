import axios from "axios";
import { useQuery } from "react-query";

const useQuizList = () =>
  useQuery(
    "quizList",
    () => axios.get(`/quizzes/registry.json`).then((res) => res.data),
    { staleTime: Infinity }
  );

export default useQuizList;
