# quiz-gen
Web Platform for Creating and taking quizzes online

Created Quizzes can be exported as JSON files. To use the JSON files need to be located in the `/public/quizzes` folder and an entry needs to be added to the `/public/quizzes/registry.json`. The entry needs a key (any string will do) and the value (filename). The entry key can be used to access the quiz by navigating to `/quiz/{the entry key}`