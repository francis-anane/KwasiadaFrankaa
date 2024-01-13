package com.abstratsystems.kwasiadafrankaa.models

import com.google.gson.annotations.SerializedName

data class Message(
    @SerializedName("id") val id: String?,
    @SerializedName("sender_id") val senderId: String,
    @SerializedName("receiver_id") val receiverId: String,
    val content: String,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("updated_at") val updatedAt: String
)