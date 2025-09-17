# Product Requirement Document (PRD)

## Product: Bookshelf Web App

### Overview

The Bookshelf Web App is a personal digital bookshelf that allows users to manage their reading list by adding, categorizing, rating, and annotating books. The app provides a clean and intuitive interface for organizing books into categories such as **Currently Reading**, **Read**, and **Wish List**. Users can track progress, make notes, and search within their collection.

---

### Goals

1. Provide users with a central place to organize their reading journey.
2. Allow tracking of reading progress and ratings to encourage engagement.
3. Simplify the process of adding, categorizing, and discovering books.
4. Provide a clean UI with a focus on usability and readability.

---

### Key Features

#### 1. **Book Management**

* Add a new book via an overlay form.
* Input fields include:

  * Title
  * Author
  * Cover image URL
  * Notes (thoughts or excerpts)
  * Status (Reading, Read, Wish List)
  * Rating (1–5 stars)
  * Progress (%)
* Automatically set progress to **100%** when status is **Read**.

#### 2. **Categorization & Views**

* Dedicated **Currently Reading** section displayed at the top, under the navigation bar.
* Tabs for filtering:

  * All Books
  * Read
  * Wish List
* Tabs are left-aligned for clarity.

#### 3. **Search**

* Search bar in the top navigation.
* Supports keyword search by book title or author.

#### 4. **Ratings & Notes**

* Star-based rating system:

  * Filled stars for rated points.
  * Empty (gray) stars for unrated.
  * Interactive rating selection when adding a new book.
* Notes section supports text input for annotations, quotes, or reflections.

#### 5. **Progress Tracking**

* Each book in **Currently Reading** displays a progress bar.
* Users can input progress (%) manually when adding or editing a book.
* Progress input is disabled if status = Read (auto-set to 100%).

---

### Non-Goals

* Social sharing features (e.g., sharing booklists publicly).
* Integration with external book databases (e.g., Goodreads, Google Books).
* Multi-user library management.

---

### User Stories

1. As a user, I want to **add a new book** with details so I can organize my reading list.
2. As a user, I want to **filter books by status** (All, Read, Wish List) so I can quickly find them.
3. As a user, I want to **see my current reading progress** so I can track how much I’ve read.
4. As a user, I want to **rate and review books** so I can remember my impressions.
5. As a user, when I set a book’s status to **Read**, I want the progress to auto-complete to **100%**.

---

### UI/UX Requirements

* Clean and modern card-based layout for books.
* Responsive grid layout (1–3 columns depending on screen size).
* Tabs for filtering should be visually distinct and left-aligned.
* Dialog overlay for adding books should be minimal and uncluttered.
* Progress bar should be styled with rounded corners and a primary green color.

---

### Technical Requirements

* Built with React and Tailwind CSS.
* Use **shadcn/ui** components for buttons, inputs, tabs, dialogs, and cards.
* Icons from **lucide-react**.
* State managed with React hooks.
* Data stored in component state (initially hardcoded, later extendable to external storage).

---

### Future Enhancements (Not in MVP)

* Edit and delete existing books.
* Sync with external APIs (e.g., Goodreads or OpenLibrary).
* Add categories, tags, or genres for advanced filtering.
* Dark mode support.
* Export/import bookshelf data.

---

### Success Metrics

* MVP success: User can add, filter, search, rate, and track progress for books.
* User engagement measured by number of books added and frequency of status updates.
* Positive user feedback on clarity and usability of UI.

---

### Risks & Assumptions

* Assumes users will manually enter book details.
* Assumes no backend integration in MVP.
* Risk of data loss if local state is cleared (no persistent storage initially).

---

**End of PRD**

