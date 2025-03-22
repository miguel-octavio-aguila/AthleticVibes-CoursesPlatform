CREATE DATABASE IF NOT EXISTS course_platform;
USE course_platform;

CREATE TABLE users(
    id              INT(255) AUTO_INCREMENT NOT NULL,
    name            VARCHAR(50) NOT NULL,
    surname         VARCHAR(100) DEFAULT NULL,
    role            VARCHAR(20) DEFAULT NULL,
    email           VARCHAR(255) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    description     TEXT DEFAULT NULL,
    image           VARCHAR(255) DEFAULT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    remember_token  VARCHAR(255) DEFAULT NULL,
    CONSTRAINT pk_users PRIMARY KEY(id)
) ENGINE=InnoDB;

CREATE TABLE categories(
    id              INT(255) AUTO_INCREMENT NOT NULL,
    name            VARCHAR(100) DEFAULT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_categories PRIMARY KEY(id)
) ENGINE=InnoDB;

CREATE TABLE courses(
    id              INT(255) AUTO_INCREMENT NOT NULL,
    category_id     INT(11) NOT NULL,
    name            VARCHAR(100) DEFAULT NULL,
    detail          VARCHAR(100) DEFAULT NULL,
    image           VARCHAR(255) DEFAULT NULL,
    url             VARCHAR(255) DEFAULT NULL,
    accordion       INT(11) NOT NULL,
    current_price   DECIMAL(7,2) DEFAULT NULL,
    previous_price  DECIMAL(7,2) DEFAULT NULL,
    num_sales       INT(11) NOT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_courses PRIMARY KEY(id),
    CONSTRAINT fk_courses_category FOREIGN KEY(category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE videos(
    id              INT(11) AUTO_INCREMENT NOT NULL,
    user_id         INT(11) NOT NULL,
    course_id       INT(11) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    url             VARCHAR(255) DEFAULT NULL,
    file            TEXT DEFAULT NULL,
    download        TEXT DEFAULT NULL,
    section         INT(11) NOT NULL,
    accordion_title VARCHAR(255) DEFAULT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_videos PRIMARY KEY(id),
    CONSTRAINT fk_videos_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_videos_course FOREIGN KEY(course_id) REFERENCES courses(id)
) ENGINE=InnoDB;

CREATE TABLE comments(
    id              INT(255) AUTO_INCREMENT NOT NULL,
    user_id         INT(255) NOT NULL,
    video_id        INT(255) NOT NULL,
    title           VARCHAR(100) DEFAULT NULL,
    comment         VARCHAR(100) DEFAULT NULL,
    image           VARCHAR(255) DEFAULT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_comments PRIMARY KEY(id),
    CONSTRAINT fk_comments_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_comments_video FOREIGN KEY(video_id) REFERENCES videos(id)
) ENGINE=InnoDB;

CREATE TABLE carts(
    id              INT(11) AUTO_INCREMENT NOT NULL,
    user_id         INT(11) NOT NULL,
    course_id       INT(11) NOT NULL,
    quantity        INT(11) NOT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_carts PRIMARY KEY(id),
    CONSTRAINT fk_cart_course FOREIGN KEY(course_id) REFERENCES courses(id),
    CONSTRAINT fk_cart_user FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE sales(
    id              INT(11) AUTO_INCREMENT NOT NULL,
    user_id         INT(11) NOT NULL,
    course_id       INT(11) NOT NULL,
    video_id        INT(11) NOT NULL,
    progress        INT(11) DEFAULT NULL,
    quantity_sold   INT(11) DEFAULT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_sales PRIMARY KEY(id),
    CONSTRAINT fk_sales_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_sales_course FOREIGN KEY(course_id) REFERENCES courses(id),
    CONSTRAINT fk_sales_video FOREIGN KEY(video_id) REFERENCES videos(id)
) ENGINE=InnoDB;

CREATE TABLE checkboxes(
    id              INT(11) AUTO_INCREMENT NOT NULL,
    user_id         INT(11) NOT NULL,
    course_id       INT(11) NOT NULL,
    video_id        INT(11) NOT NULL,
    checkbox        INT(11) NOT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_checkboxes PRIMARY KEY(id),
    CONSTRAINT fk_checkboxes_course FOREIGN KEY(course_id) REFERENCES courses(id),
    CONSTRAINT fk_checkboxes_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_checkboxes_video FOREIGN KEY(video_id) REFERENCES videos(id)
) ENGINE=InnoDB;

CREATE TABLE responses(
    id              INT(255) AUTO_INCREMENT NOT NULL,
    user_id         INT(255) NOT NULL,
    comment_id      INT(255) NOT NULL,
    response        VARCHAR(100) DEFAULT NULL,
    image           VARCHAR(255) DEFAULT NULL,
    deleted_at      DATETIME DEFAULT NULL,
    created_at      DATETIME DEFAULT NULL,
    updated_at      DATETIME DEFAULT NULL,
    CONSTRAINT pk_responses PRIMARY KEY(id),
    CONSTRAINT fk_responses_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_responses_comment FOREIGN KEY(comment_id) REFERENCES comments(id)
) ENGINE=InnoDB;