const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // 제목
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
          // unique: true,
        },
        // 내용
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        // 파일의 경로 저장 
        file: {
          type: Sequelize.TEXT,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: true, // timestamps를 true로 S하면 createAt updateAt 생성이된다.
        underscored: true, //기본적으로 테이블명과 컬럼명을 CamelCase로 바꾸는데 snake case로 설정
        paranoid: false, //true로 설정하면 deletedAt컬럼이 생긴다
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static assocaite(db){
    db.Post.belongsTo(db.User, {foreginKey: "user_id", targetKey:"id"});
  }
};
