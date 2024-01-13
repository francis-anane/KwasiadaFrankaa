import com.abstratsystems.kwasiadafrankaa.models.Message
import retrofit2.Call
import retrofit2.http.*

/**
 * Retrofit interface for the ORG Android app API.
 */
interface GameApiRequests {
    // Player routes

    @GET("/api/players/onlinePlayers/")
    fun getOnlinePlayers(): Call<ArrayList<Player>>
    @GET("/api/players/{player_id}")
    fun getPlayer(@Path("player_id") playerId: String): Call<Player>

    @POST("/api/players/register")
    fun createPlayer(@Body player: Player): Call<Player>

    @PUT("/api/players/{player_id}")
    fun updatePlayer(@Path("player_id") playerId: String, @Body player: Player): Call<Player>

    @DELETE("/api/players/{player_id}")
    fun deletePlayer(@Path("player_id") playerId: String): Call<Void>

    // Message routes
    @GET("/api/players/{player_id}/messages")
    fun getPlayerMessages(@Path("player_id") playerId: String): Call<ArrayList<Message>>

    @POST("/api/messages")
    fun createMessage(@Body message: Message): Call<Message>

    @DELETE("/api/messages/{message_id}")
    fun deleteMessage(@Path("message_id") messageId: String): Call<Void>



}