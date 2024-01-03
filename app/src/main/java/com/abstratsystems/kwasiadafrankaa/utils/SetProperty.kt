package com.abstratsystems.kwasiadafrankaa.utils

import android.R
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.view.View
import androidx.appcompat.app.ActionBar
import androidx.appcompat.app.AppCompatActivity


object SetProperty {
    fun actionBarColor(context: Context, colorHex: String){
        // Define ActionBar object
        if (context is AppCompatActivity) {
            val actionBar: ActionBar? = context.supportActionBar
            val colorDrawable = ColorDrawable(Color.parseColor(colorHex))
            // Set BackgroundDrawable of actionbar
            actionBar!!.setBackgroundDrawable(colorDrawable)
        }

    }
    fun actionBarTitle(context: Context, title: String) {
        if (context is AppCompatActivity) {
            val actionBar: ActionBar? = context.supportActionBar
            actionBar?.title = title
        }
    }

    fun homeButtonDisplay(context: Context, value: Boolean){
        if (context is AppCompatActivity){
            val actionBar: ActionBar? = context.supportActionBar
            actionBar?.setDisplayShowHomeEnabled(value)
        }
    }

    fun viewsBackgroundTint(views: List<View>, colorHex: String) {
        val color = Color.parseColor(colorHex)
        for(view in views){
            view.backgroundTintList = ColorStateList.valueOf(color)

        }
        
    }
}

