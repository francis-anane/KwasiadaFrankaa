package com.abstratsystems.kwasiadafrankaa

import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.TableLayout
import android.widget.TableRow

//import kotlinx.android.synthetic.main.activity_game.*

class GameActivity: Activity() {
    private lateinit var row0_column0: Button
    private lateinit var row0_column1: Button
    private lateinit var row0_column2: Button
    private lateinit var row1_column0: Button
    private lateinit var row1_column1: Button
    private lateinit var row1_column2: Button
    private lateinit var row2_column0: Button
    private lateinit var row2_column1: Button
    private lateinit var row2_column2: Button
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game)

    }
    private fun initViews(){
        row0_column0 = findViewById(R.id.row0_column0)
        row0_column1 = findViewById(R.id.row0_column1)
        row0_column2 = findViewById(R.id.row0_column2)
        row1_column0 = findViewById(R.id.row1_column0)
        row1_column1 = findViewById(R.id.row1_column1)
        row1_column2 = findViewById(R.id.row1_column2)
        row2_column0 = findViewById(R.id.row2_column0)
        row2_column1 = findViewById(R.id.row2_column1)
        row2_column2 = findViewById(R.id.row2_column2)
    }
}