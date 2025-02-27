# .windsurfrules

## Project Overview

*   **Type:** windsurf_file
*   **Description:** Sudoku Demon is a feature-rich mobile app aimed at Sudoku enthusiasts, especially young users, offering multiple difficulty levels, daily challenges, a clean and intuitive interface, and intelligent gameplay enhanced by GPT-4 integration for dynamic puzzle generation and smart hints. The app utilizes social logins and Supabase for secure user and game state management.
*   **Primary Goal:** Deliver a seamless and engaging Sudoku experience by leveraging GPT-4 for dynamic puzzle generation and intelligent hints, while ensuring a secure and kid-friendly interface.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   [React Native]: Use a dedicated 'screens' directory to host route components, e.g. 'src/screens/HomeScreen.tsx', 'src/screens/GameScreen.tsx', 'src/screens/AuthScreen.tsx'.
    *   Example 1: "React Navigation" → Utilize 'src/screens/{ScreenName}.tsx' in a stack navigator setup to streamline mobile routing.
    *   Example 2: "React Navigation with Deep Linking" → Implement 'src/navigation/RootNavigator.tsx' to manage routing logic and enhance app flow integration.

### Core Directories

*   **Versioned Structure:**

    *   [src/screens]: Contains all screen components such as Home, Game, Settings, and Leaderboard, organized by navigation flow.
    *   [src/components]: Houses shared UI elements and custom components, following best practices adapted from Shadcn UI for mobile interfaces.

### Key Files

*   **Stack-Versioned Patterns:**

    *   [src/navigation/RootNavigator.tsx]: Implements the React Navigation stack and routing logic for a cohesive navigation experience.
    *   [src/screens/AuthScreen.tsx]: Custom screen dedicated to social login authentication (Google, Facebook, Instagram) for secure user onboarding.

## Tech Stack Rules

*   **Version Enforcement:**

    *   [react-native@latest]: Utilize the latest stable release of React Native, ensuring the navigation and UI components adhere to mobile best practices.
    *   [supabase@latest]: Enforce integration with Supabase for secure and efficient backend operations, including user profile and game state management.

## PRD Compliance

*   **Non-Negotiable:**

    *   "The integration of GPT-4 not only generates unique puzzles but also provides intelligent hints and solving techniques" : Must enforce a dynamic puzzle generation and smart hint system powered by GPT-4, as specified in the PRD.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Example: "React Native Auth Flow → src/screens/AuthScreen.tsx initiating social authentication, followed by navigation to HomeScreen for main menu options"
