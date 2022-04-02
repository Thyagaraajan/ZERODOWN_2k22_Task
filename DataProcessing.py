import csv
from dataclasses import field
from tokenize import Double
import pymongo
import numpy as np
from matplotlib import pyplot as plt
import csv
#%matplotlib inline 

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["local"]
def dictFunction(val):
    mycol = mydb[val]

    myquery = [{
        "$group" : 
            {"_id" : ["$ZIP","$CITY","$STATE", "$X", "$Y"],
            "numb" : {"$sum" : 1}
            }}
        ]

    mydoc = mycol.aggregate(myquery)
    D = dict()
    for i in mydoc:
        D[tuple(i["_id"])] = i["numb"]

    return D
L = ["All_places_of_worship","Convention_Centers_Fairgrounds","Cruise_Line_Terminals","Major_Sport_Venues","Mobile_Home_Parks"]
new_Dict = dict()

for i in range(len(L)):
    d = dictFunction(L[i])
    for j in d:
        if j[0] not in new_Dict:
            l = [j[1],j[2],j[0],j[3],j[4],0,0,0,0,0]
            l[5+i] = d[j]
            new_Dict[j[0]] = l
        else:
            s = new_Dict[j[0]]
            s[5+i] = d[j]
            new_Dict[j[0]] = s

#print(new_Dict)

l = []
for i in new_Dict.values():
    doc = {"_id":i[2], "City":i[0], "State":i[1], "Zip":i[2], "Places_Of_Worship":i[5], "Convention_Centers_Fairgrounds":i[6], "Cruise_Line_Terminals":i[7],"Major_Sport_Venues":i[8],"Mobile_Home_Parks":i[9], "location":{"type":"Point","coordinates":[float(i[3]),float(i[4])]}}
    l.append(doc)

collection = mydb["Final"]
collection.drop()
collection.insert_many(l)
collection.create_index([("location",pymongo.GEOSPHERE)])
filename = "D:\\Datasets\\final_db.csv"
fields = ["City", "State", "Zip", "X", "Y", "Places_Of_Worship", "Convention_Centers_Fairgrounds","Cruise_Line_Terminals","Major_Sport_Venues","Mobile_Home_Parks"]
# writing to csv file 

print(new_Dict.values())
with open(filename, 'w') as csvfile: 
    # creating a csv writer object 
    csvwriter = csv.writer(csvfile) 
        
    # writing the fields 
    csvwriter.writerow(fields) 
        
    # writing the data rows 
    csvwriter.writerows(new_Dict.values())
    
#This function will return the top (Limit:x) x neighbours nearer to the given (x,y) latitude as input.
   
def returnpoints(x,y):
    docs=[]
    for doc in mydb['Final'].find({"location":{"$near":[x,y]}}).limit(10):
        docs.append(doc)
    return docs        
     
# key_list = np.array([i for i in new_Dict.keys()])
# worship_list = np.array([i[3] for i in new_Dict.values()])
# center_list = np.array([i[4] for i in new_Dict.values()])
# cruise_list = np.array([i[5] for i in new_Dict.values()])
# sport_list = np.array([i[6] for i in new_Dict.values()])
# mob_home_list = np.array([i[7] for i in new_Dict.values()])

# plt.subplot(1,2,1)
# plt.plot(key_list,worship_list)
# plt.title("Worship Plot")
# plt.ylabel("Places Of Worship")
# plt.xlabel("ZIP Code")

# plt.subplot(1,2,2)
# plt.plot(key_list,center_list)
# plt.title("Convention Center Plot")
# plt.ylabel("Convention Centers")
# plt.xlabel("ZIP Code")

# plt.subplot(2,2,1)
# plt.plot(key_list,cruise_list)
# plt.title("Cruise Terminals Plot")
# plt.ylabel("Cruise Terminals")
# plt.xlabel("ZIP Code")

# plt.subplot(2,2,2)
# plt.plot(key_list,sport_list)+
# plt.title("Sport Venues Plot")
# plt.ylabel("Sport Venues")
# plt.xlabel("ZIP Code")

# plt.subplot(3,1,1)
# plt.plot(key_list,mob_home_list)
# plt.title("Mobile Homes Plot")
# plt.ylabel("Mobile Homes")
# plt.xlabel("ZIP Code")

# plt.show()
