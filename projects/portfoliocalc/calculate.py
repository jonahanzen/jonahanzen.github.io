import json
import matplotlib.pyplot as plt

# Open and read the JSON file
with open('acoes.json', 'r') as file:
    json_data = json.load(file)

# Access the 'data' key in the JSON dictionary
data_list = json_data['data']


# Initialize dictionary to store column sums and counts
column_sums = {}
column_counts = {}

# Iterate through each row in the 'data' list
for row in data_list:
    for key, value in row.items():
        # Check if the value is numerical or can be converted to a float

        try:
                if "id" in key:
                    continue 
                else:
                    numerical_value = float(value)
                    column_sums[key] = column_sums.get(key, 0) + numerical_value
                    column_counts[key] = column_counts.get(key, 0) + 1
        except (TypeError, ValueError):
            continue  # Skip non-numeric values and null values

# Calculate and print averages
column_averages = {}
for key in column_sums.keys():
    average = column_sums[key] / column_counts[key]
    column_averages[key] = average
    print(f"{key}_average: {average}")

# Create a bar chart for the average values
plt.figure(figsize=(12, 8))
plt.barh(list(column_averages.keys()), list(column_averages.values()))
plt.xlabel('Average Value')
plt.title('Average Values for Each Column')
for i, v in enumerate(column_averages.values()):
    plt.text(v, i, f"{v:.2f}", va='center', color='blue')
plt.show()