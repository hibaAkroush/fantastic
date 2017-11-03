DROP TABLE IF EXISTS user;
		
CREATE TABLE user (
  `user_id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `first_name` VARCHAR(40) NULL DEFAULT NULL,
  `last_name` VARCHAR(40) NULL DEFAULT NULL,
  `phone_number` INTEGER NULL DEFAULT NULL,
  `email` VARCHAR(40) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

DROP TABLE IF EXISTS nani;
		
CREATE TABLE nani (
  `nani_id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `first_name` VARCHAR(40) NULL DEFAULT NULL,
  `last_name` VARCHAR(40) NULL DEFAULT NULL,
  `phone_number` INTEGER NULL DEFAULT NULL,
  `email` VARCHAR(40) NULL DEFAULT NULL,
  PRIMARY KEY (`nani_id`)
);


DROP TABLE IF EXISTS service;
		
CREATE TABLE service (
  `service_id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `user_id_user` INTEGER NULL DEFAULT NULL,
  `nani_id_nani` INTEGER NULL DEFAULT NULL,
  `start_time` TIME NULL DEFAULT NULL,
  `end_time` TIME NULL DEFAULT NULL,
  PRIMARY KEY (`service_id`)
);

ALTER TABLE service ADD FOREIGN KEY (fk_user_id) REFERENCES user (`user_id`);
ALTER TABLE service ADD FOREIGN KEY (fk_nani_id) REFERENCES nani (`nani_id`);



-- Test Data


INSERT INTO `user` (`user_id`,`first_name`,`last_name`,`phone_number`,`email`) VALUES
('1','jwan','zerkani','791234567','jwan@hotmail.com');
INSERT INTO `nani` (`nani_id`,`first_name`,`last_name`,`phone_number`,`email`) VALUES
('1','hiba','akroush','795533111','hiba@gmail.com');
INSERT INTO `service` (`service_id`,`user_id_user`,`nani_id_nani`,`start_time`,`end_time`) VALUES
('1','1','1','9:10:22','11:30:45');