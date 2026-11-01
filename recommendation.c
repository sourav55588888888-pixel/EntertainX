/*
 * EntertainX - C recommendation engine (console version)
 * Compile: gcc recommendation.c -o entertainx
 * Run:     ./entertainx        (Windows: entertainx.exe)
 *
 * This C program is a standalone demonstration of the recommendation logic.
 * The static HTML website does not call this executable directly.
 * For a live website/C connection, expose this logic through a backend API
 * (for example, a small C HTTP server) or compile the engine to WebAssembly.
 */
#include <stdio.h>
#include <string.h>

#define MAX_ITEMS 30

struct Entertainment {
    int id;
    char name[50];
    char type[20];
    char genre[25];
    float rating;
    int year;
};

void showItems(struct Entertainment items[], int n) {
    int i;
    printf("\n%-3s %-22s %-10s %-14s %-6s %-5s\n",
           "ID", "TITLE", "TYPE", "GENRE", "RATING", "YEAR");
    printf("--------------------------------------------------------------------\n");
    for (i = 0; i < n; i++) {
        printf("%-3d %-22s %-10s %-14s %-6.1f %-5d\n",
               items[i].id, items[i].name, items[i].type,
               items[i].genre, items[i].rating, items[i].year);
    }
}

void sortByRating(struct Entertainment items[], int n) {
    int i, j;
    struct Entertainment temp;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (items[j].rating < items[j + 1].rating) {
                temp = items[j];
                items[j] = items[j + 1];
                items[j + 1] = temp;
            }
        }
    }
}

void recommend(struct Entertainment items[], int n,
               char wantedType[], char wantedGenre[], float minRating) {
    int i, found = 0;
    printf("\n--- Recommended for you ---\n");
    for (i = 0; i < n; i++) {
        int typeMatch = (strcmp(wantedType, "All") == 0 ||
                         strcmp(items[i].type, wantedType) == 0);
        int genreMatch = (strcmp(wantedGenre, "All") == 0 ||
                          strcmp(items[i].genre, wantedGenre) == 0);
        if (typeMatch && genreMatch && items[i].rating >= minRating) {
            printf("%-22s | %-10s | %-14s | Rating %.1f\n",
                   items[i].name, items[i].type,
                   items[i].genre, items[i].rating);
            found = 1;
        }
    }
    if (!found) {
        printf("No matching content. Try another category, genre or rating.\n");
    }
}

void savePreferences(char type[], char genre[], float rating) {
    FILE *fp = fopen("preferences.txt", "w");
    if (fp == NULL) {
        printf("Could not save preferences to file.\n");
        return;
    }
    fprintf(fp, "Category: %s\nGenre: %s\nMinimum rating: %.1f\n",
            type, genre, rating);
    fclose(fp);
    printf("Preferences saved in preferences.txt\n");
}

int main(void) {
    struct Entertainment items[] = {
        {1, "Interstellar", "Movie", "Sci-Fi", 8.7f, 2014},
        {2, "Inception", "Movie", "Thriller", 8.8f, 2010},
        {3, "The Dark Knight", "Movie", "Action", 9.0f, 2008},
        {4, "Dangal", "Movie", "Drama", 8.3f, 2016},
        {5, "Spider-Verse", "Movie", "Animation", 8.6f, 2023},
        {6, "3 Idiots", "Movie", "Comedy", 8.4f, 2009},
        {7, "Breaking Bad", "Series", "Crime", 9.5f, 2008},
        {8, "Dark", "Series", "Sci-Fi", 8.7f, 2017},
        {9, "Stranger Things", "Series", "Sci-Fi", 8.7f, 2016},
        {10, "The Office", "Series", "Comedy", 9.0f, 2005},
        {11, "Panchayat", "Series", "Comedy", 8.9f, 2020},
        {12, "Planet Earth", "Series", "Documentary", 9.4f, 2006},
        {13, "Football", "Sports", "Team Sport", 9.0f, 2026},
        {14, "Cricket", "Sports", "Team Sport", 9.2f, 2026},
        {15, "Formula 1", "Sports", "Motorsport", 8.8f, 2026},
        {16, "Lo-fi Focus", "Music", "Lo-fi", 8.5f, 2026},
        {17, "Indie Discoveries", "Music", "Indie", 8.4f, 2026},
        {18, "Minecraft", "Gaming", "Sandbox", 9.0f, 2011},
        {19, "Rocket League", "Gaming", "Sports", 8.5f, 2015},
        {20, "Chess", "Gaming", "Strategy", 8.7f, 2026}
    };
    int n = (int)(sizeof(items) / sizeof(items[0]));
    int choice;
    char type[20], genre[25];
    float minRating;

    do {
        printf("\n====================================\n");
        printf("          ENTERTAINX - C\n");
        printf("====================================\n");
        printf("1. Show all entertainment\n");
        printf("2. Get recommendations\n");
        printf("3. Show highest-rated first\n");
        printf("4. Save my preferences\n");
        printf("0. Exit\n");
        printf("Enter choice: ");

        if (scanf("%d", &choice) != 1) {
            printf("Invalid input. Restart the program and enter a number.\n");
            return 1;
        }

        switch (choice) {
            case 1:
                showItems(items, n);
                break;
            case 2:
            case 4:
                printf("Category (All/Movie/Series/Sports/Music/Gaming): ");
                scanf("%19s", type);
                printf("Genre (All/Sci-Fi/Comedy/Action/Crime/etc.): ");
                scanf("%24s", genre);
                printf("Minimum rating (0-10): ");
                if (scanf("%f", &minRating) != 1 || minRating < 0 || minRating > 10) {
                    printf("Invalid rating.\n");
                    return 1;
                }
                if (choice == 2) {
                    recommend(items, n, type, genre, minRating);
                } else {
                    savePreferences(type, genre, minRating);
                }
                break;
            case 3:
                sortByRating(items, n);
                showItems(items, n);
                break;
            case 0:
                printf("Thanks for using EntertainX!\n");
                break;
            default:
                printf("Choose a valid menu option.\n");
        }
    } while (choice != 0);

    return 0;
}
