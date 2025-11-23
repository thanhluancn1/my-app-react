-- ==========================================
-- 0. KHỞI TẠO SCHEMA
-- ==========================================
CREATE SCHEMA IF NOT EXISTS edu;

SET search_path TO edu, public;

-- ==========================================
-- 1. QUẢN TRỊ HỆ THỐNG & NGƯỜI DÙNG
-- ==========================================

DROP TABLE IF EXISTS edu.users CASCADE;
CREATE TABLE edu.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  role VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Hoạt động',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 2. QUẢN LÝ TRƯỜNG HỌC, LỚP, HỌC SINH
-- ==========================================

DROP TABLE IF EXISTS edu.schools CASCADE;
CREATE TABLE edu.schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50)
);

DROP TABLE IF EXISTS edu.classes CASCADE;
CREATE TABLE edu.classes (
  id SERIAL PRIMARY KEY,
  school_id INT, -- No FK
  class_name VARCHAR(100) NOT NULL,
  subject_name VARCHAR(100),
  start_year INT,
  end_year INT,
  status VARCHAR(50) DEFAULT 'Hoạt động',
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS edu.students CASCADE;
CREATE TABLE edu.students (
  id SERIAL PRIMARY KEY,
  class_id INT, -- No FK
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  email VARCHAR(255),
  phone_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Hoạt động',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 3. CÂY KIẾN THỨC (KNOWLEDGE TREE)
-- ==========================================

DROP TABLE IF EXISTS edu.grade_levels CASCADE;
CREATE TABLE edu.grade_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value INT
);

DROP TABLE IF EXISTS edu.subjects CASCADE;
CREATE TABLE edu.subjects (
  id SERIAL PRIMARY KEY,
  grade_level_id INT, -- No FK
  name VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS edu.books CASCADE;
CREATE TABLE edu.books (
  id SERIAL PRIMARY KEY,
  subject_id INT, -- No FK
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS edu.chapters CASCADE;
CREATE TABLE edu.chapters (
  id SERIAL PRIMARY KEY,
  book_id INT, -- No FK
  name VARCHAR(255) NOT NULL,
  order_number INT
);

DROP TABLE IF EXISTS edu.lessons CASCADE;
CREATE TABLE edu.lessons (
  id SERIAL PRIMARY KEY,
  chapter_id INT, -- No FK
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_number INT
);

DROP TABLE IF EXISTS edu.knowledge_units CASCADE;
CREATE TABLE edu.knowledge_units (
  id SERIAL PRIMARY KEY,
  lesson_id INT, -- No FK
  content TEXT NOT NULL,
  type VARCHAR(50) -- VD: 'Khái niệm'
);

-- ==========================================
-- 4. NGÂN HÀNG CÂU HỎI (QUESTION BANK)
-- ==========================================

DROP TABLE IF EXISTS edu.questions CASCADE;
CREATE TABLE edu.questions (
  id SERIAL PRIMARY KEY,
  knowledge_unit_id INT, -- No FK
  lesson_id INT, -- No FK
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- VD: 'Trắc nghiệm'
  level VARCHAR(50), -- VD: 'Vận dụng'
  default_score FLOAT DEFAULT 1.0,
  solution_guide TEXT,
  created_by INT, -- No FK
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS edu.question_options CASCADE;
CREATE TABLE edu.question_options (
  id SERIAL PRIMARY KEY,
  question_id INT, -- No FK
  content TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  order_index INT
);

DROP TABLE IF EXISTS edu.question_images CASCADE;
CREATE TABLE edu.question_images (
  id SERIAL PRIMARY KEY,
  question_id INT, -- No FK
  image_key VARCHAR(100),
  image_url TEXT
);

-- ==========================================
-- 5. QUẢN LÝ ĐỀ THI & GIAO BÀI (EXAMS)
-- ==========================================

DROP TABLE IF EXISTS edu.exam_batches CASCADE;
CREATE TABLE edu.exam_batches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  creator_id INT, -- No FK
  subject_id INT, -- No FK
  duration_minutes INT,
  total_points FLOAT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Bản nháp', -- VD: 'Bản nháp'
  allow_view_score BOOLEAN DEFAULT FALSE,
  allow_view_solution BOOLEAN DEFAULT FALSE,
  min_score_to_view FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 6. MA TRẬN ĐỀ THI (EXAM MATRICES)
-- ==========================================

DROP TABLE IF EXISTS edu.exam_matrices CASCADE;
CREATE TABLE edu.exam_matrices (
  id SERIAL PRIMARY KEY,
  exam_batch_id INT, -- No FK
  chapter_id INT, -- No FK
  lesson_id INT, -- No FK
  knowledge_unit_id INT, -- No FK
  level_recognition INT DEFAULT 0,
  level_understanding INT DEFAULT 0,
  level_application INT DEFAULT 0,
  level_high_application INT DEFAULT 0,
  type_multiple_choice INT DEFAULT 0,
  type_essay INT DEFAULT 0,
  type_true_false INT DEFAULT 0,
  type_fill_blank INT DEFAULT 0,
  total_points FLOAT DEFAULT 0,
  CONSTRAINT check_knowledge_target CHECK (
    (chapter_id IS NOT NULL) OR (lesson_id IS NOT NULL) OR (knowledge_unit_id IS NOT NULL)
  )
);

-- ==========================================
-- 7. LIÊN KẾT ĐỀ THI
-- ==========================================

DROP TABLE IF EXISTS edu.exam_class_assignments CASCADE;
CREATE TABLE edu.exam_class_assignments (
  id SERIAL PRIMARY KEY,
  exam_batch_id INT, -- No FK
  class_id INT, -- No FK
  assigned_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS edu.exam_questions CASCADE;
CREATE TABLE edu.exam_questions (
  id SERIAL PRIMARY KEY,
  exam_batch_id INT, -- No FK
  question_id INT, -- No FK
  score_in_exam FLOAT,
  order_index INT
);

-- ==========================================
-- 8. LỊCH DẠY (SCHEDULE)
-- ==========================================

DROP TABLE IF EXISTS edu.schedules CASCADE;
CREATE TABLE edu.schedules (
  id SERIAL PRIMARY KEY,
  class_id INT, -- No FK
  lesson_id INT, -- No FK
  teacher_id INT, -- No FK
  date DATE NOT NULL,
  week_day VARCHAR(20), -- VD: 'Thứ Hai'
  start_period INT,
  end_period INT,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);