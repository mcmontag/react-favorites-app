# React Favorites App

A React application built with TypeScript, featuring an extensible favorites system.

## Project Structure

```
src/
├── components/
│   ├── app-shell/          
│   │   ├── App.tsx               # The root content component (the app shell)
│   │   ├── UserMenu.tsx          # Components rendered within <App />
│   │   ├── [...].tsx             
│   │   └── routes/         
│   │       └── routes.ts         # Route extensions used by the app shell
│   ├── core/                 # Reusable core components
│   │   └── FavoritableCard.tsx   # Favorite/unfavorite anything
│   └── pages/                # Page components, corresponding to routes.
│       ├── home/             
│       │   └── HomePage.tsx
│       └── countries/        
│           ├── CountriesPage.tsx
│           └── CountryCard.tsx
├── contexts/              # React contexts
├── lib/                   # "Libraries" for complex domain-specific logic
│   └── favorites-api/     # Hooks + utils to interact with the favorites API
├── queries/               # GraphQL queries and hooks
├── types/                 # Common TypeScript type definitions
└── routes.ts              # Route definitions
```

## API Integrations
The app integrates with two different APIs:

### Countries GraphQL API
- Fetches country data from the public GraphQL API at `https://countries.trevorblades.com`.

### Favorites Backend API
- Uses a custom Express + MongoDB backend (`./backend/`) with a REST API for favorites persistence. Supports user-scoped CR~~U~~D operations, and arbitrary keys for different categories of favorites.

## Development Guidelines
### Installation
```bash
# Clone the repository
git clone <repository-url>
cd react-favorites-app

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

### Backend Requirements
The favorites functionality requires the backend API - an extremely simple Express + MongoDB app - to be running. I opted for this as I felt it was important to actually mutate things.

If you're able to utilize Docker Compose, it's as simple as:
```bash
docker compose up -d
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Adding a page
- Create a `<Something>Page.tsx` component in `/components/pages/<something>/`
- Update `routes.ts` with a new route definition.
- Add an extension for the new route in `route-configs.ts`
- If necessary, add a new `AppNavLink` to the page in the app shell.

</br>
</br>

# Commentary
### Tech Stack
#### UI & Styling
- **Mantine** - Modern React components library
- **Tabler Icons** - Beautiful icon set
- **Emotion** - CSS-in-JS styling

#### Navigation
- **React Router** - Dead-simple routing, made even better with...
- **Type-Safe Routing**: The [react-router-typesafe-routes](https://github.com/fenok/react-router-typesafe-routes) library is used to enforce strict typing of routes + their search params (and state, if that ever became necessary).
- **Data Fetching & Mutations**: Utilizes a few different libraries to interact with external APIs:
  -  `react-query` to query REST APIs
  -  `apollo` for GraphQL queries + mutations
  -  Vanilla `fetch` for `POST` requests to REST APIs
- **Code Quality**: ESLint, Prettier, and TypeScript with opinionated configurations.

### Build + Test Frameworks
- **Vite**
- **Jest + React Testing Library**

## Key Architecture + Implementation Decisions

### Component Organization
The major components fall into three buckets:
  - `app-shell` - layout-related components
  - `core` - generic or generally useful components. In the future, this would be where things like branded/design-approved wrappers around Mantine components would live.
  - `pages` - where verticals live. The top-level components within this category (e.g. `CountriesPage`) could eventually be replaced with dynamically-loaded micro-frontends. Non-page components are localized within their page's sub-directory -- anything that needs to be shared should go in `core` instead.

### State Management Strategy
I'm of the unpopular opinion that state management libraries like Redux are more trouble than they're worth. If state needs to be shared, it should be provided via a Context. `AppContext` is an example of this - it provides user details to the entire app. Localized/domain-specific contexts are easy to work with, and would be easy to plug into the hierarchical structure of `app shell > page > page-specific content` depending on the scope of the data being provided.

### Caching
Ah, yes...everyone's favorite topic.

Nothing to write home about here, honestly. React Query and Apollo were chosen for their intuitive-but-highly-customizable default behaviors.

### Mutation results
You'll notice that I simply refetch after mutating, rather than attempting to merge query state with mutation results is error prone, and fiddling with the cache even moreso. Both Apollo and React Query have ways to solve this problem if there were ever a need for it.

## Todos
### Things I'd do if I weren't already out of time
- Allow `Languages` to be favorited, even though they don't have a page (you can only see them when un-collapsing the relevant section of a country details drawer). I think that'd be a neat way to showcase how generic the tooling around favorites could be.

- Add a `Favorites` page that shows all of your favorites across every category.

- Add more tests! I really only have coverage on major components and a few hooks.

- Add sanity checks (so, *even more* tests), such as:
  - Verify that the app shell doesn't render duplicate nav links
  - Verify that extended route configs don't have duplicate values for things that shouldn't be duplicated (e.g. no two pages should have the same label)

- Persist the selected country in the URL on `CountriesPage`.

- Add a wrapper around search params to make them easier to read and keep in sync. Maybe add a `core` component like `FilterBar`...

## Use of AI
I used Claude Code to:
- Stub out this README (which I then rewrote from scratch)
- Stub out tests (which I then spent an hour fixing)
- Fill in some missing JSDoc (this actually worked pretty well!)

In other words, I did NOT use Claude Code (or any other AI tools) to:
- Write any "user-facing" React code (i.e. aside from tests).
- Write any of the back-end code.