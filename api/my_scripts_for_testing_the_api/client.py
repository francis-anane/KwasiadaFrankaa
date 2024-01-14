import socketio
from getpass import getpass
import requests
import json

sio = socketio.Client()

player = None
gamePlayersRoom = None

@sio.event
def connect():
    print("Connected to server")

@sio.event
def modifiedPlayer(data):
    global player
    player = data


@sio.event
def disconnect():
    print("Disconnected from server")

@sio.event
def message(data):
    print("\nReceived message from {}: {}".format(data['senderId'], data['message']))

    
    
@sio.event
def error(data):
    print("Error:", data)

@sio.event
def gameState(data):
    print("game state: ", data)

@sio.event
def gameWinner(data):
    print("Game winner: ", data)

@sio.event
def multiplayerMove(data):
    print()

@sio.event
def singlePlayerMove(data):
    if data.get("isYourTurn"):
        if data["moveCount"] == 0:
            desRow = int(input("Enter destination row: "))
            desCol = int(input("Enter destination column: "))
        else:
            srcRow = int(input("Enter source row: "))
            srcCol = int(input("Enter source column: "))
            desRow = int(input("Enter destination row: "))
            desCol = int(input("Enter destination column: "))
            data['gameBoard'][srcRow][srcCol] = ''
        
        if(data["playerSymbol"] == "red"):
            if data['gameBoard'][desRow][desCol] != 'blue':
                data['gameBoard'][desRow][desCol] = 'red'
                data["moveCount"] += 1
                data['isYourTurn'] = False
            else:
                print("Invalid move")
        elif(data["playerSymbol"] == "blue"):
            if data['gameBoard'][desRow][desCol] != 'red':
                data['gameBoard'][desRow][desCol] = 'blue'
                data["moveCount"] += 1
                data['isYourTurn'] = False
            else:
                print("Invalid move")
        print(data)
        global player
        player = data

# Event handler for the 'invitation' event
@sio.event
def invitation(data):
    #senderSocketId = data.get('senderId')
    senderId = data.get('senderId')
    global gamePlayersRoom
    gamePlayersRoom = data.get('gamePlayersRoom')

    print('\nInvitation from ' + senderId + '\n')
    reception = input('Accept invitation? (y/n): ')
    if reception == 'y':
        # Emit 'eventAccepted' event to the server
        #sio.emit('eventAccepted', {'senderSocketId': senderSocketId, 'receiverSocketId': sio.sid})
        # sio.emit('eventAccepted', {'senderId': senderId,})
        sio.emit('eventAccepted', {'senderId': senderId, 'gamePlayersRoom': gamePlayersRoom})
        print('Invitation accepted')

    else:
        # Emit 'eventRejected' event to the server
        sio.emit('eventRejected', {'senderSocketId': senderId})
        print('Invitation rejected')

@sio.event
def joinedGameRoom(data):
    global gamePlayersRoom
    gamePlayersRoom = data.get('gamePlayersRoom')
    print('gamePlayersRoom:', gamePlayersRoom)
    print('You are matched in a multiplayer game')






    

if __name__ == "__main__":
    try:
        url = 'http://127.0.0.1:3000/api/auth/login'
        email = input("Enter your email: ")
        password = getpass()
        payload = {'email': email, 'password': password}
        result = requests.post(url, json=payload)
        # print(result.text)
        player = json.loads(result.text).get('player')
        print(player)        
    	
        if(result):
            sio.connect('http://127.0.0.1:3000/api')  # Connect to the root URL of the server
            sio.emit('setSocketId', {'playerId': player['_id']})

            onlinePlayers = json.loads(requests.get("http://127.0.0.1:3000/api/players/onlinePlayers").text)
            print('Online Players:')
            for p in onlinePlayers:
                print("Player Name: {0}\nPlayer ID: {1}".format(p["name"], p["_id"]))
                #print("Player", p)
            while True:
                event = input("Enter an event name  (or 'exit' to quit): ")
            
                if event == 'exit':
                    break
                elif event == 'message':
                    message_content = input("Enter a message: ")
                    sio.emit('message', {"content": message_content, "gamePlayersRoom": gamePlayersRoom})
                elif event == 'inviteOpponent':
                    opponentId = input("Enter the opponent ID: ")
                    sio.emit('inviteOpponent', {"opponentId": opponentId, "inviteSenderSocketId": sio.sid})
                #sio.emit('makeMove', {'srcRow': 0, 'srcCol': 0, 'desRow': 2, 'desCol': 2})
                #sio.emit("singlePlayerMove", player)

    except Exception as e:
        print("Client error:", e)
    finally:
        sio.disconnect()
