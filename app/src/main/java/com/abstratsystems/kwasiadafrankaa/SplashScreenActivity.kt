package com.abstratsystems.kwasiadafrankaa

import Player
import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.abstratsystems.kwasiadafrankaa.utils.AbstratBackgroundRunner
import com.abstratsystems.kwasiadafrankaa.utils.AbstratHelperClass
import com.abstratsystems.kwasiadafrankaa.utils.InitGameBoardData
import com.abstratsystems.kwasiadafrankaa.utils.Instances
import com.abstratsystems.kwasiadafrankaa.utils.Instances.player
import com.abstratsystems.org.utils.PlayerIdIO
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

@SuppressLint("CustomSplashScreen")
class SplashScreenActivity : AppCompatActivity() {

    // Executes when the activity is created
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Define the required permissions
        val permissions = arrayListOf(
            android.Manifest.permission.READ_EXTERNAL_STORAGE,
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
            android.Manifest.permission.INTERNET,
        )

        // Request needed permissions for the app
        AbstratHelperClass.App.requestPermissions(permissions, this, 1)



        // Read player ID from storage
        val id = PlayerIdIO.readId(PlayerIdIO.appStoragePath(this) + "/player_id.txt")

        // Check if player ID exists
        if (id == "") {
            // If player ID does not exist, navigate to PlayerSetupActivity
            startActivity(Intent(this@SplashScreenActivity, PlayerSetupActivity::class.java))
        } else {
            // If player ID exists, make a background API request to get player data
            AbstratBackgroundRunner.runInBackground({
                Instances.gameApiRequest.getPlayer(id).enqueue(object : Callback<Player> {
                    override fun onResponse(call: Call<Player>, response: Response<Player>) {
                        if (response.isSuccessful) {
                            // Handle successful response
                            val player = response.body()
                            if (player != null) {
                                Instances.player = player
                                Log.i("Response", Instances.player.toString())
                                // Initialize online players
                                InitGameBoardData.initOnlinePlayers()

                            } else {
                                Log.i("Null Responds", "Got nothing")
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
                        // Handle failure to connect to the API
                        Log.i("FAILED TO CONNECT", t.toString())
                    }
                })
            }) {}

            // After API request, navigate to GameActivity
            startActivity(Intent(this@SplashScreenActivity, GameActivity::class.java))
        }

        // Finish the activity
        finish()
    }
}
