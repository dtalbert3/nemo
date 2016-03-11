// Compile: javac -cp "weka.jar:mysql-connector-java-5.1.38-bin.jar" WekaEasy.java
// Run: java -cp "weka.jar:mysql-connector-java-5.1.38-bin.jar:./" WekaEasy

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.evaluation.NominalPrediction;
import weka.classifiers.rules.DecisionTable;
import weka.classifiers.rules.PART;
import weka.classifiers.trees.DecisionStump;
import weka.classifiers.trees.J48;
import weka.core.FastVector;
import weka.core.Instances;
import weka.experiment.InstanceQuery;
import java.sql.*;
import weka.classifiers.Evaluation;
import weka.classifiers.trees.J48;



public class WekaEasy
{
  public static void main(String[] args)
  {
    try{
        System.out.print("Connecting...");
        InstanceQuery query = new InstanceQuery();
        query.setUsername("NEMO_WEB");
        query.setPassword("NEMO");
        //query.setQuery("Select * from NEMO_Datamart.observation_fact LIMIT 10;");
        query.setQuery("Select * from NEMO_Datamart.IrisData");
        Instances data = query.retrieveInstances();
        // THIS Sets the attribute that is the class, in this case the attribute class from the SQL table IrisData
        data.setClassIndex(data.numAttributes() - 1);
        System.out.print("Data:");
        System.out.print(data);

        Instances train = data;
        Instances test = data;
        // train classifier
        Classifier cls = new J48();
        cls.buildClassifier(train);
        // evaluate classifier and print some statistics
        Evaluation eval = new Evaluation(train);
        eval.evaluateModel(cls, test);
        System.out.println(eval.toSummaryString("\nResults\n======\n", false));
      }
      catch(Exception e)
      {
            e.printStackTrace();

      }
     System.out.println("Goodbye!");
 }
}
