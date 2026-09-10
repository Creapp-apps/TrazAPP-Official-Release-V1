const https = require('https');

const token = 'sbp_3930eef0c9da4530403798c0a4018a0e62be2cc2';
const projectRef = 'fnzxjpynuijjxxpcpqtd';

const sqlQuery = `
CREATE OR REPLACE FUNCTION public.get_device_bunker_meta(p_device_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room_id uuid;
  v_org_id uuid;
  v_bunker_name text;
  v_is_provisioned boolean;
  v_room_name text := '';
  v_room_type text := 'flowering';
  v_active_map_id uuid;
  v_plant_count int := 0;
  v_raw_stage text := 'flowering';
  v_plant_stage text := 'Floración';
  v_strain_name text := '';
  v_tasks json := '[]'::json;
  v_task_count int := 0;
  v_plants json := '[]'::json;
BEGIN
  -- Lookup device row
  SELECT room_id, organization_id, bunker_name, is_provisioned
  INTO v_room_id, v_org_id, v_bunker_name, v_is_provisioned
  FROM public.trazapp_devices
  WHERE device_id = p_device_id AND is_active = true;

  IF NOT FOUND OR v_is_provisioned IS NOT TRUE OR v_room_id IS NULL THEN
    RETURN json_build_object(
      'is_provisioned', false,
      'bunker_name', 'SIN SALA',
      'room_name', 'SIN ASIGNAR',
      'plant_count', 0,
      'plant_stage', 'Floración',
      'strain_name', '',
      'task_count', 0,
      'tasks', '[]'::json,
      'plants', '[]'::json
    );
  END IF;

  -- Get room name & type
  SELECT name, type INTO v_room_name, v_room_type FROM public.rooms WHERE id = v_room_id;

  -- Identify active clone_map_id in this room (most recent batch set)
  SELECT clone_map_id INTO v_active_map_id
  FROM public.batches
  WHERE current_room_id = v_room_id AND discarded_at IS NULL AND clone_map_id IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1;

  -- Get active plant count & stage from active batches
  IF v_active_map_id IS NOT NULL THEN
    SELECT COALESCE(SUM(quantity), 0), COALESCE(MAX(stage), 'flowering')
    INTO v_plant_count, v_raw_stage
    FROM public.batches
    WHERE current_room_id = v_room_id AND discarded_at IS NULL AND clone_map_id = v_active_map_id;
  ELSE
    SELECT COALESCE(SUM(quantity), 0), COALESCE(MAX(stage), 'flowering')
    INTO v_plant_count, v_raw_stage
    FROM public.batches
    WHERE current_room_id = v_room_id AND discarded_at IS NULL;
  END IF;

  -- Translate stage to Spanish
  IF v_room_type = 'flowering' OR v_raw_stage ILIKE '%flora%' OR v_raw_stage ILIKE '%flower%' THEN
    v_plant_stage := 'Floración';
  ELSIF v_raw_stage ILIKE '%veg%' THEN
    v_plant_stage := 'Vegetativo';
  ELSIF v_raw_stage ILIKE '%clon%' OR v_raw_stage ILIKE '%esquej%' THEN
    v_plant_stage := 'Esquejes';
  ELSIF v_raw_stage ILIKE '%secad%' OR v_raw_stage ILIKE '%dry%' THEN
    v_plant_stage := 'Secado';
  ELSE
    v_plant_stage := 'Floración';
  END IF;

  -- Get predominant strain name from active batches
  IF v_active_map_id IS NOT NULL THEN
    SELECT COALESCE(g.name, b.name)
    INTO v_strain_name
    FROM public.batches b
    LEFT JOIN public.genetics g ON g.id = b.genetic_id
    WHERE b.current_room_id = v_room_id AND b.discarded_at IS NULL AND b.clone_map_id = v_active_map_id
    GROUP BY COALESCE(g.name, b.name)
    ORDER BY COUNT(*) DESC
    LIMIT 1;
  ELSE
    SELECT COALESCE(g.name, b.name)
    INTO v_strain_name
    FROM public.batches b
    LEFT JOIN public.genetics g ON g.id = b.genetic_id
    WHERE b.current_room_id = v_room_id AND b.discarded_at IS NULL
    GROUP BY COALESCE(g.name, b.name)
    ORDER BY COUNT(*) DESC
    LIMIT 1;
  END IF;

  -- Get active plants with real grid_position, strain, start_date, origin, and stage_days
  SELECT COALESCE(json_agg(
    json_build_object(
      'name', COALESCE(b.tracking_code, b.name),
      'strain', COALESCE(g.name, 'Genetica'),
      'grid_position', COALESCE(b.grid_position, ''),
      'start_date', COALESCE(to_char(b.start_date, 'YYYY-MM-DD'), to_char(b.created_at, 'YYYY-MM-DD'), ''),
      'origin', CASE 
                  WHEN b.parent_batch_id IS NOT NULL OR b.clone_map_id IS NOT NULL THEN 'ESQUEJE'
                  ELSE 'SEMILLA'
                END,
      'stage_days', GREATEST(0, (CURRENT_DATE - COALESCE(b.start_date, b.created_at::date))),
      'quantity', b.quantity
    )
    ORDER BY b.grid_position ASC, b.created_at ASC
  ), '[]'::json)
  INTO v_plants
  FROM public.batches b
  LEFT JOIN public.genetics g ON g.id = b.genetic_id
  WHERE b.current_room_id = v_room_id 
    AND b.discarded_at IS NULL
    AND (v_active_map_id IS NULL OR b.clone_map_id = v_active_map_id);

  -- Get pending/in_progress tasks for this room (excluding incidents, with dates)
  SELECT COUNT(*), COALESCE(json_agg(
    json_build_object(
      'id', id,
      'title', title,
      'status', status,
      'description', COALESCE(description, ''),
      'date', COALESCE(due_date, to_char(created_at, 'YYYY-MM-DD'), '')
    )
  ), '[]'::json)
  INTO v_task_count, v_tasks
  FROM (
    SELECT id, title, status, description, due_date, created_at
    FROM public.chakra_tasks
    WHERE room_id = v_room_id
      AND status IN ('pending', 'in_progress')
      AND title NOT ILIKE '%[INCIDENCIA]%'
      AND title NOT ILIKE '%incidenc%'
    ORDER BY created_at DESC
    LIMIT 10
  ) t;

  RETURN json_build_object(
    'is_provisioned', true,
    'bunker_name', COALESCE(v_bunker_name, v_room_name, 'Bunker'),
    'room_name', COALESCE(v_room_name, 'Bunker'),
    'plant_count', v_plant_count,
    'plant_stage', v_plant_stage,
    'strain_name', COALESCE(v_strain_name, ''),
    'task_count', v_task_count,
    'tasks', v_tasks,
    'plants', v_plants
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_device_bunker_meta(text) TO anon, authenticated, service_role;
`;

const postData = JSON.stringify({ query: sqlQuery });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${projectRef}/database/query`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`HTTP Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.write(postData);
req.end();
