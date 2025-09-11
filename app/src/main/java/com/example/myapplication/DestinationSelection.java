package com.example.myapplication;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.content.ContextCompat;

public class DestinationSelection extends AppCompatActivity {
    private static final String TAG = "DestinationSelection";
    private static final int MAX_SWIPES = 20;
    private static final float SWIPE_THRESHOLD = 200f; // Reduced threshold for easier swiping

    private CardView destinationCard;
    private TextView tvCounter;
    private TextView tvCityName;
    private TextView tvDateRange;
    private TextView tvDestinationName;
    private TextView tvDescription;
    private TextView tvRating;
    private TextView tvPrice;
    private TextView tvAddress;
    private ImageView ivDestinationImage;
    private ImageView ivStarIcon;
    private ImageButton btnBack;
    private ImageButton btnInfo;
    private FrameLayout cardContainer;

    private GestureDetector gestureDetector;
    private int currentSwipeCount = 1;

    // Sample destination data
    private String[] destinationNames = {
            "Sunnybank Hotel", "Brisbane River Cruise", "Story Bridge Adventure",
            "Queensland Museum", "Lone Pine Koala Sanctuary", "South Bank Parklands",
            "Mount Coot-tha Lookout", "GOMA Gallery", "Brisbane Botanic Gardens",
            "Kangaroo Point Cliffs", "Eagle Street Pier", "Queen Street Mall",
            "Roma Street Parkland", "Fortitude Valley", "New Farm Park",
            "Redcliffe Peninsula", "Moreton Island", "Gold Coast Day Trip",
            "Sunshine Coast Tour", "Lamington National Park"
    };

    private String[] descriptions = {
            "Unassuming roadside property featuring a steakhouse with a sports bar, as well as free parking.",
            "Scenic river cruise showcasing Brisbane's iconic landmarks and beautiful cityscape views.",
            "Thrilling bridge climb experience offering panoramic views of Brisbane city and surrounds.",
            "Fascinating museum with natural history exhibits, planetarium shows and interactive displays.",
            "World-famous koala sanctuary where you can cuddle koalas and hand-feed kangaroos.",
            "Contemporary art gallery featuring modern exhibitions and creative displays.",
            "Stunning panoramic views of Brisbane city and surrounding landscapes.",
            "Interactive science museum with planetarium and educational exhibits.",
            "Beautiful botanical gardens with diverse plant collections and peaceful walks.",
            "Adventure climbing experience with breathtaking river and city views.",
            "Vibrant dining and entertainment precinct along the Brisbane River.",
            "Premier shopping destination in the heart of Brisbane's CBD.",
            "Large parkland featuring gardens, lakes and recreational facilities.",
            "Trendy entertainment district known for live music and nightlife.",
            "Riverside park perfect for picnics, walks and outdoor activities.",
            "Coastal peninsula offering beaches, seafood and seaside attractions.",
            "World's third largest sand island with unique ecosystems and adventures.",
            "Day trip to famous beaches, theme parks and coastal attractions.",
            "Scenic coastal region with beaches, markets and natural beauty.",
            "UNESCO World Heritage rainforest with hiking trails and wildlife."
    };

    private float[] ratings = {4.9f, 4.7f, 4.8f, 4.5f, 4.6f, 4.3f, 4.8f, 4.4f, 4.7f, 4.9f, 4.2f, 4.1f, 4.5f, 4.0f, 4.6f, 4.3f, 4.8f, 4.4f, 4.7f, 4.9f};

    private String[] prices = {
            "AU$100", "AU$45", "AU$89", "AU$25", "AU$35",
            "AU$15", "AU$12", "AU$20", "AU$8", "AU$75",
            "AU$50", "AU$0", "AU$6", "AU$30", "AU$5",
            "AU$40", "AU$120", "AU$85", "AU$60", "AU$25"
    };

    private String[] addresses = {
            "555 Lang St, St Lucia", "Brisbane River", "Story Bridge",
            "South Bank", "Lone Pine Sanctuary", "South Bank Parklands",
            "Mount Coot-tha", "Stanley Place", "Brisbane Botanic Gardens",
            "Kangaroo Point", "Eagle Street Pier", "Queen Street Mall",
            "Roma Street", "Fortitude Valley", "New Farm Park",
            "Redcliffe Peninsula", "Moreton Island", "Gold Coast",
            "Sunshine Coast", "Lamington National Park"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.destination_selection);

        Log.d(TAG, "onCreate: Starting DestinationSelection");

        initViews();
        setupGestureDetector();
        setupClickListeners();
        updateDestinationInfo();
        updateCounter();
    }

    private void initViews() {
        Log.d(TAG, "initViews: Initializing all views");

        destinationCard = findViewById(R.id.destination_card);
        cardContainer = findViewById(R.id.card_container);
        tvCounter = findViewById(R.id.tv_counter);
        tvCityName = findViewById(R.id.tv_city_name);
        tvDateRange = findViewById(R.id.tv_date_range);
        tvDestinationName = findViewById(R.id.tv_destination_name);
        tvDescription = findViewById(R.id.tv_description);
        tvRating = findViewById(R.id.tv_rating);
        tvPrice = findViewById(R.id.tv_price);
        tvAddress = findViewById(R.id.tv_address);
        ivDestinationImage = findViewById(R.id.iv_destination_image);
        ivStarIcon = findViewById(R.id.star_icon);
        btnBack = findViewById(R.id.btn_back);
        btnInfo = findViewById(R.id.btn_info);

        Log.d(TAG, "initViews: Card found: " + (destinationCard != null));
        Log.d(TAG, "initViews: Container found: " + (cardContainer != null));
    }

    private void setupGestureDetector() {
        Log.d(TAG, "setupGestureDetector: Setting up gesture detection");

        gestureDetector = new GestureDetector(this, new GestureDetector.SimpleOnGestureListener() {
            private float totalScrollX = 0f;
            private boolean swipeTriggered = false;

            @Override
            public boolean onDown(MotionEvent e) {
                Log.d(TAG, "Gesture: onDown");
                totalScrollX = 0f;
                swipeTriggered = false;
                return true; // Important: return true to continue processing
            }

            @Override
            public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX, float distanceY) {
                if (e1 != null && e2 != null && !swipeTriggered) {
                    totalScrollX = e2.getX() - e1.getX();
                    float totalScrollY = Math.abs(e2.getY() - e1.getY());

                    Log.d(TAG, "Gesture: onScroll totalScrollX=" + totalScrollX + ", totalScrollY=" + totalScrollY);

                    // Check if horizontal scroll distance exceeds threshold and is more horizontal than vertical
                    if (Math.abs(totalScrollX) > SWIPE_THRESHOLD && Math.abs(totalScrollX) > totalScrollY) {
                        swipeTriggered = true; // Prevent multiple triggers

                        if (totalScrollX > 0) {
                            Log.d(TAG, "Gesture: Scroll RIGHT detected (distance: " + totalScrollX + ")");
                            onSwipeRight();
                        } else {
                            Log.d(TAG, "Gesture: Scroll LEFT detected (distance: " + totalScrollX + ")");
                            onSwipeLeft();
                        }
                        return true;
                    }
                }
                return true;
            }

            @Override
            public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
                Log.d(TAG, "Gesture: onFling called");

                if (e1 == null || e2 == null || swipeTriggered) {
                    Log.d(TAG, "Gesture: e1/e2 null or swipe already triggered");
                    return false;
                }

                float deltaX = e2.getX() - e1.getX();
                float deltaY = Math.abs(e2.getY() - e1.getY());

                Log.d(TAG, "Gesture: onFling deltaX=" + deltaX + ", deltaY=" + deltaY + ", threshold=" + SWIPE_THRESHOLD);

                if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > deltaY) {
                    swipeTriggered = true;

                    if (deltaX > 0) {
                        Log.d(TAG, "Gesture: Fling RIGHT detected");
                        onSwipeRight();
                    } else {
                        Log.d(TAG, "Gesture: Fling LEFT detected");
                        onSwipeLeft();
                    }
                    return true;
                }
                Log.d(TAG, "Gesture: No fling swipe detected");
                return false;
            }
        });

        // Create a comprehensive touch listener with debug logging
        View.OnTouchListener debugTouchListener = new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                String action = "";
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        action = "DOWN";
                        break;
                    case MotionEvent.ACTION_MOVE:
                        action = "MOVE";
                        break;
                    case MotionEvent.ACTION_UP:
                        action = "UP";
                        break;
                    case MotionEvent.ACTION_CANCEL:
                        action = "CANCEL";
                        break;
                }
                Log.d(TAG, "Touch: " + action + " on " + v.getClass().getSimpleName() +
                        " at (" + event.getX() + ", " + event.getY() + ")");

                boolean result = gestureDetector.onTouchEvent(event);
                Log.d(TAG, "Touch: Gesture detector returned: " + result);
                return result;
            }
        };

        // Apply touch listener to multiple views to ensure it works
        if (cardContainer != null) {
            Log.d(TAG, "Setting touch listener on cardContainer");
            cardContainer.setOnTouchListener(debugTouchListener);
        }

        if (destinationCard != null) {
            Log.d(TAG, "Setting touch listener on destinationCard");
            destinationCard.setOnTouchListener(debugTouchListener);
        }

        // Also try with the content overlay
        LinearLayout contentOverlay = findViewById(R.id.content_overlay);
        if (contentOverlay != null) {
            Log.d(TAG, "Setting touch listener on contentOverlay");
            contentOverlay.setOnTouchListener(debugTouchListener);
        }

        // Make sure buttons don't interfere with swiping
        if (btnInfo != null) {
            btnInfo.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    if (event.getAction() == MotionEvent.ACTION_DOWN) {
                        Log.d(TAG, "Info button touched");
                        return false; // Let the button handle its own clicks
                    }
                    return false;
                }
            });
        }
    }

    private void setupClickListeners() {
        Log.d(TAG, "setupClickListeners: Setting up button clicks");

        if (btnBack != null) {
            btnBack.setOnClickListener(v -> {
                Log.d(TAG, "Back button clicked");
                onBackPressed();
            });
        }

        if (btnInfo != null) {
            btnInfo.setOnClickListener(v -> {
                Log.d(TAG, "Info button clicked");
                Toast.makeText(this, "Navigate to detail page", Toast.LENGTH_SHORT).show();
            });
        }
    }

    private void onSwipeLeft() {
        Log.d(TAG, "onSwipeLeft: User rejected destination");
        animateCardExit(-1000f);
        Toast.makeText(this, "Not interested", Toast.LENGTH_SHORT).show();
        proceedToNextDestination();
    }

    private void onSwipeRight() {
        Log.d(TAG, "onSwipeRight: User liked destination");
        animateCardExit(1000f);
        Toast.makeText(this, "Added to your trip!", Toast.LENGTH_SHORT).show();
        proceedToNextDestination();
    }

    private void animateCardExit(float translationX) {
        Log.d(TAG, "animateCardExit: Starting animation with translation " + translationX);

        if (destinationCard == null) {
            Log.e(TAG, "animateCardExit: destinationCard is null!");
            return;
        }

        ObjectAnimator translateX = ObjectAnimator.ofFloat(destinationCard, "translationX", 0f, translationX);
        ObjectAnimator alpha = ObjectAnimator.ofFloat(destinationCard, "alpha", 1f, 0f);
        ObjectAnimator rotation = ObjectAnimator.ofFloat(destinationCard, "rotation", 0f, translationX > 0 ? 30f : -30f);

        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(translateX, alpha, rotation);
        animatorSet.setDuration(300);

        animatorSet.addListener(new android.animation.AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(android.animation.Animator animation) {
                Log.d(TAG, "Animation completed");
                resetCardPosition();
            }
        });

        animatorSet.start();
    }

    private void resetCardPosition() {
        Log.d(TAG, "resetCardPosition: Resetting card to original position");
        if (destinationCard != null) {
            destinationCard.setTranslationX(0f);
            destinationCard.setAlpha(1f);
            destinationCard.setRotation(0f);
        }
    }

    private void proceedToNextDestination() {
        currentSwipeCount++;
        Log.d(TAG, "proceedToNextDestination: Moving to " + currentSwipeCount + "/" + MAX_SWIPES);

        if (currentSwipeCount > MAX_SWIPES) {
            navigateToAgreementPage();
        } else {
            updateDestinationInfo();
            updateCounter();
        }
    }

    private void updateDestinationInfo() {
        int index = (currentSwipeCount - 1) % destinationNames.length;
        Log.d(TAG, "updateDestinationInfo: Updating to destination " + index + ": " + destinationNames[index]);

        if (tvDestinationName != null) {
            tvDestinationName.setText(destinationNames[index]);
        }

        if (index < descriptions.length && tvDescription != null) {
            tvDescription.setText(descriptions[index]);
        }

        if (index < ratings.length && tvRating != null) {
            float rating = ratings[index];
            tvRating.setText(String.valueOf(rating));

            if (ivStarIcon != null) {
                int ratingColor = getRatingColor(rating);
                ivStarIcon.setColorFilter(ratingColor, PorterDuff.Mode.SRC_IN);
                tvRating.setTextColor(ratingColor);
            }
        }

        if (index < prices.length && tvPrice != null) {
            tvPrice.setText(prices[index] + " / person");
        }

        if (index < addresses.length && tvAddress != null) {
            tvAddress.setText(addresses[index]);
        }
    }

    private int getRatingColor(float rating) {
        if (rating >= 4.5f) {
            return Color.parseColor("#4CAF50");
        } else if (rating >= 4.0f) {
            return Color.parseColor("#FF9800");
        } else if (rating >= 3.0f) {
            return Color.parseColor("#FF5722");
        } else {
            return Color.parseColor("#F44336");
        }
    }

    private void updateCounter() {
        if (tvCounter != null) {
            tvCounter.setText(currentSwipeCount + "/" + MAX_SWIPES);
        }
    }

    private void navigateToAgreementPage() {
        Log.d(TAG, "navigateToAgreementPage: All destinations completed");
        Toast.makeText(this, "All destinations selected! Moving to agreement page.", Toast.LENGTH_LONG).show();
    }

    public void setTripData(String cityName, String dateRange) {
        Log.d(TAG, "setTripData: Setting city=" + cityName + ", dates=" + dateRange);
        if (tvCityName != null) {
            tvCityName.setText(cityName);
        }
        if (tvDateRange != null) {
            tvDateRange.setText(dateRange);
        }
    }
}