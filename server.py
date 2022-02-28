from flask import Flask, request
import pandas as pd

app = Flask(__name__)

"""
Api call to read the data from the file and slight formatting
"""

@app.route('/getData')
def getData():
    data = pd.read_excel('Data.xlsx', sheet_name='Sheet1')

    formatData = data.to_json(orient='records')
    #print(formatData)

    return formatData


"""
Api call to sort the doctors based off the selected doctor and their rating
This method removes all doctors who have a different specialty.
"""

@app.route('/sortDataRating', methods=["POST"])
def sortDataRating():
    print("IN SORT RATING")
    if request.method == "POST":
        data = request.get_json()
        doctors = data["data"]
        doctors.remove(data["doctor"])
        doctorsOK = []
        for row in doctors:
            if row["specialty"] == data["doctor"]["specialty"]:
                doctorsOK.append(row)
        doctors = doctorsOK
        doctors.sort(key=lambda i: i["rating"])
        doctors.reverse()
        data["data"] = doctors
        return data

    return (None)

"""
Api call to sort the doctors based off the selected doctor and their distance
This method removes all doctors who have a different specialty.
"""

@app.route('/sortDataDistance', methods=["POST"])
def sortDataDistance():
    print("IN SORT DATA")
    if request.method == "POST":
        data = request.get_json()
        doctors = data["data"]
        doctors.remove(data["doctor"])
        doctorsOK = []
        for row in doctors:
            if row["specialty"] == data["doctor"]["specialty"]:
                doctorsOK.append(row)
        doctors = doctorsOK
        for row in doctors:
            distance = (data["doctor"]["latitude"] - row["latitude"]) ** 2 + \
                       (data["doctor"]["longitude"] - row["longitude"]) ** 2
            row["distance"] = distance ** 1/2
        doctors.sort(key=lambda i: i["distance"])
        data["data"] = doctors
        return data

    return (None)




if __name__ == "__main__":
    app.run(debug=True)
