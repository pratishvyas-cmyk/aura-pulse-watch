
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  age           INTEGER,
  units         TEXT NOT NULL DEFAULT 'metric',
  onboarding_done BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.health_readings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  heart_rate      INTEGER,
  hrv             NUMERIC(6,2),
  stress_score    INTEGER,
  readiness_score INTEGER,
  steps           INTEGER,
  calories        INTEGER,
  distance_m      NUMERIC(10,2),
  active_mins     INTEGER,
  sleep_score     INTEGER,
  sleep_duration_mins INTEGER,
  sleep_deep_mins INTEGER,
  sleep_light_mins INTEGER,
  sleep_rem_mins  INTEGER,
  sleep_awake_mins INTEGER,
  is_manual_stress_event BOOLEAN NOT NULL DEFAULT false,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_health_readings_user_time ON public.health_readings(user_id, recorded_at DESC);
ALTER TABLE public.health_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own readings"   ON public.health_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own readings" ON public.health_readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own readings" ON public.health_readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own readings" ON public.health_readings FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.device_info (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  model            TEXT NOT NULL DEFAULT 'ThePuck Gen 1',
  serial_number    TEXT,
  firmware_version TEXT NOT NULL DEFAULT '1.4.2',
  battery_level    INTEGER NOT NULL DEFAULT 82,
  connection_state TEXT NOT NULL DEFAULT 'connected',
  last_seen_lat    NUMERIC(10,7),
  last_seen_lng    NUMERIC(10,7),
  last_seen_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.device_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own device"   ON public.device_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own device" ON public.device_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own device" ON public.device_info FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.gesture_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gesture_type  TEXT NOT NULL,
  action        TEXT NOT NULL,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, gesture_type)
);
ALTER TABLE public.gesture_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gestures"   ON public.gesture_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gestures" ON public.gesture_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gestures" ON public.gesture_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gestures" ON public.gesture_configs FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.haptic_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_name  TEXT NOT NULL,
  pattern       TEXT NOT NULL DEFAULT 'single',
  intensity     INTEGER NOT NULL DEFAULT 70,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_name)
);
ALTER TABLE public.haptic_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own haptics"   ON public.haptic_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own haptics" ON public.haptic_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own haptics" ON public.haptic_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own haptics" ON public.haptic_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_profiles_updated_at        BEFORE UPDATE ON public.profiles        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_device_info_updated_at     BEFORE UPDATE ON public.device_info     FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_gesture_configs_updated_at BEFORE UPDATE ON public.gesture_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_haptic_profiles_updated_at BEFORE UPDATE ON public.haptic_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.device_info (user_id, last_seen_at)
  VALUES (NEW.id, now())
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.gesture_configs (user_id, gesture_type, action) VALUES
    (NEW.id, 'double_tap',  'call_accept'),
    (NEW.id, 'tilt_right',  'music_next'),
    (NEW.id, 'tilt_left',   'music_prev'),
    (NEW.id, 'press_hold',  'mark_stress'),
    (NEW.id, 'triple_tap',  'call_reject')
  ON CONFLICT (user_id, gesture_type) DO NOTHING;

  INSERT INTO public.haptic_profiles (user_id, profile_name, pattern, intensity) VALUES
    (NEW.id, 'alert',           'double',      80),
    (NEW.id, 'stress_warning',  'long',        70),
    (NEW.id, 'readiness_nudge', 'single',      50),
    (NEW.id, 'call_incoming',   'pattern_sos', 90)
  ON CONFLICT (user_id, profile_name) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
