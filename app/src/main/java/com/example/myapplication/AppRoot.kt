package com.example.myapplication

import android.content.Intent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import androidx.navigation.NavHostController

sealed class Screen(val route: String, val label: String) {
    data object Home : Screen("home", "Home")
    data object Discover : Screen("discover", "Discover")
    data object Profile : Screen("profile", "Profile")

    //
    data object CreatePlan : Screen("create_plan", "Create Plan")
    data object JoinTeam : Screen("join_team", "Join Team")
}

@Composable
fun AppRoot() {
    val navController = rememberNavController()
    val context = LocalContext.current

    val bottomItems = listOf(Screen.Home, Screen.Discover, Screen.Profile)

    Scaffold(
        bottomBar = {
            NavigationBar {
                val currentRoute = currentBackStackRoute(navController)
                bottomItems.forEach { screen ->
                    NavigationBarItem(
                        selected = currentRoute == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            when (screen) {
                                Screen.Home -> Icon(Icons.Outlined.Home, contentDescription = null)
                                Screen.Discover -> Icon(Icons.Outlined.Explore, contentDescription = null)
                                Screen.Profile -> Icon(Icons.Outlined.AccountCircle, contentDescription = null)
                                else -> {}
                            }
                        },
                        label = { Text(screen.label) }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onCreatePlan = { navController.navigate(Screen.CreatePlan.route) },
                    onJoinTeam = { navController.navigate(Screen.JoinTeam.route) }
                )
            }
            composable(Screen.Discover.route) { DiscoverScreen() }
            composable(Screen.Profile.route) { ProfileScreen() }

            composable(Screen.CreatePlan.route) {
                LaunchedEffect(Unit) {
                    val intent = Intent(context, DestinationSelection::class.java)
                    context.startActivity(intent)
                    navController.popBackStack()
                }

                // Show loading while launching activity
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            composable(Screen.JoinTeam.route) { PlaceholderScreen("Join a team (placeholder)") }
        }
    }
}

@Composable
private fun currentBackStackRoute(navController: NavHostController): String? {
    val backStackEntry by navController.currentBackStackEntryAsState()
    return backStackEntry?.destination?.route
}