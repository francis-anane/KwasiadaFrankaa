package com.abstratsystems.kwasiadafrankaa

import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.TableLayout
import android.widget.TableRow

//import kotlinx.android.synthetic.main.activity_game.*

class GameActivity: Activity() {
    private lateinit var row0column0: Button
    private lateinit var row0column1: Button
    private lateinit var row0column2: Button
    private lateinit var row1column0: Button
    private lateinit var row1column1: Button
    private lateinit var row1column2: Button
    private lateinit var row2column0: Button
    private lateinit var row2column1: Button
    private lateinit var row2column2: Button
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game)

    }
    private fun initViews(){
        row0column0 = findViewById(R.id.row0_column0)
        row0column1 = findViewById(R.id.row0_column1)
        row0column2 = findViewById(R.id.row0_column2)
        row1column0 = findViewById(R.id.row1_column0)
        row1column1 = findViewById(R.id.row1_column1)
        row1column2 = findViewById(R.id.row1_column2)
        row2column0 = findViewById(R.id.row2_column0)
        row2column1 = findViewById(R.id.row2_column1)
        row2column2 = findViewById(R.id.row2_column2)
    }
}