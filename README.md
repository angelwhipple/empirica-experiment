# Intro

The majority of this Empirica experiment has been contributed by @SwapneelM and the Digital Information Research Lab at Boston University. My contributions include:

- A warrants feature, which allows producers to optionally guarantee the validity of their product advertisement and promote it to a wider audience

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
