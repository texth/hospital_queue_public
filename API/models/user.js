const Model = require('./model').Model;

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     login VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     full_name VARCHAR(255),
//     email VARCHAR(255) UNIQUE NOT NULL,
//     email_code VARCHAR(255),
//     reset_code VARCHAR(255),
//     profile_picture VARCHAR(255),
//     role VARCHAR(50) DEFAULT 'user'
// );

class User extends Model {
    constructor(email = '', password = '', full_name = '', email_code = '', reset_code = '') {
        super();
        this.id = 0;
        this.email = email;
        this.password = password;
        this.full_name = full_name;
        this.email_code = email_code;
        this.reset_code = reset_code;
    }

    static async findAll() {
        const results = await super.findAll('users');
        return results.map(row => {
            const user = new User();
            user.id = row.id;
            user.email = row.email;
            user.password = row.password;
            user.full_name = row.full_name;
            user.email_code = row.email_code;
            user.reset_code = row.reset_code;
            return user.safe();
        });
    }

    static async findById(id) {
        const results = await super.find(id, 'users');
        const user = new User();
        if (results[0]) {
            const row = results[0];
            user.id = row.id;
            user.email = row.email;
            user.password = row.password;
            user.full_name = row.full_name;
            user.email_code = row.email_code;
            user.reset_code = row.reset_code;
        }
        return user;
    }

    static async findByEmail(email) {
        const results = await super.find(email, 'users', 'email');
        const user = new User();
        if (results[0]) {
            const row = results[0];
            user.id = row.id;
            user.email = row.email;
            user.password = row.password;
            user.full_name = row.full_name;
            user.email_code = row.email_code;
            user.reset_code = row.reset_code;
        }
        return user;
    }

    static async save(user) {
        await super.save(user, 'users');
        return await this.findByEmail(user.email);
    }

    static async deleteById(id) {
        await super.delete(id, 'users');
    }

    safe() {
        return {
            id: this.id,
            email: this.email,
            full_name: this.full_name
        };
    }
}

module.exports = User;
