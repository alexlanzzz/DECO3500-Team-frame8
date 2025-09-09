package com.example.myapplication

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun HomeScreen(
    onCreatePlan: () -> Unit,
    onJoinTeam: () -> Unit,
) {
    Column(Modifier.fillMaxSize()) {
        // Menu bar
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "CoTrip",
                style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.ExtraBold)
            )
            Spacer(Modifier.weight(1f))
            IconButton(onClick = { /* TODO settings */ }) {
                Icon(Icons.Outlined.Settings, contentDescription = "Settings")
            }
        }

        // Two main choices
        Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
            FeatureCard(
                title = "Create new trip plan",
                subtitle = "Start a collaborative itinerary",
                onClick = onCreatePlan
            )

            Spacer(Modifier.height(12.dp))

            FeatureCard(
                title = "Join a team",
                subtitle = "Enter a code or accept an invite",
                onClick = onJoinTeam
            )
        }

        // space below
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun FeatureCard(
    title: String,
    subtitle: String,
    onClick: () -> Unit,
) {
    val cardShape = RoundedCornerShape(16.dp)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(170.dp)
            .clip(cardShape)
            .clickable(onClick = onClick)
            .background(
                Brush.linearGradient(
                    listOf(
                        Color(0xFF324B86),
                        Color(0xFF6BA4FF)
                    )
                )
            )
    ) {

        AssistChip(
            onClick = onClick,
            label = { Text("Go") },
            modifier = Modifier.align(Alignment.TopEnd).padding(10.dp)
        )

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(16.dp)
        ) {
            Text(title, style = MaterialTheme.typography.titleLarge.copy(color = Color.White, fontWeight = FontWeight.Bold))
            Spacer(Modifier.height(6.dp))
            Text(subtitle, style = MaterialTheme.typography.bodyMedium.copy(color = Color.White.copy(alpha = 0.9f)))
        }
    }
}