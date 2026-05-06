-- Bảng lưu thông tin các trận đấu
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('active', 'finished')) DEFAULT 'active',
  total_bill_amount NUMERIC DEFAULT 0
);

-- Bảng lưu thông tin 4 người chơi trong 1 game
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  final_rank INT CHECK (final_rank >= 1 AND final_rank <= 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lưu điểm của từng vòng
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  round_number INT NOT NULL,
  scores JSONB NOT NULL, -- Ví dụ: {"player_1_id": 10, "player_2_id": -5, ...}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lưu các khoản nợ của người thua (hạng 3 và hạng 4)
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RPC Function: get_leaderboard
-- Trả về bảng xếp hạng tổng số nợ theo khoảng thời gian
CREATE OR REPLACE FUNCTION get_leaderboard(time_period TEXT)
RETURNS TABLE (
  name TEXT,
  total_debt NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.name,
    SUM(d.amount) AS total_debt
  FROM debts d
  JOIN players p ON d.player_id = p.id
  WHERE 
    (time_period = 'all') OR
    (time_period = 'week' AND d.created_at >= (NOW() - INTERVAL '7 days')) OR
    (time_period = 'month' AND d.created_at >= (NOW() - INTERVAL '1 month'))
  GROUP BY p.name
  ORDER BY total_debt DESC;
END;
$$ LANGUAGE plpgsql;
