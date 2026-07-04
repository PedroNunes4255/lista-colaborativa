while True:
        if Username == "admin" and Password == "admin123":
            print("Login successful!")
            break
        else:
            print("Invalid username or password. Please try again.")
            Username = input("Enter your username: ")
            Password = input("Enter your password: ")   