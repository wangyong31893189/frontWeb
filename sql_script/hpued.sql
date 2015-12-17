/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50087
Source Host           : localhost:3306
Source Database       : hpued

Target Server Type    : MYSQL
Target Server Version : 50087
File Encoding         : 65001

Date: 2015-10-15 16:26:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `account`
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `id` bigint(20) NOT NULL auto_increment COMMENT '自增ID',
  `userName` varchar(255) default NULL COMMENT '登录用户名',
  `password` varchar(255) default NULL COMMENT '用户密码',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='帐户登录表';

-- ----------------------------
-- Records of account
-- ----------------------------
INSERT INTO `account` VALUES ('1', 'admin', 'e10adc3949ba59abbe56e057f20f883e');

-- ----------------------------
-- Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(100) default NULL COMMENT '文章标题',
  `articleCode` varchar(10) default NULL COMMENT '文章代码',
  `articleName` varchar(20) default NULL COMMENT '文章名称',
  `articlePic` varchar(100) default NULL,
  `author` varchar(20) default NULL COMMENT '文章作者',
  `content` text COMMENT '文章内容',
  `createTime` datetime default NULL COMMENT '创建时间',
  `updateTime` datetime default NULL COMMENT '更新时间',
  `status` int(11) default NULL COMMENT '文章状态   0为待审核  1为可用  2为不可用',
  `categoryName` varchar(20) default NULL COMMENT '文章名称',
  `categoryCode` varchar(10) default NULL COMMENT '文章代码',
  `desc` text,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` bigint(20) NOT NULL auto_increment COMMENT '自增加主键',
  `categoryName` varchar(50) NOT NULL COMMENT '分类名称',
  `categoryCode` varchar(10) NOT NULL COMMENT '分类代码',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='分类表  前端页分类表';

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '性能优化', 'xnyh');

-- ----------------------------
-- Table structure for `comments`
-- ----------------------------
DROP TABLE IF EXISTS `comments`;

-- ----------------------------
-- Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL auto_increment,
  `content` text COMMENT '评论内容',
  `createTime` datetime default NULL COMMENT '创建时间',
  `updateTime` datetime default NULL COMMENT '更新时间',
  `nickName` varchar(30) default NULL COMMENT '昵称',
  `email` varchar(30) default NULL COMMENT '邮箱',
  `articleId` int(11) default NULL COMMENT '评论文章ID',
  `commentId` int(11) default NULL COMMENT '评论的ID',
  `userId` int(11) default NULL COMMENT '用户ID',
  `replyTo` varchar(30) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='评论表';


-- ----------------------------
-- Table structure for `tool`
-- ----------------------------
DROP TABLE IF EXISTS `tool`;
CREATE TABLE `tool` (
  `lId` bigint(20) NOT NULL auto_increment COMMENT '自增加主键',
  `toolName` varchar(255) default NULL COMMENT '工具名称',
  `toolUrl` varchar(255) default NULL COMMENT '工具地址',
  `toolDesc` varchar(255) default NULL COMMENT '工具介绍',
  PRIMARY KEY  (`lId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='前端工具表';

-- ----------------------------
-- Records of tool
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL auto_increment COMMENT '自增加主键',
  `realName` varchar(255) default NULL COMMENT '用户真实名称',
  `picPath` varchar(255) default NULL COMMENT '头像地址',
  `userDesc` varchar(255) default NULL COMMENT '用户简介',
  `birth` date default NULL COMMENT '用户生日   1987-05-14',
  `sex` int(11) default NULL COMMENT '用户性别   0为男生   1为女生',
  `address` varchar(50) default NULL COMMENT '详细地址',
  `city` varchar(50) default NULL COMMENT '城市',
  `province` varchar(50) default NULL COMMENT '省',
  `county` varchar(50) default NULL COMMENT '国家',
  `district` varchar(50) default NULL COMMENT '区',
  `accountId` int(11) default NULL,
  `nickName` varchar(255) default NULL COMMENT '昵称',
  `email` varchar(50) default NULL COMMENT '用户邮箱',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '也一样', '/files/Jellyfish.jpg', '    公共', '2015-10-15', '0', '提高防御和太阳', '济源', '河南', null, '济源', '1', 'YTEYEYEYEYE', '12@111.com');


-- 增加log 日志表
CREATE TABLE `log` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`desc`  varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作详情' ,
`createTime`  datetime NULL DEFAULT NULL COMMENT '创建时间' ,
`operator`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作者' ,
`userId`  int(11) NULL DEFAULT NULL COMMENT '操作者ID' ,
`title`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作主题' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=1
ROW_FORMAT=COMPACT
;

-- 修改文章的文章代码字段长度
ALTER TABLE `article`
MODIFY COLUMN `articleCode`  varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章代码' AFTER `title`;
-- 修改文章的文章名称字段长度
ALTER TABLE `article`
MODIFY COLUMN `articleName`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章名称' AFTER `articleCode`;

-- 增加分类表字段  是否删除标志  不做物理删除
ALTER TABLE `category`
ADD COLUMN `isDelete`  int NULL DEFAULT 0 COMMENT '是否删除标志   0为未删除  1为已删除' AFTER `categoryCode`;
-- 增加文章表字段  是否删除标志  不做物理删除
ALTER TABLE `article`
ADD COLUMN `isDelete`  int NULL DEFAULT 0 COMMENT '是否删除标志   0为未删除  1为已删除' AFTER `desc`;

-- 增加帐户名的唯一约束
ALTER TABLE `account`
ADD UNIQUE INDEX `index_username` (`userName`) USING BTREE ;


-- 插件表
CREATE TABLE `plugins` (
`id`  int(11) NOT NULL AUTO_INCREMENT COMMENT '表字段ID' ,
`title`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '插件标题' ,
`content`  text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '插件内容' ,
`createTime`  datetime NULL DEFAULT NULL COMMENT '创建时间' ,
`updateTime`  datetime NULL DEFAULT NULL COMMENT '更新时间' ,
`author`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '插件作者' ,
`status`  int(11) NULL DEFAULT NULL COMMENT '插件状态   0为未审核   1为已审核   2为未通过' ,
`isDelete`  int(11) NULL DEFAULT 0 COMMENT '删除状态   不做物理删除   0为正常  1为已删除' ,
`demoUrl`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '示例地址' ,
`gitUrl`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'git地址' ,
`tags`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签 以,号分隔，最多可为5个' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_title` (`title`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=1
ROW_FORMAT=COMPACT
;


-- 插件评论
CREATE TABLE `comment_plugins` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`content`  text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '评论内容' ,
`createTime`  datetime NULL DEFAULT NULL COMMENT '创建时间' ,
`updateTime`  datetime NULL DEFAULT NULL COMMENT '更新时间' ,
`nickName`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称' ,
`email`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱' ,
`pluginId`  int(11) NULL DEFAULT NULL COMMENT '评论插件ID' ,
`commentId`  int(11) NULL DEFAULT NULL COMMENT '评论的ID' ,
`userId`  int(11) NULL DEFAULT NULL COMMENT '用户ID' ,
`replyTo`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
COMMENT='评论表'
AUTO_INCREMENT=1
ROW_FORMAT=COMPACT
;



-- ----------------------------
-- Table structure for `role`
-- ----------------------------
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色名称',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`id`)
) 
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=1
ROW_FORMAT=COMPACT
;
-- ----------------------------
-- Records of role
-- ----------------------------

-- ----------------------------
-- Table structure for `role_action`
-- ----------------------------
CREATE TABLE `role_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) DEFAULT NULL COMMENT '角色ID',
  `actionId` int(11) DEFAULT NULL COMMENT '链接ID',
  PRIMARY KEY (`id`)
) 
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=1
ROW_FORMAT=COMPACT
;
-- ----------------------------
-- Records of role_action
-- ----------------------------

-- ----------------------------
-- Table structure for `url_action`
-- ----------------------------
CREATE TABLE `url_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色链接',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '链接描述',
  `code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限code',
  PRIMARY KEY (`id`)
) 
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=1
ROW_FORMAT=COMPACT
;
-- ----------------------------
-- Records of url_action
-- ----------------------------


ALTER TABLE `user`
ADD COLUMN `roleId` `roleId1`  int(11) NULL DEFAULT NULL COMMENT '角色ID' AFTER `website`,
ADD COLUMN `isDelete` `isDelete1`  int(11) NULL DEFAULT NULL COMMENT '是否删除  1为正常  2为删除' AFTER `roleId1`;







