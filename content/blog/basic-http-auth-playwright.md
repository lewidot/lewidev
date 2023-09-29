+++
title = "Handling basic HTTP authentication with Playwright"
date = 2023-07-08
description = "How to handle basic HTTP authentication using Playwright and Python"
draft = true

[taxonomies]
tags=["playwright", "python"]

[extra]
featured = false
+++

There are multiple ways that authentication is implemented on a website, most commonly through a login form that requires users' credentials to be input. However, some sites may implement [Basic HTTP Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme) where credentials are requested by the server and need to be handled differently.

Let’s start with writing a Python script that uses Playwright to visit a website that implements basic HTTP authentication.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://the-internet.herokuapp.com/basic_auth")
    page.screenshot(path="screenshot.png")
    browser.close()
```

Run the script and open the screenshot that this script captured, you will see something like this, stating that you are not authorised.

![Screenshot showing authorization error.](/images/http-basic-auth-playwright-unauthorized.png)

This page implements basic HTTP authentication which requires a username and password, these are both `admin` for this particular site. There are several ways to handle this with our Playwright script.

## Deprecated method using URL

The first method is to pass the credentials in the URL. This should work but is now [deprecated](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#access_using_credentials_in_the_url) and not the recommended solution. We can tweak our script to include `admin:admin@` at the beginning of our URL.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    page.goto(
        "https://admin:admin@the-internet.herokuapp.com/basic_auth"
    )
    page.screenshot(path="screenshot.png")
    browser.close()
```

When we run this script now, we should see that the screenshot now shows a page confirming that we have provided the required credentials and accessed the webpage.

![Screenshot showing logged in page with success message.](/images/http-basic-auth-playwright-authorized.png)

## Recommended method using Playwright browser context

Playwright provides us with a more modern solution, where we can pass these credentials into the browser context that we create in our script. To do this we can use the `browser.new_context()` method and pass in the username and password in a dictionary for the `http_credentials` argument. We can then create the page object from this browser context.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        http_credentials={"username": "admin", "password": "admin"}
    )
    page = context.new_page()
    page.goto("https://the-internet.herokuapp.com/basic_auth")
    page.screenshot(path="screenshot.png")
    browser.close()
```

Checking the screenshot you will see that we can now successfully handle the authentication and access the website.