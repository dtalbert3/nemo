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



public class WekaEasy
{
  public static void main(String[] args)
  {
    try{
        System.out.print("Connecting...");
        InstanceQuery query = new InstanceQuery();
        query.setUsername("NEMO_WEB");
        query.setPassword("NEMO");
        query.setQuery("Select * from NEMO_Datamart.observation_fact LIMIT 10;");
        Instances data = query.retrieveInstances();
        System.out.print("Data:");
        System.out.print(data);
      }
      catch(Exception e)
      {
            e.printStackTrace();

      }
     System.out.println("Goodbye!");
 }
}
