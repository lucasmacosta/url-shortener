# URL Shortener

This repo provides a minimal POC for a **URL shortener** feature, that is, an utility that takes a regular url and generates a shorter, easier to read version of it, while tracking its usage and allowing registered users to handle their url mappings.

There are two independent packages for backend and frontend respectively, and scripts are provided to run them individually or to setup a complete environment using `docker compose`. Workspaces from `npm` are used to simplify the installation of dependencies and building/running both packages.

## Configuration

Run the `npm install` command to install dependencies. On Linux it works out of the box, on MacOS I had to use Node.js 20 and run the `npm config set python "$(which python3)"` command first before I was able to compile the sqlite dependency. In order to install that Node.js version the command `nvm install` can be used at the root of the repo, provided you are using `nvm` to manage Node.js versions. The exact node version used while developing is on the `.nvmrc` file.

## Quickstart for development environment

- Run `npm install` to install dependencies.
- Copy the `packages/backend/.env.sample` file into `packages/backend/.env` and make changes if needed.
- Copy the `packages/frontend/.env.sample` file into `packages/frontend/.env` and make changes if needed.
- Run the `npm run start:dev:backend` command to start the server in development mode.
- The API will now be available on http://localhost:3000, using a default in-memory SQLite database that gets reset every its started.
- Run the `npm run start:dev:frontend` command to start the frontend in development mode.
- The frontend will now be available on http://localhost:8080
- Use the provided postman collection on `docs/postman/URL-Shortener-API.postman_collection.json` and the corresponding environment from `docs/postman/URL-Shortener-environment.postman_environment.json` to perform requests to the available endpoints.
- Check [this video](https://drive.google.com/file/d/16TCrl1j0vweZ4SU3ygrGxtKI8yMZRnVQ/view?usp=sharing) for a quick overview of the functionality provided by the frontend.

## Backend

The backend has his own set of commands that can be used by running them using the `-w backend` flag, like this `npm run <command> -w backend`.

### Running the API in dev mode

When the API is started with the `npm run start:dev -w backend` command, it will reload automatically when sources are updated.

### Building the API

The API can be built with the `npm run build -w backend` command, which will generate the target javascript files.

### Starting the API

After build, the API can be started with the `npm start -w backend` command.

### Running tests

Tests are ran with the `npm run test -w backend` command. For now only E2E are implemented, using the same in-memory sqlite DB than when running the API in development mode.

### Using a different database

Since the API uses the sequelize library, using another database should as simple as installing the necessary modules and then setting the `DB_URI` env var appropriately. The required dependencies for SQLite and PostgreSQL are already configured.

## Frontend

The frontend has his own set of commands that can be used by running them using the `-w frontend` flag, like this `npm run <command> -w frontend`.

### Running the frontend in dev mode

When the frontend is started with the `npm run dev -w frontend` command, it will reload automatically when sources are updated.

## Using docker

### Backend

The API can be built as a container using the following docker command to get the `url-shortener-be:latest` tag:

```shell
docker buildx build -f Dockerfile.backend -t url-shortener-be:latest .
```

Once the image is built, a container can be run using this command to expose the API on port 3000:

```shell
docker run --rm --publish 3000:3000 url-shortener-be:latest
```

### Frontend

The frontend can be built as a container using the following docker command to get the `url-shortener-fe:latest` tag:

```shell
docker buildx build -f Dockerfile.frontend -t url-shortener-fe:latest .
```

Once the image is built, a container can be run using this command to expose the API on port 3000:

```shell
docker run --rm --publish 8080:8080 url-shortener-fe:latest
```

### Putting it all together

A docker compose `compose.yml` file is provided that allows to orchestrate a full environment with both backend and frontend running and using a postgresql database. It can be used with the `docker compose up -d --build` command, which will take care of setting up the DB and running the API using it. The API can then be accessed through http://localhost:3000 and the frontend will be on http://localhost:8080. The `docker-compose down` command will take care of bringing the services down.

# Further improvements:

Here's a list of things that are left pending for future improvements to the API in terms of architecture:

- Add unit tests, currently only E2E are implemented using the API endpoints.
- Use the repository pattern to talk with the DB.
- Add proper API documentation, using `Swagger`, `JSON:API` or similar. Ideally it should be generated automatically by describing the endpoints somehow, either by annotations on comments or by using decorators. Another desirable feature would be to use the definitions to generate the typings on the API consumers.
- If selecting the attributes to be returned on each endpoint is required, then most likely GraphQL would be a better option.
- Throttling is currently only enforced on the endpoint that creates url mappings by using the [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) library, which should work fine for a basic usage. Further scaling might require to use tools at infra level instead.
- Add support for linting and prettier tools.

And the list of things pending for frontend:

- There are issues with the state of the text fields in the UI, it definitely requires some polishing and testing, my frontend abilities are a little bit rusty!
- The UI is pretty basic, it can be improved.
- Tests are missing.
- I tried to setup a `common` npm workspace with the API DTOs to allow both backend and frontend to share the definitions, but making vite to recognize and use these files has proved to be a challenge. There's [a package](https://www.npmjs.com/package/vite-tsconfig-paths) that should allow vite to read files from outside its folder, but I haven't had the chance to look into it.
