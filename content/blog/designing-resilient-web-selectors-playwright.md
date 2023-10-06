+++
title = "Designing resilient web selectors with Playwright"
date = 2022-08-16
description = "Designing resilient web selectors using Playwright and Python"
draft = true
[taxonomies]
tags=["playwright", "python"]

[extra]
featured = false
+++

After I started to dive into automated UI testing, I quickly learnt how important it is to design selectors that are unique and resilient to change. We are creating flaky tests if we cannot consistently and reliably locate the web elements that our test case needs to interact with. With Playwright there are a few options, [xpath](https://developer.mozilla.org/en-US/docs/Web/XPath), [css selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) and Playwright's own [user visible locators](https://playwright.dev/python/docs/locators).

To begin, lets look at the following `html` snippet. It shows the html structure of a login form containing a username input, a password input and a login button. We will aim to create resilient selectors for each of these elements.

```html
<form>
    <div class="form_group">
        <input class="input_error form_input" placeholder="Username" 
        type="text" data-test="username" id="user-name" name="user-name" 
        autocorrect="off" autocapitalize="none" value="">
    </div>
    <div class="form_group">
        <input class="input_error form_input" placeholder="Password" 
        type="password" data-test="password" id="password" name="password" 
        autocorrect="off" autocapitalize="none" value="">
    </div>
    <input type="submit" class="submit-button btn_action" 
    data-test="login-button" id="login-button" name="login-button" 
    value="Login">
</form>
```

## Creating XPATH selectors
XPATH selectors are my least favourite option as they are reliant on the position of the element in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), the clue is in the name. So when the elements change or update, it can mean that our XPATH selector is no longer able to locate the expected element. We can build the selectors by following the structure of the html from the form element.

```sh
# Username selector
form/div[1]/input

# Password selector
form/div[2]/input

# Login selector
form/input
```

In the above examples, you can see that the only difference between both the username and password inputs is whether they are in the first or second div. If another div is added before this then it will potentially no longer work.

I find XPATH selectors harder to read and less explicit about which element is being selected. Fortunately most `html` elements on a modern web page have attributes which we can use to more accurately locate an element. For this we can look at using `css` selectors.

## Creating CSS selectors


xuxmir-0cijmy-puXbom