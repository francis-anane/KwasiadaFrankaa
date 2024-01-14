import requests
from getpass import getpass

method = input("Enter method (get/post/delete): ")

if method == "post":
    url = "http://127.0.0.1:3000/api/players/register"
    name = input("Enter your name: ")
    email = input("Enter your email: ")
    password = getpass("Enter your password: ")
    payload = {"name": name, "email": email, "password": password}

    try:
        result = requests.post(url, json=payload)

        # Check if the request was successful (status code 2xx)
        if result.status_code // 100 == 2:
            print("Registration successful.")
        else:
            print("Registration failed. Status code:", result.status_code)
            print(result.text)
    except requests.RequestException as e:
        print("Error making the request:", e)

elif method == "delete":
    player_id = input("Enter player id: ")
    url = f"http://127.0.0.1:3000/api/players/{player_id}"

    try:
        result = requests.delete(url)

        # Check if the request was successful (status code 2xx)
        if result.status_code // 100 == 2:
            print("Deletion successful.")
        else:
            print("Deletion failed. Status code:", result.status_code)
            print(result.text)
    except requests.RequestException as e:
        print("Error making the request:", e)
elif method == "get":
    queryType = input("Enter query type (all/one): ")
    if queryType == "all":
    	url = "http://127.0.0.1:3000/api/players/all"
    elif queryType == "one":
    	    player_id = input("Enter player id: ")
    	    url = "http://127.0.0.1:3000/api/players/" + player_id
    else:
        print("Error: Invalid query type " + queryType)	    
    
    try:
        result = requests.get(url)
        print(result.text)
    except requests.RequestException as e:
        print("Error making the request:", e)

else:
    print("Invalid method. Please enter 'get', 'post' or 'delete'.")

