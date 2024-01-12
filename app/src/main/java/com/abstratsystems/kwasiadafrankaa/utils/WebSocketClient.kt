package com.abstratsystems.kwasiadafrankaa.utils

import android.util.Log
import okhttp3.*
import okio.ByteString

object WebSocketClient {
    private const val WS_URL = "ws://192.168.110.1:3000/api"

    private var webSocket: WebSocket? = null
    private var eventListener: WebSocketEventListener? = null

    interface WebSocketEventListener {
        fun onCustomEvent(event: String)
    }

    fun sendCustomEvent(eventData: String) {
        val customEventMessage = "CUSTOM_EVENT:$eventData"
        webSocket?.send(customEventMessage)
    }

    fun setEventListener(listener: WebSocketEventListener) {
        eventListener = listener
    }

    fun startWebSocket() {
        val client = OkHttpClient()
        val request = Request.Builder().url(WS_URL).build()

        val listener = object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                super.onOpen(webSocket, response)
                // WebSocket connection is established
                // You can perform any actions when the connection opens
                Log.d("WebSocket", "Connection opened")
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                super.onMessage(webSocket, text)
                // Handle text message received from the server
                handleMessage(text)
            }

            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
                super.onMessage(webSocket, bytes)
                // Handle binary message received from the server
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                super.onClosing(webSocket, code, reason)
                // WebSocket is closing
                // You can perform any cleanup actions here
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                super.onFailure(webSocket, t, response)
                // Handle connection failure
                Log.e("WebSocket", "Connection failed", t)
            }
        }

        webSocket = client.newWebSocket(request, listener)
    }

    fun sendMessage(message: String) {
        webSocket?.send(message)
    }

    fun stopWebSocket() {
        webSocket?.close(1000, "Connection closed")
    }

    private fun handleMessage(message: String) {
        // Handle incoming messages from the WebSocket server
        // Check if the message is a custom event and notify the listener
        if (message.startsWith("CUSTOM_EVENT:")) {
            val eventData = message.removePrefix("CUSTOM_EVENT:")
            eventListener?.onCustomEvent(eventData)
        }
    }
}
