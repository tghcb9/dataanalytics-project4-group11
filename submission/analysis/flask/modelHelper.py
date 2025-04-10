import pandas as pd
import pickle

class ModelHelper:
    def __init__(self, model_path):
        self.model = pickle.load(open(model_path, 'rb'))

    def predictions(self, input_data):
        # Create DataFrame with all expected columns set to False by default
        expected_columns = [
            # Platform columns
            'Platform_3DS', 'Platform_DC', 'Platform_DS', 'Platform_GBA', 'Platform_GC', 'Platform_PC',
            'Platform_PS', 'Platform_PS2', 'Platform_PS3', 'Platform_PS4', 'Platform_PSP', 'Platform_PSV',
            'Platform_Wii', 'Platform_WiiU', 'Platform_X360', 'Platform_XB', 'Platform_XOne',

            # Genre columns
            'Genre_Action', 'Genre_Adventure', 'Genre_Fighting', 'Genre_Misc', 'Genre_Platform',
            'Genre_Puzzle', 'Genre_Racing', 'Genre_Role-Playing', 'Genre_Shooter', 'Genre_Simulation',
            'Genre_Sports', 'Genre_Strategy',

            # Rating columns
            'Rating_AO', 'Rating_E', 'Rating_E10+', 'Rating_K-A', 'Rating_M', 'Rating_RP', 'Rating_T', 'Rating_Unknown',

            # Numerical features
            'Publisher', 'Year of Release', 'Critic Score', 'User Score',
            'NA Sales', 'EU Sales', 'JP Sales', 'Other Sales'
        ]

        data_dict = {col: False for col in expected_columns}  # Set all to False/0

        # Update with real input values from payload
        for key, value in input_data.items():
            if key in data_dict:
                data_dict[key] = value

        # Ensure numeric fields are properly typed
        for col in ['Publisher', 'Year of Release', 'Critic Score', 'User Score',
                    'NA Sales', 'EU Sales', 'JP Sales', 'Other Sales', 'Global Sales']:
            if col in data_dict:
                data_dict[col] = float(data_dict[col])

        df = pd.DataFrame([data_dict], columns=expected_columns)
        # Use if making model with global_sales_model_neuralnetwork_optimized>> prediction = float(self.model.predict(df)[0][0])
        prediction = float(self.model.predict(df)[0])
        return prediction

