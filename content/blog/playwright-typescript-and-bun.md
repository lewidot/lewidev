+++
title = "Playwright, Typescript and Bun"
date = 2024-08-12
description = "Starting a new Playwright project in Typescript with Bun."
draft = false
[taxonomies]
tags=["playwright", "typescript"]
+++

[Bun](https://bun.sh/) is one of the latest evolutions in the javascript ecosystem and so I wanted to learn how it can be leveraged in an automation testing project using [Playwright](https://playwright.dev/). In this post, I will step through how we can setup our developer environment for using Playwright, Typescript and Bun. 

**Bun is not essential,** I just wanted to try it out. You can easily swap it out for `npm`, `pnpm` or `yarn`.

## Installing Bun
To begin, we will install Bun. I would recommend following their installation process [here](https://bun.sh/docs/installation) for your operating system. Once installed, we can run `bun --version` to verify the installation has worked. At the time of writing this, I am using version `1.1.21`.
```sh
bun --version
1.1.21
```

## Creating the project structure
With Bun installed we will now create a new directory for our project. You can name it whatever you like.
```sh
mkdir playwright-bun
cd playwright-bun
```

Inside our new directory we can create a new Playwright project with the initial structure setup using the `create playwright` command.

```sh
bun create playwright
```

You will be prompted to select some options. We want to select Typescript, add the default Github Actions workflow and install the Playwright browsers.

```sh
Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
✔ Do you want to use TypeScript or JavaScript? · TypeScript
✔ Where to put your end-to-end tests? · tests
✔ Add a GitHub Actions workflow? (y/N) · true
✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
```

This will create the files and directories of a Playwright project for you. However, notice that even though we have run the command with `bun`, it has installed the project dependencies with `npm`. So for us to make use of Bun, we can remove the `package-lock.json` file that `npm` creates and instead install the dependencies again with Bun.

```sh
rm package-lock.json
```

```sh
bun install
```

This will create a new lock file and our initial project should now look something like this.

```sh
.
├── .github
│   └── workflows
├── .gitignore
├── bun.lockb
├── node_modules
│   ├── @playwright
│   ├── @types
│   ├── fsevents
│   ├── playwright
│   ├── playwright-core
│   └── undici-types
├── package.json
├── playwright.config.ts
├── tests
│   └── example.spec.ts
└── tests-examples
    └── demo-todo-app.spec.ts
```

There are several things to understand here that you will need to know in all Playwright projects.

1. Your dependencies are kept in the `node_modules` directory (which can get pretty large!)
2. You can manage your dependencies and project in the `package.json` file, which we will come to later
3. The Playwright configuration is managed in `playwright.config.ts`
4. It is common practice to keep all test files in a `tests` directory

With an understanding of the basic project structure we can now try and run the tests.

```sh
bun playwright test
```

You should see in your terminal that the tests are running and it will show you the pass or failure rate and the time taken. This is the bare minimum you need to get started writing automated tests. To make our project more robust we want to include some tooling to help our code stay idiomatic and *mostly* error free. For this we need a formatter and a linter.

## Formatting with Prettier

[Prettier](https://prettier.io/) is the standard formatter for Typescript and Javascript projects. We first need to install it as a development dependency to our project.

```sh
bun add --dev --exact prettier
```

This will install Prettier for us, but we also need to create a configuration file for Prettier so that we can define the formatting rules we want to enforce.

```sh
touch .prettierrc
```

Open the `.prettierrc` file in your chosen editor and add the following basic configuration. Remember, this is the default configuration recommended by Prettier and you can change it to your own stylistic preferences using the many options available, which are documented [here](https://prettier.io/docs/en/options). 

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

To format the code we can run the Prettier cli on our project.
```sh
bun prettier . --write
```

This will output to the terminal which files have been formatted. Luckily, by default, Prettier ignores version control files and `node_modules`.

```sh
.github/workflows/playwright.yml 24ms
.prettierrc 33ms
package.json 2ms
playwright.config.ts 52ms
tests-examples/demo-todo-app.spec.ts 73ms
tests/example.spec.ts 3ms
```

Now our code will conform to a set of formatting rules. However, there is more to be done. 

## Configuring Typescript

Playwright uses Typescript and transforms it to Javascript at runtime. However, it does not do any type checking so it will still run with non-critical errors. You can read about it more [here](https://playwright.dev/docs/test-typescript#introduction). If we want a consistent and robust codebase we can utilise the Typescript compiler to help us catch these errors.

Let's add `typescript` as a development dependency.
```sh
bun add --dev typescript
```

This gives us access to the binary `tsc`, which is the Typescript compiler.

The first step is to create a `tsconfig.json` which contains the settings that the Typescript compiler will use for our project. We can conveniently create this by running `tsc` with the `--init` flag.

```sh
bun tsc --init
```

This creates a `tsconfig.json` file in the root of our project. We want to start off with the following settings.

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

We just want to check that the Typescript compiles with no errors, we do not need the Javascript output. To do this we can run `tsc` with the `--noEmit` flag. But first, go to the `tests` directory and update the following line in the `example.spec.ts` file to introduce a call to a function that does not exist.

```ts
// Before
await expect(page).toHaveTitle(/Playwright/)

// After
await expect(page).ToHaveTitle(/Playwright/)
```

Now we can run the Typescript compiler. 
```sh
bun tsc --noEmit
```
Once that command has run we should see an error displayed explaining what is wrong in our code.

```sh
tests/example.spec.ts:7:24 - error TS2551: Property 'toHavetitle' does not exist on type 'MakeMatchers<void, Page, {}>'. Did you mean 'toHaveTitle'?
```

This allows us to catch issues with our code before we get to running our tests. Unfortunately it will not catch all the issues. That is where we can add linting to our project as another line of defence.

## Linting with Eslint

Linting is a way to analyse our code for any incorrect usage or non-idiomatic programming that may cause our code to not run as we intended. A common one is missing the `await` keyword which causes incorrect behaviour in asynchronous code, which you will see all over your Playwright project. Therefore we will leverage [Eslint](https://eslint.org/) as another tool in our arsenal. More specifically, we will use [typescript-eslint](https://typescript-eslint.io/) and [eslint-plugin-playwright](https://www.npmjs.com/package/eslint-plugin-playwright).

There are a few packages to install for this to work how we want it to.

```sh
bun add --dev eslint @eslint/js @types/eslint__js typescript-eslint eslint-plugin-playwright
``` 

Similar to the other tools we have installed, we need a configuration file. For this we can create a `eslint.config.mjs` file in the root of our project.

```sh
touch eslint.config.mjs
``` 

Inside this file we can declare that we want to use the recommended linting rules for `eslint`, `typescript-eslint` and `eslint-plugin-playwright` as well as explicitly declare any specific rules we want our linter to enforce. For this all to work we must tell `eslint` that our project is a Typescript project and that our `tsconfig.json` file is in the root of our project. All together we want something like this.

```js
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default tseslint.config(
    eslint.configs.recommended,
    playwright.configs['flat/recommended'],
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: '.',
            },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
        },
    }
)
```

We can try this out by removing `await` from one of the lines in `example.spec.ts`.

```ts
// Before
await expect(page).toHaveTitle(/Playwright/)

// After
expect(page).toHaveTitle(/Playwright/)
```

Now we can lint our test files that are in the `tests` directory and see that our linter has caught the missing `await`.

```sh
bun eslint tests/**
```

```sh
7:5  error  Promises must be awaited...
```

These tools will assist us with keeping our project consistent and with finding issues in our code before we run our tests. Having to manually run each command independently is inefficient and it slows down the rate at which we can iterate on our tests. Fortunately we can use the `scripts` functionality in our `package.json` file to bundle these commands together.

## Adding scripts to package.json

We can create a script each for formatting, linting and type checking and add them to the `scripts` object in `package.json`.

```json
"scripts": {
  "fmt": "prettier . --write",
  "ts": "tsc --noEmit",
  "lint": "eslint tests/**"
}
```

We can run each of these commands individually with `bun run` whenever we need to. We can also streamline this by creating a `pretest` and `test` script. The `pretest` script will automatically run before the `test` script.

```json
"scripts": {
  "fmt": "prettier . --write",
  "ts": "tsc --noEmit",
  "lint": "eslint tests/**",
  "pretest": "bun run fmt && bun run ts && bun run lint",
  "test": "playwright test"
}
```

Now each time we run the command `bun run test` our project will be formatted, type-checked and linted before the tests are run. This will tighten our feedback loop so that our code always stays consistent and correct. Most editors can also integrate with these tools and provide this feedback immediately without needing to run the scripts.

This project structure sets up a good foundation to build upon and allows you to focus on the most important thing, writing tests.
