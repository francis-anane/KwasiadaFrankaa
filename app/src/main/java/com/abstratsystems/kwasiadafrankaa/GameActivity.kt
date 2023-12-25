package com.abstratsystems.kwasiadafrankaa

import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.TableLayout
import android.widget.TableRow

//import kotlinx.android.synthetic.main.activity_game.*

class GameActivity: Activity() {

    private lateinit var board_layout: TableLayout
    private lateinit var table_row0: TableRow
    private lateinit var table_row1: TableRow
    private lateinit var table_row2: TableRow
    private lateinit var table_row0_column0: Button
    private lateinit var table_row0_column1: Button
    private lateinit var table_row0_column2: Button
    private lateinit var table_row1_column0: Button
    private lateinit var table_row1_column1: Button
    private lateinit var table_row1_column2: Button
    private lateinit var table_row2_column0: Button
    private lateinit var table_row2_column1: Button
    private lateinit var table_row2_column2: Button
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game)

    }
    private fun initViews(){
        board_layout = findViewById(R.id.board_layout)
        table_row0 = findViewById(R.id.row0)
        table_row1 = findViewById(R.id.row1)
        table_row2 = findViewById(R.id.row2)
        table_row0_column0 = findViewById(R.id.row0_column0)
        table_row0_column1 = findViewById(R.id.row0_column1)
        table_row0_column2 = findViewById(R.id.row0_column2)
        table_row1_column0 = findViewById(R.id.row1_column0)
        table_row1_column1 = findViewById(R.id.row1_column1)
        table_row1_column2 = findViewById(R.id.row1_column2)
        table_row2_column0 = findViewById(R.id.row2_column0)
        table_row2_column1 = findViewById(R.id.row2_column1)
        table_row2_column2 = findViewById(R.id.row2_column2)
    }
}