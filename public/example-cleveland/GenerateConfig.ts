import * as fs from 'fs';

/**
 * GenerateConfig.ts
 * Generates a Revisit Study Config for Cleveland-McGill Experiment
 * Usage: npx tsx GenerateConfig.ts
 */

const chartTypes = ['barChart', 'horizontalBarChart', 'upsideDownBarChart'];
const trialsPerType = 20;

function generateTrials() {
  const dynamicComponents: any = {};
  const sequenceList: string[] = [];

  chartTypes.forEach((type) => {
    for (let i = 1; i <= trialsPerType; i++) {
      // Generate 5 random data points
      const numPoints = 5;
      const data = Array.from({ length: numPoints }, (_, j) => ({
        name: String.fromCharCode(65 + j),
        value: Math.floor(Math.random() * 91) + 10,
      }));

      // Pick 2 random indices to compare
      const indices = [...Array(numPoints).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const val1 = data[indices[0]].value;
      const val2 = data[indices[1]].value;

      // True Percent: (smaller / larger) * 100
      const correctPct = Math.round((Math.min(val1, val2) / Math.max(val1, val2)) * 100);

      const trialId = `${type}_${i}`;
      dynamicComponents[trialId] = {
        baseComponent: type,
        parameters: { 
          data, 
          selectedIndices: indices 
        },
        correctAnswer: [{ id: 'cm-response', answer: correctPct }],
      };
      sequenceList.push(trialId);
    }
  });

  return { dynamicComponents, sequenceList };
}

const { dynamicComponents, sequenceList } = generateTrials();

const fullConfig = {
  $schema: 'https://raw.githubusercontent.com/revisit-studies/study/v2.3.2/src/parser/StudyConfigSchema.json',
  studyMetadata: {
    title: 'A3 Experiment',
    version: 'pilot',
    authors: ['Ha Chu, Yanhong Liu, Conor McCoy, Benjamin Perry'],
    date: '2026-02-13',
    description: 'A variation of the Cleveland & McGill graphical perception task',
    organizations: ['University of Utah', 'WPI', 'University of Toronto'],
  },
  uiConfig: {
    contactEmail: 'contact@revisit.dev',
    helpTextPath: 'example-cleveland/assets/help.md',
    logoPath: 'revisitAssets/revisitLogoSquare.svg',
    withProgressBar: true,
    autoDownloadStudy: false,
    withSidebar: true,
  },
  baseComponents: {
    horizontalBarChart: {
      description: 'A bubble chart with correct answer of 0.66',
      instruction: 'Two values are marked with dots. \n\nWhat percentage do you believe the smaller value represents relative to the larger value?',
      type: 'react-component',
      path: 'example-cleveland/assets/HorizontalBarChart.tsx',
      parameters: {
        data: [
          { name: 'A', value: '30' },
          { name: 'B', value: '40' },
          { name: 'C', value: '50' },
          { name: 'D', value: '40' },
          { name: 'E', value: '60' },
        ],
        selectedIndices: [1, 4],
      },
      response: [{ id: 'cm-response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', placeholder: '0-100', max: 100, min: 0 }],
      nextButtonLocation: 'sidebar',
      instructionLocation: 'sidebar',
    },
    stackedBarChart: {
      meta: { difficulty: 5, chart: 'stacked bar' },
      description: 'A chart with correct answer of 0.66',
      instruction: 'Two values are marked with dots. \n\nWhat percentage do you believe the smaller value represents relative to the larger value?',
      type: 'react-component',
      path: 'example-cleveland/assets/StackedBarChart.tsx',
      parameters: {
        data: [
          { name: 'A', value: '30' },
          { name: 'B', value: '40' },
          { name: 'C', value: '50' },
          { name: 'D', value: '40' },
          { name: 'E', value: '60' },
        ],
        selectedIndices: [1, 4],
      },
      response: [{ id: 'cm-response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', placeholder: '0-100', max: 100, min: 0 }],
      nextButtonLocation: 'sidebar',
      instructionLocation: 'sidebar',
    },
    barChart: {
      meta: { difficulty: 5, chart: 'Bar' },
      description: 'A chart with correct answer of 0.66',
      instruction: 'Two values are marked with dots. \n\nWhat percentage do you believe the smaller value represents relative to the larger value?',
      type: 'react-component',
      path: 'example-cleveland/assets/BarChart.tsx',
      parameters: {
        data: [
          { name: 'A', value: '30' },
          { name: 'B', value: '40' },
          { name: 'C', value: '50' },
          { name: 'D', value: '40' },
          { name: 'E', value: '60' },
        ],
        selectedIndices: [1, 4],
      },
      response: [{ id: 'cm-response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', placeholder: '0-100', max: 100, min: 0 }],
      nextButtonLocation: 'sidebar',
      instructionLocation: 'sidebar',
    },
    upsideDownBarChart: {
      meta: { difficulty: 5, chart: 'Bar' },
      description: 'Upside-down bar chart',
      instruction: 'Two values are marked with dots. \n\nWhat percentage do you believe the smaller value represents relative to the larger value?',
      type: 'react-component',
      path: 'example-cleveland/assets/UpsideDownBarChart.tsx',
      parameters: {
        data: [
          { name: 'A', value: '30' },
          { name: 'B', value: '40' },
          { name: 'C', value: '50' },
          { name: 'D', value: '40' },
          { name: 'E', value: '60' },
        ],
        selectedIndices: [1, 4],
      },
      response: [{ id: 'cm-response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', placeholder: '0-100', max: 100, min: 0 }],
      nextButtonLocation: 'sidebar',
      instructionLocation: 'sidebar',
    }
  },
  components: {
    introduction: { type: 'markdown', path: 'example-cleveland/assets/introduction.md', response: [] },
    training1: { type: 'image', path: 'example-cleveland/assets/cm-training.png', response: [] },
    trainingHorizontalBarChart1: {
      baseComponent: 'horizontalBarChart',
      description: 'A bubble chart with correct answer of 0.66',
      parameters: { selectedIndices: [3, 4], response: [{ id: 'response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', max: 100, min: 0 }] },
      provideFeedback: true,
      allowFailedTraining: false,
      correctAnswer: [{ id: 'cm-response', answer: 66 }]
    },
    trainingBarChart1: {
      baseComponent: 'barChart',
      parameters: { selectedIndices: [1, 4], response: [{ id: 'response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', max: 100, min: 0 }] },
      provideFeedback: true,
      correctAnswer: [{ id: 'cm-response', answer: 66 }]
    },
    trainingUpsideDownChart1: {
      baseComponent: 'upsideDownBarChart',
      parameters: { selectedIndices: [1, 2], response: [{ id: 'response', prompt: 'Answer:', location: 'sidebar', type: 'numerical', max: 100, min: 0 }] },
      provideFeedback: true,
      correctAnswer: [{ id: 'cm-response', answer: 80 }]
    },
    ...dynamicComponents,
    'post-study-survey1': { type: 'questionnaire', response: [] }
  },
  // Define the sequence: fixed intro/training, randomized trials via a nested dynamic block
  sequence: {
    id: "cleveland_study_root",
    order: "fixed",
    components: [
      "introduction",
      "training1",
      "trainingHorizontalBarChart1",
      "trainingBarChart1",
      "trainingUpsideDownChart1",
      {
        id: "trial_block",
        order: "random",
        components: sequenceList
      },
      "post-study-survey1"
    ]
  }
};

// Execution logic
try {
  fs.writeFileSync('./config.json', JSON.stringify(fullConfig, null, 2));
  console.log(`✅ Success! Config generated`);
} catch (err) {
  console.error('❌ Error generating config:', err);
}
