+++
title = "Getting started with Selenium in Python"
date = 2024-01-18
description = "An introductory tutorial to automating web browsers in Python with Selenium."
draft = false
[taxonomies]
tags=["selenium", "python"]

[extra]
featured = true
+++


[Selenium](https://www.selenium.dev/) is one of the most widely used suites of open source browser automation tools today. In this post, I will step through how we can setup our development environment and write a simple Python script that will automate an interaction on a webpage.

## Setting up the development environment
To get started, we will need Python installed. Head to the official Python website [here](https://www.python.org/downloads/) to follow their installation process for your chosen operating system.

With Python installed, next we will need to create a new directory for our script.
```sh
mkdir getting-started-selenium
cd getting-started-selenium
```

Within our new working directory, we can move onto setting up a virtual environment. This lets us install our project dependencies in a local environment. My personal choice is to use [venv](https://docs.python.org/3/library/venv.html).

```sh
python3 -m venv venv
```

This command creates a virtual environment in our current directory named `venv`. However, just creating the virtual environment is only half of the job. We must activate it to begin using it. This command varies depending on which operating system and shell you are using. I recommend referencing the venv documentation [here](https://docs.python.org/3/library/venv.html#how-venvs-work).

```sh
source venv/bin/activate
```

Finally we will need a Python file to write our code in. It is common practice to have a `main.py` file as the entry point of our program.

```sh
touch main.py
```

With each of these steps complete, we can now install Selenium Webdriver and its dependencies into our virtual environment.

## Installing Selenium

To install the Selenium library into our virtual environment, we will use `pip` the Python package manager. **Ensure your virtual environment is activated before installing any dependencies.**

```sh
pip install selenium
```

This will have installed the library into our virtual environment. The version I am using is `4.22.0`. With the introduction of [Selenium Manager](https://www.selenium.dev/blog/2022/introducing-selenium-manager/) in version `4.6.0`, we do not have to worry about installing browser drivers manually. We are now ready to begin writing the Python script.

## Writing our first script

To start, open `main.py` in your editor of choice.

To be able to use Selenium in our script, we must first import it. In order to interact with a web browser, we need to import the `webdriver` module. We can declare this at the top of the file.

```python
from selenium import webdriver
```

The entry point to our program is going to be through a `main` function, as this is considered idiomatic Python.

```python
def main() -> None:
```

Now we can create our driver object using a browser class from the webdriver module. This will allow us to interact with a website through the selected browser.

```python
from selenium import webdriver

def main() -> None: 
    driver = webdriver.Chrome()
```

We can now use the `get` method to visit a website. We just need to pass the URL to the method as a string. For this example, I will use [Google](https://www.google.com). To ensure our browser shuts down gracefully at the end of our script, we can use the `close` method from the driver object.

```python
from selenium import webdriver

def main() -> None:
    driver = webdriver.Chrome()
    driver.get("https://www.google.com")
    driver.close()
```

With our `main` function defined, we must add the following code to the bottom of our file to call the main function. I know it looks strange but you can read more about it [here](https://docs.python.org/3/library/__main__.html).

```python
from selenium import webdriver

def main() -> None:
    driver = webdriver.Chrome()
    driver.get("https://www.google.com")
    driver.close()

if __name__ == "__main__":
    main()    
```

In our terminal we can run our Python file by simply calling the python executable and the name of the file.

```sh
python main.py
```

This will run our script. By default Selenium will run in headed mode, which means that the browser is rendered to our screen. However, as the script is so short it will only flash up for a split second before closing. As your program grows it can be more cumbersome to render the browser to the screen, so what we can do instead is update our script so that Selenium runs headless.

## Running Selenium in headless mode

Using Chrome as our browser, we need to utilise the `ChromeOptions` class to access the headless functionality.

```python
options = webdriver.ChromeOptions()
```

With our `options` object initialised, we now need to add the `--headless` argument with a value of `new`.

```python
options.add_argument("--headless=new")
```

Now we can pass this into the `Chrome` class in our script as the `options` argument. Which should result in our `main` function looking like this.

```python
def main() -> None:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)
    driver.get("https://www.google.com")
    driver.close()
```

If you rerun the program, you should now no longer see the Chrome browser opened up.

From here we can expand the functionality of our script as far as we want. For now, we will just get the page title and print it to the terminal. We can use the `title` property from our webdriver object to accomplish this. The final version of our script should look like this.

```python
from selenium import webdriver

def main() -> None:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)
    driver.get("https://www.google.com")
    print(driver.title)
    driver.close()

if __name__ == "__main__":
    main()    
```

If we run this again, you should see `Google` printed to the terminal.

```sh
python main.py
Google
```

Now experiment with Selenium and build some more functionality into the script. If you want to try out the equivalent script in [Playwright](https://playwright.dev/) check out my other post [here](https://lewi.dev/blog/getting-started-with-playwright-in-python/).
