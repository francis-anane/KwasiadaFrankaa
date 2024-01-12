data class Player(
    var name: String,
    var email: String,
    var password: String,
    var gameBoard: ArrayList<ArrayList<String>> = arrayListOf(
        arrayListOf("", "", ""),
        arrayListOf("", "", ""),
        arrayListOf("", "", "")
    ),
    var playerSymbol: String? = null,
    var opponentSymbol: String? = null,
    var isYourTurn: Boolean? = null,
    var hasWon: Boolean? = null,
    var moveCount: Int = 0,
    var playerId: String? = null,
    var opponentId: String? = null,
    var socketId: String? = null
)
