package com.abstratsystems.kwasiadafrankaa

import GameApiRequests
import Player
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.abstratsystems.kwasiadafrankaa.utils.AbstratBackgroundRunner
import com.abstratsystems.kwasiadafrankaa.utils.InitGameBoardData
import com.abstratsystems.kwasiadafrankaa.utils.Instances
import com.abstratsystems.org.utils.PlayerIdIO
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PlayerSetupActivity : AppCompatActivity() {
    private lateinit var playerNameEditText: EditText
    private lateinit var playerPasswordEditText: EditText
    private lateinit var confirmPasswordEditText: EditText
    private lateinit var saveButton: Button
    private lateinit var editTextTextEmailAddress: EditText
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player_setup)
        initViews()

        saveButton.setOnClickListener {
            val playerName: String = playerNameEditText.text.toString()
            val email: String = editTextTextEmailAddress.text.toString()
            val password: String = playerPasswordEditText.text.toString()
            val confirmPassword: String = confirmPasswordEditText.text.toString()


            if(playerName != "" && email != "" && password != "" && confirmPassword != ""){
                if(password == confirmPassword){
                    Instances.player.name = playerName
                    Instances.player.email = email
                    Instances.player.password = password
                    Log.i("Player: ", Instances.player.toString())
                    // Execute in the background
                    AbstratBackgroundRunner.runInBackground({

                        Instances.gameApiRequest.createPlayer(Instances.player).enqueue(object:
                            Callback<Player> {
                            override fun onResponse(call: Call<Player>, response: Response<Player>) {
                                if (response.isSuccessful) {
                                    val player = response.body()
                                    if (player != null) {
                                        Log.i("Response", player.toString())
                                        PlayerIdIO.writeId(PlayerIdIO.appStoragePath(this@PlayerSetupActivity) + "/player_id.txt", player.playerId!!)
                                        emptyFields() // clear entry fields
                                        startActivity(Intent(this@PlayerSetupActivity, GameActivity::class.java))
                                        Instances.gameApiRequest.getPlayer(player.playerId!!).enqueue(object: Callback<Player> {
                                            override fun onResponse(call: Call<Player>, response: Response<Player>) {
                                                if (response.isSuccessful) {
                                                     val player = response.body()
                                                    if (player != null) {
                                                        Instances.player = player;
                                                        Log.i("Response",
                                                            Instances.player.toString()
                                                        )
                                                        // Initialize online players
                                                        InitGameBoardData.initOnlinePlayers()
                                                    }else{
                                                        Log.i("Null Responds", "Got nothing")
                                                    }
                                                }else{
                                                    // Handle error cases here
                                                    val errorCode = response.code()
                                                    val errorMessage = response.message()
                                                    // Handle the error code and message appropriately
                                                    println("ErrorCode $errorCode")
                                                    println("ErrorMessage $errorMessage")
                                                }
                                            }

                                            override fun onFailure(
                                                call: Call<Player>,
                                                t: Throwable
                                            ) {
                                                Log.i("FAILED TO CONNECT", t.toString())
                                            }
                                        })

                                    } else {
                                        // Handle the case where the response body is null
                                        Log.i("Null:", "Got nothing")
                                    }
                                } else {
                                    // Handle error cases here
                                    val errorCode = response.code()
                                    val errorMessage = response.message()
                                    // Handle the error code and message appropriately
                                    println("ErrorCode $errorCode")
                                    println("ErrorMessage $errorMessage")
                                }
                            }

                            override fun onFailure(call: Call<Player>, t: Throwable) {
                                // Handle network errors or request failure
                                Log.i("FAILED TO CONNECT", t.toString())
                            }
                        })
                    }

                    ){}

                }
                else{
                    Toast.makeText(this, "Password Mismatch", Toast.LENGTH_SHORT).show()
                }
            }
            else{
                Toast.makeText(this, "All fields required!", Toast.LENGTH_SHORT).show()
            }
        }

    }
    private fun initViews(){
        playerNameEditText = findViewById(R.id.editTextPlayerName)
        playerPasswordEditText = findViewById(R.id.editTextPlayerPassword)
        confirmPasswordEditText = findViewById(R.id.editTextConfirmPassword)
        saveButton = findViewById(R.id.saveButton)
        editTextTextEmailAddress = findViewById(R.id.editTextTextEmailAddress)

    }

    // clear entry fields
    private fun emptyFields(){
        playerNameEditText.text.clear()
        playerPasswordEditText.text.clear()
        confirmPasswordEditText.text.clear()
        saveButton = findViewById(R.id.saveButton)
        editTextTextEmailAddress.text.clear()

    }
}