# Movieland Code Review

## Tech stack and structure of the project

* Use React with Typescript, because of the next advantages:

    * Improved Code Quality, since provides optional static typing, which helps us to detect errors and bugs before runtime.
    * Enhanced IDE support, since comes with improved tooling support and features such as auto-completion, refactoring, and error highlighting, which enhances the developer's productivity and code readability.
    * Scalability since is well suited for large-scale projects and applications, where managing and maintaining code becomes more complex as the application grows in size.


* We could add `ESLint`, which is a popular tool for linting JavaScript code.
  It helps developers to identify and fix common errors and problems in their code, such as syntax errors, potential bugs, and code style violations.
  We can use `eslint` `eslint-plugin-react` `eslint-plugin-react-hooks` and use popular style guides for React projects like Airbnb or Standard.


* It would be nice to add `Prettier` as well, which is a code formatter that automatically can format our code to follow a set of rules or conventions, based on a configuration file.  Prettier enforces a consistent code style and reduces the amount of time we spend manually formatting our code. It has a set of default rules that can be overridden or extended in our configuration file.


* It would be nice to create a component folder inside of the `components` directory and have there the respective styles and test files.
  All groups together will improve accessibility and readability.


## Generic stuff

* Avoid namings like `myClickHandler` https://github.com/E-Tarik/coding-assignment/blob/master/src/components/Movie.jsx#L15 that does not tell us anything. We should define namings are auto self-explanatory and follow the react convention having the prefix `handleClose...`.


* Avoid duplicated code and reuse as much as possible like [Movie.jsx:29](https://github.com/E-Tarik/coding-assignment/blob/master/src/components/Movie.jsx#L29),
  [Movie.jsx:35](https://github.com/E-Tarik/coding-assignment/blob/master/src/components/Movie.jsx#L35), [Movie.jsx:51](https://github.com/E-Tarik/coding-assignment/blob/master/src/components/Movie.jsx#L51).


We can create a helper fn to reuse the logic improving the readability, scalability, and maintainability.


* Avoid having commented code like [here](https://github.com/E-Tarik/coding-assignment/blob/master/src/test/watchLater.test.js#L19&L23) because can cause confusion for developers.


## constants.js

We should not expose sensitive/private information on a [constants.js](https://github.com/E-Tarik/coding-assignment/blob/master/src/constants.js) file.

* It should be stored as a secret. The secrets are environment variables with extra security to protect their values.
  Any environment variables that define sensitive or private information (such as credentials) should be stored as secrets.


* Defined unused constant `ENDPOINT_MOVIE` https://github.com/E-Tarik/coding-assignment/blob/master/src/constants.js#L5
  Avoid defining stuff will not be used and it can be prevented by `ESLint` mentioned previously.


* The URL endpoints defined on the `constants.js` file, might be moved much better into an `urls.js` file and for sure parametrize the query string params (make them dynamic because they are being defined statically which implies we could not reuse them if the requirements are changed. For instance, if we would like to get discover movies in ascending order).


* It could be created a `services` folder (to package all this logic into a reusable function that we can call on any component that needs to fetch data.) to have there our API calls and separate it from the store. We can also have there the `urls.js` which will contain the different endpoints we will need to call.
  Having this separation will help us to decouple stuff, making it easier to read, maintain, and scale. If we want to migrate in the future from `fetch` to `Axios` or `ky`, we can do it without touching the store.
  We can use the respective urls mentioned previously in the service, and it can receive a `params` object and send them in the HTTP API call.

## Slices

* We could have this bit [moviesSlice](https://github.com/E-Tarik/coding-assignment/blob/master/src/data/moviesSlice.js#L4) in the `services/movies.js` and avoid being created on the `moviesSlice`.
  See [here](https://redux-toolkit.js.org/api/createAsyncThunk) for a good example.


* About the rest of the slices in the `data` directory, it seems they are ok following the standard defined here https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice

## App.js

* It contains a lot of definitions, and I see is growing a lot and in the future could be hard to read and maintain. We should use the `ES Modules` pattern (every single file can be created as a module) and import them where needed.


* Used inline styles [here](https://github.com/E-Tarik/coding-assignment/blob/master/src/App.js#L87).
  There is a mix of having some of them inline and others in their respective scss files `app.scss` and we should be consistent.
  Inline styles can make it difficult to maintain and update the code. Basically, limit the reusability and reduce maintainability.


* We can also extract the routes into a separate component in a React application. By extracting the routes into a separate component, we can improve the maintainability and scalability of our code.
  We can have a component called `<Routes />`.


* Use code splitting technique in React to split our application code into smaller chunks that can be loaded on-demand, rather than all at once. This can improve the performance of our application by reducing the initial load time and the amount of JavaScript that needs to be parsed by the browser.


* Using the lazy function https://react.dev/reference/react/lazy#lazy it will load the components on-demand when the corresponding routes are accessed.


* Using lazy loading components with suspense https://react.dev/reference/react/lazy#suspense-for-code-splitting

The Suspense component is used to show a loading indicator while the components are being loaded.

## Styles

* The classes defined on the styles look easy to override because they are quite generic, mentioning directly the HTML tags, and are not scoped to a specific component. It could be problematic. It would be nice to use BEM methodology (Block Element Modifier) which is a naming convention for CSS classes that help to organize and structure our CSS code.
  The main advantages are:
    * Better organization and structure
    * Reusability
    * Maintainability
    * Scalability
    * avoids CSS conflicts


* Use of `rem` units instead of `px`, because of the next reasons:

    * Scalability, because the rem unit is scalable given we can adjust based on the font size of the root element, making it easier to create responsive designs.

    * Accessibility, because it helps to improve accessibility allowing users to adjust the font size without affecting the layout.

    * Consistency, because sizing elements based on the font size of the root element, facilitate maintaining a consistent design across our website.


* Colors in styles are formatted sometimes using [uppercase](https://github.com/E-Tarik/coding-assignment/blob/master/src/styles/movies.scss#L10) and others in [lowercase](https://github.com/E-Tarik/coding-assignment/blob/master/src/styles/starred.scss#L20)

We should be consistent. We could set an `ESLint` or `Prettier` rule for that and use lowercase.
It does not affect the functionality of the code but using lowercase it's easier to read and maintain our code.

* A lot of media queries `@media (max-width: ...)` are being used.
  We could use [media-queries](https://getbootstrap.com/docs/5.3/layout/breakpoints/#media-queries) of Bootstrap or some other type of CSS framework that facilitate our life styling components faster and also can have an impact on the performance of the app.
  For instance, [Tailwind CSS](https://tailwindcss.com/docs/responsive-design#working-mobile-first). With it, we could define our own `design system` with utility classes instead of littering our stylesheets with arbitrary values. They make it easy to be consistent with color choices, spacing, typography, shadows, and everything else that makes up a well-engineered design system.


* Avoid adding classes through JS like https://github.com/E-Tarik/coding-assignment/blob/master/src/components/Movie.jsx#L24.
  It's difficult to maintain and update in the future.
  We can use React hooks for that, specifically the `useState` hook `const [opened, setOpened] = useState(false)` and use the `className` attr based on the variable.

## Unit tests

* Looking at this [file](https://github.com/E-Tarik/coding-assignment/blob/master/src/test/movies.mocks.js)
  We can create `fixtures` files to contain fake data of the API calls. The structure can be the next:

```
services/movies/movies.js
services/movies/movies.spec.js` || `services/movies/movies.test.js`
`services/movies/movies.fixtures.js`
```


* As it was mentioned previously, we can group the component test in its respective component folder, the service test in its respective service folder, the slices tests in its respective store folder, etc. Basically like https://github.com/E-Tarik/coding-assignment/blob/master/src/App.test.js that's at the same root level as the respective app.js file.


* We can improve its readability, scalability, and maintainability by organizing desired behaviors in different described blocks and inside have the different "it's" blocks which should start with `should...`.
  Example with describe + test:

```
describe('Movies', () => {
  describe('When having data',() => {
    it('should render a title', () => {})
    ...
  })

  describe('When loading',() => {
    it('should render loading message', () => {});
    it('should not render error message', () => {});
    it('should not render content', () => {});
  })

  describe('When failling', () => {
    it('should not render loading message', () => {});
    it('should render error message', () => {});
    it('should does not render content', () => {});
  })
  ...
})
```
For instance, this structure looks better https://github.com/E-Tarik/coding-assignment/blob/master/src/test/movieSlice.test.js


* Components are not testing all the scenarios and others do not have tests, like `Header`, `Movies`, `Starred`, `YoutubePlayer`, etc.
  Tests are very important, because generate trust, can it help us find possible bugs or scenarios we did not think of, help us to maintain the code easily, and to evolve new features.


* Set coverage threshold https://create-react-app.dev/docs/running-tests#coverage-reporting at least starting by 80% and increasing it until getting 100%. We should try to cover as much as possible delivering good quality and reducing the number of bugs.


* `starred` and `watchLater` components look like duplicated?
  They are using the same `HTML` and `CSS`. We could create one generic component for that.
  Create `props` and pass the `movies`, and `headerTitleMovies` to show a header title when there are movies and `emptyTextMovies` to show when there are no movies.

## User Experience

* HTTP API calls without keeping in mind `loading` and `error` status. Consider as well handling errors.
  Every component should contemplate empty, loading, data, and error status.


* If there is something wrong, we should provide feedback to the users.