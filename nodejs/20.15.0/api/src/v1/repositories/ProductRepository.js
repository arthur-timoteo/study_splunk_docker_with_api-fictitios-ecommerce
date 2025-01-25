const database = require('../database/database_connection');

class ProductRepository {
    async find(product) {
        const { first_name, email, password_signin, ip_address } = member;

        if(await !this.checkIfMemberAlreadyExists(email))
        {
            console.log('aaaaaaaa');
            return false;
        }

        try{
            console.log('insert member');
            await database.query(
                'INSERT INTO member (first_name, email, password_signin, ip_address) VALUES ($1, $2, $3, $4);', 
                [first_name, email, password_signin, ip_address]
            );
        }
        catch(error){
            console.log(error);
            return false;
        }

        return true;
    }
}
  
module.exports = new AccountRepository();