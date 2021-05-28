import "./css/app.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { QuizList, Quiz, Editor, Results } from "./pages";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h2>Quiz Gen</h2>
            <h4>Create and take Quizzes</h4>
          </header>
          <nav className="App-nav">
            <Link to="/all">All Quizzes</Link>
            <Link to="/create">Create a Quiz</Link>
          </nav>
          <div className="App-content">
            <Switch>
              <Route path={["/create", "/edit/:id"]}>
                <Editor />
              </Route>
              <Route path="/all">
                <QuizList />
              </Route>
              <Route path="/quiz/:id">
                <Quiz />
              </Route>
              <Route path="/results/:id">
                <Results />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
