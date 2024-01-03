package com.abstratsystems.kwasiadafrankaa

import Player
import android.app.Activity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.RelativeLayout
import android.widget.TextView
import android.widget.ToggleButton
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.abstratsystems.kwasiadafrankaa.utils.InitGameBoardData
import com.abstratsystems.kwasiadafrankaa.utils.AbstratRecyclerViewAdapter
import com.abstratsystems.kwasiadafrankaa.utils.Instances.player
import com.abstratsystems.kwasiadafrankaa.utils.WebSocketClient

class GameActivity : Activity() {

    // Declare UI elements
    private lateinit var row0column0: Button
    private lateinit var row0column1: Button
    private lateinit var row0column2: Button
    private lateinit var row1column0: Button
    private lateinit var row1column1: Button
    private lateinit var row1column2: Button
    private lateinit var row2column0: Button
    private lateinit var row2column1: Button
    private lateinit var row2column2: Button
    private lateinit var onlinePlayersAndMessagesRecyclerView: RecyclerView
    private lateinit var messageEditText: EditText
    private lateinit var sendMessageButton: Button
    private lateinit var symbolOneButton: Button
    private lateinit var symbolTwoButton: Button
    private lateinit var symbolThreeButton: Button
    private lateinit var multiAndSinglePlayerToggleButton: ToggleButton
    private lateinit var layoutManager: LinearLayoutManager
    private lateinit var adapter: AbstratRecyclerViewAdapter<Player, RelativeLayout>

    // Variables for tracking game moves
    private var srcRow: Int? = null
    private var srcCol: Int? = null
    private var desRow: Int? = null
    private var desCol: Int? = null
    private var secondClick: Boolean = false

    // Called when the activity is created
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("GameActivity", "onCreate called")
        setContentView(R.layout.activity_game)
        initViews()

        WebSocketClient.startWebSocket()

        // Initialize the adapter with an empty list
        adapter = AbstratRecyclerViewAdapter(
            context = this@GameActivity,
            listData = InitGameBoardData.onlinePlayers,
            viewsLayoutResFileId = R.layout.players_view,
            viewsLayoutParentId = R.id.playersViewParent
        ) { itemView, player ->
            val playersButton = itemView.findViewById<Button>(R.id.playersBtn)
            playersButton.text = player.name
        }

        // Set onClickListeners for game board buttons
        row0column0.setOnClickListener {
            handleButtonClick(0, 0)
        }

        row0column1.setOnClickListener {
            handleButtonClick(0, 1)
        }

        row0column2.setOnClickListener {
            handleButtonClick(0, 2)
        }

        row1column0.setOnClickListener {
            handleButtonClick(1, 0)
        }

        row1column1.setOnClickListener {
            handleButtonClick(1, 1)
        }

        row1column2.setOnClickListener {
            handleButtonClick(1, 2)
        }

        row2column0.setOnClickListener {
            handleButtonClick(2, 0)
        }

        row2column1.setOnClickListener {
            handleButtonClick(2, 1)
        }

        row2column2.setOnClickListener {
            handleButtonClick(2, 2)
        }

// Inside onCreate method
        multiAndSinglePlayerToggleButton.setOnCheckedChangeListener { buttonView, isChecked ->
            if (isChecked) {
                multiAndSinglePlayerToggleButton.text = "Multiplayer Mode"
                // If in multiplayer mode, show the RecyclerView
                onlinePlayersAndMessagesRecyclerView.visibility = View.VISIBLE

            } else {
                multiAndSinglePlayerToggleButton.text = "Single Player Mode"
                // If in single-player mode, hide the RecyclerView
                onlinePlayersAndMessagesRecyclerView.visibility = View.GONE
                messageEditText.visibility = View.GONE
                sendMessageButton.visibility = View.GONE
            }
        }

        // Set an event listener to handle incoming custom events
        WebSocketClient.setEventListener(object : WebSocketClient.WebSocketEventListener {
            override fun onCustomEvent(event: String) {
             // update
            }
        })
    }

    // Method to handle button clicks on the game board
    private fun handleButtonClick(row: Int, col: Int) {
        if (!secondClick && player.moveCount == 0) {
            desRow = row
            desCol = col
            player.gameBoard[desRow!!][desCol!!] = player.playerSymbol.toString()
            secondClick = true

        } else if (!secondClick && player.moveCount > 0) {
            srcRow = row
            srcCol = col
            secondClick = true
        } else if (secondClick && player.moveCount > 0) {
            desRow = row
            desCol = col
            player.gameBoard[srcRow!!][srcCol!!] = ""
            player.gameBoard[desRow!!][desCol!!] = player.playerSymbol.toString()
            secondClick = false
        }
        // Send a custom event when the button is clicked
        WebSocketClient.sendCustomEvent("Hello, Server!")
        // Print the selected row and column for debugging
        println("desRow: $desRow")
        println("desCol: $desCol")
    }

    // Method to initialize UI elements
    private fun initViews() {
        row0column0 = findViewById(R.id.row0_column0)
        row0column1 = findViewById(R.id.row0_column1)
        row0column2 = findViewById(R.id.row0_column2)
        row1column0 = findViewById(R.id.row1_column0)
        row1column1 = findViewById(R.id.row1_column1)
        row1column2 = findViewById(R.id.row1_column2)
        row2column0 = findViewById(R.id.row2_column0)
        row2column1 = findViewById(R.id.row2_column1)
        row2column2 = findViewById(R.id.row2_column2)
        onlinePlayersAndMessagesRecyclerView = findViewById(R.id.playersAndMessagesRecyclerView)
        symbolOneButton = findViewById(R.id.symbolOneBtn)
        symbolTwoButton = findViewById(R.id.symbolTwoBtn)
        symbolThreeButton = findViewById(R.id.symbolThreeBtn)
        sendMessageButton = findViewById(R.id.sendMessageButton)
        messageEditText = findViewById(R.id.messageEditText)
        multiAndSinglePlayerToggleButton = findViewById(R.id.singleAndMultiplayerToggleButton)
    }
    // called when activity is destroyed
    override fun onDestroy() {
        super.onDestroy()
        WebSocketClient.stopWebSocket()
    }
}
