# Intro

The majority of this Empirica experiment has been contributed by @SwapneelM and the Digital Information Research Lab at Boston University. My contributions include: - A warrants feature, which allows producers to optionally guarantee the validity of their product advertisement and promote it to a wider audience

- A leaderboard feature, allowing producers to observe the overall market at any point in the experiment

# Setup

- git clone \<repo-url\> && cd empirica-experiment

- cd client && npm install

- cd ../server && npm install

# Play experiment

- cd empirica-experiment && empirica

- Launch a new game from http://localhost:3000/admin
  - Click New Batch, use the following params
  - Assignment method: Complete
  - Treatment: Solo
  - Lobby configuration: Default individual
  - Click Create, then Start
- Navigate to http://localhost:3000 to play as a producer
  - Provide a unique player ID each time, otherwise won't work

# Short answers

1. Feature planning
   I went about implementing the warrants feature as its own component in typical React style. As for the leaderboard feature, my approach was a bit more involved as this required storing multiple producer scores across consecutive rounds, games, and potentially server restarts. Knowing that this could be done a few different ways, I first experimented with using a server-side session variable to store leaderboard information. Though I saw some initial success with initializing a global leaderboard this way, I later found some bugs related to retrieving that session variable in later requests for leaderboard data or to update the leaderboard. Thus, I proceeded with the second approach of integrating a MongoDB database into the backend that would store scores. This database is then manipulated everytime a new score is calculated after rounds, and everytime a user wishes to view the leaderboard.

2. Real-world applications
