describe('Clicking on the login button ', function(){  
    var username, password, loginButton;

    beforeEach(function() {
        browser.get('/#/HomePage');
        useremail = element(by.model('user.email'));
        password = element(by.model('user.password'));
        loginButton = element(by.ion-button('login(user)'));
    });

    it('should validate the credentials for a successful login and display the MainPage', function() {
        useremail.sendKeys('email@mail.com');
        password.sendKeys('password');
    
        loginButton.click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch('/main');
    
            var mains = element.all(by.repeater('main'));
            expect(mains.count()).toEqual(3);
        });    
    })

    // it('should display a popup for an unsuccessful login', function() {
    //     useremail.sendKeys('gonehybrid');
    //     password.sendKeys('idontknow');
    
    //     loginButton.click().then(function() {
    //         expect(browser.getLocationAbsUrl()).toMatch('/HomePage');
    
    //         var popup = element(by.css('.popup-container.popup-showing.active'));
    //         expect(popup.isDisplayed()).toBeTruthy();
    //     });
    // });
});