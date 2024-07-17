+++
title = "Introduction to Automation Testing with Pytest"
date = 2024-03-08
description = "A short introduction to using Pytest and Playwright for automation testing in Python."
draft = false
[taxonomies]
tags=["playwright", "pytest"]

[extra]
featured = true
+++

[Pytest](https://docs.pytest.org/en/stable/) is currently the best choice when it comes to picking a testing framework in Python. It provides a solid set of functionality for writing maintainable and intentional tests. Pair this with Playwright and we can design tests that interact with our web applications and verify, with confidence, that they are working as intended. In this article we are going to build a test script that will automate a login form on a website and check that the login is successful or not.

### Project setup

To get started there are a few steps we must take to get our project setup.

Firstly, create a new directory.

```sh
mkdir intro-pytest
cd intro-pytest
```

Next create a virtual environment and activate it.

```sh
python3 -m venv venv
source venv/bin/activate
```

We can now install our dependencies. We will be using [Pytest](https://docs.pytest.org/en/stable) as the testing framework, [Playwright](https://playwright.dev/python/) for interacting with the website and [pytest-playwright](https://pypi.org/project/pytest-playwright/), which is a pytest plugin.

```sh
pip install pytest
pip install playwright
pip install pytest-playwright
```

These commands will install these packages into our virtual environment so that we can access them in our python code. Finally we will need to make sure we have the relevant browsers installed by running the following command:

```sh
playwright install
```

With these steps complete, we can now move onto writing our test script.

### Writing a pytest test function

Pytest enforces some good configuration by default. A good example of this is that it looks for tests in `test_*.py` or `*_test.py` files. Therefore, in our project we will create a file called `test_login.py`.

```sh
touch test_login.py
```

In this file we can write our test functions and pytest will automatically discover these tests. So lets open it in our favourite editor and start designing our first test. I like to scaffold the test case with the test name and the different test steps before implementing any functionality.

Tests are defined as functions that have `test_` as the prefix. So lets create our test function and add the test steps as comments so we can see what we will need to implement in our python code.

```python
def test_login_valid_credentials() -> None:
    # Navigate to the website: https://the-internet.herokuapp.com/login

    # Input a valid username

    # Input a valid password

    # Click the Login button

    # Assert that we have been directed to the secure page

    pass
```

This is the structure of our test case. I always try to give test functions clear and descriptive names. Also notice that the function returns `None`, this is because each function declaration is a standalone test and we do not explicitly call these functions anywhere in our project. So we are not expecting a value to be returned as it would never get used.

Now we can work through each test step and implement the necessary code. Our first step is to navigate to the website and so this is where we will now need to import some Playwright functionality. To navigate to a website we first need to construct our browser instance, context and page object. Luckily, the `pytest-playwright` package provides us with some helpful [fixtures](https://docs.pytest.org/en/stable/explanation/fixtures.html) to remove this boilerplate code. I plan on going into depth on pytest fixtures in a future article but for now we can see them as a function that executes some defined behaviour for us to use in our tests. In this case, we want to access a `Page` object in our test without needing to repeat this setup manually in each test function. We can therefore pass this into our test and use it.

```python
from playwright.sync_api import Page

def test_login_valid_credentials(page: Page) -> None:
```

Now that we can access the `page` object, we can use it to start implementing our test steps. The first step is to navigate to the website, which we can do with the `goto` method.

```python
# Navigate to the website: https://the-internet.herokuapp.com/login
page.goto("https://the-internet.herokuapp.com/login")
```

For the following steps we will need to input valid credentials and click the login button. The credentials on this test site are provided on the login page so take a look to get familiar with the website. Its always a good practice to walk through the test manually before implementing any automated interactions. Check out my other article [here]("https://lewi.dev/blog/automating-a-login-form-with-python-and-playwright/") to learn more about automating a login form in more depth. We can create a locator for each form field and utilise the `fill` and `click` methods to complete these interactions.

```python
# Input a valid username
page.get_by_label("Username").fill("tomsmith")

# Input a valid password
page.get_by_label("Password").fill("SuperSecretPassword!")

# Click the Login button
page.get_by_role("button", name="Login").click()
```

Now that we have the interactions complete we can run the test with the `pytest` command. This will collect our test function, run it and display the result.

```sh
pytest
```

We should see that this test has passed. If you replace the input values and rerun `pytest` you will see that the test still passes. This is only because each line in our test function has been executed successfully, it does not validate the behaviour of the login. We can validate that the login has worked by adding an assertion to our test. If the login is successful we should get directed to the `secure` page of the website. Therefore we can assert that the current url after logging in is `https://the-internet.herokuapp.com/secure`.

## Playwright assertions

With Playwright we have access to their own custom assertion functionality, which you can learn more about [here](https://playwright.dev/python/docs/test-assertions). With the `expect` function we can build out assertions on our page object and also on locators. We can import this from the Playwright library at the top of our file.

```python
from playwright.sync_api import Page, expect
```

For this test, we can use the `to_have_url` assertion on our page object. If the url is not what we expect, an `AssertionError` will be raised and the test will fail.

```python
# Assert that we have been directed to the secure page
expect(page).to_have_url("https://the-internet.herokuapp.com/secure")
```

This is what our finished test function should look like.

```python
from playwright.sync_api import Page, expect


def test_login_valid_credentials(page: Page) -> None:
    # Navigate to the website: https://the-internet.herokuapp.com/login
    page.goto("https://the-internet.herokuapp.com/login")

    # Input a valid username
    page.get_by_label("Username").fill("tomsmith")

    # Input a valid password
    page.get_by_label("Password").fill("SuperSecretPassword!")

    # Click the Login button
    page.get_by_role("button", name="Login").click()

    # Assert that we have been directed to the secure page
    expect(page).to_have_url("https://the-internet.herokuapp.com/secure")
```

When we run `pytest` again from the terminal we should see this test pass.

Now we may also want to write a second test, that verifies if an error message is displayed when incorrect login credentials are provided. We can follow the steps above and create another test function called `test_login_invalid_credentials`. The test steps are very similar except that the input values will be different and the assertion will be different. We will need to create a locator for the error message which we can use the `to_be_visible` assertion on. Have a go at trying to write this test yourself before checking my example below.

```python
def test_login_invalid_credentials(page: Page) -> None:
    # Navigate to the website: https://the-internet.herokuapp.com/login
    page.goto("https://the-internet.herokuapp.com/login")

    # Input a valid username
    page.get_by_label("Username").fill("tomsmith")

    # Input an invalid password
    page.get_by_label("Password").fill("invalidpassword")

    # Click the Login button
    page.get_by_role("button", name="Login").click()

    # Assert that an error message is displayed
    expect(page.get_by_text("Your password is invalid!")).to_be_visible()
```

This is a good starting point when we only have one or two functionalities to test, however this will not scale very efficiently. As our application evolves we would need to maintain the tests which becomes increasingly more difficult if we have duplicate code across our test suite. This would lead us to looking at centralising re-usable code and following some popular design patterns to improve the robustness of our tests. I would recommend looking into the **Page Object Model** pattern which is very popular in automation testing. We have only just scratched the surface of what we can do with `pytest` but I hope it shows how easy it is to use. It becomes much more powerful when you start to build your automation framework on top of it and utilise its many features. Which I will touch on in the future in much more depth...
