'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('tb_projects', [{
       title: "Tes Project Database 3",
       start_date: "2023-10-22",
       end_date: "2023-10-30",
       description: "Ini adalah deskripsi project database ketiga",
       technologies: [ 'React Js', 'Typescript' ],
       image: "image.jpg",
       createdAt: new Date(),
       updatedAt: new Date()
     }], {});    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_projects', null, {});
  }
};
