export default {
  'UserDashRefreshRate': 1000 *  10,
  'Demographics': {
    'sex_cd': ['m', 'f'],
    'race_cd': ['american indian', 'asian', 'black', 'hispanic', 'white']
  },
  'Optimizers': [
    'Ensemble',
    'FeatureSelection',
    'ParameterOptimization'
  ],
  'Classifiers': [
    'J48',
    'Perceptron',
    'NaiveBayes',
    'SMO',
    'RandomForest'
  ]
}
