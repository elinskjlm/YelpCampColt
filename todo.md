# TODO

### General \ mix

- [ ] Reroute to wanted \ previous url, after login.
- [ ] Logout kicks you to '/campgrounds' instead of returning you to previous page (i.g '/show').
- [ ] Thorough tests, including non-gui-based requests.

- [ ] For camps, reviews, ... :
    - [ ] Unsigned-in user:
        - [ ] Can Browse all camps, all reviews.
        - [ ] Can see Login/Signup option.
        - [ ] Cannot see Logout option.
        - [ ] Can see Add New camp / review buttons.
        - [ ] Cannot submit new (Should be directed to Login/Signup w/o losing input data).
        - [ ] Cannot see Edit / Delete buttons.
    - [ ] Signed-in, not Author user:
        - [ ] Can Browse all camps, all reviews.
        - [ ] Can see Logout option.
        - [ ] Cannot see Login/Signup option.
        - [ ] Can see Add New camp / review buttons.
        - [ ] Can submit new.
        - [ ] Cannot see Edit / Delete buttons.
    - [ ] Signed-in and Author user:
        - [ ] Can Browse all camps, all reviews.
        - [ ] Can see Logout option.
        - [ ] Cannot see Login/Signup option.
        - [ ] Can see Add New camp / review buttons.
        - [ ] Can submit new.
        - [ ] Can see Edit / Delete buttons.

- [ ] Edit reviews

### UI

- [ ] Clean unnecessary links (such as 'Add New Camp ⛺' on '/campgrounds').

- [ ] Option to decide whether navbar is stiky or fixed?.

- [ ] In Show, when no reviews: Either center card, or fill with something else.

### Validation & Access control

- [ ] Make sure that all & only needed routes are protected.

- [ ] Validate image urls (new & edit).
    - [ ] Should at least not break (at least have one '/' in it).


### Routes flow

- [ ] Camp page -> Add new : 
    - [ ] If logged in: => new -> (newly made)
    - [ ] Else: => login (/signup!) -> (newly made)
- [ ] Show page -> Add new : 
    - [ ] If logged in: => new -> (newly made)
    - [ ] Else: => login (/signup!) -> (newly made)
- [ ] (Other pages -> Add new)
    - [ ] If logged in: => new -> (newly made)
    - [ ] Else: => login (/signup!) -> (newly made)
