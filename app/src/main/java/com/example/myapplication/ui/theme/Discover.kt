package com.example.myapplication

import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun DiscoverScreen() {
    CenteredText("Discover (placeholder)")
}

@Composable
fun ProfileScreen() {
    CenteredText("Profile (placeholder)")
}

@Composable
fun PlaceholderScreen(text: String) {
    CenteredText(text)
}

@Composable
private fun CenteredText(text: String) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(text = text, style = MaterialTheme.typography.titleMedium)
    }
}