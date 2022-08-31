const checkForbidenString = (value, forbidenString) => {
    if (value === forbidenString) {
      throw new Error('Nazwa "slug" jest zakazana'); 
    }
  }

const isEmail = (email) => {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}

module.exports = {
  checkForbidenString,
  isEmail
}