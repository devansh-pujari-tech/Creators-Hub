# Promises vs Callbacks

The application uses Promises through `async`/`await` for API and database operations. This keeps asynchronous control flow readable and lets errors be handled with `try`/`catch`.

## Callback style

```js
function loadUserWithCallback(loadUser, callback) {
  loadUser((error, user) => {
    if (error) {
      callback(error);
      return;
    }

    callback(null, user);
  });
}
```

The callback receives either an error or the result. Multiple dependent callbacks can become difficult to read and maintain.

## Promise style

```js
function loadUser(loadUserRequest) {
  return new Promise((resolve, reject) => {
    loadUserRequest((error, user) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(user);
    });
  });
}
```

The caller can compose the operation with `.then()` and `.catch()`, or use `async`/`await`:

```js
async function getUserName(loadUserRequest) {
  const user = await loadUser(loadUserRequest);
  return user.name;
}
```

## Application usage

- `backend/utils/asyncHandler.js` converts rejected async route handlers into Express error flow.
- `backend/routes/users.js` and `backend/routes/posts.js` use `async`/`await` for Mongoose operations.
- `frontend/src/context/AuthContext.jsx` uses `async`/`await` for Axios login and registration requests.

This gives the project direct evidence of Promise-based asynchronous programming while preserving the callback alternative for comparison.
