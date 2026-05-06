-- 1. Xóa bảng rounds cũ (nếu có dữ liệu quan trọng, bạn nên backup, nếu không thì cứ xóa)
DROP TABLE IF EXISTS rounds;

-- 2. Thêm cột rounds (JSONB) vào bảng games
ALTER TABLE games
ADD COLUMN rounds JSONB DEFAULT '[]'::jsonb;
