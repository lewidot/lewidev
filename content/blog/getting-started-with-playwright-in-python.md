+++
title = "Getting started with Playwright in Python"
date = 2023-09-29
draft = false
[taxonomies]
tags=["playwright", "python"]

[extra]
featured = true
+++

[Playwright](https://playwright.dev/) is an open source project, created by Microsoft, that is designed and marketed as a modern solution to browser automation and end-to-end testing. It is a major competitor to the popular project, [Selenium](https://www.selenium.dev). Paired with the Python programming language, it provides us with a very capable set of tools to automate interactions with websites and APIs. In this post, I will step through how we can setup our development environment and write a simple Python script that will automate an interaction on a webpage.

## Setting up the development environment
To get started, we will need Python installed. Head to the official Python website [here](https://www.python.org/downloads/) to follow their installation process for your chosen operating system.

Once that is complete, run the `which python` or `which python3` command in your terminal to double check the installation was successful.
```sh
which python3
/usr/local/bin/python3
```

With Python installed, next we will need to create a new directory for our script.
```sh
mkdir playwright-demo
cd playwright-demo
```

Now that this is our new working directory, we can move onto setting up a virtual environment. This lets us install our project dependencies in a local environment. My personal choice is to use [venv](https://docs.python.org/3/library/venv.html).

```sh
python3 -m venv venv
```
This command creates a virtual environment in our current directory named `venv`. We could name it anything but I always choose venv for the sake of simplicity. However, just creating the virtual environment is only half of the job, we must activate it to begin using it. This command varies depending on which operating system and shell you are using. I recommend referencing the venv documentation [here](https://docs.python.org/3/library/venv.html#how-venvs-work).

```sh
source venv/bin/activate
```

Finally we will need a Python file to write our code in. It is common practice to have a `main.py` file as the entry point of our program.
```sh
touch main.py
```
With each of these steps complete, we can now install the Playwright library and its dependencies into our virtual environment.

## Installing Playwright

To install the Playwright library into our virtual environment, we will use `pip` the Python package manager. Ensure your virtual environment is activated before installing any dependencies.

```sh
pip install playwright
```

This has installed the library, but we will also need to have the browsers installed. Luckily, Playwright comes with its own command to install the relevant browser binaries for Chromium, Firefox and Webkit.

```sh
playwright install
```

Now we are ready to begin writing the Python script.

## Writing our first script

To start, open `main.py` in your editor of choice.

To be able to use the Playwright library, we must import it into our file. We can declare this at the top of the file.
```python
from playwright.sync_api import sync_playwright
```

The `sync_playwright` function we have imported returns a context manager which we can use to interact with the Playwright API. So our first step will be to create the context manager and create a `browser` object for the browser of our choice.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
```

With our Browser context created, we next need to create a `page` object using the `new_page()` method on the browser object. Visualise this as the tab inside your web browser. This page object will expose methods that let us access a webpage and interact with it.


```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
```

We can now use the `goto()` method to visit a website. We just need to pass the URL to the method as a string. For this example I will use [Google](https://www.google.com). To ensure our browser shuts down gracefully at the end of our script, we can use the `close()` method from the browser object.

 ```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://www.google.com")
    browser.close()
```

In our terminal we can run our Python file by simply calling the python executable and the name of the file.
```sh
python main.py
```

This will run our script, however by default it will run [headless](https://playwright.dev/python/docs/debug#headed-mode) so that we do not see anything rendered on the screen. We can modify this by passing values for the `headless` and `slow_mo` arguments in the `launch()` method. We do not need a `slow_mo` value, but it helps slow down the execution so that we are able to see what is happening.

```python
browser = p.chromium.launch(headless=False, slow_mo=500)
```
If you rerun the program, you should now see a Chromium instance open, the Google website loaded and then the browser closed.

From here we can expand the functionality of our script as far as we want, but I will tackle that in depth in a later post. For now, we will just get the page title and print it to the terminal. We can use the `title()` method from our page object to accomplish this. The final version of our script should look like this.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=500)
    page = browser.new_page()
    page.goto("https://www.google.com")
    print(page.title())
    browser.close()
```

If we run this again, you should see `Google` printed to the terminal.

```sh
python main.py
Google
```

Now experiment with this as much as possible. Try this out with a different URL and see what the output is, or use the `page.screenshot()` method and see what it captures.