import socketio
from getpass import getpass
import requests
import json

sio = socketio.Client()

player = None
gamePlayersRoom = None
senderSocketId = None
receiverSocketId = None

@sio.event
def connect():
    print("Connected to server\n")

@sio.event
def modifiedPlayer(data):
    global player
    player = data


@sio.event
def disconnect():
    print("Disconnected from server\n")

@sio.event
def message(data):
    if data.get('sender').get('socketId') != player.get('socketId'):
        print("\nReceived message from {}: {}\n\r".format(data['sender']['name'], data['message']))

    
    
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
def moveMade(data):
    print(data)

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
    global senderSocketId
    senderSocketId = data.get('senderSocketId')
    global receiverSocketId
    receiverSocketId = data.get('receiverSocketId')
    global gamePlayersRoom

    gamePlayersRoom = data.get('gamePlayersRoom')

    print('\nInvitation from ' + senderSocketId + '\n')
    reception = input('Accept invitation? (y/n): ')
    if reception == 'y':
        sio.emit('eventAccepted', {'senderSocketId': senderSocketId, 'gamePlayersRoom': gamePlayersRoom})
        print('Invitation accepted\n')

    else:
        # Emit 'eventRejected' event to the server
        sio.emit('eventRejected', {'senderSocketId': senderSocketId})
        print('Invitation rejected\n')

@sio.event
def joinedGameRoom(data):
    global gamePlayersRoom
    gamePlayersRoom = data.get('gamePlayersRoom')
    print('\ngamePlayersRoom:', gamePlayersRoom)
    print('\nYou are matched in a multiplayer game\n')






    

if __name__ == "__main__":
    try:
        url = 'http://127.0.0.1:3000/api/auth/login'
        email = input("Enter your email: ")
        password = getpass()
        payload = {'email': email, 'password': password}
        result = requests.post(url, json=payload)
        player = json.loads(result.text).get('player')      
    	
        if(result):
            sio.connect('http://127.0.0.1:3000/api')  # Connect to the root URL of the server
            sio.emit('setSocketId', {'playerId': player['_id']})

            onlinePlayers = json.loads(requests.get("http://127.0.0.1:3000/api/players/onlinePlayers").text)
            print('Online Players:')
            for p in onlinePlayers:
                print("Player Name: {0}\nPlayer ID: {1}\n".format(p["name"], p["_id"]))
                #print("Player", p)
            while True:
                print("Events:\n1. inviteOpponent\n2. message\n3. makeMove")
                event = input("Enter an event name  (or 'exit' to quit): ")
                print("\n")
                if event == 'exit':
                    break
                elif event == 'inviteOpponent':
                    opponentEmail = input("Enter the opponent's email: ")
                    sio.emit('inviteOpponent', {"opponentEmail": opponentEmail, "inviteSenderSocketId": sio.sid})
                    print("\n")
                elif event == 'message':
                    message_content = input("Enter a message: ")
                    sio.emit('message', {"content": message_content, "sender": player, "gamePlayersRoom": gamePlayersRoom})
                    print("\n")
                elif event == "makeMove":
                    srcRow = int(input("Enter source row: "))
                    srcCol = int(input("Enter source column: "))
                    desRow = int(input("Enter destination row: "))
                    desCol = int(input("Enter destination column: "))
                    sio.emit("makeMove", {"move":{"srcRow": srcRow, "srcCol": srcCol, "desRow": desRow, "desCol": desCol},
                                          "gameBoard": player.get("gameBoard"), "gamePlayersRoom": gamePlayersRoom})
                    print("\n")
                elif event == "endGame":
                    sio.emit("endGame", {"senderSocketId": senderSocketId, "receiverSocketId": receiverSocketId})
                # else:
                #     if event != "" or event != " " or event != "\r":
                #         print("Invalid Event\n")

    except Exception as e:
        print("Client error:", e)
    finally:
        sio.disconnect()
