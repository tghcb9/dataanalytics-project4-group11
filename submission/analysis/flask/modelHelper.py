import pandas as pd
import pickle
import numpy as np

# Define the SQLHelper Class
# PURPOSE: Deal with all of the database logic
class ModelHelper:
###     def __init__(self):
          # model
###          self.model = pickle.load(open("model_pipeline.pkl", 'rb'))

     def predictions(self, name, platform, Year, Genre, Publisher, NA, EU, JP,
               Other, Global, Critic_Score, Critic_Count, User_Score, Developer, Rating):
        
        df = pd.DataFrame()
        df["name"] = [name]
        df["platform"] = [platform]
        df["Year"] = [Year]
        df["Genre"] = [Genre]
        df["Publisher"] = [Publisher]
        df["NA"] = [NA]
        df["EU"] = [EU]
        df["JP"] = [JP]
        df["Other"] = [Other]
        df["Global"] = [Global]
        df["Critic_Score"] = [Critic_Score]
        df["Critic_Count"] = [Critic_Count]
        df["User_Score"] = [User_Score]
        df["Developer"] = [Developer]
        df["Rating"] = [Rating]
        
        # columns in order
        df = df.loc[:, ['name', 'platform', 'Year', 'Genre', 'Publisher', 
          'NA', 'EU','JP', 'Other', 'Global', 'Critic_Score', 'Critic_Count', 
          'User_Score', 'Developer', 'Rating']]
        
        preds = self.model.predict_proba(df)
        return(preds[0][1])
