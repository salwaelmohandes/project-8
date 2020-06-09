'strict mode';

const Sequelize = require("sequelize");
const moment = require('moment');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {
        publishedAt() {
            const date = moment(this.createAt).format('MMMM D, YYYY, h:mma')
            return date;
        }
        shortDescription() {
            const shortDesc = this.body.length > 200 ? this.body.substring(0 ,200) + '...' : this.body;
            return shortDesc;
        }
    }
    Book.init({
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" is required'
            }
        }
    },
    author: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Author" is required'
            }
        }
    },
    genre: Sequelize.DataTypes.STRING,
    year: Sequelize.DataTypes.INTEGER,

    }, { sequelize });

    return Book;
};