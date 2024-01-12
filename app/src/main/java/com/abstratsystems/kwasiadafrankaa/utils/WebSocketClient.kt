package com.abstratsystems.kwasiadafrankaa.utils

import okhttp3.*
import okio.ByteString

object WebSocketClient {
    private const val WS_URL = "ws://"

    private var webSocket: WebSocket? = null

    fun startWebSocket() {
        val client = OkHttpClient() 
        val request = Request.Builder().url(WS_URL).build()

        val listener = object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                super.onOpen(webSocket, response)
                // WebSocket connection is established
                // You can perform any actions when the connection opens
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
    }
}
