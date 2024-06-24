# growth-landing-page


# 03-growth-landing-page
![Completed Badge](https://img.shields.io/badge/completed-green)

This project was created for the Growth website Landing page from iCodeThis challenge

`vanilla` contains the code for the pure HTML, CSS, and JS version of the project

`vanilla-mvc` contains the code for the pure HTML, CSS, and JS version of the project, but refactored using ES6 modules and the MVC paradigm with JS

`typescript` contains the code for the Typescript refactor of the project

## Overview
This project is a game of tic tac toe, created using 3 different times -- once using vanilla JS, another using vanilla JS with the MVC pattern, and lastly using Typescript. 

## Purpose of completion
The purpose of completing this project was to go through the full workflow of creating a fully functional app in HTML, CSS, and JS. It also ended up helping me gain experience refactoring frontend code for better design patterns after having to refactor it twice. Even though I've created a project previously in Typescript, I've never refactored vanilla JS code into Typescript code, and it ended up being easier than I thought it'd be.

## Challenges encountered
I experienced some trouble in the beginning getting my layout correct on desktop. Even though the video used a CSS reset, I ended up removing some of my CSS reset since the box-border property caused some of my DOM elements to be improperly positioned on the page. Other than that, there weren't too many other challenges with this project; mainly lots of new insights.

## Lessons Learned
Some of the things I learned while completing this project includes:
- Applying knowledge about CSS Grid
- CSS Reset is NOT always the solution
- Using variables for colors
- *VERY* basic animations
- Even though you’ll have majority of CSS in the document, sometimes it’s quick and convenient to have a quick style in the HTML
- There’s differences between the window and document (use window for events, use document for the DOM)
- Instead of keeping track of game board, keep track of the moves (the state)
- Use classes to keep track of styles that’ll be changed later programmatically

Even though I learned tons good web design concepts, I did feel like some parts were being overengineered a bit.

## Next steps
- Refactor the project using React
- Add a backend to the app for a multiplayer mode
