# Welcome to Phi's Mastermind game's README

## Prerequirements
You will need an installation of node.js and npm to play this game.
You can find the download link here: [Download Node and NPM](https://nodejs.org/en/download/)

## Setup
To play this game of mastermind, clone this repo to your local machine.
Make sure your console is pointed at the correct directory (root of this repo) and run:
<code>npm i</code>.

## Test suite
To ensure that the game functions properly, try to run the test suite with the following command.
<code>npm run test</code>

## Application core decisions
I made the following determinations with this application.
<ul>
  <li>Test each endpoint gratuitously with a comprehensive testing suite.</li>
  <li>I want to further utilize the robust api I've built to generate web pages on the server.</li>
  <li>I want a lightweight and easy to use database that would allow anyone to use the game with very little setup effort, and for this I chose sqlite3.</li>
</ul>

## How to play
To play Mastermind start the application with the following command in the console.
<code>npm run start</code>

This should automatically open your browser and go to localhost:4242 where you can play the game.

The rules are as follows:
<ol>
<li>At the start of the game the computer will randomly select a pattern of four different numbers from a total of 8 different numbers. (0-7)</li>
<li>A player will have 10 attempts to guess the number combinations</li>
<li>At the end of each guess, computer will provide one of the following response</li>
<li>as feedback:
  <ul>
      <li>The player had guessed a correct number and its correct location</li>
  </ul>
</li>
</ol>
**Note that the computer’s feedback will not reveal which number the player guessed correctly

If you want to clear the database to start fresh go to line 51 in src/db/sequelize.js and change <code>force: false</code> to <code>force: true</code> in 