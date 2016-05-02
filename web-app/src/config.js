export default {
  'apiUrl': 'http://localhost:3030',
  'UserDashRefreshRate': 1000 *  10,
  'Demographics': {
    'sex_cd': ['m', 'f'],
    'race_cd': ['american indian', 'asian', 'black', 'hispanic', 'white'],
    'age': 'bounded'
  },
  'Optimizers': [
    'Random',
    'Ensemble',
    'FeatureSelection',
    'CVParams'
  ],
  'Classifiers': [
    'Random',
    'J48',
    'Perceptron',
    'NaiveBayes',
    'SMO',
    'RandomForest'
  ]
}
