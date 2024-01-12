package com.abstratsystems.kwasiadafrankaa.utils

import Player
import android.content.Context
import android.util.Log
import com.abstratsystems.kwasiadafrankaa.models.Message
import com.abstratsystems.kwasiadafrankaa.utils.Instances
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

object InitGameBoardData {
    var onlinePlayers = ArrayList<Player>()
    var messages = ArrayList<Message>()

    fun initOnlinePlayers(){
        Instances.gameApiRequest.getOnlinePlayers()
            .enqueue(object : Callback<ArrayList<Player>> {
                override fun onResponse(
                    call: Call<ArrayList<Player>>,
                    response: Response<ArrayList<Player>>
                ) {
                    if (response.isSuccessful) {

                        onlinePlayers = response.body()!!
                        Log.i("Active Players:", onlinePlayers.toString())


                    } else {
                        Log.i("Failed to get players:", response.toString())
                    }
                }

                override fun onFailure(call: Call<ArrayList<Player>>, t: Throwable) {
                    Log.i("Connection Failed", t.toString())
                }

            })
    }
}