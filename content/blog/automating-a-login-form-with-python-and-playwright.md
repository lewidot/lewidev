+++
title = "Automating a login form with Python and Playwright"
date = 2024-02-07
description = "Tutorial teaching how to interact with and automate a login form in Python using the Playwright library."
draft = false
[taxonomies]
tags=["playwright", "python"]

[extra]
featured = true
+++

The Playwright library makes it easy for us to automate interactions with websites in the browser. In this article we are going to explore these capabilities by writing a script that will complete a login form on a website.

Let’s start with writing a Python script that uses Playwright to visit a website that has a login form. See [Getting started with Playwright in Python](https://lewi.dev/blog/getting-started-with-playwright-in-python/) for an introduction to the basics if required.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://the-internet.herokuapp.com/login")
    browser.close()
```

This script navigates to the desired webpage and then closes. To complete the login form we need to complete three interactions:

1. **Input the username**
2. **Input the password**
3. **Click the login button**

The first step to achieving this is to locate these elements on the webpage.

## Locating elements on a webpage

This is the HTML for the username input field:

```html
<label for="username">Username</label>
<input type="text" name="username" id="username">
```

To interact with this HTML element in our script we will create a Playwright locator. As we can see this form input has a label and Playwright provides us with a `get_by_label` method we can use to create our locator.

```python
page.get_by_label("Username")
```

We can take the same approach with the password input field which has the same HTML structure.

```python
page.get_by_label("Password")
```

Whilst this method seems the most appropriate here, it is not the only method available. The Playwright library provides a comprehensive API for locating web elements, more powerful than just CSS and XPath selectors. You can learn more about these in the Playwright [documentation](https://playwright.dev/python/docs/locators).

The third element we need to create a locator for is the login button.

```html
<button class="radius" type="submit">
    <i class="fa fa-2x fa-sign-in"> Login</i>
</button>
```

The simplest way to explain this element is obvious, it is a button with "Login" as the text. If we think about it this way we can understand how to use the `get_by_role` method. We need to provide two arguments to this method, the `role` and the `name`.

```python
page.get_by_role(role="button", name="Login")
```

## Interacting with web elements

Now that we have the locators for the three elements, we need to interact with each of them in the way that you would manually. Input the required text and click the button.

To input text we can use the `fill` method on the username and password locators.

```python
page.get_by_label("Username").fill("tomsmith")
page.get_by_label("Password").fill("SuperSecretPassword!")
```

To click the button we can use the `click` method.

```python
page.get_by_role(role="button", name="Login").click()
```

With these steps complete we can run our python script. We can also add the `headless` and `slowmo` options when initialising our browser object so that we can see the results on the screen.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=1000)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://the-internet.herokuapp.com/login")
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("SuperSecretPassword!")
    page.get_by_role(role="button", name="Login").click()
    browser.close()
```

Running this python script will load the webpage, complete the login form and close the browser. This is a short and simple program but it demonstrates the power of Playwright and also the speed in which you can develop something. Take the concepts in this article and apply it to a real use case and see how you can expand it to something useful.
