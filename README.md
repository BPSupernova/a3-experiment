## Vertical vs. Horizontal vs. Upside-Down Bar Chart Study
Link: https://bpsupernova.github.io/a3-experiment/

## Done by Benjamin Perry, Ha Chu, Yanhong Liu, & Connor McCoy

## General Description of the Study
This study attempts to discern whether there is an optimal version of the bar chart to use in studies. We approach this study by hypothesizing sideways bar charts are most optimal. Optimal in this case refers to the quality of a bar chart to allow the user better performance on the study task (in this case being guessing what percent of the larger chosen bar does the smaller chosen bar represent). Optimality is tested by analyzing user data taken through 20 trials (per user) of each of the three bar chart types (vertical, horizontal, and upside down) and calculating the error between guessed and actual values (of the percent of the larger chosen bar that the smaller chosen bar represents). The trials and bar lengths are randomly ordered/numbered after the training, while training itself is fixed. We have provided some screenshots of the study below.

## Screenshots
![study_training_page](img/traing_screenshot.png)

![study_vertical_guess](img/vertical_bar_screenshot.png)

![study_horizontal_guess](img/horizontal_bar_screenshot.png)

![study_upside_down_guess](img/upside-down_bar_screenshot.png)

![study_error_calculations_and_analysis](img/error_calc_&_analytics_screenshot.png)

## Technical Acheivements
- Randomizing trial and bar data using a config generator algorithmic approach
- Automatic error calculations and downloadable csv button
- Actually deploying the study on and using ReVISit lol (considering the unfamiliarity our team had with the tool)
- Programming horizontal and upside-down bar charts into React components using d3

## Design Acheivements
- Separating between training and trial guesses 
- Allowing participants who failed the training to go through the experiment anyways
- Modifying the dot generation code to always make the dot spawn within the lower portion of the bar, no matter the graph's orientation
- Creating 3 types of bar chart visualizations within the same study